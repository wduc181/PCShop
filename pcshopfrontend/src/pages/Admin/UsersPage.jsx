import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/Layouts/AdminLayout";
import AdminTable from "@/components/Admin/AdminTable";
import AdminPagination from "@/components/Admin/AdminPagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { getUsers, updateUserInfo } from "@/services/userService";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ fullname: "", email: "", address: "", dateOfBirth: "" });

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

  useEffect(() => {
    const fetchUsersFx = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getUsers({ page, limit });
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Lỗi khi tải danh sách người dùng:", err);
        setError(err?.message || "Không thể tải người dùng");
        toast.error(err?.message || "Không thể tải người dùng");
      } finally {
        setLoading(false);
      }
    };
    fetchUsersFx();
  }, [page]);

  const handleEdit = (id) => {
    const u = users.find((x) => x.id === id);
    if (!u) return;
    setEditingUser(u);
    setForm({
      fullname: u.fullName || "",
      email: u.email || "",
      address: u.address || "",
      dateOfBirth: toDateInputValue(u.dateOfBirth),
    });
    setEditOpen(true);
  };

  const handleSubmitEdit = async () => {
    if (!editingUser) return;
    try {
      const payload = {
        id: editingUser.id,
        fullname: form.fullname?.trim() || "",
        email: form.email?.trim() || "",
        address: form.address?.trim() || "",
        dateOfBirth: form.dateOfBirth || undefined,
      };
      if (!payload.email) {
        toast.error("Email là bắt buộc");
        return;
      }
      const updated = await updateUserInfo(payload);
      setUsers((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      toast.success("Cập nhật người dùng thành công");
      setEditOpen(false);
      setEditingUser(null);
    } catch (err) {
      toast.error(err?.message || "Cập nhật thất bại");
    }
  };

  return (
    <AdminLayout>
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.05) 0, rgba(0, 0, 0, 0.05) 1px, transparent 1px, transparent 20px),
            repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.05) 0, rgba(0, 0, 0, 0.05) 1px, transparent 1px, transparent 20px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Người dùng</h1>
        </div>

        <AdminTable
          columns={[
            "ID",
            "Họ tên",
            "Email",
            "Số điện thoại",
            "Địa chỉ",
            "Ngày sinh",
            "Vai trò",
            "Ngày tạo",
          ]}
          data={users.map((u) => ({
            id: u.id,
            fullName: u.fullName,
            email: u.email,
            phoneNumber: u.phoneNumber,
            address: u.address,
            dateOfBirth: toDateInputValue(u.dateOfBirth),
            role: u.authority || "USER",
            createdAt: u.createdAt ? new Date(u.createdAt).toLocaleString("vi-VN") : "",
          }))}
          onEdit={handleEdit}
          actionHeader="Hành động"
          renderActions={(item) => (
            <Button variant="outline" size="sm" onClick={() => handleEdit(item.id)}>
              Sửa
            </Button>
          )}
        />

        <div className="mt-4">
          <AdminPagination
            currentPage={page}
            totalPages={5}
            onPageChange={setPage}
          />
        </div>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div>
                <label className="text-sm font-medium">Họ tên</label>
                <Input
                  value={form.fullname}
                  onChange={(e) => setForm((f) => ({ ...f, fullname: e.target.value }))}
                  placeholder="Nhập họ tên"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="name@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Địa chỉ</label>
                <Input
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  placeholder="Địa chỉ"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Ngày sinh</label>
                <Input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Hủy</Button>
              </DialogClose>
              <Button onClick={handleSubmitEdit} disabled={loading}>Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default UsersPage;
