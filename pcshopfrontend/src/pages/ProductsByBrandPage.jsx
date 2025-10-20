import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import { useParams } from "react-router";
import { getAllBrands } from "@/services/brandService";
import { getProductsByBrand } from "@/services/productService";
import { brandImageUrl } from "@/config/env";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import CustomPagination from "@/components/ProductsPages/CustomPagination";
import ProductIsFeatured from "@/components/common/ProductIsFeatured";

const ProductsByBrand = () => {
  const { brandName } = useParams();

  const [brandId, setBrandId] = useState(null);
  const [brandLabel, setBrandLabel] = useState("");
  const [brandLogo, setBrandLogo] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [loadingBrand, setLoadingBrand] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [sort, setSort] = useState("");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const slugify = (s = "") =>
    s
      .toString()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        setLoadingBrand(true);
        setNotFound(false);
        const brands = await getAllBrands();
        const list = Array.isArray(brands) ? brands : brands?.brands || [];
        const match = list.find((b) => slugify(b.name) === (brandName || "").toLowerCase());
        if (!active) return;
        if (match) {
          setBrandId(match.id);
          setBrandLabel(match.name);
          setBrandLogo(match.logoUrl || "");
          setBrandDescription(match.description || "");
        } else {
          setBrandId(null);
          setBrandLabel("");
          setBrandLogo("");
          setBrandDescription("");
          setNotFound(true);
        }
        setPage(1);
      } catch (e) {
        console.error("Lỗi tải brand:", e);
        if (active) setNotFound(true);
      } finally {
        if (active) setLoadingBrand(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [brandName]);

  useEffect(() => {
    let active = true;
    const fetchProducts = async () => {
      if (!brandId) {
        setItems([]);
        setTotalPages(1);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const resp = await getProductsByBrand(brandId, page, pageSize, sort || undefined);
        if (!active) return;
        setItems(resp?.products || []);
        setTotalPages(resp?.totalPages || 1);
      } catch (e) {
        console.error("Lỗi tải sản phẩm theo brand:", e);
        if (active) {
          setItems([]);
          setTotalPages(1);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      active = false;
    };
  }, [brandId, page, sort]);

  const title = useMemo(() => brandLabel || "Thương hiệu", [brandLabel]);

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-12 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-2xl mb-10">
        {loadingBrand ? (
          <Skeleton className="h-20 w-40 mb-4" />
        ) : brandLogo ? (
          <img src={brandImageUrl(brandLogo)} alt={title} className="h-20 mb-4 object-contain" />
        ) : null}
        <h1 className="text-3xl font-bold">{loadingBrand ? "Đang tải..." : notFound ? "Không tìm thấy thương hiệu" : title}</h1>
        {!loadingBrand && !notFound && (
          <p className="text-sm mt-2 max-w-xl text-center opacity-80">
            {brandDescription || `Sản phẩm chính hãng từ thương hiệu ${title}`}
          </p>
        )}
      </div>

      {/* Sort bar */}
      {!loadingBrand && !notFound && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="text-xl font-semibold">Sản phẩm của {title}</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sắp xếp:</span>
            <Button variant={sort === "" ? "default" : "outline"} size="sm" onClick={() => { setSort(""); setPage(1); }}>Mới nhất</Button>
            <Button variant={sort === "asc" ? "default" : "outline"} size="sm" onClick={() => { setSort("asc"); setPage(1); }}>Giá tăng</Button>
            <Button variant={sort === "desc" ? "default" : "outline"} size="sm" onClick={() => { setSort("desc"); setPage(1); }}>Giá giảm</Button>
            <Button variant={sort === "alphabet" ? "default" : "outline"} size="sm" onClick={() => { setSort("alphabet"); setPage(1); }}>A-Z</Button>
          </div>
        </div>
      )}

      {/* Content */}
      {loadingBrand ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-40 md:h-48 w-full rounded-lg" />
          ))}
        </div>
      ) : notFound ? (
        <div className="text-center text-gray-600">Thương hiệu không tồn tại.</div>
      ) : loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-40 md:h-48 w-full rounded-lg" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-600">Không có sản phẩm của thương hiệu này.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {items.map((p) => (
            <ProductIsFeatured key={p.id} product={p} heightClass="h-40 md:h-48" />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loadingBrand && !notFound && (
        <div className="flex justify-center mb-10">
          <CustomPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </MainLayout>
  );
};

export default ProductsByBrand;
