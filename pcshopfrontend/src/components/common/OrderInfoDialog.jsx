import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const OrderInfoDialog = ({
  open,
  onOpenChange,
  form,
  setForm,
  saving = false,
  onSave,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sửa thông tin nhận hàng</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Họ tên</label>
            <Input value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm text-gray-600">Số điện thoại</label>
            <Input value={form.phoneNumber} onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm text-gray-600">Địa chỉ giao</label>
            <Input value={form.shippingAddress} onChange={(e) => setForm((f) => ({ ...f, shippingAddress: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Ghi chú</label>
            <Input value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm text-gray-600">Phương thức thanh toán</label>
            <Input value={form.paymentMethod} onChange={(e) => setForm((f) => ({ ...f, paymentMethod: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm text-gray-600">Vận chuyển</label>
            <Input value={form.shippingMethod} onChange={(e) => setForm((f) => ({ ...f, shippingMethod: e.target.value }))} />
          </div>
          {/* Status editing removed as requested */}
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Hủy</Button>
          <Button onClick={onSave} disabled={saving}>{saving ? "Đang lưu..." : "Lưu thay đổi"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderInfoDialog;
