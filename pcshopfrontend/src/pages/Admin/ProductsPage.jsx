import React, { useState } from "react";
import AdminLayout from "@/components/Layouts/AdminLayout";
import AdminTable from "@/components/Admin/AdminTable";
import AdminPagination from "@/components/Admin/AdminPagination";
import { Button } from "@/components/ui/button";

const ProductsPage = () => {
  const [page, setPage] = useState(1);

  const products = [
    {
      id: 1,
      name: "MSI Katana 15",
      category: "Gaming",
      brand: "MSI",
      price: 29990000,
      stock: 12,
      image_url: "/products/msi-katana15.jpg",
    },
    {
      id: 2,
      name: "ASUS TUF A15",
      category: "Gaming",
      brand: "ASUS",
      price: 25990000,
      stock: 8,
      image_url: "/products/asus-tuf-a15.jpg",
    },
  ];

  const handleEdit = (id) => console.log("Edit product:", id);
  const handleDelete = (id) => console.log("Delete product:", id);

  return (
    <AdminLayout>
      {/* Nền caro */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.05) 0, rgba(0, 0, 0, 0.05) 1px, transparent 1px, transparent 20px),
            repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.05) 0, rgba(0, 0, 0, 0.05) 1px, transparent 1px, transparent 20px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Sản phẩm</h1>
          <Button>Thêm sản phẩm</Button>
        </div>

        <AdminTable
          columns={["Ảnh", "Tên sản phẩm", "Danh mục", "Nhãn hàng", "Giá (VNĐ)", "Tồn kho"]}
          data={products.map((p) => ({
            image: <img src={p.image_url} alt={p.name} className="w-12 h-12 object-cover rounded" />,
            name: p.name,
            category: p.category,
            brand: p.brand,
            price: p.price.toLocaleString("vi-VN"),
            stock: p.stock,
          }))}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="mt-4">
          <AdminPagination currentPage={page} totalPages={5} onPageChange={setPage} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductsPage;
