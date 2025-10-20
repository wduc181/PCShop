export const API_BASE_URL = (import.meta?.env?.VITE_API_BASE_URL || "http://localhost:8088").replace(/\/$/, "");
export const API_PREFIX = (import.meta?.env?.VITE_API_PREFIX || "/api/ver1").replace(/\/$/, "");
export const API_URL = `${API_BASE_URL}${API_PREFIX}`;

export const UPLOADS_PRODUCTS = (import.meta?.env?.VITE_UPLOADS_PRODUCTS || "/uploads/products").replace(/\/$/, "");
export const UPLOADS_BRANDS = (import.meta?.env?.VITE_UPLOADS_BRANDS || "/uploads/brands").replace(/\/$/, "");

export function resolveAssetUrl(u, defaultBasePath = "") {
  if (!u || typeof u !== "string") return "";
  if (/^https?:\/\//i.test(u) || /^\/\//.test(u)) return u;
  if (u.startsWith("/")) return `${API_BASE_URL}${u}`;
  if (/^(uploads|images)\//i.test(u)) return `${API_BASE_URL}/${u}`;
  if (defaultBasePath) return `${API_BASE_URL}${defaultBasePath}/${u}`;
  return `${API_BASE_URL}/${u}`;
}

export const productImageUrl = (name) => resolveAssetUrl(name, UPLOADS_PRODUCTS);
export const brandImageUrl = (name) => resolveAssetUrl(name, UPLOADS_BRANDS);

const rawAllowlist = import.meta?.env?.VITE_ADMIN_ALLOWLIST || "";
export const ADMIN_ALLOWLIST = String(rawAllowlist)
  .split(/[,\s]+/)
  .map((s) => s.trim())
  .filter(Boolean);
