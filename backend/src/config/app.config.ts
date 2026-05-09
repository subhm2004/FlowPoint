import { getEnv } from "../utils/get-env";

const parseOrigins = (raw: string) =>
  raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const appConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", "5000"),
  BASE_PATH: getEnv("BASE_PATH", "/api"),
  MONGO_URI: getEnv("MONGO_URI", ""),

  JWT_SECRET: getEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "7d"),

  /** Comma-separated allowed browser origins for CORS (e.g. Vercel URL + http://localhost:5173 for local dev). */
  FRONTEND_ORIGINS: parseOrigins(
    getEnv("FRONTEND_ORIGIN", "http://localhost:5173")
  ),
});

export const config = appConfig();
