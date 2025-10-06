import React, { useState } from "react";
import AdminLayout from "@/components/Layouts/AdminLayout";
import AdminTable from "@/components/Admin/AdminTable";
import AdminPagination from "@/components/Admin/AdminPagination";

const OrderHistoryPage = () => {
  const [page, setPage] = useState(1);

  // Dữ liệu mẫu (thông thường bạn sẽ lấy từ API /orders)
  const orders = [
    {
      id: 201,
      customer: "Nguyễn Văn A",
      total_price: 29990000,
      status: "Đã giao",
      created_at: "2025-09-15",
      updated_at: "2025-09-20",
    },
    {
      id: 202,
      customer: "Trần Thị B",
      total_price: 18990000,
      status: "Đã hủy",
      created_at: "2025-09-10",
      updated_at: "2025-09-12",
    },
    {
      id: 203,
      customer: "Phạm Văn C",
      total_price: 35990000,
      status: "Đang vận chuyển",
      created_at: "2025-10-03",
      updated_at: "2025-10-04",
    },
  ];

  // Chỉ lấy đơn có trạng thái "Đã giao" hoặc "Đã hủy"
  const filteredOrders = orders.filter(
    (o) => o.status === "Đã giao" || o.status === "Đã hủy"
  );

  const handleView = (id) => console.log("Xem chi tiết đơn hàng:", id);
  const handleDelete = (id) => console.log("Xóa khỏi lịch sử:", id);

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
          <h1 className="text-2xl font-bold">Lịch sử đơn hàng</h1>
        </div>

        <AdminTable
          columns={["Mã đơn", "Khách hàng", "Tổng tiền (VNĐ)", "Trạng thái", "Ngày tạo", "Cập nhật"]}
          data={filteredOrders.map((o) => ({
            id: o.id,
            customer: o.customer,
            total_price: o.total_price.toLocaleString("vi-VN"),
            status: o.status,
            created_at: o.created_at,
            updated_at: o.updated_at,
          }))}
          onEdit={handleView}
          onDelete={handleDelete}
        />

        <div className="mt-4">
          <AdminPagination currentPage={page} totalPages={2} onPageChange={setPage} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderHistoryPage;
