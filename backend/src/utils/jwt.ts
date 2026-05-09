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
