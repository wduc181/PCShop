import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import { useLocation, Link } from "react-router";
import { getAllProducts } from "@/services/productService";
import { Skeleton } from "@/components/ui/skeleton";
import ProductIsFeatured from "@/components/common/ProductIsFeatured";

const useQuery = () => new URLSearchParams(useLocation().search);

const ProductsPage = () => {
  const query = useQuery();
  const sort = query.get("sort") || undefined;
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        setLoading(true);
        const res = await getAllProducts(page, 20, sort);
        if (!active) return;
        setItems(res?.products || []);
        setTotalPages(res?.totalPages || 1);
      } catch (e) {
        console.error("Lỗi tải sản phẩm:", e);
      } finally {
        if (active) setLoading(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [page, sort]);

  const title = useMemo(() => {
    if (sort === "featured") return "Sản phẩm nổi bật";
    if (sort === "discount") return "Sản phẩm khuyến mãi";
    return "Tất cả sản phẩm";
  }, [sort]);

  return (
    <MainLayout>
      <div className="bg-black text-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex gap-2 text-sm">
            <Link
              to="/products?sort=featured"
              className={`px-3 py-1 rounded border ${sort === "featured" ? "bg-yellow-500 text-black border-yellow-500" : "border-white/30 hover:bg-white/10"}`}
            >
              Nổi bật
            </Link>
            <Link
              to="/products?sort=discount"
              className={`px-3 py-1 rounded border ${sort === "discount" ? "bg-red-500 text-white border-red-500" : "border-white/30 hover:bg-white/10"}`}
            >
              Khuyến mãi
            </Link>
            <Link
              to="/products"
              className={`px-3 py-1 rounded border ${!sort ? "bg-white text-black border-white" : "border-white/30 hover:bg-white/10"}`}
            >
              Tất cả
            </Link>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <Skeleton className="h-40 md:h-48 w-full" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center text-gray-400">Không có sản phẩm.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {items.map((p) => (
              <ProductIsFeatured key={p.id} product={p} heightClass="h-40 md:h-48" />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            className="px-3 py-1 rounded border border-white/30 disabled:opacity-50"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Trang trước
          </button>
          <span className="text-sm text-white/80">
            {page} / {Math.max(1, totalPages)}
          </span>
          <button
            className="px-3 py-1 rounded border border-white/30 disabled:opacity-50"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Trang sau
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductsPage;
