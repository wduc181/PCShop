import React from "react";
import { mockOrders } from "@/lib/mockOrders";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import MainLayout from "@/components/Layouts/MainLayout";

const OrdersPage = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-semibold mb-6">Đơn hàng của tôi</h1>

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
              {mockOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className={`hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <td className="p-3 font-medium text-gray-800">{order.id}</td>
                  <td className="p-3">{order.date}</td>
                  <td className="p-3">{order.status}</td>
                  <td className="p-3 text-red-600 font-semibold">
                    {order.total.toLocaleString()}₫
                  </td>
                  <td className="p-3 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      Xem chi tiết
                    </Button>
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

export default OrdersPage;