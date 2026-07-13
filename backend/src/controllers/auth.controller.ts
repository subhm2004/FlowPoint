import { randomUUID } from "crypto";
import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { loginSchema, registerSchema } from "../validation/auth.validation";
import { HTTPSTATUS } from "../config/http.config";
import { config } from "../config/app.config";
import {
  loginOrCreateGoogleUserService,
  registerUserService,
  verifyUserService,
} from "../services/auth.service";
import UserModel from "../models/user.model";
import {
  signAccessToken,
  signOAuthState,
  verifyOAuthState,
} from "../utils/jwt";

const OAUTH_STATE_COOKIE = "flowpilot_oauth_state";

/**
 * One greppable prefix for the whole Google flow, so a sign-in can be followed in the
 * Render log by filtering on "[google-oauth]".
 *
 * `flow` is the first 8 characters of the state nonce. It is printed at every step, so
 * the "start" line and the "callback" line of the SAME sign-in can be tied together even
 * when several people are signing in at once.
 *
 * Never pass a token, an authorization code, or the client secret in here.
 */
const log = (flow: string, event: string, fields: Record<string, unknown> = {}) => {
  const rest = Object.entries(fields)
    .map(([k, v]) => `${k}=${v}`)
    .join(" ");
  console.log(`[google-oauth] ${flow} ${event}${rest ? " " + rest : ""}`);
};

const googleClient = () =>
  new OAuth2Client({
    clientId: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    redirectUri: config.GOOGLE_CALLBACK_URL,
  });

const readCookie = (req: Request, name: string): string | null => {
  const raw = req.headers.cookie;
  if (!raw) return null;
  for (const part of raw.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
};

/** Only ever hand the SPA an in-app path back — never an absolute URL an attacker supplied. */
const safeReturnUrl = (value: unknown): string | undefined => {
  if (typeof value !== "string" || !value.startsWith("/")) return undefined;
  if (value.startsWith("//")) return undefined;
  return value;
};

/**
 * Where the browser lands once we are done. The access token goes in the URL *fragment*,
 * not the query string: fragments are never sent to a server, so the token stays out of
 * the frontend host's request logs and any Referer header.
 */
const frontendUrl = (opts: {
  token?: string;
  error?: string;
  returnUrl?: string;
}): string => {
  const url = new URL(config.FRONTEND_GOOGLE_CALLBACK_URL);
  if (opts.error) url.searchParams.set("error", opts.error);
  if (opts.returnUrl) url.searchParams.set("returnUrl", opts.returnUrl);
  if (opts.token) url.hash = new URLSearchParams({ token: opts.token }).toString();
  return url.toString();
};

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse({
      ...req.body,
    });

    const { userId } = await registerUserService(body);

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "User was created but could not be loaded.",
      });
    }

    const safeUser = user.omitPassword();
    const token = signAccessToken(String(safeUser._id));

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User created successfully",
      token,
      user: safeUser,
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = loginSchema.parse(req.body);

    const user = await verifyUserService({ email, password });
    const token = signAccessToken(String(user._id));

    return res.status(HTTPSTATUS.OK).json({
      message: "Logged in successfully",
      token,
      user,
    });
  }
);

export const logOutController = asyncHandler(
  async (_req: Request, res: Response) => {
    return res
      .status(HTTPSTATUS.OK)
      .json({ message: "Logged out successfully" });
  }
);

/** Step 1 — send the browser to Google's consent screen. */
export const googleAuthController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!config.GOOGLE_ENABLED) {
      // Prints exactly which of the three is missing, so a half-filled Render env
      // is obvious from the log instead of guesswork.
      log("-", "ABORT not_configured", {
        has_client_id: Boolean(config.GOOGLE_CLIENT_ID),
        has_client_secret: Boolean(config.GOOGLE_CLIENT_SECRET),
        has_callback_url: Boolean(config.GOOGLE_CALLBACK_URL),
      });
      return res.redirect(
        frontendUrl({ error: "Google sign-in is not configured on the server." })
      );
    }

    const nonce = randomUUID();
    const returnUrl = safeReturnUrl(req.query.returnUrl);
    const state = signOAuthState({ nonce, returnUrl });

    // The redirect_uri below must match Google's console character for character.
    // Logging it means a redirect_uri_mismatch can be diagnosed by eye, from the log.
    log(nonce.slice(0, 8), "START", {
      redirect_uri: config.GOOGLE_CALLBACK_URL,
      returnUrl: returnUrl ?? "-",
      origin: req.headers.origin ?? "-",
    });

    // SameSite=Lax still rides along on Google's top-level GET redirect back to us,
    // which is exactly the one navigation we need it for.
    res.cookie(OAUTH_STATE_COOKIE, nonce, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 60 * 1000,
      path: "/",
    });

    return res.redirect(
      googleClient().generateAuthUrl({
        access_type: "online",
        scope: ["openid", "email", "profile"],
        prompt: "select_account",
        state,
      })
    );
  }
);

