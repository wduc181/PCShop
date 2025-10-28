import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router";
import MainLayout from "@/components/Layouts/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { getOrdersByUser } from "@/services/orderService";

const OrdersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(() => new Set());

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
  const res = await getOrdersByUser(userId, 1, 20, token);
      const list = Array.isArray(res?.content) ? res.content : Array.isArray(res) ? res : [];
      setOrders(list);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, userId]);

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
    // Try to format ISO-like string; fallback to raw
    try {
      const d = new Date(s);
      if (!isNaN(d.getTime())) return d.toLocaleString("vi-VN");
      return String(s);
    } catch (_) {
      return String(s);
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
                      <td className="p-3">{order.status}</td>
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
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default OrdersPage;