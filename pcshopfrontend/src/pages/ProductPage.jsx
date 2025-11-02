import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import { useNavigate, useParams } from "react-router";
import { getProductById, getProductImages } from "@/services/productService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { productImageUrl } from "@/config/env";
import { addToCart } from "@/services/cartItemService";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { getProductComments, getReplies, createComment, updateComment, deleteComment } from "@/services/commentService";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

const ProductPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { isAuthenticated, token } = useAuth();
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [qty, setQty] = useState(1);
	const [adding, setAdding] = useState(false);
	const [images, setImages] = useState([]);
	const [imgIndex, setImgIndex] = useState(0);

	// Resolve current user id without exposing it in the URL
	const userId = useMemo(() => {
		let stored = null;
		try { stored = localStorage.getItem("user_id"); } catch (_) {}
		let decodedUid = null;
		try {
			const tok = token || localStorage.getItem("token");
			if (tok) {
				const parts = tok.split(".");
				if (parts.length >= 2) {
					const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
					const raw = payload?.user_id ?? payload?.userId ?? payload?.id ?? payload?.uid ?? null;
					decodedUid = raw != null ? String(raw) : null;
				}
			}
		} catch (_) {}
		const val = stored ?? decodedUid ?? null;
		const num = val != null ? Number(val) : null;
		return Number.isFinite(num) && num > 0 ? num : null;
	}, [token]);

	useEffect(() => {
		let ignore = false;
		async function load() {
			try {
				console.log("ProductPage: start loading for id:", id);
				setLoading(true);
					const [data, imgs] = await Promise.all([
					getProductById(id),
					getProductImages(id).catch(() => []),
				]);
				console.log("ProductPage: fetched product:", data);
				console.log("ProductPage: fetched images:", imgs);
				if (!ignore) {
				setProduct(data);
				const normalized = Array.isArray(imgs) ? imgs.map(productImageUrl) : [];
				setImages(normalized);
					setImgIndex(0);
				}
			} catch (e) {
				console.error("ProductPage: load error:", e);
				if (!ignore) setError("Không thể tải sản phẩm");
			} finally {
				console.log("ProductPage: load complete for id:", id);
				if (!ignore) setLoading(false);
			}
		}
		if (id) load();
		return () => {
			ignore = true;
		};
	}, [id]);

	const showPrev = () => {
		setImgIndex((prev) => {
			if (!images.length) return 0;
			const next = (prev - 1 + images.length) % images.length;
			console.log("Carousel: prev ->", next, images[next]);
			return next;
		});
	};

	const showNext = () => {
		setImgIndex((prev) => {
			if (!images.length) return 0;
			const next = (prev + 1) % images.length;
			console.log("Carousel: next ->", next, images[next]);
			return next;
		});
	};

	const priceText = useMemo(() => {
		if (!product) return "";
		const price = product.price ?? 0;
		return price.toLocaleString("vi-VN") + " ₫";
	}, [product]);

	const handleAddToCart = async () => {
		if (!isAuthenticated) {
			toast.warning("Vui lòng đăng nhập để thêm vào giỏ hàng");
			navigate("/users/auth", { replace: true });
			return;
		}
		if (!userId) {
			toast.warning("Không xác định được tài khoản. Vui lòng đăng xuất và đăng nhập lại.");
			return;
		}
		try {
			setAdding(true);
			const numQty = Math.max(1, parseInt(qty, 10) || 1);
			await addToCart(userId, product.id, numQty);
			toast.success("Đã thêm sản phẩm vào giỏ hàng");
		} catch (e) {
			console.error("Add to cart error:", e);
			const msg = e?.message || "Không thể thêm vào giỏ hàng";
			toast.error(msg);
		} finally {
			setAdding(false);
		}
	};

		return (
			<MainLayout>
				<div className="container mx-auto px-4 py-10">
					{loading ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<Skeleton className="w-full h-[420px] rounded-xl" />
							<div className="space-y-4">
								<Skeleton className="h-8 w-2/3" />
								<Skeleton className="h-6 w-1/3" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-5/6" />
								<Skeleton className="h-10 w-40" />
							</div>
						</div>
					) : error ? (
						<Card className="bg-white">
							<CardContent className="p-6 text-red-600">{error}</CardContent>
						</Card>
					) : product ? (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								<Card className="bg-white">
									<CardContent className="p-6">
										<div className="relative w-full h-[420px] bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
											{images && images.length > 0 ? (
												<img
													src={images[imgIndex]}
													alt={product.name}
													className="max-h-full max-w-full object-contain"
													onError={(e) => {
														console.warn("Image load failed:", images[imgIndex]);
														e.currentTarget.onerror = null;
														e.currentTarget.src = "/placeholder-image.png";
													}}
												/>
											) : product?.thumbnail ? (
												<img
													src={productImageUrl(product.thumbnail)}
													alt={product.name}
													className="max-h-full max-w-full object-contain"
													onError={(e) => {
														console.warn("Thumbnail image load failed:", product?.thumbnail);
														e.currentTarget.onerror = null;
														e.currentTarget.src = "/placeholder-image.png";
													}}
												/>
											) : (
												<div className="text-gray-400">Không có ảnh</div>
											)}

											{images.length > 1 && (
												<>
													<Button
														variant="secondary"
														size="icon"
														className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full shadow"
														onClick={showPrev}
														aria-label="Ảnh trước"
													>
														<ChevronLeft className="h-5 w-5" />
													</Button>
													<Button
														variant="secondary"
														size="icon"
														className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full shadow"
														onClick={showNext}
														aria-label="Ảnh sau"
													>
														<ChevronRight className="h-5 w-5" />
													</Button>
												</>
											)}
										</div>
									</CardContent>
								</Card>

								<Card className="bg-white">
									<CardContent className="p-6 space-y-4">
										<h1 className="text-2xl font-bold">{product.name}</h1>
										<div className="text-xl font-semibold text-green-600">{priceText}</div>
										<div className="text-sm text-gray-600">
											Tình trạng: {product.stockQuantity > 0 ? "Còn hàng" : "Hết hàng"}
										</div>

										{product.description && (
											<p className="text-gray-700 leading-relaxed whitespace-pre-line">
												{product.description}
											</p>
										)}

										<div className="flex items-center gap-3 pt-2">
											<Input
												type="number"
												min={1}
												value={qty}
												onChange={(e) => setQty(e.target.value)}
												className="w-24"
											/>
											<Button onClick={handleAddToCart} disabled={product.stockQuantity <= 0 || adding}>
												{adding ? "Đang thêm..." : "Thêm vào giỏ hàng"}
											</Button>
										</div>

										<div className="text-sm text-gray-500 pt-2">
											Danh mục: {product.categoryName || "—"} • Nhãn hàng: {product.brandName || "—"}
										</div>
									</CardContent>
								</Card>
							</div>

							<Card className="mt-10 bg-white">
								<CardContent className="p-6">
									<h2 className="text-xl font-semibold mb-4">Bình luận</h2>
									<CommentsSection productId={product.id} />
								</CardContent>
							</Card>
						</>
					) : null}
				</div>
			</MainLayout>
		);
};

