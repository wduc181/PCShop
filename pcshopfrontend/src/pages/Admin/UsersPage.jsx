import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/Layouts/AdminLayout";
import AdminTable from "@/components/Admin/AdminTable";
import AdminPagination from "@/components/Admin/AdminPagination";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/services/api";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 10; // backend default limit

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Gọi API thật của bạn
        const data = await apiRequest(`/users`);
        setUsers(data); // backend trả List<User>
      } catch (err) {
        console.error("Lỗi khi tải danh sách người dùng:", err);
      }
    };
    fetchUsers();
  }, [page]);

  const handleEdit = (id) => console.log("Edit user:", id);
  const handleDelete = (id) => console.log("Delete user:", id);

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
          <h1 className="text-2xl font-bold">Người dùng</h1>
          <Button>Thêm người dùng</Button>
        </div>

        <AdminTable
          columns={[
            "ID",
            "Họ tên",
            "Email",
            "Số điện thoại",
            "Địa chỉ",
            "Ngày sinh",
            "Vai trò",
            "Ngày tạo",
          ]}
          data={users.map((u) => ({
            id: u.id,
            fullName: u.fullName,
            email: u.email,
            phoneNumber: u.phoneNumber,
            address: u.address,
            dateOfBirth: u.dateOfBirth,
            role: u.role?.name || "UNKNOWN",
            createdAt: new Date(u.createdAt).toLocaleString("vi-VN"),
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

export default UsersPage;
