import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import OnSale from "@/components/HomePage/OnSale";
import Featured from "@/components/HomePage/Featured";
import Brands from "@/components/HomePage/Brands";

const HomePage = () => {
  return (
    <div className="min-h-screen w-full bg-[#fafafa] relative text-gray-900">
      {/* Diagonal Grid with Light */}
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

      {/* Layout chính */}
      <div className="min-h-screen flex flex-col relative z-10">
        {/* Header */}
        <Header />

        {/* Nội dung chia cột */}
<div className="flex flex-1 pt-12">
  {/* Sidebar */}
  <div className="h-[calc(100vh-3rem)] sticky top-12">
    <Sidebar />
  </div>

  {/* Main content */}
  <main className="flex-1 p-6 space-y-12 overflow-y-auto">
    {/* OnSale */}
    <div className="bg-black text-white rounded-xl shadow-lg p-6 mt-3">
      <OnSale />
    </div>

    {/* Featured */}
    <div className="bg-black text-white rounded-xl shadow-lg p-6">
      <Featured />
    </div>

    {/* Brands */}
    <div className="bg-black text-white rounded-xl shadow-lg p-6">
      <Brands />
    </div>
  </main>
</div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
