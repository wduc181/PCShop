import { apiRequest } from "./api";

const BASE_URL = "/comments";

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
		return await apiRequest(`${BASE_URL}/product/${productId}${toQuery(params)}`, { method: "GET" });
	} catch (error) {
		console.error("Error fetching product comments:", error);
		throw error;
	}
};

export const getReplies = async (commentId, params = {}) => {
	if (!commentId) throw new Error("commentId is required");
	try {
		return await apiRequest(`${BASE_URL}/${commentId}/replies${toQuery(params)}`, { method: "GET" });
	} catch (error) {
		console.error("Error fetching comment replies:", error);
		throw error;
	}
};

export const createComment = async ({ productId, content, rootCommentId, userId } = {}) => {
	// fallback to persisted user_id set by AuthContext
	let uid = userId;
	try {
		if (uid == null) {
			const stored = localStorage.getItem("user_id");
			if (stored != null && Number.isFinite(Number(stored))) uid = Number(stored);
		}
	} catch (_) {}
	const body = JSON.stringify(toCreateDTO({ productId, userId: uid, content, rootCommentId }));
	try {
		return await apiRequest(`${BASE_URL}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body,
		});
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
		return await apiRequest(`${BASE_URL}/${commentId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body,
		});
	} catch (error) {
		console.error("Error updating comment:", error);
		throw error;
	}
};

export const deleteComment = async (commentId) => {
	if (!commentId) throw new Error("commentId is required");
	try {
		return await apiRequest(`${BASE_URL}/${commentId}`, { method: "DELETE" });
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

