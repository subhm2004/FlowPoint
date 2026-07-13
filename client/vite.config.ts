import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  /** Local Express default from backend .env (PORT=8000) */
  const proxyTarget = env.VITE_DEV_PROXY_TARGET || "http://127.0.0.1:8000";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      /**
       * 3000 is not cosmetic: the Google console's registered redirect URI is
       * http://localhost:3000/api/auth/callback/google, so Google sends the browser
       * back *here* and the proxy below hands it to Express. strictPort makes a busy
       * port fail loudly instead of drifting to 3001 and silently breaking OAuth.
       */
      port: 3000,
      strictPort: true,
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
