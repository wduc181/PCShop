import React from "react";
import { Star } from "lucide-react";

const Featured = () => {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500" />
          TOP SẢN PHẨM BÁN CHẠY
        </h2>
      </div>

      {/* Placeholder grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-lg h-40 flex items-center justify-center text-gray-500"
          >
            Product {i}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Featured;
