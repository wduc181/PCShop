import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CustomPagination from "@/components/ProductsPages/CustomPagination";
import { apiRequest } from "@/services/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const AdminBrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [page, setPage] = useState(1);
  const [brandsPerPage] = useState(5);

  const [open, setOpen] = useState(false);
  const [newBrand, setNewBrand] = useState({
    name: "",
    description: "",
    logoUrl: null,
  });

  const fetchBrands = async () => {
    try {
      const data = await apiRequest("/brands");
      setBrands(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa nhãn hàng này không?")) return;
    try {
      await apiRequest(`/brands/${id}`, { method: "DELETE" });
      fetchBrands();
    } catch (error) {
      alert("Lỗi khi xóa nhãn hàng: " + error.message);
    }
  };

  const handleAddBrand = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newBrand.name);
      formData.append("description", newBrand.description);
      formData.append("logoUrl", newBrand.logoUrl);

      const token = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJwaG9uZU51bWJlciI6IjAwMDAwMDAwMDIiLCJzdWIiOiIwMDAwMDAwMDAyIiwiZXhwIjoxNzYyMDEzNTk3fQ.vPZfRfIzax_gHIJZ9r_MsbAZqW_KRW26stKs3jQRw1U"; // token admin
      const response = await fetch("http://localhost:8088/api/ver1/brands", {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (!response.ok) throw new Error(await response.text());
      alert("Thêm nhãn hàng thành công!");
      setOpen(false);
      setNewBrand({ name: "", description: "", logoUrl: null });
      fetchBrands();
    } catch (error) {
      alert("Lỗi khi thêm nhãn hàng: " + error.message);
    }
  };

  const indexOfLast = page * brandsPerPage;
  const indexOfFirst = indexOfLast - brandsPerPage;
  const currentBrands = brands.slice(indexOfFirst, indexOfLast);

  return (
    <AdminLayout>
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Quản lý Nhãn hàng</h1>
          <Button onClick={() => setOpen(true)}>+ Thêm nhãn hàng</Button>
        </div>

        <Card className="shadow-md">
          <CardContent>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border">Logo</th>
                  <th className="py-2 px-4 border">Tên nhãn hàng</th>
                  <th className="py-2 px-4 border">Mô tả</th>
                  <th className="py-2 px-4 border text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentBrands.map((brand, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 border text-center">
                      {brand.logoUrl ? (
                        <img
                          src={`http://localhost:8088/uploads/brands/${brand.logoUrl}`}
                          alt={brand.name}
                          className="w-16 h-16 object-contain mx-auto rounded"
                        />
                      ) : (
                        <span className="text-gray-400 italic">No image</span>
                      )}
                    </td>
                    <td className="py-2 px-4 border">{brand.name}</td>
                    <td className="py-2 px-4 border">{brand.description}</td>
                    <td className="py-2 px-4 border text-center space-x-2">
                      <Button variant="outline" size="sm">
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
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <div className="mt-4 flex justify-center">
          <CustomPagination
            totalItems={brands.length}
            itemsPerPage={brandsPerPage}
            currentPage={page}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Modal thêm nhãn hàng */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm nhãn hàng mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-3">
            <Input
              type="text"
              placeholder="Tên nhãn hàng"
              value={newBrand.name}
              onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
            />
            <Textarea
              placeholder="Mô tả nhãn hàng"
              value={newBrand.description}
              onChange={(e) =>
                setNewBrand({ ...newBrand, description: e.target.value })
              }
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewBrand({ ...newBrand, logoUrl: e.target.files[0] })
              }
            />
            <Button onClick={handleAddBrand} className="w-full">
              Lưu
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminBrandsPage;
