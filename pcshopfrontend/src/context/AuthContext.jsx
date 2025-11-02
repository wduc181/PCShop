import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isAdminFromToken } from "@/services/auth";

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
      try { localStorage.removeItem("user_id"); } catch (_) {}
      return;
    }
    const payload = decodeJwt(token);
    const phone = payload?.phoneNumber || payload?.phone || payload?.phone_number || payload?.sub || null;

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
    setIsAdmin(isAdminFromToken(token));
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
