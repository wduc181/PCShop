import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Lock } from "lucide-react";

const LoginForm = () => {
  return (
    <form className="space-y-4">
      <div className="flex items-center border rounded-md px-3">
        <User className="w-5 h-5 mr-2 text-gray-500" />
        <Input type="email" placeholder="Số điện thoại" className="border-0 focus-visible:ring-0" />
      </div>
      <div className="flex items-center border rounded-md px-3">
        <Lock className="w-5 h-5 mr-2 text-gray-500" />
        <Input type="password" placeholder="Mật khẩu" className="border-0 focus-visible:ring-0" />
      </div>
      <Button className="w-full">Đăng nhập</Button>
    </form>
  );
};

export default LoginForm;
