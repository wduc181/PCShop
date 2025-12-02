import { apiRequest } from "@/services/api";
import { getUserIdFromToken } from "@/services/auth";

const unwrap = (res) => (res && typeof res === "object" && "response_object" in res ? res.response_object : res);

const getAuthToken = (token) => {
	if (token) return token;
	try {
		return localStorage.getItem("token");
	} catch (_) {
		return null;
	}
};

const withAuthHeader = (token, options = {}) => {
	if (!token) return options;
	return {
		...options,
		headers: {
			...(options.headers || {}),
			Authorization: `Bearer ${token}`,
		},
	};
};

const request = async (endpoint, options) => unwrap(await apiRequest(endpoint, options));

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
 * @returns {Promise<any>}
*/
export const getUsers = async ({ page = 1, limit = 10, token } = {}) => {
	const t = getAuthToken(token);
	if (!t) throw new Error("Missing auth token");
	const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
	return await request(`/users?${qs.toString()}`, withAuthHeader(t));
};

/**
 * @param {{ id: number, fullname?: string, fullName?: string, email: string, address?: string, date_of_birth?: string|Date, dateOfBirth?: string|Date, token?: string }} params
 * @returns {Promise<any>}
 */
export const updateUserInfo = async ({ id, fullname, fullName, email, address, date_of_birth, dateOfBirth, token } = {}) => {
	if (!email) throw new Error("Email là bắt buộc");

	const t = getAuthToken(token);
	if (!t) throw new Error("Missing auth token");

	let uid = id;
	if (!uid) uid = getUserIdFromToken(t);
	if (!uid) throw new Error("Missing user id");

	const payload = {
		fullname: typeof fullname !== "undefined" ? fullname : fullName,
		email,
		address,
		date_of_birth: normalizeDate(typeof date_of_birth !== "undefined" ? date_of_birth : dateOfBirth),
	};

	return await request(`/users/changeInfo/${uid}`, withAuthHeader(t, {
		method: "PUT",
		body: JSON.stringify(payload),
	}));
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

	return await request(`/users/${uid}`, withAuthHeader(t));
};

export default {
	getUsers,
	updateUserInfo,
	getUser,
};

