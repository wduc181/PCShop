import { apiRequest } from "./api";

const BASE_URL = "/order-details";

export const getOrderDetailsByOrder = async (orderId) => {
	if (!orderId) throw new Error("orderId is required");
	return apiRequest(`${BASE_URL}/order/${orderId}`, { method: "GET" });
};

export default {
	getOrderDetailsByOrder,
};

