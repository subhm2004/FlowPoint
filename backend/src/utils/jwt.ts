import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config/app.config";

export type JwtPayload = { sub: string };

export function signAccessToken(userId: string): string {
  return jwt.sign({ sub: userId }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  } as SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, config.JWT_SECRET) as JwtPayload;
}

/**
 * OAuth `state`: signed so Google cannot be handed a forged one, short-lived, and
 * carrying a nonce we also drop in an httpOnly cookie — the pair is what ties the
 * callback back to the browser that actually started the flow.
 */
export type OAuthStatePayload = { nonce: string; returnUrl?: string };

export function signOAuthState(payload: OAuthStatePayload): string {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: "10m" });
}

export function verifyOAuthState(state: string): OAuthStatePayload {
  return jwt.verify(state, config.JWT_SECRET) as OAuthStatePayload;
}
