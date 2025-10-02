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
    <aside className="w-96 bg-black text-white flex flex-col justify-between h-[calc(100vh-48px)]">
      <div>
        {/* Giỏ hàng */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800">
          <ShoppingCart size={24} />
          <span className="font-semibold">Giỏ hàng</span>
        </div>

        {/* Header danh mục */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-700">
          <List size={20} />
          <span className="uppercase font-semibold tracking-wide text-100">
            Danh mục sản phẩm
          </span>
        </div>

        {/* Category list */}
        <nav className="flex flex-col mt-2">
          {categories.map((cat, index) => (
            <a
              key={index}
              href="#"
              className="px-6 py-2 text-100 hover:bg-gray-700 hover:text-white transition-colors"
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
          className="block w-full py-2 text-center font-medium bg-gray-800 hover:bg-gray-700 rounded"
        >
          Đăng nhập
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
