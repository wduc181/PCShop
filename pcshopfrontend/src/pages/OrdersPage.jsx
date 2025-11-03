import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router";
import MainLayout from "@/components/Layouts/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { getOrdersByUser, cancelOrder, updateOrderInfo } from "@/services/orderService";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import OrderInfoDialog from "@/components/common/OrderInfoDialog";

const OrdersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(() => new Set());
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [cancellingId, setCancellingId] = useState(null);
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
  const [saving, setSaving] = useState(false);

  const userId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const qUid = params.get("uid");
    let stored = null;
    try { stored = localStorage.getItem("user_id"); } catch (_) {}
    const val = qUid ?? stored ?? null;
    const num = val != null ? Number(val) : null;
    return Number.isFinite(num) && num > 0 ? num : null;
  }, [location.search]);

  const loadOrders = async () => {
    if (!userId) {
      setError("Không xác định được tài khoản. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await getOrdersByUser(userId, page, size, token);
      const list = Array.isArray(res?.content) ? res.content : Array.isArray(res) ? res : [];
      setOrders(list);
      if (res && typeof res === "object") {
        const tp = Number(res.totalPages ?? 1);
        const te = Number(res.totalElements ?? list.length ?? 0);
        setTotalPages(Number.isFinite(tp) && tp > 0 ? tp : 1);
        setTotalElements(Number.isFinite(te) && te >= 0 ? te : list.length ?? 0);
      } else {
        setTotalPages(1);
        setTotalElements(list.length ?? 0);
      }
      setError("");
    } catch (e) {
      console.error("Lỗi tải đơn hàng:", e);
      setError("Không thể tải danh sách đơn hàng. Hãy thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      setError("Bạn cần đăng nhập để xem đơn hàng.");
      return;
    }
    loadOrders();
  }, [isAuthenticated, userId, page, size]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qPage = Number(params.get("page"));
    if (Number.isFinite(qPage) && qPage > 0 && qPage !== page) {
      setPage(qPage);
    }
  }, []);

  const updateQueryPage = (nextPage) => {
    const params = new URLSearchParams(location.search);
    if (nextPage > 0) params.set("page", String(nextPage));
    else params.delete("page");
    navigate({ pathname: location.pathname, search: `?${params.toString()}` }, { replace: true });
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const formatMoney = (v) => {
    const n = Number(v || 0);
    return n.toLocaleString("vi-VN") + "₫";
  };

  const formatDate = (s) => {
    if (!s) return "—";
    try {
      const d = new Date(s);
      if (!isNaN(d.getTime())) return d.toLocaleString("vi-VN");
      return String(s);
    } catch (_) {
      return String(s);
    }
  };
  const STATUS_EN2VI = {
    pending: "Chờ xử lý",
    processing: "Đang xử lý",
    shipped: "Đã gửi",
    delivered: "Đã giao",
    cancelled: "Đã hủy",
    canceled: "Đã hủy",
  };
  const statusToVI = (val) => {
    if (!val) return "—";
    const key = String(val).toLowerCase();
    return STATUS_EN2VI[key] ?? String(val);
  };

  const openEdit = (order) => {
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

  const handleSaveEdit = async () => {
    if (!editingOrder) return;
    try {
      setSaving(true);
      await updateOrderInfo(editingOrder.id, editForm);
      setEditOpen(false);
      setEditingOrder(null);
      await loadOrders();
    } catch (e) {
      console.error("Cập nhật đơn hàng thất bại", e);
      alert("Cập nhật đơn hàng thất bại. Vui lòng thử lại sau.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-semibold mb-6">Đơn hàng của tôi</h1>

        {loading ? (
          <div className="py-10 text-center text-gray-500">Đang tải đơn hàng...</div>
        ) : error ? (
          <div className="py-10 text-center text-red-600">{error}</div>
        ) : orders.length === 0 ? (
          <div className="py-10 text-center text-gray-500">Chưa có đơn hàng.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700">
                  <th className="p-3">Mã đơn hàng</th>
                  <th className="p-3">Ngày đặt</th>
                  <th className="p-3">Trạng thái</th>
                  <th className="p-3">Tổng tiền</th>
                  <th className="p-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <React.Fragment key={order.id}>
                    <tr
                      className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                    >
                      <td className="p-3 font-medium text-gray-800">{order.id}</td>
                      <td className="p-3">{formatDate(order.orderDate)}</td>
                      <td className="p-3">{statusToVI(order.status)}</td>
                      <td className="p-3 text-red-600 font-semibold">{formatMoney(order.totalPrice)}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleExpand(order.id)}
                          >
                            {expanded.has(order.id) ? "Thu gọn" : "Xem chi tiết"}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate(`/orders/${order.id}`)}
                          >
                            Xem sản phẩm
                          </Button>
                          {(() => {
                            const status = String(order.status || "").toLowerCase();
                            const isCancelled = status === "cancelled" || status === "canceled" || status === "cancel";
                            const canEdit = status === "pending"; // backend only allows edit when pending
                            return (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={!canEdit}
                                title={canEdit ? "Sửa thông tin nhận hàng" : "Chỉ có thể sửa khi đơn ở trạng thái chờ xử lý"}
                                onClick={() => openEdit(order)}
                              >
                                Sửa thông tin
                              </Button>
                            );
                          })()}
                          {(() => {
                            const status = String(order.status || "").toLowerCase();
                            const isCancelled = status === "cancelled" || status === "canceled" || status === "cancel";
                            if (isCancelled) {
                              return (
                                <Button variant="outline" size="sm" disabled>
                                  Đã hủy
                                </Button>
                              );
                            }
                            return (
                              <Button
                                variant="destructive"
                                size="sm"
                                disabled={cancellingId === order.id}
                                onClick={async () => {
                                  const ok = window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?");
                                  if (!ok) return;
                                  try {
                                    setCancellingId(order.id);
                                    await cancelOrder(order.id, token);
                                    await loadOrders();
                                  } catch (e) {
                                    console.error("Hủy đơn thất bại", e);
                                    alert("Hủy đơn thất bại. Vui lòng thử lại sau.");
                                  } finally {
                                    setCancellingId(null);
                                  }
                                }}
                              >
                                Hủy đơn
                              </Button>
                            );
                          })()}
                        </div>
                      </td>
                    </tr>
                    {expanded.has(order.id) && (
                      <tr>
                        <td className="p-3 bg-gray-50" colSpan={5}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                            <div>
                              <div><span className="font-medium">Họ tên:</span> {order.fullName || "—"}</div>
                              <div><span className="font-medium">SĐT:</span> {order.phoneNumber || "—"}</div>
                              <div><span className="font-medium">Email:</span> {order.email || "—"}</div>
                            </div>
                            <div>
                              <div><span className="font-medium">Địa chỉ giao:</span> {order.shippingAddress || "—"}</div>
                              <div><span className="font-medium">Thanh toán:</span> {order.paymentMethod || "—"} • {order.paymentStatus || "—"}</div>
                              <div><span className="font-medium">Vận chuyển:</span> {order.shippingMethod || "—"}</div>
                            </div>
                          </div>
                          {order.note && (
                            <div className="mt-2 text-sm text-gray-600"><span className="font-medium">Ghi chú:</span> {order.note}</div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {/* Pagination controls + page size */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-600">
                Tổng cộng: <span className="font-medium">{totalElements.toLocaleString("vi-VN")}</span> đơn hàng
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <label htmlFor="page-size" className="text-gray-600">Mỗi trang</label>
                  <select
                    id="page-size"
                    className="border rounded-md px-2 py-1 text-sm"
                    value={size}
                    onChange={(e) => {
                      const next = Number(e.target.value);
                      setSize(next);
                      setPage(1);
                      updateQueryPage(1);
                    }}
                  >
                    {[10, 20, 50].map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => {
                          if (page > 1) {
                            const next = page - 1;
                            setPage(next);
                            updateQueryPage(next);
                          }
                        }}
                        aria-disabled={page <= 1}
                        className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>

                    {(() => {
                      const items = [];
                      const tp = Math.max(1, totalPages || 1);
                      const makePage = (p) => (
                        <PaginationItem key={p}>
                          <PaginationLink
                            isActive={p === page}
                            onClick={() => {
                              if (p !== page) {
                                setPage(p);
                                updateQueryPage(p);
                              }
                            }}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      );

                      if (tp <= 7) {
                        for (let i = 1; i <= tp; i++) items.push(makePage(i));
                        return items;
                      }

                      items.push(makePage(1));
                      const start = Math.max(2, page - 1);
                      const end = Math.min(tp - 1, page + 1);
                      if (start > 2) items.push(
                        <PaginationItem key="ellipsisa"><PaginationEllipsis /></PaginationItem>
                      );
                      for (let p = start; p <= end; p++) items.push(makePage(p));
                      if (end < tp - 1) items.push(
                        <PaginationItem key="ellipsisb"><PaginationEllipsis /></PaginationItem>
                      );
                      items.push(makePage(tp));
                      return items;
                    })()}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => {
                          if (page < totalPages) {
                            const next = page + 1;
                            setPage(next);
                            updateQueryPage(next);
                          }
                        }}
                        aria-disabled={page >= totalPages}
                        className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </div>
        )}
      </div>
      <OrderInfoDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        form={editForm}
        setForm={setEditForm}
        saving={saving}
        onSave={handleSaveEdit}
      />
    </MainLayout>
  );
};

export default OrdersPage;