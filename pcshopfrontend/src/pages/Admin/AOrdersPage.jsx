import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/Layouts/AdminLayout";
import AdminTable from "@/components/Admin/AdminTable";
import AdminPagination from "@/components/Admin/AdminPagination";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { getAllOrders, updateOrder, normalizeOrderUserId } from "@/services/OrderService";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const AOrdersPage = () => {
  const navigate = useNavigate();
  const { token, isAdmin } = useAuth();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [draftStatus, setDraftStatus] = useState("");

  const finalStatuses = new Set(["delivered", "cancelled"]);
  const processingStatuses = ["pending", "processing", "shipped"];

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders(token);
      const list = Array.isArray(res) ? res : Array.isArray(res?.content) ? res.content : [];
      setOrders(list);
      setError("");
    } catch (e) {
      console.error("Load orders failed:", e);
      const msg = String(e?.message || "");
      if (msg.includes("API Error 403")) setError("Bạn không có quyền truy cập trang này.");
      else if (msg.includes("API Error 401")) setError("Bạn cần đăng nhập để truy cập trang này.");
      else setError("Không thể tải danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Đừng chặn theo cờ client-side; để backend quyết định quyền truy cập
    if (!token) {
      setLoading(false);
      setError("Bạn cần đăng nhập để truy cập trang này.");
      return;
    }
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filteredOrders = useMemo(() => {
    const base = orders.filter((o) => !finalStatuses.has(String(o.status).toLowerCase()));
    if (statusFilter === "all") return base;
    return base.filter((o) => String(o.status).toLowerCase() === String(statusFilter).toLowerCase());
  }, [orders, statusFilter]);

  const startEdit = (id) => {
    setEditingId(id);
    const o = orders.find((x) => x.id === id);
    setDraftStatus(String(o?.status || "").toLowerCase());
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftStatus("");
  };

  const saveEdit = async (id) => {
    try {
      const o = orders.find((x) => x.id === id);
      if (!o) return;
      const current = String(o.status || "").toLowerCase();
      if (!draftStatus || draftStatus === current) {
        toast.info("Không có thay đổi để cập nhật");
        cancelEdit();
        return;
      }
      const dto = {
        orderId: id,
        userId: normalizeOrderUserId(o),
        fullName: o.fullName,
        email: o.email,
        phoneNumber: o.phoneNumber,
        shippingAddress: o.shippingAddress,
        note: o.note,
        totalPrice: o.totalPrice,
        paymentMethod: o.paymentMethod,
        shippingMethod: o.shippingMethod,
        trackingNumber: o.trackingNumber,
        status: draftStatus || o.status,
      };
      await updateOrder(id, dto);
      toast.success("Cập nhật đơn hàng thành công");
      setEditingId(null);
      setDraftStatus("");
      loadOrders();
    } catch (e) {
      console.error("Update order failed:", e);
      toast.error(e?.message || "Cập nhật thất bại");
    }
  };

  const goHistory = () => navigate("/admin/order-history");

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
          <h1 className="text-2xl font-bold">Đơn hàng (chưa hoàn tất)</h1>
          <div className="flex items-center gap-3">
            {/* Bộ lọc trạng thái theo enum backend */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {processingStatuses.map((s) => (
                  <SelectItem key={s} value={s}>{s.toUpperCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="secondary" onClick={goHistory}>Xem lịch sử</Button>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-500">Đang tải đơn hàng...</div>
        ) : error ? (
          <div className="py-10 text-center text-red-600">{error}</div>
        ) : (
          <AdminTable
            columns={["Mã đơn", "Khách hàng", "Tổng tiền (VNĐ)", "Trạng thái", "Ngày đặt", "Thanh toán"]}
            data={filteredOrders.map((o) => ({
              id: o.id,
              customer: o.fullName || o.user?.fullName || o.email || "—",
              total_price: Number(o.totalPrice || 0).toLocaleString("vi-VN"),
              status: editingId === o.id ? (
                <Select value={draftStatus} onValueChange={setDraftStatus}>
                  <SelectTrigger className="w-[180px] h-8 text-sm">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {processingStatuses.map((s) => (
                      <SelectItem key={s} value={s}>{s.toUpperCase()}</SelectItem>
                    ))}
                    <SelectItem value="delivered">DELIVERED</SelectItem>
                    <SelectItem value="cancelled">CANCELLED</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <span>{String(o.status || "").toUpperCase()}</span>
              ),
              created_at: o.orderDate ? new Date(o.orderDate).toLocaleString("vi-VN") : "—",
              updated_at: String(o.paymentStatus || "").toUpperCase(),
            }))}
            renderActions={(item) => (
              editingId === item.id ? (
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => saveEdit(item.id)}>Lưu</Button>
                  <Button size="sm" variant="ghost" onClick={cancelEdit}>Huỷ</Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 justify-center">
                  <Button variant="outline" size="sm" onClick={() => startEdit(item.id)}>
                    Sửa
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => console.log("Delete order:", item.id)}>
                    Xóa
                  </Button>
                </div>
              )
            )}
          />
        )}

        <div className="mt-4">
          <AdminPagination currentPage={page} totalPages={4} onPageChange={setPage} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AOrdersPage;
