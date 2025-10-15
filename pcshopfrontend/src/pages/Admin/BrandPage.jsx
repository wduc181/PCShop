import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BrandFormDialog from "@/components/Admin/BrandFormDialog";
import {
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "@/services/brandService";
import { brandImageUrl } from "@/config/env";

const BrandPage = () => {
  const [brands, setBrands] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [brandData, setBrandData] = useState({
    name: "",
    description: "",
    logoUrl: null,
  });

  const fetchBrands = async () => {
    try {
      const data = await getAllBrands();
      setBrands(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async (id) => {
    if (!id) {
      alert("Không tìm thấy ID nhãn hàng để xóa!");
      return;
    }
    if (!window.confirm("Bạn có chắc muốn xóa nhãn hàng này không?")) return;

    try {
      await deleteBrand(id);
      alert("Đã xóa nhãn hàng thành công!");
      fetchBrands();
    } catch (error) {
      alert("Lỗi khi xóa nhãn hàng: " + error.message);
    }
  };

  const handleOpenAdd = () => {
    setEditMode(false);
    setBrandData({ name: "", description: "", logoUrl: null });
    setOpen(true);
  };

  const handleOpenEdit = (brand) => {
    if (!brand?.id) {
      console.error("Lỗi: brand.id bị undefined khi nhấn Sửa", brand);
      return;
    }

    setEditMode(true);
    setSelectedId(brand.id);
    setBrandData({
      name: brand.name,
      description: brand.description,
      logoUrl: null,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", brandData.name);
      formData.append("description", brandData.description);
      if (brandData.logoUrl) {
        formData.append("logoUrl", brandData.logoUrl);
      }

      if (editMode) {
        if (!selectedId) {
          alert("Không tìm thấy ID để cập nhật!");
          return;
        }
        await updateBrand(selectedId, formData);
        alert("Cập nhật nhãn hàng thành công!");
      } else {
        await createBrand(formData);
        alert("Thêm nhãn hàng thành công!");
      }

      setOpen(false);
      fetchBrands();
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  return (
    <AdminLayout>
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
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Quản lý Nhãn hàng</h1>
          <Button onClick={handleOpenAdd}>+ Thêm nhãn hàng</Button>
        </div>

        <Card className="shadow-md bg-white">
          <CardContent className="p-6 bg-white">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border bg-gray-100">Logo</th>
                  <th className="py-2 px-4 border bg-gray-100">Tên nhãn hàng</th>
                  <th className="py-2 px-4 border bg-gray-100">Mô tả</th>
                  <th className="py-2 px-4 border text-center bg-gray-100">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {brands.length === 0 ? (
                  <tr className="bg-white">
                    <td
                      colSpan="4"
                      className="text-center py-4 text-gray-500 italic bg-white"
                    >
                      Chưa có nhãn hàng nào.
                    </td>
                  </tr>
                ) : (
                  brands.map((brand) => (
                    <tr key={brand.id || Math.random()} className="border-b hover:bg-gray-50 bg-white">
                      <td className="py-2 px-4 border text-center bg-white">
                        {brand.logoUrl ? (
                          <img
                            src={brandImageUrl(brand.logoUrl)}
                            alt={brand.name}
                            className="w-16 h-16 object-contain mx-auto rounded"
                          />
                        ) : (
                          <span className="text-gray-400 italic">No image</span>
                        )}
                      </td>
                      <td className="py-2 px-4 border bg-white">{brand.name}</td>
                      <td className="py-2 px-4 border bg-white">{brand.description}</td>
                      <td className="py-2 px-4 border text-center space-x-2 bg-white">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEdit(brand)}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(brand.id)}
                        >
                          Xóa
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <BrandFormDialog
        open={open}
        setOpen={setOpen}
        brandData={brandData}
        setBrandData={setBrandData}
        onSubmit={handleSubmit}
        title={editMode ? "Cập nhật nhãn hàng" : "Thêm nhãn hàng mới"}
      />
    </AdminLayout>
  );
};

export default BrandPage;
