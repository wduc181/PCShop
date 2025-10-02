import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Lock, Mail, Phone, MapPin, Calendar } from "lucide-react";

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data gửi BE:", formData);
    // TODO: gọi API register ở đây (axios/fetch)
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
        />
      </div>

      {/* Phone number */}
      <div className="flex items-center border rounded-md px-3">
        <Phone className="w-5 h-5 mr-2 text-gray-500" />
        <Input
          name="phoneNumber"
          type="text"
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
        />
      </div>

      <Button type="submit" className="w-full">
        Đăng kí
      </Button>
    </form>
  );
};

export default RegisterForm;
