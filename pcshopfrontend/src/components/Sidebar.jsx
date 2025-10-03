import React from "react";
import { List, ShoppingCart } from "lucide-react";
import { Link } from "react-router";

const categories = [
  "PC Gaming - Máy tính chơi game",
  "PC Workstation",
  "PC Văn Phòng",
  "PC AMD Gaming",
  "PC Core Ultra",
  "PC Giả Lập - Ảo Hóa",
  "Linh kiện máy tính",
  "Màn hình",
  "Gaming Gear",
  "Giá Treo Màn Hình",
];

const Sidebar = () => {
  return (
    <aside className="w-96 bg-black text-white flex flex-col justify-between h-[calc(100vh-60px)] sticky top-[60px]">
      <div>
        {/* Giỏ hàng */}
        <Link
          to="/cart-items"
          className="flex items-center gap-2 px-4 py-2 mx-6 my-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Giỏ hàng</span>
        </Link>

        {/* Header danh mục */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-700">
          <List className="w-4 h-4" />
          <span className="uppercase font-semibold tracking-wide text-sm">
            Danh mục sản phẩm
          </span>
        </div>

        {/* Category list */}
        <nav className="flex flex-col mt-2">
          {categories.map((cat, index) => (
            <a
              key={index}
              href="#"
              className="px-6 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              {cat}
            </a>
          ))}
        </nav>
      </div>

      {/* Bottom login */}
      <div className="px-6 py-4 border-t border-gray-700">
        <Link
          to="/users/auth"
          className="block w-full py-2 text-center text-sm font-medium bg-gray-800 hover:bg-gray-700 rounded transition-colors"
        >
          Đăng nhập
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
