import { API_URL } from "@/config/env";

const AUTH_KEYS = Object.freeze({ token: "token", userId: "userId", phone: "phoneNumber", roles: "roles" });

const handleResponse = async (res) => {
    let data;
    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        data = await res.json();
    } else {
        data = { message: await res.text() };
    }

    if (!res.ok) {
        const errorMessage = data?.message || res.statusText || "Đã có lỗi xảy ra";
        throw new Error(errorMessage);
    }

    return data?.response_object || data;
};

const persistAuthSnapshot = ({ token, id, phone_number, roles } = {}) => {
    try {
        if (typeof token === "string" && token.length > 0) {
            localStorage.setItem(AUTH_KEYS.token, token);
        }
        if (typeof id === "number" && Number.isFinite(id)) {
            localStorage.setItem(AUTH_KEYS.userId, String(id));
        } else {
            localStorage.removeItem(AUTH_KEYS.userId);
        }
        if (phone_number) {
            localStorage.setItem(AUTH_KEYS.phone, phone_number);
        } else {
            localStorage.removeItem(AUTH_KEYS.phone);
        }
        if (Array.isArray(roles) && roles.length > 0) {
            localStorage.setItem(AUTH_KEYS.roles, JSON.stringify(roles));
        } else {
            localStorage.removeItem(AUTH_KEYS.roles);
        }
    } catch (_) {
        // ignore storage errors (e.g. private browsing)
    }
};

export const clearAuthSnapshot = () => {
    try {
        localStorage.removeItem(AUTH_KEYS.userId);
        localStorage.removeItem(AUTH_KEYS.phone);
        localStorage.removeItem(AUTH_KEYS.roles);
        localStorage.removeItem(AUTH_KEYS.token);
    } catch (_) {
        // ignore
    }
};

export const getAuthSnapshot = () => {
    try {
        const token = localStorage.getItem(AUTH_KEYS.token) || null;
        const rawUserId = localStorage.getItem(AUTH_KEYS.userId);
        const userId = rawUserId != null ? Number(rawUserId) : null;
        const phoneNumber = localStorage.getItem(AUTH_KEYS.phone) || null;
        const rolesRaw = localStorage.getItem(AUTH_KEYS.roles);
        let roles = [];
        if (rolesRaw) {
            try {
                const parsed = JSON.parse(rolesRaw);
                roles = Array.isArray(parsed) ? parsed : [];
            } catch (_) {
                roles = [];
            }
        }
        return {
            token,
            userId: Number.isFinite(userId) ? userId : null,
            phoneNumber,
            roles,
        };
    } catch (_) {
        return { token: null, userId: null, phoneNumber: null, roles: [] };
    }
};

export const registerUser = async (userData) => {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    
    return handleResponse(res);
};

export const loginUser = async (credentials) => {
    const payload = credentials?.phone_number
        ? credentials
        : { phone_number: credentials?.phoneNumber, password: credentials?.password };

    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const tokenResponse = await handleResponse(res);

    const token = tokenResponse?.token || (typeof tokenResponse === "string" ? tokenResponse : null);
    if (token) {
        persistAuthSnapshot({
            token,
            id: tokenResponse?.id,
            phone_number: tokenResponse?.phone_number,
            roles: tokenResponse?.roles,
        });
        if (import.meta?.env?.DEV) console.log("[users.loginUser] token saved", {
            hasToken: true,
            id: tokenResponse?.id,
            phone: tokenResponse?.phone_number,
            roles: tokenResponse?.roles?.length || 0,
        });
    }

    return token;
};

const decodeJwtPayload = (token) => {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    try {
        let base = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        while (base.length % 4 !== 0) base += "=";
        const json = atob(base);
        return JSON.parse(json) || null;
    } catch (_) {
        return null;
    }
};

const normalizeRole = (r) => String(r || "").toUpperCase().replace(/^ROLE_/, "").trim();
const toArray = (v) => Array.isArray(v) ? v : (typeof v === "string" ? v.split(/[,\s]+/).filter(Boolean) : []);

export const getRolesFromToken = (token) => {
    const payload = decodeJwtPayload(token) || {};
    let roles = [
        ...toArray(payload.roles),
        ...toArray(payload.role),
        ...toArray(payload.authorities),
        ...toArray(payload.scope),
    ];
    const realmRoles = payload?.realm_access?.roles;
    if (Array.isArray(realmRoles)) roles.push(...realmRoles);
    const resourceAccess = payload?.resource_access;
    if (resourceAccess && typeof resourceAccess === "object") {
        Object.values(resourceAccess).forEach((entry) => {
            if (entry?.roles && Array.isArray(entry.roles)) roles.push(...entry.roles);
        });
    }
    
    const normalized = roles.map(normalizeRole).filter(Boolean);
    return Array.from(new Set(normalized));
};

export const isAdminFromToken = (token) => getRolesFromToken(token).includes("ADMIN");

export const getUserIdFromToken = (token) => {
    const payload = decodeJwtPayload(token);
    if (!payload) return null;
    // Kiểm tra kỹ các trường user_id
    const raw = payload.user_id ?? payload.userId ?? payload.id ?? null;
    const n = raw != null ? Number(raw) : null;
    return Number.isFinite(n) && n > 0 ? n : null;
};

export const changePassword = async ({ userId, password, newPassword, confirmNewPassword, token } = {}) => {
    if (!password || !newPassword) throw new Error("Vui lòng nhập mật khẩu cũ và mới");
    if (typeof confirmNewPassword !== "undefined" && newPassword !== confirmNewPassword) {
        throw new Error("Mật khẩu mới và nhập lại mật khẩu mới không khớp");
    }

    let snapshot;
    let t = token;
    if (!t) {
        snapshot = getAuthSnapshot();
        t = snapshot.token;
    }
    if (!t) throw new Error("Bạn chưa đăng nhập");

    let uid = userId;
    if (!uid) {
        if (!snapshot) snapshot = getAuthSnapshot();
        uid = snapshot.userId ?? getUserIdFromToken(t);
    }
    if (!uid) throw new Error("Không tìm thấy ID người dùng");

    const res = await fetch(`${API_URL}/auth/${uid}/change-password`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${t}`,
        },
     
        body: JSON.stringify({ 
            password: password, 
            new_password: newPassword 
        }),
    });

    return handleResponse(res);
};

export default {
    registerUser,
    loginUser,
    getRolesFromToken,
    isAdminFromToken,
    changePassword,
};