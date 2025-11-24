import { API_URL } from "@/config/env";

// Debug helper
const dbg = (...args) => {
  try {
    if (import.meta?.env?.DEV) console.log("[apiRequest]", ...args);
  } catch (_) {
    // ignore
  }
};

export const apiRequest = async (endpoint, options = {}) => {
  let token;
  try {
    token = localStorage.getItem("token") || undefined;
  } catch (_) {
    token = undefined;
  }
  dbg("init", { endpoint, method: options.method || "GET", isFormData: options.body instanceof FormData, hasToken: !!token });

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  dbg("response", { endpoint, status: response.status });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return true;
};
