import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/Layouts/AdminLayout";
import AdminTable from "@/components/Admin/AdminTable";
import AdminPagination from "@/components/Admin/AdminPagination";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { getAllOrders, updateOrderInfo, updateOrderStatus, cancelOrder } from "@/services/orderService";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import OrderInfoDialog from "@/components/common/OrderInfoDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toVIOrderStatus, toVIPaymentStatus } from "@/lib/statusMaps";

const toOrderList = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object" && Array.isArray(raw.content)) return raw.content;
  return [];
};

const AOrdersPage = () => {
  const navigate = useNavigate();
  const { token, isAdmin } = useAuth();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    shippingAddress: "",
    note: "",
    paymentMethod: "",
    shippingMethod: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const [statusDlgOpen, setStatusDlgOpen] = useState(false);
  const [statusDlgOrder, setStatusDlgOrder] = useState(null);
  const [statusValue, setStatusValue] = useState("Chờ xử lý");
  const [savingStatus, setSavingStatus] = useState(false);

  const finalStatuses = new Set(["delivered", "cancelled"]);
  const processingStatuses = ["pending", "processing", "shipped"];

  const statusToVI = toVIOrderStatus;
  const paymentToVI = toVIPaymentStatus;

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders(token);
      setOrders(toOrderList(res));
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
    if (!token) {
      setLoading(false);
      setError("Bạn cần đăng nhập để truy cập trang này.");
      return;
    }
    loadOrders();
  }, [token]);

  const filteredOrders = useMemo(() => {
    const base = orders.filter((o) => !finalStatuses.has(String(o.status).toLowerCase()));
    if (statusFilter === "all") return base;
    return base.filter((o) => String(o.status).toLowerCase() === String(statusFilter).toLowerCase());
  }, [orders, statusFilter]);

  const openEditInfo = (order) => {
    setEditingOrder(order);
    setEditForm({
      fullName: order.fullName ?? "",
      email: order.email ?? "",
      phoneNumber: order.phoneNumber ?? "",
      shippingAddress: order.shippingAddress ?? "",
      note: order.note ?? "",
      paymentMethod: order.paymentMethod ?? "",
      shippingMethod: order.shippingMethod ?? "",
    });
    setEditOpen(true);
  };

  const saveEditInfo = async () => {
    if (!editingOrder) return;
    try {
      setSavingEdit(true);
      await updateOrderInfo(editingOrder.id, editForm);
      toast.success("Đã lưu thông tin nhận hàng");
      setEditOpen(false);
      setEditingOrder(null);
      loadOrders();
    } catch (e) {
      console.error("Cập nhật thông tin nhận hàng thất bại:", e);
      toast.error(e?.message || "Cập nhật thất bại");
    } finally {
      setSavingEdit(false);
    }
  };

  const openUpdateStatus = (order) => {
    setStatusDlgOrder(order);
    setStatusValue(statusToVI(order.status));
    setStatusDlgOpen(true);
  };

  const saveUpdateStatus = async () => {
    if (!statusDlgOrder) return;
    try {
      setSavingStatus(true);
      await updateOrderStatus(statusDlgOrder.id, statusValue, token);
      toast.success("Đã cập nhật trạng thái đơn hàng");
      setStatusDlgOpen(false);
      setStatusDlgOrder(null);
      loadOrders();
    } catch (e) {
      console.error("Cập nhật trạng thái thất bại:", e);
      toast.error(e?.message || "Cập nhật thất bại");
    } finally {
      setSavingStatus(false);
    }
  };

  const goHistory = () => navigate("/admin/order-history");

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
          <h1 className="text-2xl font-bold">Đơn hàng (chưa hoàn tất)</h1>
          <div className="flex items-center gap-3">
            {/* Bộ lọc trạng thái (hiển thị tiếng Việt, giữ giá trị tiếng Anh) */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {processingStatuses.map((s) => (
                  <SelectItem key={s} value={s}>{statusToVI(s)}</SelectItem>
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
              status: <span>{statusToVI(o.status)}</span>,
              created_at: o.orderDate ? new Date(o.orderDate).toLocaleString("vi-VN") : "—",
              updated_at: paymentToVI(o.paymentStatus),
            }))}
            actionHeader="Hành động"
            renderActions={(item) => {
              const o = orders.find((x) => x.id === item.id);
              const status = String(o?.status || "").toLowerCase();
              const canCancel = status === "pending";
              return (
                <div className="flex items-center gap-2 justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={!canCancel}
                    onClick={async () => {
                      if (!canCancel) return;
                      const ok = window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?");
                      if (!ok) return;
                      try {
                        await cancelOrder(item.id, token);
                        toast.success("Đã hủy đơn hàng");
                        loadOrders();
                      } catch (e) {
                        console.error("Hủy đơn thất bại:", e);
                        toast.error(e?.message || "Hủy đơn thất bại");
                      }
                    }}
                  >
                    Hủy đơn
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={status !== "pending"}
                    title={status !== "pending" ? "Chỉ sửa khi đơn ở trạng thái Chờ xử lý" : undefined}
                    onClick={() => openEditInfo(o)}
                  >
                    Sửa thông tin nhận hàng
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openUpdateStatus(o)}
                  >
                    Cập nhật trạng thái
                  </Button>
                </div>
              );
            }}
          />
        )}

        <div className="mt-4">
          <AdminPagination currentPage={page} totalPages={4} onPageChange={setPage} />
        </div>
      </div>

      {/* Dialogs */}
      <OrderInfoDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        form={editForm}
        setForm={setEditForm}
        saving={savingEdit}
        onSave={saveEditInfo}
      />

      <Dialog open={statusDlgOpen} onOpenChange={setStatusDlgOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Trạng thái</label>
            <Select value={statusValue} onValueChange={setStatusValue}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Chờ xử lý",
                  "Đang xử lý",
                  "Đã gửi",
                  "Đã giao",
                  "Đã hủy",
                ].map((vn) => (
                  <SelectItem key={vn} value={vn}>{vn}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDlgOpen(false)} disabled={savingStatus}>Hủy</Button>
            <Button onClick={saveUpdateStatus} disabled={savingStatus}>{savingStatus ? "Đang lưu..." : "Lưu"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AOrdersPage;
