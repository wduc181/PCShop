// Centralized environment and URL helpers
export const API_BASE_URL = (import.meta?.env?.VITE_API_BASE_URL || "http://localhost:8088").replace(/\/$/, "");
export const API_PREFIX = (import.meta?.env?.VITE_API_PREFIX || "/api/ver1").replace(/\/$/, "");
export const API_URL = `${API_BASE_URL}${API_PREFIX}`;

export const UPLOADS_PRODUCTS = (import.meta?.env?.VITE_UPLOADS_PRODUCTS || "/uploads/products").replace(/\/$/, "");
export const UPLOADS_BRANDS = (import.meta?.env?.VITE_UPLOADS_BRANDS || "/uploads/brands").replace(/\/$/, "");

// Resolve any asset URL; if absolute return as-is; if starts with '/', prefix API_BASE_URL
// otherwise join with defaultBasePath under API_BASE_URL
export function resolveAssetUrl(u, defaultBasePath = "") {
  if (!u || typeof u !== "string") return "";
  // Already absolute
  if (/^https?:\/\//i.test(u) || /^\/\//.test(u)) return u;
  // Starts with '/'
  if (u.startsWith("/")) return `${API_BASE_URL}${u}`;
  // Looks like 'uploads/...'
  if (/^(uploads|images)\//i.test(u)) return `${API_BASE_URL}/${u}`;
  // Otherwise, treat as filename under provided default path
  if (defaultBasePath) return `${API_BASE_URL}${defaultBasePath}/${u}`;
  return `${API_BASE_URL}/${u}`;
}

export const productImageUrl = (name) => resolveAssetUrl(name, UPLOADS_PRODUCTS);
export const brandImageUrl = (name) => resolveAssetUrl(name, UPLOADS_BRANDS);
