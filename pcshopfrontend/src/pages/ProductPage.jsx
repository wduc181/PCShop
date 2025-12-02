import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { getAuthSnapshot } from "@/services/auth";

const EMPTY_THREAD_STATE = Object.freeze({ items: [], total: 0, expanded: false, loading: false, loaded: false });

const createThreadEntry = (overrides = {}) => ({
	items: [],
	total: 0,
	expanded: false,
	loading: false,
	loaded: false,
	...overrides,
});

const normalizeComment = (raw = {}) => {
	const replyCount =
		raw.replyCount ??
		raw.repliesCount ??
		raw.totalReplies ??
		raw.childrenCount ??
		raw.reply_count ??
		raw.replies_count ??
		raw.total_replies ??
		raw.children_count;
	return {
		id: raw.id ?? raw.commentId ?? null,
		productId: raw.productId ?? raw.product_id ?? null,
		userId: raw.userId ?? raw.user_id ?? null,
		userName: raw.userName ?? raw.user_name ?? raw.fullName ?? null,
		rootCommentId: raw.rootCommentId ?? raw.root_comment_id ?? null,
		content: raw.content ?? "",
		edited: Boolean(raw.edited),
		active: raw.active ?? true,
		createdAt: raw.createdAt ?? raw.created_at ?? null,
		updatedAt: raw.updatedAt ?? raw.updated_at ?? null,
		replyCount: replyCount != null && Number.isFinite(Number(replyCount)) ? Number(replyCount) : 0,
	};
};

const normalizeComments = (list = []) => list.map((item) => normalizeComment(item));

const removeFromList = (list = [], id) => {
	const next = list.filter((item) => item.id !== id);
	return next.length === list.length ? list : next;
};

const replaceInList = (list = [], replacement) => {
	let changed = false;
	const next = list.map((item) => {
		if (item.id === replacement.id) {
			changed = true;
			return replacement;
		}
		return item;
	});
	return changed ? next : list;
};

const formatTimestamp = (value) => {
	if (!value) return "";
	try {
		return new Date(value).toLocaleString("vi-VN");
	} catch (_) {
		return "";
	}
};

const useStoredAuthSnapshot = (token) => {
	const [snapshot, setSnapshot] = useState(() => getAuthSnapshot());
	useEffect(() => {
		setSnapshot(getAuthSnapshot());
	}, [token]);
	return snapshot;
};

const normalizeImageEntries = (list) => {
	if (!Array.isArray(list)) return [];
	return list
		.map((item) => {
			if (!item) return "";
			if (typeof item === "string") return item;
			if (typeof item.imageUrl === "string") return item.imageUrl;
			if (typeof item.url === "string") return item.url;
			if (typeof item.path === "string") return item.path;
			return "";
		})
		.filter((path) => Boolean(path && path.trim()))
		.map((path) => productImageUrl(path.trim()));
};

const useProductDetails = (productId) => {
	const [product, setProduct] = useState(null);
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!productId) return;
		let ignore = false;
		const fetchData = async () => {
			try {
				setLoading(true);
				setError(null);
				const [data, imgs] = await Promise.all([
					getProductById(productId),
					getProductImages(productId).catch(() => []),
				]);
				if (ignore) return;
				setProduct(data);
				const normalized = normalizeImageEntries(imgs);
				setImages(normalized);
			} catch (err) {
				if (!ignore) setError(err?.message || "Không thể tải sản phẩm");
			} finally {
				if (!ignore) setLoading(false);
			}
		};
		fetchData();
		return () => {
			ignore = true;
		};
	}, [productId]);

	return { product, images, loading, error };
};

const ProductPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { isAuthenticated, token } = useAuth();
	const authSnapshot = useStoredAuthSnapshot(token);
	const userId = authSnapshot?.userId ?? null;
	const { product, images, loading, error } = useProductDetails(id);
	const [qty, setQty] = useState(1);
	const [adding, setAdding] = useState(false);
	const [imgIndex, setImgIndex] = useState(0);

	useEffect(() => {
		setImgIndex(0);
	}, [images]);

	const priceText = useMemo(() => {
		if (!product) return "";
		const price = product.price ?? 0;
		return price.toLocaleString("vi-VN") + " ₫";
	}, [product]);

	const handleAddToCart = useCallback(async () => {
		if (!product) return;
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
		} catch (err) {
			console.error("Add to cart error:", err);
			toast.error(err?.message || "Không thể thêm vào giỏ hàng");
		} finally {
			setAdding(false);
		}
	}, [isAuthenticated, navigate, product, qty, userId]);

	const showPrev = useCallback(() => {
		setImgIndex((prev) => {
			if (!images.length) return 0;
			return (prev - 1 + images.length) % images.length;
		});
	}, [images]);

	const showNext = useCallback(() => {
		setImgIndex((prev) => {
			if (!images.length) return 0;
			return (prev + 1) % images.length;
		});
	}, [images]);

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
						<ProductHero
							product={product}
							images={images}
							imgIndex={imgIndex}
							onPrevImage={showPrev}
							onNextImage={showNext}
							qty={qty}
							onQtyChange={setQty}
							onAddToCart={handleAddToCart}
							adding={adding}
							priceText={priceText}
						/>

						<Card className="mt-10 bg-white">
							<CardContent className="p-6">
								<h2 className="text-xl font-semibold mb-4">Bình luận</h2>
								<CommentsSection productId={product.id} authSnapshot={authSnapshot} />
							</CardContent>
						</Card>
					</>
				) : null}
			</div>
		</MainLayout>
	);
};

const ProductHero = ({
	product,
	images,
	imgIndex,
	onPrevImage,
	onNextImage,
	qty,
	onQtyChange,
	onAddToCart,
	adding,
	priceText,
}) => (
	<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
		<ProductGallery product={product} images={images} imgIndex={imgIndex} onPrev={onPrevImage} onNext={onNextImage} />
		<ProductInfoCard
			product={product}
			priceText={priceText}
			qty={qty}
			onQtyChange={onQtyChange}
			onAddToCart={onAddToCart}
			adding={adding}
		/>
	</div>
);

