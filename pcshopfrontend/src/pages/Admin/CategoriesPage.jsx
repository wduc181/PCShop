import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/Layouts/AdminLayout";
import AdminTable from "@/components/Admin/AdminTable";
import AdminPagination from "@/components/Admin/AdminPagination";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/services/api";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiRequest(`/categories`);
        setCategories(data.content || data); 
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
      }
    };

    fetchCategories();
  }, [page]);

  const handleEdit = (id) => console.log("Edit category:", id);
  const handleDelete = (id) => console.log("Delete category:", id);
  const handleAdd = () => console.log("Thêm danh mục mới");

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

      {/* Nội dung */}
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Danh mục</h1>
          <Button onClick={handleAdd}>Thêm danh mục</Button>
        </div>

        <AdminTable
          columns={["ID", "Tên danh mục", "Mô tả", "Ngày tạo"]}
          data={categories.map((c) => ({
            id: c.id,
            name: c.name,
            description: c.description || "—",
            createdAt: new Date(c.createdAt).toLocaleString("vi-VN"),
          }))}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="mt-4">
          <AdminPagination
            currentPage={page}
            totalPages={5}
            onPageChange={setPage}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default CategoriesPage;
