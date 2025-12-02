import { apiRequest } from "./api";

const BASE_URL = "/cart-items";
const unwrap = (res) => (res && typeof res === "object" && "response_object" in res ? res.response_object : res);
const request = async (endpoint, options) => unwrap(await apiRequest(endpoint, options));

const toCartDTO = ({ userId, productId, quantity = 1 }) => ({
	user_id: Number(userId),
	product_id: Number(productId),
	quantity: Number(quantity) || 1,
});

export const addCartItem = async (payload) => {
	try {
		const body = JSON.stringify(
			payload && ("user_id" in payload || "product_id" in payload)
				? {
						user_id: Number(payload.user_id),
						product_id: Number(payload.product_id),
						quantity: Number(payload.quantity) || 1,
					}
				: toCartDTO(payload || {})
		);
		return await request(BASE_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body,
		});
	} catch (error) {
		console.error("Error adding cart item:", error);
		throw error;
	}
};

export const updateCartItemQuantity = async (id, quantity) => {
	try {
		const q = new URLSearchParams({ quantity: String(quantity) });
		return await request(`${BASE_URL}/${id}?${q.toString()}`, {
			method: "PUT",
		});
	} catch (error) {
		console.error("Error updating cart item quantity:", error);
		throw error;
	}
};


export const removeCartItem = async (id) => {
	try {
		return await request(`${BASE_URL}/${id}`, { method: "DELETE" });
	} catch (error) {
		console.error("Error removing cart item:", error);
		throw error;
	}
};

export const clearCart = async (userId) => {
	try {
		return await request(`${BASE_URL}/user/${userId}`, { method: "DELETE" });
	} catch (error) {
		console.error("Error clearing cart:", error);
		throw error;
	}
};

export const getCart = async (userId) => {
	try {
		return await request(`${BASE_URL}/user/${userId}`, { method: "GET" });
	} catch (error) {
		console.error("Error fetching cart:", error);
		throw error;
	}
};

export const addToCart = (userId, productId, quantity = 1) =>
	addCartItem({ userId, productId, quantity });

