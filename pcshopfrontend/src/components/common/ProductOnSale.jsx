import React from "react";
import { Link } from "react-router";
import { productImageUrl } from "@/config/env";

const formatPrice = (v) => (v ?? 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 });

const ProductOnSale = ({ product, className = "", imageHeightClass = "h-32" }) => {
	if (!product) return null;
	const { id, name, price = 0, discount = 0, thumbnail } = product;
	const finalPrice = Math.max(0, price * (1 - (discount ?? 0) / 100));

	return (
		<Link
			to={`/products/${id}`}
			className={`block bg-gray-900 rounded-lg shadow-md p-4 hover:bg-gray-800 transition-colors ${className}`}
		>
			<div className={["relative w-full mb-3 bg-gray-800 rounded flex items-center justify-center overflow-hidden", imageHeightClass].join(" ")}>
				{thumbnail ? (
					<img
						src={productImageUrl(thumbnail)}
						alt={name}
						className="h-full w-full object-contain"
						onError={(e) => {
							e.currentTarget.onerror = null;
							e.currentTarget.src = "/placeholder-image.png";
						}}
					/>
				) : (
					<div className="text-gray-500 text-sm">No image</div>
				)}
				{discount > 0 && (
					<div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
						-{discount}%
					</div>
				)}
			</div>
			<div className="text-sm font-semibold line-clamp-2 min-h-[2.5rem]">{name}</div>
			<div className="mt-2 flex items-baseline gap-2">
				{discount > 0 && (
					<span className="text-gray-400 line-through text-xs">{formatPrice(price)}₫</span>
				)}
				<span className="text-white font-bold">{formatPrice(finalPrice)}₫</span>
			</div>
		</Link>
	);
};

export default ProductOnSale;

