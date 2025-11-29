import { apiRequest } from "./api";
import { getAuthSnapshot } from "./auth";

const BASE_URL = "/comments";

const unwrap = (res) =>
	res && typeof res === "object" && "response_object" in res ? res.response_object : res;

const resolveUserId = (userId) => {
	if (userId != null) {
		const n = Number(userId);
		return Number.isFinite(n) ? n : null;
	}
	const snapshot = getAuthSnapshot();
	const fromSnapshot = snapshot?.userId;
	if (fromSnapshot != null) {
		const n = Number(fromSnapshot);
		return Number.isFinite(n) ? n : null;
	}
	return null;
};

const toCreateDTO = ({ productId, userId, content, rootCommentId } = {}) => {
	const pid = productId != null ? Number(productId) : null;
	const uid = userId != null ? Number(userId) : null;
	const rid = rootCommentId != null ? Number(rootCommentId) : null;
	if (!pid || !content) {
		throw new Error("productId and content are required");
	}
	return {
		product_id: pid,
		user_id: uid, // backend @Valid requires this; controller will also enforce owner = current user
		...(rid ? { root_comment_id: rid } : {}),
		content: String(content),
	};
};

const toQuery = (params = {}) => {
	const { page = 1, size = 10, sort = "desc" } = params;
	const sp = new URLSearchParams({ page: String(page), size: String(size), sort: String(sort) });
	return `?${sp.toString()}`;
};

export const getProductComments = async (productId, params = {}) => {
	if (!productId) throw new Error("productId is required");
	try {
		const res = await apiRequest(`${BASE_URL}/product/${productId}${toQuery(params)}`, { method: "GET" });
		return unwrap(res);
	} catch (error) {
		console.error("Error fetching product comments:", error);
		throw error;
	}
};

export const getReplies = async (commentId, params = {}) => {
	if (!commentId) throw new Error("commentId is required");
	try {
		const res = await apiRequest(`${BASE_URL}/${commentId}/replies${toQuery(params)}`, { method: "GET" });
		return unwrap(res);
	} catch (error) {
		console.error("Error fetching comment replies:", error);
		throw error;
	}
};

export const createComment = async ({ productId, content, rootCommentId, userId } = {}) => {
	const uid = resolveUserId(userId);
	if (!uid) throw new Error("Bạn cần đăng nhập để bình luận");
	const body = JSON.stringify(toCreateDTO({ productId, userId: uid, content, rootCommentId }));
	try {
		const res = await apiRequest(`${BASE_URL}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body,
		});
		return unwrap(res);
	} catch (error) {
		console.error("Error creating comment:", error);
		throw error;
	}
};

export const updateComment = async (commentId, { content } = {}) => {
	if (!commentId) throw new Error("commentId is required");
	if (!content) throw new Error("content is required");
	try {
		const body = JSON.stringify({ content: String(content) });
		const res = await apiRequest(`${BASE_URL}/${commentId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body,
		});
		return unwrap(res);
	} catch (error) {
		console.error("Error updating comment:", error);
		throw error;
	}
};

export const deleteComment = async (commentId) => {
	if (!commentId) throw new Error("commentId is required");
	try {
		const res = await apiRequest(`${BASE_URL}/${commentId}`, { method: "DELETE" });
		return unwrap(res);
	} catch (error) {
		console.error("Error deleting comment:", error);
		throw error;
	}
};

export default {
	getProductComments,
	getReplies,
	createComment,
	updateComment,
	deleteComment,
};

