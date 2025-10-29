import React, { useEffect, useState } from "react";
import { List, ShoppingCart, User as UserIcon, Menu } from "lucide-react";
import { Link } from "react-router";
import { getCategories } from "../../services/categoryService";
import { Skeleton } from "../ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { toast } from "sonner";
import { updateUserInfo, getUser } from "@/services/userService";
import { changePassword } from "@/services/auth";

const Sidebar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Popover + dialogs state
  const [saving, setSaving] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);

  // User info fetched from backend for popover display
  const [accountUser, setAccountUser] = useState(null);
  const [accountLoading, setAccountLoading] = useState(false);

  // Edit info form state
  const toDateInputValue = (v) => {
    if (!v) return "";
    if (typeof v === "string") return v.split("T")[0] || v;
    const d = new Date(v);
    if (isNaN(d)) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  const [infoForm, setInfoForm] = useState({
    fullname: "",
    email: "",
    address: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    // Prefill form when edit info dialog opens (prefer server-fetched accountUser)
    if (infoOpen) {
      const src = accountUser ?? user;
      setInfoForm({
        fullname: src?.fullName ?? src?.fullname ?? "",
        email: src?.email ?? "",
        address: src?.address ?? "",
        dateOfBirth: toDateInputValue(src?.dateOfBirth ?? src?.date_of_birth),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoOpen]);

  // Load current user info from API once authenticated
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!isAuthenticated) {
        setAccountUser(null);
        return;
      }
      try {
        setAccountLoading(true);
        const data = await getUser();
        if (!alive) return;
        setAccountUser(data);
      } catch (e) {
        // Silent fail; we will fallback to context user in UI
        console.warn("Không thể tải thông tin người dùng:", e);
      } finally {
        if (alive) setAccountLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        if (!mounted) return;
        // Normalize to array of { id, name } supporting both array or wrapped object
        const raw = Array.isArray(data) ? data : (data?.categories || []);
        const list = raw.map((c) => ({
          id: c.id ?? c.category_id ?? c.ID,
          name: c.name ?? c.category_name ?? c.Name,
        }));
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

  // Generate slug path to be consistent with ProductsByCategoryPage resolver
  const slugify = (s = "") =>
    s
      .toString()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  const toCategoryPath = (name) => `/category/${slugify(name)}`;

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
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link
                  to="/admin/orders"
                  className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white"
                >
                  Trang admin
                </Link>
              )}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    title="Tài khoản"
                    className="bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    <Menu className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-72 p-3">
                  <div className="mb-3 text-sm">
                    {accountLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-40" />
                        <Skeleton className="h-3 w-56" />
                      </div>
                    ) : (
                      <>
                        <div className="font-medium truncate">
                          {accountUser?.fullName ?? accountUser?.fullname ?? user?.fullName ?? user?.fullname ?? "Người dùng"}
                        </div>
                        <div className="text-gray-400 truncate">
                          {accountUser?.phoneNumber ?? accountUser?.phone_number ?? user?.phoneNumber ?? "-"}
                        </div>
                        <div className="text-gray-400 truncate">
                          {accountUser?.email ?? user?.email ?? "-"}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Button size="sm" onClick={() => navigate("/orders")}>Đơn đã đặt</Button>
                    <Button size="sm" variant="outline" onClick={() => setInfoOpen(true)}>Đổi thông tin</Button>
                    <Button size="sm" variant="outline" onClick={() => setPwOpen(true)}>Đổi mật khẩu</Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        try { localStorage.removeItem("user_fullname"); } catch (_) {}
                        logout();
                        navigate("/users/auth", { replace: true });
                      }}
                    >
                      Đăng xuất
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
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
      {/* Edit Info Dialog */}
      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đổi thông tin</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Họ tên</label>
              <Input value={infoForm.fullname} onChange={(e) => setInfoForm((f) => ({ ...f, fullname: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={infoForm.email} onChange={(e) => setInfoForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium">Địa chỉ</label>
              <Input value={infoForm.address} onChange={(e) => setInfoForm((f) => ({ ...f, address: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium">Ngày sinh</label>
              <Input type="date" value={infoForm.dateOfBirth} onChange={(e) => setInfoForm((f) => ({ ...f, dateOfBirth: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button
              onClick={async () => {
                if (!infoForm.email?.trim()) {
                  toast.error("Email là bắt buộc");
                  return;
                }
                try {
                  setSaving(true);
                  await updateUserInfo({
                    // id có thể thiếu, service sẽ tự lấy từ token
                    id: user?.id,
                    fullname: infoForm.fullname,
                    email: infoForm.email,
                    address: infoForm.address,
                    dateOfBirth: infoForm.dateOfBirth || undefined,
                  });
                  toast.success("Cập nhật thông tin thành công");
                    // Refresh account info to reflect changes in popover
                    try {
                      const refreshed = await getUser();
                      setAccountUser(refreshed);
                    } catch (_) {}
                  setInfoOpen(false);
                } catch (err) {
                  toast.error(err?.message || "Cập nhật thất bại");
                } finally {
                  setSaving(false);
                }
              }}
              disabled={saving}
            >
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={pwOpen} onOpenChange={setPwOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đổi mật khẩu</DialogTitle>
          </DialogHeader>
          <ChangePasswordForm
            onCancel={() => setPwOpen(false)}
            onDone={() => { setPwOpen(false); toast.success("Đổi mật khẩu thành công"); }}
          />
        </DialogContent>
      </Dialog>
    </aside>
  );
};

export default Sidebar;

// Inline component: Change Password Form
const ChangePasswordForm = ({ onCancel, onDone }) => {
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!oldPw || !newPw) {
      toast.error("Vui lòng nhập đủ mật khẩu cũ và mới");
      return;
    }
    if (newPw !== confirmPw) {
      toast.error("Mật khẩu mới và nhập lại không khớp");
      return;
    }
    try {
      setSubmitting(true);
      await changePassword({ password: oldPw, newPassword: newPw, confirmNewPassword: confirmPw });
      setOldPw(""); setNewPw(""); setConfirmPw("");
      onDone?.();
    } catch (err) {
      toast.error(err?.message || "Đổi mật khẩu thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">Mật khẩu hiện tại</label>
        <Input type="password" value={oldPw} onChange={(e) => setOldPw(e.target.value)} />
      </div>
      <div>
        <label className="text-sm font-medium">Mật khẩu mới</label>
        <Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
      </div>
      <div>
        <label className="text-sm font-medium">Nhập lại mật khẩu mới</label>
        <Input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Hủy</Button>
        <Button onClick={handleSubmit} disabled={submitting}>Đổi mật khẩu</Button>
      </DialogFooter>
    </div>
  );
};