/** Step 2 — Google hands back a code; trade it for an identity and mint our own JWT. */
export const googleCallbackController = asyncHandler(
  async (req: Request, res: Response) => {
    // `flow` starts unknown: until the state JWT is verified we do not know which
    // sign-in this callback belongs to. It is filled in as soon as we do.
    let flow = "?";

    const fail = (reason: string, message: string, extra: Record<string, unknown> = {}) => {
      log(flow, `FAIL ${reason}`, extra);
      return res.redirect(frontendUrl({ error: message }));
    };

    if (!config.GOOGLE_ENABLED) {
      return fail("not_configured", "Google sign-in is not configured on the server.");
    }

    const cookieNonce = readCookie(req, OAUTH_STATE_COOKIE);
    res.clearCookie(OAUTH_STATE_COOKIE, { path: "/" });

    const { code, state } = req.query;

    log(flow, "CALLBACK", {
      has_code: typeof code === "string",
      has_state: typeof state === "string",
      has_cookie: Boolean(cookieNonce),
      google_error: typeof req.query.error === "string" ? req.query.error : "-",
    });

    if (typeof req.query.error === "string") {
      // Google itself refused. This is where redirect_uri_mismatch and
      // access_denied (user pressed Cancel) show up.
      return fail("google_said_" + req.query.error, "Google sign-in was cancelled.");
    }
    if (typeof code !== "string" || typeof state !== "string") {
      return fail("no_code", "Google sign-in failed: no authorization code was returned.");
    }

    let statePayload;
    try {
      statePayload = verifyOAuthState(state);
      flow = statePayload.nonce.slice(0, 8);
    } catch {
      // Expired (>10 min) or signed with a different JWT_SECRET — which is what you
      // get if JWT_SECRET differs between the instance that started the flow and the
      // one handling the callback.
      return fail("bad_state", "Google sign-in expired. Please try again.");
    }

    // The signature proves we issued the state; the cookie proves this is the same
    // browser that started the flow. Both are needed to stop login-CSRF.
    if (!cookieNonce || cookieNonce !== statePayload.nonce) {
      return fail("state_mismatch", "Google sign-in failed: state mismatch. Please try again.", {
        cookie_present: Boolean(cookieNonce),
        cookie_matches: cookieNonce === statePayload.nonce,
      });
    }

    let payload;
    try {
      const client = googleClient();
      const { tokens } = await client.getToken(code);
      if (!tokens.id_token) {
        return fail("no_id_token", "Google sign-in failed: no identity token was returned.");
      }
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: config.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
      log(flow, "TOKEN_OK", { sub: payload?.sub ?? "-", email_verified: payload?.email_verified });
    } catch (error) {
      // Google's own reason — "invalid_client" means a wrong/rotated secret,
      // "invalid_grant" a stale or reused code. Without printing it, this failure
      // is completely blind.
      const reason = error instanceof Error ? error.message : String(error);
      return fail("token_exchange", "Google sign-in failed: could not verify your Google account.", {
        google_says: JSON.stringify(reason),
      });
    }

    if (!payload?.sub || !payload.email) {
      return fail("no_email", "Google did not return an email address.");
    }
    // Without this, anyone able to set an unverified Google email could take over
    // an existing FlowPilot account through the account-linking path below.
    if (!payload.email_verified) {
      return fail("email_unverified", "Your Google email address is not verified.");
    }

    try {
      const user = await loginOrCreateGoogleUserService({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name || payload.email.split("@")[0],
        profilePicture: payload.picture ?? null,
      });

      log(flow, "SUCCESS", {
        userId: String(user._id),
        email: payload.email,
        redirect: config.FRONTEND_GOOGLE_CALLBACK_URL,
      });

      return res.redirect(
        frontendUrl({
          token: signAccessToken(String(user._id)),
          returnUrl: statePayload.returnUrl,
        })
      );
    } catch (error) {
      // A browser is mid-navigation here, so an error must come back as a redirect —
      // the JSON error handler would just print raw JSON at them.
      const message =
        error instanceof Error ? error.message : "Google sign-in failed.";
      return fail("user_service", message, { email: payload.email });
    }
  }
);
