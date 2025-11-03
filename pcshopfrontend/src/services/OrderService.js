import { apiRequest } from "./api";

const BASE_URL = "/orders";

const normalizeKey = (s) => {
	if (s == null) return "";
	return String(s)
		.toLowerCase()
		.trim()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/đ/g, "d")
		.replace(/Đ/g, "d");
};

const ORDER_STATUS_MAP_VI2EN = {
	// Vietnamese
	"cho xu ly": "pending",
	"dang xu ly": "processing",
	"da gui": "shipped",
	"da giao": "delivered",
	"da huy": "cancelled",
	"bi huy": "cancelled",
	"huy": "cancelled",
	pending: "pending",
	processing: "processing",
	shipped: "shipped",
	delivered: "delivered",
	canceled: "cancelled",
	cancelled: "cancelled",
};

const PAYMENT_STATUS_MAP_VI2EN = {
	"cho thanh toan": "pending",
	"chua thanh toan": "pending",
	"da thanh toan": "paid",
	"hoan tien": "refunded",

	pending: "pending",
	paid: "paid",
	refunded: "refunded",
};

const toEnglishOrderStatus = (val) => {
	const key = normalizeKey(val);
	return key ? (ORDER_STATUS_MAP_VI2EN[key] ?? key) : undefined;
};

const toEnglishPaymentStatus = (val) => {
	const key = normalizeKey(val);
	return key ? (PAYMENT_STATUS_MAP_VI2EN[key] ?? key) : undefined;
};

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

	const sEn = toEnglishOrderStatus(status);
	const psEn = toEnglishPaymentStatus(paymentStatus);

	return {
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
		...(sEn ? { status: sEn } : {}),
		...(psEn ? { payment_status: psEn } : {}),
	};
};

const toOrderInfoDTO = (payload = {}) => {
	const {
		userId,
		fullName,
		email,
		phoneNumber,
		shippingAddress,
		note,
		paymentMethod,
		shippingMethod,
	} = payload;

	const uid = userId != null ? Number(userId) : null;

	return {
		user_id: uid,
		full_name: fullName ?? "",
		email: email ?? "",
		phone_number: phoneNumber ?? "",
		shipping_address: shippingAddress ?? "",
		note: note ?? "",
		payment_method: paymentMethod ?? "",
		shipping_method: shippingMethod ?? "",
	};
};

const toOrderStatusDTO = (status) => {
	const sEn = toEnglishOrderStatus(status);
	if (!sEn) throw new Error("Invalid order status");
	return { status: sEn };
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
		const body = JSON.stringify(toOrderInfoDTO(orderData));
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

export const placeOrder = createOrderFromCart;

export const cancelOrder = async (orderId, authToken) => {
  if (!orderId) throw new Error("orderId is required");
  try {
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : undefined;
    return await apiRequest(`${BASE_URL}/${orderId}/cancel`, {
			method: "PUT",
      headers,
    });
  } catch (error) {
    console.error("Error canceling order:", error);
    throw error;
  }
};

export const updateOrderInfo = updateOrder;

export const updateOrderStatus = async (orderId, status, authToken) => {
	if (!orderId) throw new Error("orderId is required");
	try {
		const headers = {
			"Content-Type": "application/json",
			...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
		};
		const body = JSON.stringify(toOrderStatusDTO(status));
		return await apiRequest(`${BASE_URL}/${orderId}/status`, {
			method: "PUT",
			headers,
			body,
		});
	} catch (error) {
		console.error("Error updating order status:", error);
		throw error;
	}
};