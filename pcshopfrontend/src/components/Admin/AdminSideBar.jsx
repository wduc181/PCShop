import React from "react";
import { Users, Tag, Boxes, ShoppingBag, Clock } from "lucide-react";
import { Link } from "react-router";

const AdminSidebar = () => {
  const menu = [
    { name: "Người dùng", icon: <Users size={18} />, path: "/admin/users" },
    { name: "Danh mục", icon: <Tag size={18} />, path: "/admin/categories" },
    { name: "Nhãn hàng", icon: <Boxes size={18} />, path: "/admin/brands" },
    { name: "Sản phẩm", icon: <ShoppingBag size={18} />, path: "/admin/products" },
    { name: "Đơn hàng", icon: <Clock size={18} />, path: "/admin/orders" },
    { name: "Lịch sử đơn hàng", icon: <Clock size={18} />, path: "/admin/order-history" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-black text-white flex flex-col p-4 z-40">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
      <nav className="flex flex-col gap-2">
        {menu.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
