import React from "react";
import OnSale from "@/components/HomePage/OnSale";
import Featured from "@/components/HomePage/Featured";
import Brands from "@/components/HomePage/Brands";
import MainLayout from "@/components/Layouts/MainLayout";

const HomePage = () => {
  return (
    <MainLayout>
      <div className="space-y-12">
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
      </div>
    </MainLayout>
  );
};

export default HomePage;
