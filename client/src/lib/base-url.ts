/**
 * API origin + `/api` (Express default BASE_PATH). Strips trailing slashes; appends `/api` if missing.
 */
export function normalizeApiBase(raw: string | undefined): string {
  if (raw == null || raw === "") {
    return "";
  }
  const trimmed = raw.replace(/\/+$/, "").trim();
  if (trimmed.endsWith("/api")) {
    return trimmed;
  }
  return `${trimmed}/api`;
}

export const baseURL = normalizeApiBase(import.meta.env.VITE_API_BASE_URL);
