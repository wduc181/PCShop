import { apiRequest } from "./api";

const BASE_URL = "/order-details";

const unwrapResponse = (res) => {
	if (!res || typeof res !== "object") return res;
	if (res.responseObject !== undefined) return res.responseObject;
	if (res.response_object !== undefined) return res.response_object;
	if (res.data !== undefined) return res.data;
	return res;
};

export const getOrderDetailsByOrder = async (orderId) => {
	if (!orderId) throw new Error("orderId is required");
	const raw = await apiRequest(`${BASE_URL}/order/${orderId}`, { method: "GET" });
	return unwrapResponse(raw);
};

export default {
	getOrderDetailsByOrder,
};

