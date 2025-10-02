import React, { useEffect, useState } from "react";

const brands = [
  { id: 1, name: "Asus", logo: "/brands/asus.png", link: "/brands/asus" },
  { id: 2, name: "MSI", logo: "/brands/msi.png", link: "/brands/msi" },
  { id: 3, name: "Gigabyte", logo: "/brands/gigabyte.png", link: "/brands/gigabyte" },
  { id: 4, name: "Intel", logo: "/brands/intel.png", link: "/brands/intel" },
  { id: 5, name: "AMD", logo: "/brands/amd.png", link: "/brands/amd" },
];

const Brands = () => {
  const [index, setIndex] = useState(0);

  // Auto change every 3s
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % brands.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-6">Nhãn hàng</h2>

      {/* Carousel */}
      <div className="flex justify-center gap-6">
        {brands.map((brand, i) => (
          <a
            key={brand.id}
            href={brand.link}
            className={`transition-opacity duration-500 ${
              i === index ? "opacity-100" : "opacity-20"
            }`}
          >
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-16 object-contain"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default Brands;
