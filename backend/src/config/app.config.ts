import { getEnv, getOptionalEnv } from "../utils/get-env";

const parseOrigins = (raw: string) =>
  raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const appConfig = () => {
  const base = {
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

    /** Google OAuth. Optional — unset means the Google sign-in route is disabled, the rest of the API still boots. */
    GOOGLE_CLIENT_ID: getOptionalEnv("GOOGLE_CLIENT_ID"),
    GOOGLE_CLIENT_SECRET: getOptionalEnv("GOOGLE_CLIENT_SECRET"),
    /** Where Google sends the browser back. Must match a redirect URI registered in the Google console, exactly. */
    GOOGLE_CALLBACK_URL: getOptionalEnv("GOOGLE_CALLBACK_URL"),
    /** SPA page that receives our own JWT once the OAuth dance is done. */
    FRONTEND_GOOGLE_CALLBACK_URL: getOptionalEnv(
      "FRONTEND_GOOGLE_CALLBACK_URL",
      "http://localhost:5173/auth/google/callback"
    ),
  };

  return {
    ...base,
    GOOGLE_ENABLED: Boolean(
      base.GOOGLE_CLIENT_ID &&
        base.GOOGLE_CLIENT_SECRET &&
        base.GOOGLE_CALLBACK_URL
    ),
  };
};

export const config = appConfig();
