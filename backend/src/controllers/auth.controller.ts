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
      return res.redirect(
        frontendUrl({ error: "Google sign-in is not configured on the server." })
      );
    }

    const nonce = randomUUID();
    const returnUrl = safeReturnUrl(req.query.returnUrl);
    const state = signOAuthState({ nonce, returnUrl });

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
    const fail = (message: string) => res.redirect(frontendUrl({ error: message }));

    if (!config.GOOGLE_ENABLED) {
      return fail("Google sign-in is not configured on the server.");
    }

    const cookieNonce = readCookie(req, OAUTH_STATE_COOKIE);
    res.clearCookie(OAUTH_STATE_COOKIE, { path: "/" });

    const { code, state } = req.query;
    if (typeof req.query.error === "string") {
      return fail("Google sign-in was cancelled.");
    }
    if (typeof code !== "string" || typeof state !== "string") {
      return fail("Google sign-in failed: no authorization code was returned.");
    }

    let statePayload;
    try {
      statePayload = verifyOAuthState(state);
    } catch {
      return fail("Google sign-in expired. Please try again.");
    }

    // The signature proves we issued the state; the cookie proves this is the same
    // browser that started the flow. Both are needed to stop login-CSRF.
    if (!cookieNonce || cookieNonce !== statePayload.nonce) {
      return fail("Google sign-in failed: state mismatch. Please try again.");
    }

    let payload;
    try {
      const client = googleClient();
      const { tokens } = await client.getToken(code);
      if (!tokens.id_token) {
        return fail("Google sign-in failed: no identity token was returned.");
      }
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: config.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch {
      return fail("Google sign-in failed: could not verify your Google account.");
    }

    if (!payload?.sub || !payload.email) {
      return fail("Google did not return an email address.");
    }
    // Without this, anyone able to set an unverified Google email could take over
    // an existing FlowPilot account through the account-linking path below.
    if (!payload.email_verified) {
      return fail("Your Google email address is not verified.");
    }

    try {
      const user = await loginOrCreateGoogleUserService({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name || payload.email.split("@")[0],
        profilePicture: payload.picture ?? null,
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
      return fail(message);
    }
  }
);
