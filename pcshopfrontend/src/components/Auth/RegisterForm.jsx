import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Lock, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { registerUser } from "@/services/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    phoneNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
    email: "",
    dateOfBirth: "",
    roleId: 2, // mặc định
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.fullname || !formData.phoneNumber || !formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ họ tên, số điện thoại, email và mật khẩu");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    // Map sang field BE yêu cầu
    const payload = {
      fullname: formData.fullname?.trim(),
      phone_number: formData.phoneNumber?.trim(),
      address: formData.address?.trim() || "",
      password: formData.password,
      confirm_password: formData.confirmPassword,
      email: formData.email?.trim(),
      date_of_birth: formData.dateOfBirth || null, // yyyy-MM-dd
      role_id: Number(formData.roleId) || 2,
    };

    try {
      setLoading(true);
      await registerUser(payload);
      toast.success("Đăng ký thành công. Vui lòng đăng nhập!");
      // Reset form và chuyển sang đăng nhập
      setFormData({
        fullname: "",
        phoneNumber: "",
        address: "",
        password: "",
        confirmPassword: "",
        email: "",
        dateOfBirth: "",
        roleId: 2,
      });
      // Điều hướng về trang auth (tab đăng nhập), nếu đang ở trang khác
      navigate("/users/auth", { replace: true });
    } catch (err) {
      const msg = Array.isArray(err?.message)
        ? err.message.join(", ")
        : (err?.message || "Đăng ký thất bại");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Fullname */}
      <div className="flex items-center border rounded-md px-3">
        <User className="w-5 h-5 mr-2 text-gray-500" />
        <Input
          name="fullname"
          type="text"
          placeholder="Họ và tên"
          value={formData.fullname}
          onChange={handleChange}
          className="border-0 focus-visible:ring-0"
          autoComplete="name"
        />
      </div>

      {/* Phone number */}
      <div className="flex items-center border rounded-md px-3">
        <Phone className="w-5 h-5 mr-2 text-gray-500" />
        <Input
          name="phoneNumber"
          type="tel"
          inputMode="numeric"
          autoComplete="username"
          placeholder="Số điện thoại"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="border-0 focus-visible:ring-0"
        />
      </div>

      {/* Address */}
      <div className="flex items-center border rounded-md px-3">
        <MapPin className="w-5 h-5 mr-2 text-gray-500" />
        <Input
          name="address"
          type="text"
          placeholder="Địa chỉ"
          value={formData.address}
          onChange={handleChange}
          className="border-0 focus-visible:ring-0"
          autoComplete="street-address"
        />
      </div>

      {/* Email */}
      <div className="flex items-center border rounded-md px-3">
        <Mail className="w-5 h-5 mr-2 text-gray-500" />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border-0 focus-visible:ring-0"
          autoComplete="email"
        />
      </div>

      {/* Date of Birth */}
      <div className="flex items-center border rounded-md px-3">
        <Calendar className="w-5 h-5 mr-2 text-gray-500" />
        <Input
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          className="border-0 focus-visible:ring-0"
        />
      </div>

      {/* Password */}
      <div className="flex items-center border rounded-md px-3">
        <Lock className="w-5 h-5 mr-2 text-gray-500" />
        <Input
          name="password"
          type="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          className="border-0 focus-visible:ring-0"
          autoComplete="new-password"
        />
      </div>

      {/* Confirm Password */}
      <div className="flex items-center border rounded-md px-3">
        <Lock className="w-5 h-5 mr-2 text-gray-500" />
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Nhập lại mật khẩu"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="border-0 focus-visible:ring-0"
          autoComplete="new-password"
        />
      </div>

      {error && (
        <div className="text-sm text-red-600" role="alert">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Đang đăng ký..." : "Đăng kí"}
      </Button>
    </form>
  );
};

export default RegisterForm;
