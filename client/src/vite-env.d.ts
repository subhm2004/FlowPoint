/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Prod: full URL ending in `/api`. Dev: `/api`, proxied by vite.config.ts. */
  readonly VITE_API_BASE_URL?: string;
  /** Dev only: proxy target when the API is not on http://127.0.0.1:8000. */
  readonly VITE_DEV_PROXY_TARGET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
