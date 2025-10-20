import React, { useMemo, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router";
import { createOrderFromCart } from "@/services/OrderService";
import { toast } from "sonner";

const fieldCls = "w-full";
const labelCls = "text-sm font-medium text-gray-700";

const defaultOrder = (preset = {}) => ({
	fullName: preset.fullName || "",
	email: preset.email || "",
	phoneNumber: preset.phoneNumber || "",
	shippingAddress: preset.shippingAddress || "",
	note: preset.note || "",
	paymentMethod: preset.paymentMethod || "COD",
	shippingMethod: preset.shippingMethod || "STANDARD",
});

const ConfirmOrderDialog = ({ open, onOpenChange, userId }) => {
	const navigate = useNavigate();
	const location = useLocation();

	const preset = useMemo(() => {
		let fullname = null;
		let phone = null;
		let email = null;
		try {
			fullname = localStorage.getItem("user_fullname") || "";
		} catch (_) {}
		// Minimal presets; backend uses phoneNumber as username, but not stored here by default
		return { fullName: fullname, phoneNumber: phone || "", email: email || "" };
	}, []);

	const [data, setData] = useState(() => defaultOrder(preset));
	const [submitting, setSubmitting] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setData((prev) => ({ ...prev, [name]: value }));
	};

	const validate = () => {
		if (!data.fullName?.trim()) return "Vui lòng nhập họ tên";
		if (!data.phoneNumber?.trim()) return "Vui lòng nhập số điện thoại";
		if (!data.shippingAddress?.trim()) return "Vui lòng nhập địa chỉ giao hàng";
		if (!data.paymentMethod?.trim()) return "Vui lòng chọn phương thức thanh toán";
		if (!data.shippingMethod?.trim()) return "Vui lòng chọn phương thức vận chuyển";
		return null;
	};

	const submit = async () => {
		const err = validate();
		if (err) {
			toast.error(err);
			return;
		}
		if (!userId) {
			toast.error("Không xác định được tài khoản. Vui lòng đăng nhập lại.");
			return;
		}
		try {
			setSubmitting(true);
			await createOrderFromCart(userId, data);
			toast.success("Đặt hàng thành công");
			onOpenChange?.(false);
			// Điều hướng tới OrdersPage; giữ nguyên query uid nếu đang có
			const params = new URLSearchParams(location.search);
			const qUid = params.get("uid");
			const to = qUid ? `/orders?uid=${encodeURIComponent(qUid)}` : "/orders";
			navigate(to, { replace: true });
		} catch (e) {
			console.error("Create order failed:", e);
			toast.error(e?.message || "Đặt hàng thất bại");
		} finally {
			setSubmitting(false);
		}
	};

	const onClose = (v) => {
		if (submitting) return; // prevent closing while submitting
		onOpenChange?.(v);
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>Xác nhận đặt hàng</DialogTitle>
					<DialogDescription>
						Vui lòng nhập thông tin để tạo đơn hàng. Những mục có dấu * là bắt buộc.
					</DialogDescription>
				</DialogHeader>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<label className={labelCls} htmlFor="fullName">Họ tên*</label>
						<Input id="fullName" name="fullName" className={fieldCls} value={data.fullName} onChange={handleChange} />
					</div>
					<div className="space-y-2">
						<label className={labelCls} htmlFor="phoneNumber">Số điện thoại*</label>
						<Input id="phoneNumber" name="phoneNumber" className={fieldCls} value={data.phoneNumber} onChange={handleChange} />
					</div>
					<div className="space-y-2 md:col-span-2">
						<label className={labelCls} htmlFor="email">Email</label>
						<Input id="email" name="email" type="email" className={fieldCls} value={data.email} onChange={handleChange} />
					</div>
					<div className="space-y-2 md:col-span-2">
						<label className={labelCls} htmlFor="shippingAddress">Địa chỉ giao hàng*</label>
						<textarea
							id="shippingAddress"
							name="shippingAddress"
							className="w-full rounded-md border px-3 py-2 text-sm"
							rows={2}
							value={data.shippingAddress}
							onChange={handleChange}
						/>
					</div>
					<div className="space-y-2">
						<label className={labelCls} htmlFor="paymentMethod">Thanh toán*</label>
						<select
							id="paymentMethod"
							name="paymentMethod"
							className="w-full rounded-md border px-3 py-2 text-sm bg-white"
							value={data.paymentMethod}
							onChange={handleChange}
						>
							<option value="COD">Thanh toán khi nhận hàng (COD)</option>
							<option value="BANK_TRANSFER">Chuyển khoản</option>
							<option value="MOMO">Ví MoMo</option>
						</select>
					</div>
					<div className="space-y-2">
						<label className={labelCls} htmlFor="shippingMethod">Vận chuyển*</label>
						<select
							id="shippingMethod"
							name="shippingMethod"
							className="w-full rounded-md border px-3 py-2 text-sm bg-white"
							value={data.shippingMethod}
							onChange={handleChange}
						>
							<option value="STANDARD">Tiêu chuẩn</option>
							<option value="EXPRESS">Hỏa tốc</option>
						</select>
					</div>
					<div className="space-y-2 md:col-span-2">
						<label className={labelCls} htmlFor="note">Ghi chú</label>
						<textarea
							id="note"
							name="note"
							className="w-full rounded-md border px-3 py-2 text-sm"
							rows={2}
							value={data.note}
							onChange={handleChange}
						/>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange?.(false)} disabled={submitting}>
						Hủy
					</Button>
					<Button onClick={submit} disabled={submitting}>
						{submitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ConfirmOrderDialog;

