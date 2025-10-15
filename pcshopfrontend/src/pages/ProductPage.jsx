import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import { useParams } from "react-router";
import { getProductById, getProductImages } from "@/services/productsService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { productImageUrl, resolveAssetUrl } from "@/config/env";

const ProductPage = () => {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [qty, setQty] = useState(1);
  const [images, setImages] = useState([]);
  const [imgIndex, setImgIndex] = useState(0);

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

	const handleAddToCart = () => {
		// TODO: integrate real cart API/service. Temporary: localStorage cart.
		try {
			const numQty = Math.max(1, parseInt(qty, 10) || 1);
			const key = "pcshop_cart";
			const current = JSON.parse(localStorage.getItem(key) || "[]");
			const idx = current.findIndex((i) => i.id === product.id);
			if (idx >= 0) current[idx].qty += numQty;
			else
				current.push({
					id: product.id,
					name: product.name,
					price: product.price,
					thumbnail: product.thumbnail,
					qty: numQty,
				});
			localStorage.setItem(key, JSON.stringify(current));
			alert("Đã thêm vào giỏ hàng");
		} catch (e) {
			console.error(e);
			alert("Không thể thêm vào giỏ hàng");
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
							{/* Product top section */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								{/* Left: image carousel */}
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

								{/* Right: info */}
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
											<Button onClick={handleAddToCart} disabled={product.stockQuantity <= 0}>
												Thêm vào giỏ hàng
											</Button>
										</div>

										<div className="text-sm text-gray-500 pt-2">
											Danh mục: {product.categoryName || "—"} • Nhãn hàng: {product.brandName || "—"}
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Comments */}
							<Card className="mt-10 bg-white">
								<CardContent className="p-6">
									<h2 className="text-xl font-semibold mb-4">Bình luận</h2>
									<CommentBox productId={product.id} />
								</CardContent>
							</Card>
						</>
					) : null}
				</div>
			</MainLayout>
		);
};

const CommentBox = ({ productId }) => {
	const [comments, setComments] = useState([]);
	const [text, setText] = useState("");
	const [name, setName] = useState("");

	const handleAdd = (e) => {
		e.preventDefault();
		if (!text.trim()) return;
		const item = {
			id: Date.now(),
			author: name?.trim() || "Khách",
			content: text.trim(),
			createdAt: new Date().toISOString(),
		};
		setComments((prev) => [item, ...prev]);
		setText("");
	};

	return (
		<div>
			<form onSubmit={handleAdd} className="space-y-3 mb-6">
				<div className="flex gap-3">
					<Input
						placeholder="Tên của bạn (không bắt buộc)"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<Button type="submit">Gửi</Button>
				</div>
				<Textarea
					placeholder="Viết bình luận..."
					value={text}
					onChange={(e) => setText(e.target.value)}
					rows={3}
				/>
			</form>

			<Separator className="my-4" />

			<div className="space-y-4">
				{comments.length === 0 ? (
					<div className="text-gray-500">Chưa có bình luận nào.</div>
				) : (
					comments.map((c) => (
						<div key={c.id} className="border border-gray-200 rounded-lg p-4">
							<div className="flex items-center justify-between mb-1">
								<div className="font-medium">{c.author}</div>
								<div className="text-xs text-gray-400">
									{new Date(c.createdAt).toLocaleString("vi-VN")}
								</div>
							</div>
							<div className="text-gray-700 whitespace-pre-line">{c.content}</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default ProductPage;

