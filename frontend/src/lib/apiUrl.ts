/**
 * Build URL for the FastAPI backend.
 * - Dev + no VITE_API_BASE_URL: `/api/...` (Vite proxy → :8000).
 * - VITE_API_BASE_URL: that origin (production or custom dev).
 */
export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const fromEnv = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return `${fromEnv}${p}`;
  if (import.meta.env.DEV) return `/api${p}`;
  return `http://127.0.0.1:8000${p}`;
}
