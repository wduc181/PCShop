import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    <div className="min-h-screen w-full bg-[#fafafa] text-gray-900">
      <div className="min-h-screen flex flex-col relative z-10">
        {/* Header */}
        <Header />

        {/* Nội dung chia cột */}
<div className="flex flex-1 pt-12">
  {/* Sidebar */}
  <div className="h-[calc(100vh-3rem)] sticky top-12">
    <Sidebar />
  </div>


          <main className="flex-1 px-6 pt-20 pb-20">
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
                    <TableCell>{item.productName}</TableCell>
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
                    <TableCell>{item.subtotal.toLocaleString()}₫</TableCell>
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
                Tổng: {cart.totalPrice.toLocaleString()}₫
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                Thanh toán
              </Button>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default CartPage;
