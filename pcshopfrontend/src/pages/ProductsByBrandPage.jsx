import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CustomPagination from "@/components/ProductsPages/CustomPagination";
import MainLayout from "@/components/Layouts/MainLayout";

const ProductsByBrand = () => {
  // Fake dữ liệu
  const brand = {
    name: "ASUS",
    description:
      "ASUS nổi tiếng với dòng ROG mạnh mẽ cho game thủ, Zenbook sang trọng và Vivobook phổ thông.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/AsusTek_logo.svg",
  };

  const allProducts = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    name: `ASUS Laptop ${i + 1}`,
    price: `${15 + i} triệu`,
    shortDesc: "Laptop hiệu năng cao, thiết kế hiện đại.",
    image:
      "https://images.unsplash.com/photo-1587202372616-b43abea06c6d?auto=format&fit=crop&w=800&q=80",
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const totalPages = Math.ceil(allProducts.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const currentProducts = allProducts.slice(startIndex, startIndex + pageSize);

  return (
    <MainLayout>
      {/* Brand Header */}
      <div className="flex flex-col items-center justify-center py-12 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-2xl mb-10">
        <img src={brand.logo} alt={brand.name} className="h-20 mb-4" />
        <h1 className="text-3xl font-bold">{brand.name}</h1>
        <p className="text-sm mt-2 max-w-xl text-center">
          {brand.description}
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Sản phẩm của {brand.name}</h2>
        <select className="border rounded-lg p-2">
          <option value="new">Mới nhất</option>
          <option value="price-asc">Giá tăng dần</option>
          <option value="price-desc">Giá giảm dần</option>
        </select>
      </div>

      {/* Product list dạng card ngang */}
      <div className="space-y-6 mb-10">
        {currentProducts.map((product) => (
          <Card
            key={product.id}
            className="flex flex-row rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-48 h-48 object-cover"
            />
            <CardContent className="flex flex-col justify-between p-6 flex-1">
              <div>
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-gray-600">{product.price}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {product.shortDesc}
                </p>
              </div>
              <Button className="w-fit mt-4">Xem chi tiết</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </MainLayout>
  );
};

export default ProductsByBrand;
