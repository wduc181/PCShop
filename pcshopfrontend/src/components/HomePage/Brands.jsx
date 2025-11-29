import React, { useEffect, useState } from "react";
import { getAllBrands } from "@/services/brandService";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { brandImageUrl } from "@/config/env";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getAllBrands();
        const filtered = Array.isArray(data)
          ? data.filter((b) => Number(b?.id) !== 25)
          : [];
        setBrands(filtered);
      } catch (error) {
        console.error("Lỗi tải brands:", error);
      }
    };
    fetchBrands();
  }, []);

  const groupCount = Math.max(1, Math.ceil(brands.length / 5));

  // Tự động sang trái mỗi 4s
  useEffect(() => {
    if (brands.length === 0) return;
    const timer = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(timer);
  }, [brands, index]);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + groupCount) % groupCount);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % groupCount);
  };

  // Slugify to match ProductsByBrandPage
  const slugify = (s = "") =>
    s
      .toString()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  return (
    <div className="relative bg-[linear-gradient(137deg,rgba(0,0,0,1)_23%,rgba(255,255,255,1)_55%,rgba(0,0,0,1)_76%)] text-gray-900 rounded-2xl shadow-xl py-12 px-10 text-center overflow-hidden">
      <h2 className="text-3xl font-bold mb-8 tracking-tight bg-clip-text text-transparent bg-[linear-gradient(180deg,#ffffff,#cfd3e1)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
        Các nhãn hàng
      </h2>


      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            width: `${groupCount * 100}%`,
            transform: `translateX(-${index * (100 / groupCount)}%)`,
          }}
        >
          {Array.from({ length: Math.ceil(brands.length / 5) || 0 }).map((_, groupIdx) => (
            <div
              key={groupIdx}
              className="flex justify-center gap-12 w-full flex-shrink-0"
              style={{ width: `${100 / groupCount}%` }}
            >
              {brands
                .slice(groupIdx * 5, groupIdx * 5 + 5)
                .map((brand) => (
                  <Link
                    key={brand.id}
                    to={`/brand/${slugify(brand.name)}`}
                    className="flex flex-col items-center group transition-transform duration-300 hover:scale-105"
                  >
                    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 w-36 h-24 flex items-center justify-center">
                      <img
                        src={brandImageUrl(brand.logoUrl)}
                        alt={brand.name}
                        className="h-16 w-auto object-contain"
                      />
                    </div>
                    <p className="mt-2 text-sm font-medium text-rose-400 group-hover:text-cyan-500">
                      {brand.name}
                    </p>
                  </Link>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Nút trái phải */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>

      {/* Chấm dưới xem trang */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: Math.ceil(brands.length / 5) || 0 }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === index ? "bg-blue-950" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Brands;
