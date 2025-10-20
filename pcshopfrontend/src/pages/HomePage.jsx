import React from "react";
import OnSale from "@/components/HomePage/OnSale";
import Featured from "@/components/HomePage/Featured";
import Brands from "@/components/HomePage/Brands";
import MainLayout from "@/components/Layouts/MainLayout";

const HomePage = () => {
  return (
    <MainLayout>
      <div className="space-y-12">
        <div className="bg-black text-white rounded-xl shadow-lg p-6 mt-1">
          <OnSale />
        </div>

        <div className="bg-black text-white rounded-xl shadow-lg p-6 -mt-6">
          <Featured />
        </div>

        <div className="bg-black text-white rounded-xl shadow-lg p-6">
          <Brands />
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
