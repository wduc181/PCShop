import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Lock } from "lucide-react";
import { useNavigate } from "react-router";
import { loginUser } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

// Debug helper: only logs in development
const dbg = (...args) => {
  try {
    if (import.meta?.env?.DEV) console.log("[LoginForm]", ...args);
  } catch (_) {
    // ignore
  }
};

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, isAdmin } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!phoneNumber || !password) {
      setError("Vui lòng nhập đầy đủ số điện thoại và mật khẩu");
      return;
    }

    try {
      setLoading(true);
      dbg("Submit start", { phoneNumber, pwLen: password.length });
      dbg("Calling loginUser API...");
      const token = await loginUser({ phoneNumber, password });
      dbg("API responded, token type:", typeof token);
      if (!token) throw new Error("Token không hợp lệ");
      login(token);
      dbg("Token saved to AuthContext");
      toast.success("Đăng nhập thành công");
      // Điều hướng theo vai trò (dựa trên token vừa nhận để tránh race-condition)
      const parts = String(token).split(".");
      let adminNow = false;
      if (parts.length >= 2) {
        try {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
          const phone = payload?.phoneNumber || payload?.sub || null;
          let roles = payload?.roles || payload?.authorities || payload?.scope || [];
          if (typeof roles === "string") roles = roles.split(/\s|,/).filter(Boolean);
          if (!Array.isArray(roles)) roles = [];
          const adminByRole = roles.some((r) => String(r).toUpperCase().includes("ADMIN"));
          const adminByPhone = phone === "000000001";
          adminNow = adminByRole || adminByPhone;
        } catch (_) {
          // swallow
        }
      }
      if (adminNow || isAdmin) {
        dbg("Admin detected, navigating to /admin/categories");
        navigate("/admin/categories", { replace: true });
      } else {
        dbg("Navigating to /");
        navigate("/", { replace: true });
      }
    } catch (err) {
      const msg = err?.message || "Đăng nhập thất bại";
      setError(msg);
      toast.error(msg);
      console.error("[LoginForm] Login error:", err);
    } finally {
      setLoading(false);
      dbg("Submit finished");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="flex items-center border rounded-md px-3">
        <User className="w-5 h-5 mr-2 text-gray-500" />
        <Input
          type="tel"
          inputMode="numeric"
          autoComplete="username"
          placeholder="Số điện thoại"
          className="border-0 focus-visible:ring-0"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div className="flex items-center border rounded-md px-3">
        <Lock className="w-5 h-5 mr-2 text-gray-500" />
        <Input
          type="password"
          autoComplete="current-password"
          placeholder="Mật khẩu"
          className="border-0 focus-visible:ring-0"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && (
        <div className="text-sm text-red-600" role="alert">
          {error}
        </div>
      )}

      <Button className="w-full" type="submit" disabled={loading}>
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>
    </form>
  );
};

export default LoginForm;
