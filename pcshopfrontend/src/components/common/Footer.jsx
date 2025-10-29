import React from "react";
import { Phone, Mail, Megaphone, CreditCard, Shield, Wrench, RefreshCcw, FileText } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cột 1 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Về PCShop</h2>
          <p className="text-sm leading-relaxed mb-3">
            Trang bán PC, thiết bị linh kiện máy tính uy tín. Luôn tìm kiếm sản
            phẩm vì người tiêu dùng.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={16} /> SDT: 0000 000 000
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> Email: abc@xyz.com
            </li>
            <li className="flex items-center gap-2">
              <Megaphone size={16} /> Liên hệ quảng cáo: 1111 1111 1111
            </li>
          </ul>
        </div>

        {/* Cột 2 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Tài khoản ngân hàng</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CreditCard size={16} /> 0123456789 - WWBank
            </li>
            <li className="flex items-center gap-2">
              <CreditCard size={16} /> Phương thức thanh toán
            </li>
          </ul>
        </div>

        {/* Cột 3 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Chính sách & Điều khoản</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Shield size={16} /> Chính Sách Bảo Mật
            </li>
            <li className="flex items-center gap-2">
              <Wrench size={16} /> Qui Định Bảo Hành
            </li>
            <li className="flex items-center gap-2">
              <RefreshCcw size={16} /> Chính Sách Đổi Trả
            </li>
            <li className="flex items-center gap-2">
              <FileText size={16} /> Điều khoản sử dụng
            </li>
          </ul>
        </div>
      </div>

      {/* Dòng cuối */}
      <div className="mt-10 text-center text-xs text-gray-400 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} PCShop. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
