import { API_URL } from "@/config/env";
import { getUserIdFromToken } from "@/services/auth";

const parseResponse = async (res) => {
	const contentType = res.headers.get("content-type") || "";
	if (contentType.includes("application/json")) return res.json();
	return res.text();
};

const getAuthToken = (token) => {
	if (token) return token;
	try {
		return localStorage.getItem("token");
	} catch (_) {
		return null;
	}
};

// Reuse getUserIdFromToken from auth.js to avoid duplication

const normalizeDate = (v) => {
	if (!v) return undefined;
	if (typeof v === "string") return v; // assume already YYYY-MM-DD
	if (v instanceof Date && !isNaN(v)) {
		const yyyy = v.getFullYear();
		const mm = String(v.getMonth() + 1).padStart(2, "0");
		const dd = String(v.getDate()).padStart(2, "0");
		return `${yyyy}-${mm}-${dd}`;
	}
	return undefined;
};

/**
 * @param {{ page?: number, limit?: number, token?: string }} params
 * @returns {Promise<any[]>}
*/
export const getUsers = async ({ page = 1, limit = 10, token } = {}) => {
	const t = getAuthToken(token);
	if (!t) throw new Error("Missing auth token");

	const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
	const res = await fetch(`${API_URL}/users?${qs.toString()}` , {
		method: "GET",
		headers: {
			Authorization: `Bearer ${t}`,
		},
	});

	if (!res.ok) {
		const err = await res.text();
		throw new Error(err || "Lấy danh sách người dùng thất bại");
	}
	return parseResponse(res);
};

/**
 * @param {{ id: number, fullname?: string, fullName?: string, email: string, address?: string, date_of_birth?: string|Date, dateOfBirth?: string|Date, token?: string }} params
 * @returns {Promise<any>}
 */
export const updateUserInfo = async ({ id, fullname, fullName, email, address, date_of_birth, dateOfBirth, token } = {}) => {
	if (!email) throw new Error("Email là bắt buộc");

	const t = getAuthToken(token);
	if (!t) throw new Error("Missing auth token");

	// Resolve user id from param or token claims
	let uid = id;
	if (!uid) uid = getUserIdFromToken(t);
	if (!uid) throw new Error("Missing user id");

	const payload = {
		fullname: (typeof fullname !== "undefined" ? fullname : fullName),
		email,
		address,
		date_of_birth: normalizeDate(typeof date_of_birth !== "undefined" ? date_of_birth : dateOfBirth),
	};

	const res = await fetch(`${API_URL}/users/changeInfo/${uid}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${t}`,
		},
		body: JSON.stringify(payload),
	});

	if (!res.ok) {
		const err = await res.text();
		throw new Error(err || "Cập nhật thông tin người dùng thất bại");
	}
	return parseResponse(res);
};

/**
 * Lấy thông tin một user theo id (mặc định lấy từ JWT nếu không truyền id)
 * @param {{ id?: number, token?: string }} params
 * @returns {Promise<any>}
 */
export const getUser = async ({ id, token } = {}) => {
	const t = getAuthToken(token);
	if (!t) throw new Error("Missing auth token");

	let uid = id;
	if (!uid) uid = getUserIdFromToken(t);
	if (!uid) throw new Error("Missing user id");

	const res = await fetch(`${API_URL}/users/${uid}`, {
		method: "GET",
		headers: { Authorization: `Bearer ${t}` },
	});
	if (!res.ok) {
		const err = await res.text();
		throw new Error(err || "Lấy thông tin người dùng thất bại");
	}
	return parseResponse(res);
};

export default {
	getUsers,
	updateUserInfo,
	getUser,
};

