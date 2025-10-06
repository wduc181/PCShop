import React, { useState } from "react";
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

const CartPage = () => {
  // Fake dữ liệu response từ backend
  const [cart, setCart] = useState({
    userId: 1,
    items: [
      {
        id: 1,
        productId: 5,
        productName: "Laptop ASUS ROG",
        quantity: 2,
        price: 25000000,
        subtotal: 50000000,
      },
      {
        id: 2,
        productId: 6,
        productName: "Laptop MSI GF63",
        quantity: 1,
        price: 18000000,
        subtotal: 18000000,
      },
    ],
    totalPrice: 68000000,
  });

  // Mock hàm update
  const updateQuantity = (id, newQuantity) => {
    setCart((prev) => {
      const items = prev.items.map((it) =>
        it.id === id ? { ...it, quantity: newQuantity, subtotal: newQuantity * it.price } : it
      );
      const total = items.reduce((sum, it) => sum + it.subtotal, 0);
      return { ...prev, items, totalPrice: total };
    });
  };

  const removeItem = (id) => {
    setCart((prev) => {
      const items = prev.items.filter((it) => it.id !== id);
      const total = items.reduce((sum, it) => sum + it.subtotal, 0);
      return { ...prev, items, totalPrice: total };
    });
  };

  const clearCart = () => {
    setCart((prev) => ({ ...prev, items: [], totalPrice: 0 }));
  };

  return (
    <MainLayout>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h1>

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

        {/* Summary */}
        <div className="flex justify-between items-center mt-8">
          <Button variant="destructive" onClick={clearCart}>
            Xoá toàn bộ
          </Button>
          <div className="text-xl font-bold">
            Tổng:{" "}
            <span className="text-red-600">{cart.totalPrice.toLocaleString()}₫</span>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            Đặt hàng
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;
