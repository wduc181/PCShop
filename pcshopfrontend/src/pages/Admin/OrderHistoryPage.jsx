import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/Layouts/AdminLayout";
import AdminTable from "@/components/Admin/AdminTable";
import AdminPagination from "@/components/Admin/AdminPagination";
import { useAuth } from "@/context/AuthContext";
import { getAllOrders } from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { toVIOrderStatus, toVIPaymentStatus } from "@/lib/statusMaps";

const toOrderList = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object" && Array.isArray(raw.content)) return raw.content;
  return [];
};

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pageSize = 10;
  const finalStatuses = new Set(["delivered", "cancelled"]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getAllOrders(token);
        setOrders(toOrderList(res));
        setError("");
      } catch (e) {
        console.error("Load order history failed:", e);
        const msg = String(e?.message || "");
        if (msg.includes("API Error 403")) setError("Bạn không có quyền truy cập trang này.");
        else if (msg.includes("API Error 401")) setError("Bạn cần đăng nhập để truy cập trang này.");
        else setError("Không thể tải lịch sử đơn hàng.");
      } finally {
        setLoading(false);
      }
    };
    if (!token) {
      setLoading(false);
      setError("Bạn cần đăng nhập để truy cập trang này.");
      return;
    }
    load();
  }, [token]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => finalStatuses.has(String(o.status).toLowerCase()));
  }, [orders]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, page]);

  const handleView = (id) => navigate(`/orders/${id}`);
  const handleDelete = (id) => console.log("Xóa khỏi lịch sử:", id);

  const statusToVI = toVIOrderStatus;
  const paymentToVI = toVIPaymentStatus;

  return (
    <AdminLayout>
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

        {loading ? (
          <div className="py-10 text-center text-gray-500">Đang tải lịch sử đơn hàng...</div>
        ) : error ? (
          <div className="py-10 text-center text-red-600">{error}</div>
        ) : (
          <AdminTable
            columns={["Mã đơn", "Khách hàng", "Tổng tiền (VNĐ)", "Trạng thái", "Ngày tạo", "Thanh toán"]}
            data={pageData.map((o) => ({
              id: o.id,
              customer: o.fullName || o.user?.fullName || o.email || "—",
              total_price: Number(o.totalPrice || 0).toLocaleString("vi-VN"),
              status: statusToVI(o.status),
              created_at: o.orderDate ? new Date(o.orderDate).toLocaleString("vi-VN") : "—",
              updated_at: paymentToVI(o.paymentStatus),
            }))}
            actionHeader="Hành động"
            renderActions={(item) => (
              <div className="flex items-center gap-2 justify-center">
                <Button size="sm" variant="outline" onClick={() => handleView(item.id)}>
                  Xem
                </Button>
              </div>
            )}
          />
        )}

        <div className="mt-4">
          <AdminPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderHistoryPage;
