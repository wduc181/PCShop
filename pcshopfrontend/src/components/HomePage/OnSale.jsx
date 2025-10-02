import React from "react";
import { ChevronLeft, ChevronRight, Percent } from "lucide-react";

const OnSale = () => {
  return (
    <div className="bg-black text-white py-8 px-4 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Percent className="w-6 h-6 text-red-500" />
          KHUYẾN MÃI
        </h2>
        <div className="flex gap-2">
          <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Slider content (placeholder cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-gray-900 rounded-lg shadow-md p-4 animate-pulse"
          >
            <div className="bg-gray-700 h-32 mb-4 rounded" />
            <div className="h-4 bg-gray-700 mb-2 rounded" />
            <div className="h-4 bg-gray-700 w-2/3 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnSale;
