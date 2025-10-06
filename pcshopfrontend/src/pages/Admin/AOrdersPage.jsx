import React, { useState } from "react";
import AdminLayout from "@/components/Layouts/AdminLayout";
import AdminTable from "@/components/Admin/AdminTable";
import AdminPagination from "@/components/Admin/AdminPagination";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const AOrdersPage = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  const orders = [
    {
      id: 101,
      customer: "Nguyễn Văn A",
      total_price: 35990000,
      status: "Đang xử lý",
      created_at: "2025-10-01",
      updated_at: "2025-10-03",
    },
    {
      id: 102,
      customer: "Trần Thị B",
      total_price: 25990000,
      status: "Đã giao",
      created_at: "2025-09-25",
      updated_at: "2025-09-29",
    },
  ];

  const handleEdit = (id) => console.log("Edit order status:", id);
  const handleDelete = (id) => console.log("Delete order:", id);

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

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
          <h1 className="text-2xl font-bold">Đơn hàng</h1>

          {/* Bộ lọc trạng thái */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
              <SelectItem value="Chờ vận chuyển">Chờ vận chuyển</SelectItem>
              <SelectItem value="Đang vận chuyển">Đang vận chuyển</SelectItem>
              <SelectItem value="Đã giao">Đã giao</SelectItem>
              <SelectItem value="Đã hủy">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
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
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="mt-4">
          <AdminPagination currentPage={page} totalPages={4} onPageChange={setPage} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AOrdersPage;
