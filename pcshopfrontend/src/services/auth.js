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

