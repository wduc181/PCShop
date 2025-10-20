import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MainLayout from "@/components/Layouts/MainLayout";
import { useLocation } from "react-router";
import { useAuth } from "@/context/AuthContext";
import {
  getCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart as clearCartApi,
} from "@/services/cartItemService";
import ConfirmOrderDialog from "@/components/common/ConfirmOrderDialog";

const CartPage = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [cart, setCart] = useState({ userId: null, items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);

  const userId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const qUid = params.get("uid");
    let stored = null;
    try { stored = localStorage.getItem("user_id"); } catch (_) {}
    const val = qUid ?? stored ?? null;
    const num = val != null ? Number(val) : null;
    return Number.isFinite(num) && num > 0 ? num : null;
  }, [location.search]);

  const loadCart = async () => {
    if (!userId) {
      setError("Không xác định được tài khoản. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getCart(userId);
      const normalized = {
        userId: data?.userId ?? userId,
        items: Array.isArray(data?.items) ? data.items : [],
        totalPrice: Number(data?.totalPrice || 0),
      };
      setCart(normalized);
      setError("");
    } catch (e) {
      console.error("Lỗi tải giỏ hàng:", e);
      setError("Không thể tải giỏ hàng. Hãy thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      setError("Bạn cần đăng nhập để xem giỏ hàng.");
      return;
    }
    loadCart();
  }, [isAuthenticated, userId]);

  const updateQuantity = async (id, newQuantity) => {
    try {
      if (newQuantity < 1) return;
      await updateCartItemQuantity(id, newQuantity);
      await loadCart();
    } catch (e) {
      console.error("Lỗi cập nhật số lượng:", e);
    }
  };

  const removeItem = async (id) => {
    try {
      await removeCartItem(id);
      await loadCart();
    } catch (e) {
      console.error("Lỗi xoá sản phẩm:", e);
    }
  };

  const clearCart = async () => {
    try {
      if (!userId) return;
      await clearCartApi(userId);
      await loadCart();
    } catch (e) {
      console.error("Lỗi xoá toàn bộ giỏ hàng:", e);
    }
  };

  return (
    <MainLayout>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h1>

        {loading ? (
          <div className="py-10 text-center text-gray-500">Đang tải giỏ hàng...</div>
        ) : error ? (
          <div className="py-10 text-center text-red-600">{error}</div>
        ) : cart.items.length === 0 ? (
          <div className="py-10 text-center text-gray-500">Giỏ hàng trống.</div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Thành tiền</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.productName}</TableCell>
                <TableCell>{item.price.toLocaleString()}₫</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-red-600 font-semibold">
                  {item.subtotal.toLocaleString()}₫
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                  >
                    Xoá
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}

        {/* Summary */}
        <div className="flex justify-between items-center mt-8">
          <Button variant="destructive" onClick={clearCart}>
            Xoá toàn bộ
          </Button>
          <div className="text-xl font-bold">
            Tổng: {" "}
            <span className="text-red-600">{Number(cart.totalPrice).toLocaleString()}₫</span>
          </div>
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => setOpenConfirm(true)}>
            Đặt hàng
          </Button>
        </div>

        <ConfirmOrderDialog open={openConfirm} onOpenChange={setOpenConfirm} userId={userId} />
      </div>
    </MainLayout>
  );
};

export default CartPage;
