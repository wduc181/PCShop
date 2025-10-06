import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CustomPagination from "@/components/ProductsPages/CustomPagination";
import MainLayout from "@/components/Layouts/MainLayout";

const ProductsByCategory = () => {
  const category = {
    name: "Gaming Laptops",
    description: "Những chiếc laptop mạnh mẽ dành cho game thủ và dân thiết kế.",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1600&q=80",
  };

  const allProducts = Array.from({ length: 45 }).map((_, i) => ({
    id: i,
    name: `Laptop ${i + 1}`,
    price: `${20 + i} triệu`,
    image:
      "https://images.unsplash.com/photo-1587202372616-b43abea06c6d?auto=format&fit=crop&w=800&q=80",
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;
  const totalPages = Math.ceil(allProducts.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const currentProducts = allProducts.slice(startIndex, startIndex + pageSize);

  return (
    <MainLayout>
      {/* Category Header */}
      <div className="relative w-full h-64 bg-black rounded-2xl overflow-hidden mb-10">
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-3xl font-bold">{category.name}</h1>
          <p className="text-sm mt-2 max-w-2xl">{category.description}</p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
        {currentProducts.map((product) => (
          <Card
            key={product.id}
            className="rounded-2xl shadow-md hover:shadow-lg transition duration-300"
          >
            <CardContent className="p-4 flex flex-col items-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded-xl mb-4"
              />
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-600 mb-3">{product.price}</p>
              <Button className="w-full">Xem chi tiết</Button>
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

export default ProductsByCategory;
