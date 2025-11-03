import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router";
import MainLayout from "@/components/Layouts/MainLayout";
import { getOrderDetails } from "@/services/orderService";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toVIOrderStatus, toVIPaymentStatus } from "@/lib/statusMaps";

const OrderDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const orderId = useMemo(() => {
    const n = Number(id);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [id]);

  const formatMoney = (v) => (Number(v || 0)).toLocaleString("vi-VN") + "₫";
  const formatDate = (s) => {
    if (!s) return "—";
    try { const d = new Date(s); if (!isNaN(d)) return d.toLocaleString("vi-VN"); } catch (_) {}
    return String(s);
  };

  // EN -> VI mappings for display
  const statusToVI = toVIOrderStatus;
  const paymentToVI = toVIPaymentStatus;

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      setError("Bạn cần đăng nhập để xem chi tiết đơn hàng.");
      return;
    }
    const run = async () => {
      if (!orderId) {
        setLoading(false);
        setError("Mã đơn hàng không hợp lệ.");
        return;
      }
      try {
        setLoading(true);
        const data = await getOrderDetails(orderId);
        setOrder(data);
        setError("");
      } catch (e) {
        console.error("Load order details failed:", e);
        setError("Không thể tải chi tiết đơn hàng. Hãy thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, isAuthenticated]);

  return (
    <MainLayout>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Chi tiết đơn hàng #{id}</h1>
          <Button variant="outline" onClick={() => window.history.back()}>Quay lại</Button>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-500">Đang tải chi tiết đơn hàng...</div>
        ) : error ? (
          <div className="py-10 text-center text-red-600">{error}</div>
        ) : !order ? (
          <div className="py-10 text-center text-gray-500">Không tìm thấy đơn hàng.</div>
        ) : (
          <>
            {/* Thông tin đơn hàng */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-700">
              <p><span className="font-semibold">Ngày đặt:</span> {formatDate(order.orderDate)}</p>
              <p><span className="font-semibold">Trạng thái:</span> {statusToVI(order.status)}</p>
              <p><span className="font-semibold">Địa chỉ giao hàng:</span> {order.shippingAddress}</p>
              <p><span className="font-semibold">Phương thức thanh toán:</span> {order.paymentMethod} • {paymentToVI(order.paymentStatus)}</p>
              <p className="md:col-span-2">
                <span className="font-semibold">Tổng tiền:</span>{" "}
                <span className="text-red-600 font-bold">{formatMoney(order.totalPrice)}</span>
              </p>
            </div>

            {/* Danh sách sản phẩm */}
            <h2 className="text-xl font-semibold mb-3">Sản phẩm trong đơn</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left text-gray-700">
                    <th className="p-3">Sản phẩm</th>
                    <th className="p-3 text-center">Số lượng</th>
                    <th className="p-3 text-center">Đơn giá</th>
                    <th className="p-3 text-center">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.details || []).map((item, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                    >
                      <td className="p-3 font-medium text-gray-800">{item.productName}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-center">{formatMoney(item.price)}</td>
                      <td className="p-3 text-center text-red-600 font-semibold">{formatMoney(item.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default OrderDetailPage;
