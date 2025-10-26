import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ADMIN_ALLOWLIST } from "@/config/env";

const decodeJwt = (token) => {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload || null;
  } catch (_) {
    return null;
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("token");
      if (saved) setToken(saved);
    } catch (_) {}
  }, []);

  useEffect(() => {
    try {
      if (token) localStorage.setItem("token", token);
      else localStorage.removeItem("token");
    } catch (_) {}
  }, [token]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setIsAdmin(false);
      // remove cached user id when logged out
      try { localStorage.removeItem("user_id"); } catch (_) {}
      return;
    }
    const payload = decodeJwt(token);
    const phone = payload?.phoneNumber || payload?.phone || payload?.phone_number || payload?.sub || null;

    // Extract roles from common JWT claim shapes (Spring Security, Keycloak, custom)
    const toArray = (v) => Array.isArray(v) ? v : (typeof v === "string" ? v.split(/\s|,/).filter(Boolean) : []);
    const normalizeRole = (r) => String(r).toUpperCase().replace(/^ROLE_/, "").trim();

    let roles = [
      ...toArray(payload?.roles),
      ...toArray(payload?.role),
      ...toArray(payload?.authorities),
      ...toArray(payload?.scope),
    ];
    const realmRoles = payload?.realm_access?.roles;
    if (Array.isArray(realmRoles)) roles.push(...realmRoles);
    const resourceAccess = payload?.resource_access;
    if (resourceAccess && typeof resourceAccess === "object") {
      Object.values(resourceAccess).forEach((entry) => {
        if (entry?.roles && Array.isArray(entry.roles)) roles.push(...entry.roles);
      });
    }
    roles = roles.map(normalizeRole).filter(Boolean);

    // try to persist numeric user id for cart API
    const rawUid = payload?.user_id ?? payload?.userId ?? payload?.id ?? payload?.uid ?? null;
    const uidNum = rawUid != null ? Number(rawUid) : null;
    try {
      if (Number.isFinite(uidNum) && uidNum > 0) localStorage.setItem("user_id", String(uidNum));
      else localStorage.removeItem("user_id");
    } catch (_) {}

    let fullname = null;
    try {
      fullname = localStorage.getItem("user_fullname") || null;
    } catch (_) {}

  setUser({ phoneNumber: phone, fullname, roles });
  const adminByRole = roles.includes("ADMIN");

    // Normalize identifiers for robust allowlist matching
    const normalizeId = (s) => {
      const raw = (s ?? "").toString().trim();
      const lower = raw.toLowerCase();
      const digits = raw.replace(/\D/g, "");
      const digitsNoZ = digits.replace(/^0+/, "");
      return { raw, lower, digits, digitsNoZ };
    };

  const allow = (ADMIN_ALLOWLIST || []).filter(Boolean).map(normalizeId);
  const phoneN = normalizeId(phone);
  const emailN = normalizeId(payload?.email);
  const usernameRaw = payload?.username || payload?.user_name || payload?.preferred_username;
  const usernameN = normalizeId(usernameRaw);

    const adminByAllowlist = allow.length > 0 && allow.some((a) =>
      // exact raw match
      (phoneN.raw && a.raw === phoneN.raw) ||
      // digits-only match (ignore non-digits)
      (phoneN.digits && a.digits && a.digits === phoneN.digits) ||
      // match ignoring leading zeros
      (phoneN.digitsNoZ && a.digitsNoZ && a.digitsNoZ === phoneN.digitsNoZ) ||
      // email/username case-insensitive
      (emailN.lower && a.lower === emailN.lower) ||
      (usernameN.lower && a.lower === usernameN.lower)
    );
    // Backward-compat fallback if allowlist is not configured
    const adminByPhoneFallback = (!ADMIN_ALLOWLIST?.length) && (phone === "000000001" || phone === "0000000002");
    setIsAdmin(adminByRole || adminByAllowlist || adminByPhoneFallback);

    // DEV diagnostics to verify allowlist matching in local environment only
    try {
      if (import.meta?.env?.DEV) {
        console.log("[Auth] allowlist:", ADMIN_ALLOWLIST);
        console.log("[Auth] identifiers:", { phone, email: payload?.email, username: usernameRaw });
        console.log("[Auth] computed:", { adminByRole, adminByAllowlist, adminByPhoneFallback });
      }
    } catch (_) {}
  }, [token]);

  const login = (newToken) => setToken(newToken ?? null);
  const logout = () => setToken(null);

  const value = useMemo(() => ({ token, isAuthenticated: !!token, user, isAdmin, login, logout }), [token, user, isAdmin]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export default AuthContext;
