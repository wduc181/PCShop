import { apiRequest } from "./api";

const BASE_URL = "/orders";

const toOrderDTO = (payload = {}) => {
	const {
		orderId,
		userId,
		fullName,
		email,
		phoneNumber,
		shippingAddress,
		note,
		totalPrice,
		paymentMethod,
		shippingMethod,
		trackingNumber,
		status,
		paymentStatus,
	} = payload;

	const uid = userId != null ? Number(userId) : null;
	const price = totalPrice != null ? Number(totalPrice) : 0;

	return {
		// một số backend có thể yêu cầu order_id trong body
		...(orderId != null ? { order_id: Number(orderId) } : {}),
		user_id: uid,
		full_name: fullName ?? "",
		email: email ?? "",
		phone_number: phoneNumber ?? "",
		shipping_address: shippingAddress ?? "",
		note: note ?? "",
		total_price: Number.isFinite(price) && price >= 0 ? price : 0,
		payment_method: paymentMethod ?? "",
		shipping_method: shippingMethod ?? "",
		tracking_number: trackingNumber ?? "",
		...(status ? { status: String(status).toLowerCase() } : {}),
		...(paymentStatus ? { payment_status: String(paymentStatus).toLowerCase() } : {}),
	};
};

export const normalizeOrderUserId = (orderLike) => {
  if (!orderLike) return null;
  const cand = orderLike.user_id ?? orderLike.userId ?? orderLike.user_id ?? orderLike.uid;
  if (cand != null && Number.isFinite(Number(cand))) return Number(cand);
  const nested = orderLike.user?.id ?? orderLike.user?.user_id ?? orderLike.user?.userId;
  if (nested != null && Number.isFinite(Number(nested))) return Number(nested);
  return null;
};

export const createOrderFromCart = async (userId, orderData = {}) => {
	if (!userId) throw new Error("userId is required");
	try {
		const body = JSON.stringify(toOrderDTO({ ...orderData, userId }));
		return await apiRequest(`${BASE_URL}/from-cart/${userId}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body,
		});
	} catch (error) {
		console.error("Error creating order from cart:", error);
		throw error;
	}
};

export const getAllOrders = async (authToken) => {
	try {
		const headers = authToken ? { Authorization: `Bearer ${authToken}` } : undefined;
		return await apiRequest(`${BASE_URL}`, { method: "GET", headers });
	} catch (error) {
		console.error("Error fetching all orders:", error);
		throw error;
	}
};

export const getOrdersByUser = async (userId, page = 1, size = 10, authToken) => {
	if (!userId) throw new Error("userId is required");
	try {
		const params = new URLSearchParams({ page: String(page), size: String(size) });
		const headers = authToken ? { Authorization: `Bearer ${authToken}` } : undefined;
		return await apiRequest(`${BASE_URL}/user/${userId}?${params.toString()}`, { method: "GET", headers });
	} catch (error) {
		console.error("Error fetching orders by user:", error);
		throw error;
	}
};

export const getOrderDetails = async (orderId) => {
	if (!orderId) throw new Error("orderId is required");
	try {
		return await apiRequest(`${BASE_URL}/${orderId}/details`, { method: "GET" });
	} catch (error) {
		console.error("Error fetching order details:", error);
		throw error;
	}
};

export const updateOrder = async (orderId, orderData = {}) => {
	if (!orderId) throw new Error("orderId is required");
	try {
		const body = JSON.stringify(toOrderDTO(orderData));
		return await apiRequest(`${BASE_URL}/${orderId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body,
		});
	} catch (error) {
		console.error("Error updating order:", error);
		throw error;
	}
};

export const deleteOrder = async (orderId) => {
	if (!orderId) throw new Error("orderId is required");
	try {
		return await apiRequest(`${BASE_URL}/${orderId}`, { method: "DELETE" });
	} catch (error) {
		console.error("Error deleting order:", error);
		throw error;
	}
};

export const placeOrder = createOrderFromCart;

