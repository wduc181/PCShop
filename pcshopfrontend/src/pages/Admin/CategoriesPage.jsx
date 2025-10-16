import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../services/categoryService";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({ id: null, name: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : data?.categories || []);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (isEditing && category.id) {
        await updateCategory(category.id, {
          name: category.name,
          description: category.description,
        });
      } else {
        await createCategory({
          name: category.name,
          description: category.description,
        });
      }
      await loadCategories();
      setCategory({ id: null, name: "", description: "" });
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi lưu danh mục:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setCategory(cat);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      setLoading(true);
      await deleteCategory(id);
      await loadCategories();
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <AdminLayout>
        {/* Nền caro */}
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
        <main className="relative z-10 flex-1 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Quản lý Danh mục</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 items-start">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle>{isEditing ? "Cập nhật danh mục" : "Thêm danh mục mới"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Tên danh mục</label>
                    <Input
                      placeholder="Ví dụ: CPU, VGA..."
                      value={category.name}
                      onChange={(e) => setCategory({ ...category, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Mô tả</label>
                    <Input
                      placeholder="Mô tả ngắn"
                      value={category.description}
                      onChange={(e) => setCategory({ ...category, description: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Button type="submit" disabled={loading}>
                      {isEditing ? "Cập nhật" : "Thêm mới"}
                    </Button>
                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setCategory({ id: null, name: "", description: "" });
                          setIsEditing(false);
                        }}
                      >
                        Hủy
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Danh sách */}
            <Card>
              <CardHeader>
                <CardTitle>Danh sách danh mục</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent>
                <div className="rounded-md border bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                            Đang tải dữ liệu...
                          </TableCell>
                        </TableRow>
                      ) : categories.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                            Chưa có danh mục nào
                          </TableCell>
                        </TableRow>
                      ) : (
                        categories.map((cat) => (
                          <TableRow key={cat.id}>
                            <TableCell className="font-medium">{cat.name}</TableCell>
                            <TableCell>{cat.description}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleEdit(cat)}>
                                  Sửa
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(cat.id)}>
                                  Xóa
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </AdminLayout>
  );
};

export default CategoryPage;
