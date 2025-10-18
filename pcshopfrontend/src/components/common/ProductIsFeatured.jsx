import React from "react";
import { Link } from "react-router";
import { productImageUrl } from "@/config/env";

const formatPrice = (v) => (v ?? 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 });

/**
 * ProductIsFeatured
 * - Thumbnail phủ toàn thẻ (object-cover)
 * - Dải mờ ở cạnh dưới hiển thị tên và giá
 * - Nếu có discount: hiển thị giá gốc gạch và giá sau giảm
 */
const ProductIsFeatured = ({ product, className = "", heightClass = "h-56 md:h-64" }) => {
  if (!product) return null;

  const {
    id,
    name = "",
    price = 0,
    discount = 0,
    thumbnail,
  } = product;

  const finalPrice = Math.max(0, price * (1 - (discount ?? 0) / 100));

  return (
    <Link
      to={`/products/${id}`}
      className={[
        "relative block rounded-lg overflow-hidden bg-black",
        "group shadow-md hover:shadow-lg transition-shadow",
        className,
      ].join(" ")}
      aria-label={name}
    >
      {/* Ảnh phủ toàn thẻ */}
      <div className="absolute inset-0">
        {thumbnail ? (
          <img
            src={productImageUrl(thumbnail)}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/placeholder-image.png";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-900">
            Không có ảnh
          </div>
        )}
      </div>

      {/* Dải mờ dưới cùng */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="px-3 py-2">
          <div
            className="
              relative rounded-md px-3 py-2 text-white
              bg-gradient-to-t from-black/80 to-black/20
              backdrop-blur-[2px]
            "
          >
            <div className="text-sm font-semibold line-clamp-2 mb-1">
              {name}
            </div>
            <div className="flex items-baseline gap-2">
              {discount > 0 && (
                <span className="text-gray-300/80 line-through text-xs">
                  {formatPrice(price)}₫
                </span>
              )}
              <span className="text-white font-bold">
                {formatPrice(finalPrice)}₫
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tạo tỷ lệ khung thẻ với chiều cao tuỳ biến */}
      <div className={["invisible select-none", heightClass].join(" ")} aria-hidden="true" />
    </Link>
  );
};

export default ProductIsFeatured;