const CommentsSection = ({ productId }) => {
	const { isAuthenticated, isAdmin } = useAuth();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [items, setItems] = useState([]);
	const [page, setPage] = useState(1);
	const [size, setSize] = useState(10);
	const [sort, setSort] = useState("desc");
	const [totalPages, setTotalPages] = useState(1);
	const [totalElements, setTotalElements] = useState(0);
	const [text, setText] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [editText, setEditText] = useState("");
	const [editSubmitting, setEditSubmitting] = useState(false);
	const [deletingId, setDeletingId] = useState(null);
	const [replyCounts, setReplyCounts] = useState({}); // { [commentId]: number }
	const [expanded, setExpanded] = useState({}); // { [commentId]: boolean }
	const [replies, setReplies] = useState({}); // { [commentId]: array }
	const [repliesLoading, setRepliesLoading] = useState({}); // { [commentId]: boolean }
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [confirmTarget, setConfirmTarget] = useState(null); // the comment/reply object
	const [replyOpen, setReplyOpen] = useState({}); // { [rootId]: boolean }
	const [replyText, setReplyText] = useState({}); // { [rootId]: string }
	const [replySubmitting, setReplySubmitting] = useState({}); // { [rootId]: boolean }

	// resolve current user id from localStorage (AuthContext persists it after login)
	const currentUserId = useMemo(() => {
		try {
			const v = localStorage.getItem("user_id");
			const n = v != null ? Number(v) : null;
			return Number.isFinite(n) && n > 0 ? n : null;
		} catch (_) {
			return null;
		}
	}, []);

	useEffect(() => {
		let ignore = false;
		async function load() {
			try {
				setLoading(true);
				setError(null);
				const res = await getProductComments(productId, { page, size, sort });
				if (ignore) return;
				const content = Array.isArray(res?.content) ? res.content : [];
				setItems(content);
				setTotalPages(res?.totalPages != null ? Number(res.totalPages) : 1);
				setTotalElements(res?.totalElements != null ? Number(res.totalElements) : content.length);
				// fetch reply counts for current page comments (best effort)
				try {
					const ids = content.map((c) => c.id).filter(Boolean);
					if (ids.length) {
						Promise.all(ids.map(async (cid) => {
							try {
								const r = await getReplies(cid, { page: 1, size: 1, sort: "asc" });
								const n = r?.totalElements != null ? Number(r.totalElements) : 0;
								return { cid, n: Number.isFinite(n) ? n : 0 };
							} catch (_) {
								return { cid, n: 0 };
							}
						})).then((arr) => {
							setReplyCounts((prev) => {
								const next = { ...prev };
								for (const { cid, n } of arr) next[cid] = n;
								return next;
							});
						}).catch(() => {});
					}
				} catch (_) {}
			} catch (e) {
				if (!ignore) setError(e?.message || "Không thể tải bình luận");
			} finally {
				if (!ignore) setLoading(false);
			}
		}
		if (productId) load();
		return () => { ignore = true; };
	}, [productId, page, size, sort]);

	const goPrev = (e) => { e?.preventDefault?.(); setPage((p) => Math.max(1, p - 1)); };
	const goNext = (e) => { e?.preventDefault?.(); setPage((p) => Math.min(totalPages || 1, p + 1)); };

		const handleSubmit = async (e) => {
			e?.preventDefault?.();
			if (!isAuthenticated) {
				toast.warning("Vui lòng đăng nhập để bình luận");
				return;
			}
			const content = text.trim();
			if (!content) return;
			try {
				setSubmitting(true);
				const created = await createComment({ productId, content });
				toast.success("Đã gửi bình luận");
				setText("");
				// Nếu đang ở trang 1 và sort desc, chèn lên đầu để phản hồi nhanh
				if (page === 1 && (sort || "desc").toLowerCase() === "desc") {
					setItems((prev) => [created, ...prev]);
					setTotalElements((n) => (Number.isFinite(n) ? n + 1 : 1));
				} else {
					// về trang 1 để thấy bình luận mới
					setPage(1);
				}
			} catch (err) {
				console.error("create comment error:", err);
				toast.error(err?.message || "Không thể gửi bình luận");
			} finally {
				setSubmitting(false);
			}
		};

	const canModify = (c) => {
		if (!isAuthenticated) return false;
		if (isAdmin) return true;
		if (currentUserId && c?.userId) return Number(c.userId) === Number(currentUserId);
		return false;
	};

	const onEdit = (c) => {
		setEditingId(c.id);
		setEditText(c.content || "");
	};

	const onCancelEdit = () => {
		setEditingId(null);
		setEditText("");
	};

	const onSaveEdit = async (c) => {
		const newContent = (editText || "").trim();
		if (!newContent) return;
		try {
			setEditSubmitting(true);
			const updated = await updateComment(c.id, { content: newContent });
			// optimistic in-place update
			setItems((prev) => prev.map((it) => it.id === c.id ? { ...it, content: updated?.content ?? newContent, edited: true } : it));
			toast.success("Đã cập nhật bình luận");
			onCancelEdit();
		} catch (err) {
			console.error("update comment error:", err);
			toast.error(err?.message || "Không thể cập nhật bình luận");
		} finally {
			setEditSubmitting(false);
		}
	};

	const onDelete = (c) => {
		setConfirmTarget(c);
		setConfirmOpen(true);
	};

	const doDelete = async () => {
		const c = confirmTarget;
		if (!c) return;
		try {
			setDeletingId(c.id);
			await deleteComment(c.id);
			// remove from comments list if it's a top-level comment
			setItems((prev) => prev.filter((it) => it.id !== c.id));
			// also remove from any replies collections
			setReplies((prev) => {
				const next = { ...prev };
				for (const key of Object.keys(next)) {
					next[key] = (next[key] || []).filter((it) => it.id !== c.id);
				}
				return next;
			});
			// adjust counters
			setTotalElements((n) => Math.max(0, (Number.isFinite(n) ? n - 1 : 0)));
			// if deleting a reply, decrement its parent's count
			if (c.rootCommentId) {
				setReplyCounts((prev) => ({ ...prev, [c.rootCommentId]: Math.max(0, (prev[c.rootCommentId] || 1) - 1) }));
			}
			toast.success("Đã xóa bình luận");
		} catch (err) {
			console.error("delete comment error:", err);
			toast.error(err?.message || "Không thể xóa bình luận");
		} finally {
			setDeletingId(null);
			setConfirmOpen(false);
			setConfirmTarget(null);
		}
	};

	const toggleReplies = async (commentId) => {
		const isOpen = !!expanded[commentId];
		if (isOpen) {
			setExpanded((p) => ({ ...p, [commentId]: false }));
			return;
		}
		setExpanded((p) => ({ ...p, [commentId]: true }));
		if (!replies[commentId]) {
			try {
				setRepliesLoading((p) => ({ ...p, [commentId]: true }));
				const r = await getReplies(commentId, { page: 1, size: 50, sort: "asc" });
				const content = Array.isArray(r?.content) ? r.content : [];
				setReplies((prev) => ({ ...prev, [commentId]: content }));
				const n = r?.totalElements != null ? Number(r.totalElements) : content.length;
				setReplyCounts((prev) => ({ ...prev, [commentId]: Number.isFinite(n) ? n : content.length }));
			} catch (err) {
				console.error("load replies error:", err);
				toast.error(err?.message || "Không thể tải trả lời");
			} finally {
				setRepliesLoading((p) => ({ ...p, [commentId]: false }));
			}
		}
	};

	const toggleReplyForm = (target) => {
		const rootId = target?.rootCommentId || target?.id;
		if (!rootId) return;
		// ensure replies panel is open to show the new reply after submit
		setExpanded((p) => ({ ...p, [rootId]: true }));
		setReplyOpen((prev) => ({ ...prev, [rootId]: !prev[rootId] }));
	};

	const onChangeReplyText = (rootId, val) => {
		setReplyText((prev) => ({ ...prev, [rootId]: val }));
	};

	const submitReply = async (rootId) => {
		if (!isAuthenticated) {
			toast.warning("Vui lòng đăng nhập để trả lời");
			return;
		}
		const content = (replyText[rootId] || "").trim();
		if (!content) return;
		try {
			setReplySubmitting((p) => ({ ...p, [rootId]: true }));
			const created = await createComment({ productId, content, rootCommentId: rootId });
			setReplies((prev) => {
				const list = Array.isArray(prev[rootId]) ? [...prev[rootId]] : [];
				list.push(created);
				return { ...prev, [rootId]: list };
			});
			setReplyCounts((prev) => ({ ...prev, [rootId]: (prev[rootId] || 0) + 1 }));
			setExpanded((p) => ({ ...p, [rootId]: true }));
			setReplyText((p) => ({ ...p, [rootId]: "" }));
			setReplyOpen((p) => ({ ...p, [rootId]: false }));
			toast.success("Đã gửi trả lời");
		} catch (err) {
			console.error("create reply error:", err);
			toast.error(err?.message || "Không thể gửi trả lời");
		} finally {
			setReplySubmitting((p) => ({ ...p, [rootId]: false }));
		}
	};

	return (
		<div>
					{/* Form viết bình luận */}
					<div className="mb-6">
						{isAuthenticated ? (
							<form onSubmit={handleSubmit} className="space-y-3">
								<textarea
									className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-gray-900 min-h-[96px]"
									placeholder="Viết bình luận..."
									value={text}
									onChange={(e) => setText(e.target.value)}
									maxLength={5000}
								/>
								<div className="flex justify-end">
									<Button type="submit" disabled={submitting || !text.trim()}>
										{submitting ? "Đang gửi..." : "Gửi bình luận"}
									</Button>
								</div>
							</form>
						) : (
							<Alert>
								<AlertTitle>Đăng nhập để bình luận</AlertTitle>
								<AlertDescription>Vui lòng đăng nhập để tham gia thảo luận về sản phẩm.</AlertDescription>
							</Alert>
						)}
					</div>

					{loading ? (
				<div className="space-y-3">
					<Skeleton className="h-6 w-40" />
					<Skeleton className="h-20 w-full" />
					<Skeleton className="h-20 w-full" />
				</div>
			) : error ? (
				<Alert variant="destructive">
					<AlertTitle>Lỗi</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			) : (
				<>
					<div className="text-sm text-gray-600 mb-3">
						Có {totalElements} bình luận
					</div>

					{items.length === 0 ? (
						<div className="text-gray-500">Chưa có bình luận nào.</div>
					) : (
						<div className="space-y-4">
							{items.map((c) => (
								<div key={c.id} className="border border-gray-200 rounded-lg p-4">
									<div className="flex items-center justify-between mb-1">
										<div className="font-medium">
											{c.userName && String(c.userName).trim().length > 0
												? c.userName
												: c.userId
												? `Người dùng #${c.userId}`
												: "Ẩn danh"}
											{c.edited ? <span className="ml-2 text-xs text-gray-400">(đã chỉnh sửa)</span> : null}
										</div>
										<div className="flex items-center gap-2 text-xs text-gray-400">
											<span>{c.createdAt ? new Date(c.createdAt).toLocaleString("vi-VN") : ""}</span>
											{canModify(c) && (
												<>
													{editingId === c.id ? (
														<>
															<Button size="sm" variant="default" disabled={editSubmitting || !(editText || "").trim()} onClick={() => onSaveEdit(c)}>
																{editSubmitting ? "Đang lưu..." : "Lưu"}
															</Button>
															<Button size="sm" variant="secondary" onClick={onCancelEdit}>Hủy</Button>
														</>
													) : (
														<>
															<Button size="sm" variant="outline" onClick={() => onEdit(c)}>Sửa</Button>
															<Button size="sm" variant="destructive" onClick={() => onDelete(c)} disabled={deletingId === c.id}>
																{deletingId === c.id ? "Đang xóa..." : "Xóa"}
															</Button>
														</>
													)}
												</>
											)}
										</div>
									</div>
									{editingId === c.id ? (
										<textarea
											className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-gray-900 min-h-[96px]"
											value={editText}
											onChange={(e) => setEditText(e.target.value)}
											maxLength={5000}
										/>
									) : (
										<div className="text-gray-700 whitespace-pre-line">{c.content}</div>
									)}

									{/* Reply button and form (top-level comments) */}
									<div className="mt-2">
										<button
											type="button"
											className="text-sm text-blue-600 hover:underline"
											onClick={() => toggleReplyForm(c)}
										>
											Trả lời
										</button>
										{replyOpen[c.id] && (
											<div className="mt-2">
												<textarea
													className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-gray-900 min-h-[72px]"
													placeholder="Viết trả lời..."
													value={replyText[c.id] || ""}
													onChange={(e) => onChangeReplyText(c.id, e.target.value)}
													maxLength={5000}
												/>
												<div className="flex gap-2 justify-end mt-2">
													<Button
														variant="secondary"
														onClick={() => setReplyOpen((p) => ({ ...p, [c.id]: false }))}
													>
														Hủy
													</Button>
													<Button
														onClick={() => submitReply(c.id)}
														disabled={replySubmitting[c.id] || !(replyText[c.id] || "").trim()}
													>
														{replySubmitting[c.id] ? "Đang gửi..." : "Gửi trả lời"}
													</Button>
												</div>
											</div>
										)}
									</div>

									{/* Replies toggle */}
									<div className="mt-2">
										{replyCounts[c.id] > 0 && !expanded[c.id] && (
											<button
												className="text-sm text-blue-600 hover:underline"
												onClick={() => toggleReplies(c.id)}
											>
												{`Hiển thị ${replyCounts[c.id]} trả lời`}
											</button>
										)}
										{expanded[c.id] && (
											<div className="mt-2">
												<div className="mb-1">
													<button
														className="text-sm text-blue-600 hover:underline"
														onClick={() => toggleReplies(c.id)}
													>
														{`Ẩn trả lời${replyCounts[c.id] != null ? ` (${replyCounts[c.id]})` : ""}`}
													</button>
												</div>
												{repliesLoading[c.id] ? (
													<div className="space-y-2">
														<Skeleton className="h-4 w-1/3" />
														<Skeleton className="h-14 w-full" />
													</div>
												) : (Array.isArray(replies[c.id]) && replies[c.id].length > 0 ? (
													<div className="space-y-3 pl-4 border-l border-gray-200">
														{replies[c.id].map((r) => (
															<div key={r.id} className="rounded-md p-3 bg-gray-50">
																<div className="flex items-center justify-between mb-1">
																	<div className="text-sm font-medium">
																		{r.userName && String(r.userName).trim().length > 0
																			? r.userName
																			: r.userId
																			? `Người dùng #${r.userId}`
																			: "Ẩn danh"}
																		{r.edited ? <span className="ml-2 text-xs text-gray-400">(đã chỉnh sửa)</span> : null}
																	</div>
																	<div className="flex items-center gap-2 text-xs text-gray-400">
																		<span>{r.createdAt ? new Date(r.createdAt).toLocaleString("vi-VN") : ""}</span>
																		{canModify(r) && (
																			<>
																				{editingId === r.id ? (
																					<>
																						<Button size="sm" variant="default" disabled={editSubmitting || !(editText || "").trim()} onClick={() => onSaveEdit(r)}>
																							{editSubmitting ? "Đang lưu..." : "Lưu"}
																						</Button>
																						<Button size="sm" variant="secondary" onClick={onCancelEdit}>Hủy</Button>
																					</>
																				) : (
																					<>
																						<Button size="sm" variant="outline" onClick={() => onEdit(r)}>Sửa</Button>
																						<Button size="sm" variant="destructive" onClick={() => onDelete(r)} disabled={deletingId === r.id}>
																							{deletingId === r.id ? "Đang xóa..." : "Xóa"}
																						</Button>
																					</>
																				)}
																			</>
																		)}
																	</div>
																</div>
																{editingId === r.id ? (
																	<textarea
																		className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-gray-900 min-h-[72px]"
																		value={editText}
																		onChange={(e) => setEditText(e.target.value)}
																		maxLength={5000}
																	/>
																) : (
																	<div className="text-sm text-gray-700 whitespace-pre-line">{r.content}</div>
																)}
															</div>
														))}
													</div>
												) : (
													<div className="text-sm text-gray-500 pl-4">Chưa có trả lời.</div>
												))}
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					)}

					{totalPages > 1 && (
						<Pagination className="mt-6">
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious href="#" onClick={goPrev} />
								</PaginationItem>
								{/* simple 1-page indicator */}
								<PaginationItem>
									<PaginationLink href="#" isActive>
										{page}/{totalPages}
									</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationNext href="#" onClick={goNext} />
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					)}
				</>
			)}
		{/* Confirm delete dialog */}
		<ConfirmDeleteDialog
			open={confirmOpen}
			onOpenChange={setConfirmOpen}
			onConfirm={doDelete}
			loading={deletingId === (confirmTarget?.id)}
			title="Xác nhận xóa bình luận"
			description="Bạn có chắc chắn muốn xóa bình luận này? Hành động không thể hoàn tác."
		/>
	</div>
	);
};

const ConfirmDeleteDialog = ({ open, onOpenChange, onConfirm, loading, title = "Xác nhận xóa", description = "Hành động này không thể hoàn tác." }) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="secondary" onClick={() => onOpenChange?.(false)} disabled={loading}>Hủy</Button>
					<Button variant="destructive" onClick={onConfirm} disabled={loading}>
						{loading ? "Đang xóa..." : "Xóa"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ProductPage;

