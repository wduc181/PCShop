import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { getAllProducts } from "@/services/productService";
import { Skeleton } from "@/components/ui/skeleton";
import ProductIsFeatured from "@/components/common/ProductIsFeatured";
import CardSlider from "@/components/common/CardSlider";
import { Link } from "react-router";

const Featured = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const res = await getAllProducts(1, 20, "featured");
        const list = (res?.products || []).filter(
          (p) => Boolean(p?.isFeatured ?? p?.featured ?? false)
        );
        if (active) setItems(list);
      } catch (e) {
        console.error("Lỗi tải sản phẩm nổi bật:", e);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchFeatured();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500" />
          SẢN PHẨM NỔI BẬT
        </h2>
        <Link
          to="/products?sort=featured"
          className="text-sm text-white/80 hover:text-white underline underline-offset-4"
        >
          Xem tất cả
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-lg overflow-hidden">
              <Skeleton className="h-40 md:h-48 w-full" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-500">Chưa có sản phẩm nổi bật.</div>
      ) : (
        <CardSlider
          items={items}
          interval={3000}
          autoPlay
          ariaLabel="Sản phẩm nổi bật"
          renderItem={(p) => (
            <ProductIsFeatured key={p.id} product={p} heightClass="h-40 md:h-48" />
          )}
        />
      )}
    </div>
  );
};

export default Featured;
