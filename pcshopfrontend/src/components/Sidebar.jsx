import React, { useEffect, useState } from "react";
import { List, ShoppingCart, User as UserIcon, LogOut } from "lucide-react";
import { Link } from "react-router";
import { getCategories } from "../services/categoryService";
import { Skeleton } from "./ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router";

const Sidebar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        if (!mounted) return;
        // Normalize to array of { id, name }
        const list = Array.isArray(data)
          ? data.map((c) => ({ id: c.id ?? c.category_id ?? c.ID, name: c.name ?? c.category_name ?? c.Name }))
          : [];
        setCategories(list.filter((c) => c && c.name));
      } catch (e) {
        console.error("Lỗi tải danh mục ở Sidebar:", e);
        if (mounted) setError("Không thể tải danh mục");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const toCategoryPath = (name) => `/category/${encodeURIComponent(name)}`;

  return (
    <aside
      className="bg-black text-white flex flex-col sticky top-[60px] w-full sm:w-64 md:w-72 lg:w-80 xl:w-96 h-[calc(100vh-60px)]"
    >
      {/* Cart */}
      <div className="shrink-0">
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
      </div>

      {/* Category list (scrollable) */}
  <div className="flex-1 min-h-0 overflow-y-auto">
        {loading && (
          <div className="mt-2 space-y-2 px-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full bg-gray-800" />)
            )}
          </div>
        )}
        {!loading && error && (
          <div className="px-6 py-3 text-sm text-red-400">{error}</div>
        )}
        {!loading && !error && (
          <nav className="flex flex-col mt-2">
            {categories.length === 0 ? (
              <div className="px-6 py-3 text-sm text-gray-400">
                Chưa có danh mục nào
              </div>
            ) : (
              categories.map((cat) => (
                <Link
                  key={cat.id ?? cat.name}
                  to={toCategoryPath(cat.name)}
                  className="px-6 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  {cat.name}
                </Link>
              ))
            )}
          </nav>
        )}
      </div>

      {/* Bottom user card or login */}
      <div className="px-6 py-3 border-t border-gray-700 shrink-0">
        {isAuthenticated ? (
          <div className="bg-gray-800 rounded-md px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                <UserIcon className="w-4 h-4 text-gray-300" />
              </div>
              <div className="text-sm font-medium truncate">
                {user?.fullname || user?.phoneNumber || "Người dùng"}
              </div>
            </div>
            <button
              onClick={() => {
                try { localStorage.removeItem("user_fullname"); } catch (_) {}
                logout();
                navigate("/users/auth", { replace: true });
              }}
              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white"
              title="Đăng xuất"
            >
              <LogOut className="w-3 h-3" />
              <span>Thoát</span>
            </button>
          </div>
        ) : (
          <Link
            to="/users/auth"
            className="block w-full py-2 text-center text-sm font-medium bg-gray-800 hover:bg-gray-700 rounded transition-colors"
          >
            Đăng nhập
          </Link>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