const ProductGallery = ({ product, images, imgIndex, onPrev, onNext }) => {
	const activeSrc = images?.length ? images[imgIndex] : product?.thumbnail ? productImageUrl(product.thumbnail) : null;
	return (
		<Card className="bg-white">
			<CardContent className="p-6">
				<div className="relative w-full h-[420px] bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
					{activeSrc ? (
						<img
							src={activeSrc}
							alt={product?.name}
							className="max-h-full max-w-full object-contain"
							onError={(e) => {
								console.warn("Image load failed:", activeSrc);
								e.currentTarget.onerror = null;
								e.currentTarget.src = "/placeholder-image.png";
							}}
						/>
					) : (
						<div className="text-gray-400">Không có ảnh</div>
					)}

					{images?.length > 1 && (
						<>
							<Button
								variant="secondary"
								size="icon"
								className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full shadow"
								onClick={onPrev}
								aria-label="Ảnh trước"
							>
								<ChevronLeft className="h-5 w-5" />
							</Button>
							<Button
								variant="secondary"
								size="icon"
								className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full shadow"
								onClick={onNext}
								aria-label="Ảnh sau"
							>
								<ChevronRight className="h-5 w-5" />
							</Button>
						</>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

const ProductInfoCard = ({ product, priceText, qty, onQtyChange, onAddToCart, adding }) => (
	<Card className="bg-white">
		<CardContent className="p-6 space-y-4">
			<h1 className="text-2xl font-bold">{product.name}</h1>
			<div className="text-xl font-semibold text-green-600">{priceText}</div>
			<div className="text-sm text-gray-600">
				Tình trạng: {product.stockQuantity > 0 ? "Còn hàng" : "Hết hàng"}
			</div>
			{product.description && (
				<p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
			)}
			<div className="flex items-center gap-3 pt-2">
				<Input
					type="number"
					min={1}
					value={qty}
					onChange={(e) => onQtyChange(e.target.value)}
					className="w-24"
				/>
				<Button onClick={onAddToCart} disabled={product.stockQuantity <= 0 || adding}>
					{adding ? "Đang thêm..." : "Thêm vào giỏ hàng"}
				</Button>
			</div>
			<div className="text-sm text-gray-500 pt-2">
				Danh mục: {product.categoryName || "—"} • Nhãn hàng: {product.brandName || "—"}
			</div>
		</CardContent>
	</Card>
);

const CommentsSection = ({ productId, authSnapshot }) => {
	const { isAuthenticated, isAdmin } = useAuth();
	const currentUserId = authSnapshot?.userId ?? null;
	const [page, setPage] = useState(1);
	const [size] = useState(10);
	const [sort] = useState("desc");
	const [rootComments, setRootComments] = useState([]);
	const [totalPages, setTotalPages] = useState(1);
	const [totalElements, setTotalElements] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [threadState, setThreadState] = useState({});
	const [composerText, setComposerText] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [confirmState, setConfirmState] = useState({ open: false, target: null, deleting: false });

	useEffect(() => {
		setRootComments([]);
		setThreadState({});
		setPage(1);
	}, [productId]);

	const ensureThreadEntries = useCallback((list) => {
		if (!list?.length) return;
		setThreadState((prev) => {
			let mutated = false;
			const next = { ...prev };
			list.forEach((comment) => {
				if (!comment?.id || next[comment.id]) return;
				next[comment.id] = createThreadEntry({ total: comment.replyCount || 0 });
				mutated = true;
			});
			return mutated ? next : prev;
		});
	}, []);

	const loadComments = useCallback(async () => {
		if (!productId) return;
		try {
			setLoading(true);
			setError(null);
			const res = await getProductComments(productId, { page, size, sort });
			const content = normalizeComments(Array.isArray(res?.content) ? res.content : []);
			setRootComments(content);
			setTotalPages(res?.totalPages != null ? Number(res.totalPages) : 1);
			setTotalElements(res?.totalElements != null ? Number(res.totalElements) : content.length);
			ensureThreadEntries(content);
		} catch (err) {
			setError(err?.message || "Không thể tải bình luận");
		} finally {
			setLoading(false);
		}
	}, [ensureThreadEntries, page, productId, size, sort]);

	useEffect(() => {
		loadComments();
	}, [loadComments]);

	const replaceCommentEverywhere = (updated) => {
		setRootComments((prev) => replaceInList(prev, updated));
		setThreadState((prev) => {
			let mutated = false;
			const next = {};
			for (const [key, entry] of Object.entries(prev)) {
				const items = entry?.items || [];
				const replaced = replaceInList(items, updated);
				next[key] = replaced === items ? entry : { ...entry, items: replaced };
				if (next[key] !== entry) mutated = true;
			}
			return mutated ? next : prev;
		});
	};

	const removeCommentEverywhere = (comment) => {
		setRootComments((prev) => removeFromList(prev, comment.id));
		setThreadState((prev) => {
			let mutated = false;
			const next = {};
			for (const [key, entry] of Object.entries(prev)) {
				const items = entry?.items || [];
				const filtered = removeFromList(items, comment.id);
				let updatedEntry = entry;
				if (filtered !== items) {
					mutated = true;
					updatedEntry = { ...entry, items: filtered };
					if (Number(key) === Number(comment.rootCommentId)) {
						const baseTotal = Number.isFinite(entry.total) ? entry.total : items.length;
						updatedEntry.total = Math.max(0, baseTotal - 1);
					}
				}
				next[key] = updatedEntry;
			}
			if (!comment.rootCommentId && next[comment.id]) {
				delete next[comment.id];
				mutated = true;
			}
			return mutated ? next : prev;
		});
		setTotalElements((prev) => Math.max(0, prev - 1));
	};

	const appendReply = (parentId, reply) => {
		setThreadState((prev) => {
			const entry = prev[parentId] || createThreadEntry();
			const exists = entry.items?.some((item) => item.id === reply.id);
			const items = exists ? entry.items : [...entry.items, reply];
			const baseTotal = Number.isFinite(entry.total) ? entry.total : entry.items.length;
			return {
				...prev,
				[parentId]: {
					...entry,
					items,
					total: exists ? baseTotal : baseTotal + 1,
					expanded: true,
					loading: false,
					loaded: true,
				},
				[reply.id]: prev[reply.id] || createThreadEntry(),
			};
		});
	};

	const canModify = useCallback((comment) => {
		if (!isAuthenticated) return false;
		if (isAdmin) return true;
		return currentUserId != null && Number(comment.userId) === Number(currentUserId);
	}, [currentUserId, isAdmin, isAuthenticated]);

	const handleSubmitComment = async (e) => {
		e?.preventDefault?.();
		if (!isAuthenticated) {
			toast.warning("Vui lòng đăng nhập để bình luận");
			return;
		}
		const content = composerText.trim();
		if (!content) return;
		try {
			setSubmitting(true);
			const created = normalizeComment(await createComment({ productId, content }));
			setComposerText("");
			setTotalElements((n) => n + 1);
			ensureThreadEntries([created]);
			if (page === 1 && (sort || "desc").toLowerCase() === "desc") {
				setRootComments((prev) => [created, ...prev]);
			} else {
				setPage(1);
			}
			toast.success("Đã gửi bình luận");
		} catch (err) {
			toast.error(err?.message || "Không thể gửi bình luận");
		} finally {
			setSubmitting(false);
		}
	};

	const handleUpdateComment = async (comment, newContent) => {
		const content = newContent.trim();
		if (!content) return;
		try {
			const updated = normalizeComment(await updateComment(comment.id, { content }));
			replaceCommentEverywhere(updated);
			toast.success("Đã cập nhật bình luận");
		} catch (err) {
			toast.error(err?.message || "Không thể cập nhật bình luận");
			throw err;
		}
	};

	const handleReplySubmit = async (parentComment, replyContent) => {
		if (!isAuthenticated) {
			toast.warning("Vui lòng đăng nhập để trả lời");
			throw new Error("Chưa đăng nhập");
		}
		const content = replyContent.trim();
		if (!content) return;
		try {
			const created = normalizeComment(
				await createComment({ productId, content, rootCommentId: parentComment.id })
			);
			appendReply(parentComment.id, created);
			setTotalElements((n) => n + 1);
			toast.success("Đã gửi trả lời");
			return created;
		} catch (err) {
			toast.error(err?.message || "Không thể gửi trả lời");
			throw err;
		}
	};

	const requestDelete = (comment) => {
		setConfirmState({ open: true, target: comment, deleting: false });
	};

	const handleDeleteConfirmed = async () => {
		const target = confirmState.target;
		if (!target) return;
		try {
			setConfirmState((prev) => ({ ...prev, deleting: true }));
			await deleteComment(target.id);
			removeCommentEverywhere(target);
			toast.success("Đã xóa bình luận");
			setConfirmState({ open: false, target: null, deleting: false });
		} catch (err) {
			toast.error(err?.message || "Không thể xóa bình luận");
			setConfirmState((prev) => ({ ...prev, deleting: false }));
		}
	};

	const toggleReplies = async (comment) => {
		const commentId = comment.id;
		const entry = threadState[commentId];
		if (entry?.expanded && !entry?.loading) {
			setThreadState((prev) => ({ ...prev, [commentId]: { ...entry, expanded: false } }));
			return;
		}
		if (entry?.loaded && !entry?.loading) {
			setThreadState((prev) => ({ ...prev, [commentId]: { ...entry, expanded: true } }));
			return;
		}
		setThreadState((prev) => ({
			...prev,
			[commentId]: {
				...(prev[commentId] || createThreadEntry({ total: comment.replyCount })),
				expanded: true,
				loading: true,
			},
		}));
		try {
			const res = await getReplies(commentId, { page: 1, size: 50, sort: "asc" });
			const children = normalizeComments(Array.isArray(res?.content) ? res.content : []);
			ensureThreadEntries(children);
			setThreadState((prev) => ({
				...prev,
				[commentId]: {
					...(prev[commentId] || createThreadEntry()),
					items: children,
					total: res?.totalElements != null ? Number(res.totalElements) : children.length,
					expanded: true,
					loading: false,
					loaded: true,
				},
			}));
		} catch (err) {
			toast.error(err?.message || "Không thể tải trả lời");
			setThreadState((prev) => ({
				...prev,
				[commentId]: {
					...(prev[commentId] || createThreadEntry()),
					expanded: true,
					loading: false,
					loaded: true,
				},
			}));
		}
	};

	const getThread = useCallback((id) => threadState[id] || EMPTY_THREAD_STATE, [threadState]);

	return (
		<div>
			<CommentComposer
				isAuthenticated={isAuthenticated}
				value={composerText}
				onChange={setComposerText}
				onSubmit={handleSubmitComment}
				submitting={submitting}
			/>

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
					<div className="text-sm text-gray-600 mb-3">Có {totalElements} bình luận</div>
					{rootComments.length === 0 ? (
						<div className="text-gray-500">Chưa có bình luận nào.</div>
					) : (
						<div className="space-y-4">
							{rootComments.map((comment) => (
								<CommentNode
									key={comment.id}
									comment={comment}
									depth={0}
									canModify={canModify}
									onRequestDelete={requestDelete}
									onSubmitReply={handleReplySubmit}
									onUpdate={handleUpdateComment}
									getThread={getThread}
									onToggleReplies={toggleReplies}
									isAuthenticated={isAuthenticated}
								/>
							))}
						</div>
					)}

					{totalPages > 1 && (
						<Pagination className="mt-6">
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										href="#"
										onClick={(e) => {
											e.preventDefault();
											setPage((p) => Math.max(1, p - 1));
										}}
									/>
								</PaginationItem>
								<PaginationItem>
									<PaginationLink href="#" isActive>
										{page}/{totalPages}
									</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationNext
										href="#"
										onClick={(e) => {
											e.preventDefault();
											setPage((p) => Math.min(totalPages, p + 1));
										}}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					)}
				</>
			)}

			<ConfirmDeleteDialog
				open={confirmState.open}
				onOpenChange={(open) => setConfirmState((prev) => ({ ...prev, open, target: open ? prev.target : null }))}
				onConfirm={handleDeleteConfirmed}
				loading={confirmState.deleting}
				title="Xác nhận xóa bình luận"
				description="Bạn có chắc chắn muốn xóa bình luận này? Hành động không thể hoàn tác."
			/>
		</div>
	);
};

const CommentComposer = ({ isAuthenticated, value, onChange, onSubmit, submitting }) => (
	<div className="mb-6">
		{isAuthenticated ? (
			<form onSubmit={onSubmit} className="space-y-3">
				<textarea
					className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-gray-900 min-h-[96px]"
					placeholder="Viết bình luận..."
					value={value}
					onChange={(e) => onChange(e.target.value)}
					maxLength={5000}
				/>
				<div className="flex justify-end">
					<Button type="submit" disabled={submitting || !value.trim()}>
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
);

const CommentNode = ({
	comment,
	depth,
	canModify,
	onRequestDelete,
	onSubmitReply,
	onUpdate,
	getThread,
	onToggleReplies,
	isAuthenticated,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState(comment.content || "");
	const [savingEdit, setSavingEdit] = useState(false);
	const [replyOpen, setReplyOpen] = useState(false);
	const [replyValue, setReplyValue] = useState("");
	const [replyLoading, setReplyLoading] = useState(false);
	const thread = getThread(comment.id);
	const normalizedReplyCount = (() => {
		const n = Number(comment.replyCount);
		return Number.isFinite(n) ? n : null;
	})();
	const threadTotal = Number.isFinite(thread.total) ? thread.total : null;
	const threadItemsCount = thread.items?.length;
	const resolvedCount = thread.loaded
		? threadTotal ?? threadItemsCount ?? normalizedReplyCount
		: normalizedReplyCount;
	const hasKnownReplies = (threadTotal ?? 0) > 0 || (threadItemsCount ?? 0) > 0 || (normalizedReplyCount ?? 0) > 0;
	const allowLoadReplies = depth === 0 && !thread.loaded;
	const showRepliesButton = hasKnownReplies || allowLoadReplies;

	useEffect(() => {
		if (!isEditing) setEditValue(comment.content || "");
	}, [comment.content, isEditing]);

	const handleSave = async () => {
		const content = (editValue || "").trim();
		if (!content) return;
		try {
			setSavingEdit(true);
			await onUpdate(comment, content);
			setIsEditing(false);
		} finally {
			setSavingEdit(false);
		}
	};

	const handleReply = async () => {
		const content = (replyValue || "").trim();
		if (!content) return;
		try {
			setReplyLoading(true);
			await onSubmitReply(comment, content);
			setReplyValue("");
			setReplyOpen(false);
		} finally {
			setReplyLoading(false);
		}
	};

	const formattedDate = formatTimestamp(comment.createdAt);

	return (
		<div className={`rounded-lg border border-gray-200 p-4 ${depth ? "bg-gray-50" : "bg-white"}`}>
			<div className="flex items-center justify-between mb-1">
				<div className="font-medium">
					{comment.userName?.trim()
						? comment.userName
						: comment.userId
						? `Người dùng #${comment.userId}`
						: "Ẩn danh"}
					{comment.edited ? <span className="ml-2 text-xs text-gray-400">(đã chỉnh sửa)</span> : null}
				</div>
				<div className="flex items-center gap-2 text-xs text-gray-400">
					<span>{formattedDate}</span>
					{canModify(comment) && (
						<>
							{isEditing ? (
								<>
									<Button
										size="sm"
										variant="default"
										disabled={savingEdit || !(editValue || "").trim()}
										onClick={handleSave}
									>
										{savingEdit ? "Đang lưu..." : "Lưu"}
									</Button>
									<Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>
										Hủy
									</Button>
								</>
							) : (
								<>
									<Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
										Sửa
									</Button>
									<Button size="sm" variant="destructive" onClick={() => onRequestDelete(comment)}>
										Xóa
									</Button>
								</>
							)}
						</>
					)}
				</div>
			</div>
			{isEditing ? (
				<textarea
					className="w-full mt-3 rounded-md border border-gray-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-gray-900 min-h-[96px]"
					value={editValue}
					onChange={(e) => setEditValue(e.target.value)}
					maxLength={5000}
				/>
			) : (
				<div className="text-gray-700 whitespace-pre-line mt-3">{comment.content}</div>
			)}

			<div className="mt-2 flex items-center gap-4 text-sm">
				<button
					type="button"
					className="text-blue-600 hover:underline"
					onClick={() => {
						if (!isAuthenticated) {
							toast.warning("Vui lòng đăng nhập để trả lời");
							return;
						}
						setReplyOpen((prev) => !prev);
					}}
				>
					Trả lời
				</button>
				{showRepliesButton && (
					<button type="button" className="text-blue-600 hover:underline" onClick={() => onToggleReplies(comment)}>
						{thread.expanded
							? `Ẩn trả lời${resolvedCount != null ? ` (${resolvedCount})` : ""}`
							: resolvedCount != null
							? `Hiển thị ${resolvedCount} trả lời`
							: "Hiển thị trả lời"}
					</button>
				)}
			</div>

			{replyOpen && (
				<div className="mt-3">
					<textarea
						className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-gray-900 min-h-[72px]"
						placeholder="Viết trả lời..."
						value={replyValue}
						onChange={(e) => setReplyValue(e.target.value)}
						maxLength={5000}
					/>
					<div className="flex gap-2 justify-end mt-2">
						<Button variant="secondary" onClick={() => setReplyOpen(false)}>
							Hủy
						</Button>
						<Button onClick={handleReply} disabled={replyLoading || !(replyValue || "").trim()}>
							{replyLoading ? "Đang gửi..." : "Gửi trả lời"}
						</Button>
					</div>
				</div>
			)}

			{thread.expanded && (
				<div className="mt-3 space-y-3 border-l border-gray-200 pl-4">
					{thread.loading ? (
						<div className="space-y-2">
							<Skeleton className="h-4 w-1/3" />
							<Skeleton className="h-14 w-full" />
						</div>
					) : thread.items?.length ? (
						thread.items.map((child) => (
							<CommentNode
								key={child.id}
								comment={child}
								depth={depth + 1}
								canModify={canModify}
								onRequestDelete={onRequestDelete}
								onSubmitReply={onSubmitReply}
								onUpdate={onUpdate}
								getThread={getThread}
								onToggleReplies={onToggleReplies}
								isAuthenticated={isAuthenticated}
							/>
						))
					) : (
						<div className="text-sm text-gray-500">Chưa có trả lời.</div>
					)}
				</div>
			)}
		</div>
	);
};

const ConfirmDeleteDialog = ({ open, onOpenChange, onConfirm, loading, title, description }) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
				<DialogDescription>{description}</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<Button variant="secondary" onClick={() => onOpenChange(false)} disabled={loading}>
					Hủy
				</Button>
				<Button variant="destructive" onClick={onConfirm} disabled={loading}>
					{loading ? "Đang xóa..." : "Xóa"}
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
);

export default ProductPage;

