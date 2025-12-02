import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import { useParams } from "react-router";
import { getProductsByCategory } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import CustomPagination from "@/components/ProductsPages/CustomPagination";
import ProductIsFeatured from "@/components/common/ProductIsFeatured";

const slugify = (s = "") =>
  s
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const ProductsByCategory = () => {
  const { categoryName } = useParams();

  const [categoryId, setCategoryId] = useState(null);
  const [categoryLabel, setCategoryLabel] = useState("");
  const [categoryDesc, setCategoryDesc] = useState("");
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [sort, setSort] = useState("");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        setLoadingCategory(true);
        setNotFound(false);
        const cats = await getCategories();
        const list = Array.isArray(cats) ? cats : cats?.categories || [];
        const match = list.find((c) => slugify(c.name) === (categoryName || "").toLowerCase());
        if (!active) return;
        if (match) {
          setCategoryId(match.id);
          setCategoryLabel(match.name);
          const desc = match.description ?? match.desc ?? match.details ?? match.note ?? match.Description ?? "";
          setCategoryDesc(typeof desc === "string" ? desc : "");
        } else {
          setCategoryId(null);
          setCategoryLabel("");
          setCategoryDesc("");
          setNotFound(true);
        }
        setPage(1);
      } catch (e) {
        if (active) setNotFound(true);
        console.error("Lỗi tải danh mục:", e);
      } finally {
        if (active) setLoadingCategory(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [categoryName]);

  useEffect(() => {
    let active = true;
    const fetchProducts = async () => {
      if (!categoryId) {
        setItems([]);
        setTotalPages(1);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const resp = await getProductsByCategory(categoryId, page, pageSize, sort || undefined);
        if (!active) return;
        const list = Array.isArray(resp?.content)
          ? resp.content
          : Array.isArray(resp?.products)
            ? resp.products
            : Array.isArray(resp)
              ? resp
              : [];
        setItems(list);
        setTotalPages(resp?.totalPages || 1);
      } catch (e) {
        console.error("Lỗi tải sản phẩm theo danh mục:", e);
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
  }, [categoryId, page, sort]);

  const title = useMemo(() => categoryLabel || "Danh mục", [categoryLabel]);

  return (
    <MainLayout>
      {/* Header + Controls */}
      <div className="bg-black text-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              {loadingCategory ? "Đang tải danh mục..." : notFound ? "Không tìm thấy danh mục" : title}
            </h1>
            {!loadingCategory && !notFound && (
              <>
                {categoryDesc ? (
                  <p className="text-white/80 text-sm mt-1 line-clamp-2">{categoryDesc}</p>
                ) : (
                  <p className="text-white/70 text-sm mt-1">Lọc và sắp xếp sản phẩm theo nhu cầu của bạn</p>
                )}
              </>
            )}
          </div>

          {/* Sort Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-white/70 mr-1">Sắp xếp:</span>
            <Button
              variant={sort === "" ? "default" : "outline"}
              size="sm"
              className="!text-black"
              onClick={() => {
                setSort("");
                setPage(1);
              }}
            >
              Mới nhất
            </Button>
            <Button
              variant={sort === "price_asc" ? "default" : "outline"}
              size="sm"
              className="!text-black"
              onClick={() => {
                setSort("price_asc");
                setPage(1);
              }}
            >
              Giá tăng
            </Button>
            <Button
              variant={sort === "price_desc" ? "default" : "outline"}
              size="sm"
              className="!text-black"
              onClick={() => {
                setSort("price_desc");
                setPage(1);
              }}
            >
              Giá giảm
            </Button>
            <Button
              variant={sort === "alphabet" ? "default" : "outline"}
              size="sm"
              className="!text-black"
              onClick={() => {
                setSort("alphabet");
                setPage(1);
              }}
            >
              A-Z
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loadingCategory ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-40 md:h-48 w-full rounded-lg" />
          ))}
        </div>
      ) : notFound ? (
        <div className="text-center text-gray-600">Danh mục không tồn tại.</div>
      ) : loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-40 md:h-48 w-full rounded-lg" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-600">Không có sản phẩm trong danh mục này.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {items.map((p) => (
            <ProductIsFeatured key={p.id} product={p} heightClass="h-40 md:h-48" />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loadingCategory && !notFound && (
        <div className="flex justify-center mb-10">
          <CustomPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </MainLayout>
  );
};

export default ProductsByCategory;
