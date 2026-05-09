/**
 * API base for axios.
 * - Production / direct URL: `https://host.../api` or `http://localhost:8000/api`
 * - Local + Vite proxy: `/api` (same origin; vite.config proxies to backend)
 */
export function normalizeApiBase(raw: string | undefined): string {
  if (raw == null || raw === "") {
    return "";
  }
  let trimmed = raw
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\/+$/, "");

  if (trimmed === "") {
    return "";
  }

  // Same-origin path (Vite dev proxy)
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    if (trimmed === "/") return "/api";
    if (trimmed.endsWith("/api")) return trimmed;
    return `${trimmed}/api`;
  }

  if (trimmed.endsWith("/api")) {
    return trimmed;
  }
  return `${trimmed}/api`;
}

export const baseURL = normalizeApiBase(import.meta.env.VITE_API_BASE_URL);
