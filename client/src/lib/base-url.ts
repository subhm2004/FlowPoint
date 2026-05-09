/** API base for HTTP requests. Must include `/api` if server uses BASE_PATH=/api. */
function normalizeApiBase(raw: string | undefined): string {
  if (raw == null || raw === "") {
    return "";
  }
  return raw.replace(/\/+$/, "").trim();
}

export const baseURL = normalizeApiBase(import.meta.env.VITE_API_BASE_URL);
