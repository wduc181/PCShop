import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Percent } from "lucide-react";
import { getAllProducts } from "@/services/productService";
import { Skeleton } from "@/components/ui/skeleton";
import ProductOnSale from "@/components/common/ProductOnSale";

const OnSale = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollerRef = useRef(null);
  const timerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchOnSale = async () => {
      try {
        setLoading(true);
        const res = await getAllProducts(1, 20, "discount");
        const list = (res?.products || []).filter((p) => (p.discount ?? 0) > 0);
        if (active) {
          setItems(list);
        }
      } catch (e) {
        console.error("Lỗi tải sản phẩm khuyến mãi:", e);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchOnSale();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!items.length) return;
    if (isHovering) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const el = scrollerRef.current;
      if (!el) return;
      const step = el.clientWidth; // trượt theo bề rộng khung nhìn
      const maxLeft = el.scrollWidth - el.clientWidth;
      const nextLeft = el.scrollLeft + step + 2;
      if (nextLeft >= maxLeft) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 3000);
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [items.length, isHovering]);

  const n = items.length;
  const prev = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = el.clientWidth;
    const prevLeft = el.scrollLeft - step - 2;
    if (prevLeft <= 0) {
      const maxLeft = el.scrollWidth - el.clientWidth;
      el.scrollTo({ left: maxLeft, behavior: "smooth" });
    } else {
      el.scrollBy({ left: -step, behavior: "smooth" });
    }
  };
  const next = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = el.clientWidth;
    const maxLeft = el.scrollWidth - el.clientWidth;
    const nextLeft = el.scrollLeft + step + 2;
    if (nextLeft >= maxLeft) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: step, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-black text-white py-8 px-4 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Percent className="w-6 h-6 text-red-500" />
          KHUYẾN MÃI
        </h2>
        <div className="flex gap-2">
          <button
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full disabled:opacity-50"
            onClick={prev}
            disabled={n <= 1}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full disabled:opacity-50"
            onClick={next}
            disabled={n <= 1}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-gray-900 rounded-lg shadow-md p-4">
              <Skeleton className="h-28 w-full mb-4 rounded" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-400">Chưa có sản phẩm khuyến mãi.</div>
      ) : (
        <div
          ref={scrollerRef}
          className="overflow-x-auto scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none]"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="flex gap-4 pr-6 [&::-webkit-scrollbar]:hidden">
            {items.map((p) => (
              <div key={p.id} className="snap-start shrink-0 w-1/2 sm:w-1/3 lg:w-1/5">
                <ProductOnSale product={p} imageHeightClass="h-28" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OnSale;
