import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "../Admin/AdminSideBar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      <div className="flex flex-col w-full ml-64">
        <Header />
        <main className="flex-1 p-6 mt-16">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
