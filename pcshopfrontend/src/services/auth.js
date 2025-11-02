import { API_URL } from "@/config/env";

const parseResponse = async (res) => {
	const contentType = res.headers.get("content-type") || "";
	if (contentType.includes("application/json")) {
		return res.json();
	}
	return res.text();
};

export const registerUser = async (userData) => {
	const res = await fetch(`${API_URL}/auth/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(userData),
	});
	if (!res.ok) {
		const err = await res.text();
		throw new Error(err || "Đăng ký thất bại");
	}
	return parseResponse(res);
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

	if (!res.ok) {
		const err = await res.text();
		throw new Error(err || "Đăng nhập thất bại");
	}

	let token = await parseResponse(res);
	if (typeof token === "string" && token.length > 2 && token.startsWith('"') && token.endsWith('"')) {
		token = token.slice(1, -1);
	}
	if (typeof token === "string" && token) {
		try {
			localStorage.setItem("token", token);
			if (import.meta?.env?.DEV) console.log("[users.loginUser] token saved, length:", token.length);
		} catch (_) {}
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
	const raw = payload.user_id ?? payload.userId ?? payload.id ?? null;
	const n = raw != null ? Number(raw) : null;
	return Number.isFinite(n) && n > 0 ? n : null;
};

/**
 * @param {{ userId?: number, password: string, newPassword: string, confirmNewPassword?: string, token?: string }} params
 */
export const changePassword = async ({ userId, password, newPassword, confirmNewPassword, token } = {}) => {
	if (!password || !newPassword) throw new Error("password and newPassword are required");
	if (typeof confirmNewPassword !== "undefined" && newPassword !== confirmNewPassword) {
		throw new Error("Mật khẩu mới và nhập lại mật khẩu mới không khớp");
	}
	let t = token;
	try { if (!t) t = localStorage.getItem("token"); } catch (_) {}
	if (!t) throw new Error("Missing auth token");
	let uid = userId;
	if (!uid) uid = getUserIdFromToken(t);
	if (!uid) throw new Error("Missing user id");

	const res = await fetch(`${API_URL}/auth/${uid}/change-password`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${t}`,
		},
		body: JSON.stringify({ password, new_password: newPassword }),
	});
	if (!res.ok) {
		const err = await res.text();
		throw new Error(err || "Đổi mật khẩu thất bại");
	}
	return parseResponse(res);
};

export default {
	registerUser,
	loginUser,
	getRolesFromToken,
	isAdminFromToken,
	changePassword,
};

