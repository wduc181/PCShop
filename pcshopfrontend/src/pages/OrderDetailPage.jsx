import React from "react";
import { useParams } from "react-router";
import { mockOrderDetails } from "@/lib/mockOrderDetails";
import MainLayout from "@/components/Layouts/MainLayout";

const OrderDetailPage = () => {
  const { id } = useParams();
  const order = mockOrderDetails; // sau này sẽ thay bằng API theo id

  return (
    <MainLayout>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-semibold mb-6">
          Chi tiết đơn hàng #{id}
        </h1>

        {/* Thông tin đơn hàng */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-700">
          <p><span className="font-semibold">Ngày đặt:</span> {order.date}</p>
          <p><span className="font-semibold">Trạng thái:</span> {order.status}</p>
          <p><span className="font-semibold">Địa chỉ giao hàng:</span> {order.shippingAddress}</p>
          <p><span className="font-semibold">Phương thức thanh toán:</span> {order.paymentMethod}</p>
          <p className="md:col-span-2">
            <span className="font-semibold">Tổng tiền:</span>{" "}
            <span className="text-red-600 font-bold">{order.total.toLocaleString()}₫</span>
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
              {order.items.map((item, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <td className="p-3 font-medium text-gray-800">{item.productName}</td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3 text-center">{item.price.toLocaleString()}₫</td>
                  <td className="p-3 text-center text-red-600 font-semibold">
                    {(item.quantity * item.price).toLocaleString()}₫
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderDetailPage;
