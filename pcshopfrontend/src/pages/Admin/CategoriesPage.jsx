import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/Layouts/AdminLayout";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({ id: null, name: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
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
    }
  };

  const handleEdit = (cat) => {
    setCategory(cat);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      await deleteCategory(id);
      await loadCategories();
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
    }
  };

  return (
      <AdminLayout>
        <main className="flex-1 p-8">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">
            Quản lý Danh mục
          </h2>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-2xl shadow-md mb-8 w-full max-w-xl"
          >
            <div className="mb-4">
              <label className="block font-semibold mb-2">Tên danh mục</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                value={category.name}
                onChange={(e) =>
                  setCategory({ ...category, name: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">Mô tả</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                value={category.description}
                onChange={(e) =>
                  setCategory({ ...category, description: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              {isEditing ? "Cập nhật" : "Thêm mới"}
            </button>

            {isEditing && (
              <button
                type="button"
                className="ml-4 text-gray-600 underline"
                onClick={() =>
                  setCategory({ id: null, name: "", description: "" }) ||
                  setIsEditing(false)
                }
              >
                Hủy
              </button>
            )}
          </form>

          {/* Bảng danh sách */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Danh sách danh mục</h3>
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-3">Tên</th>
                  <th className="border p-3">Mô tả</th>
                  <th className="border p-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      Chưa có danh mục nào
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50">
                      <td className="border p-3">{cat.name}</td>
                      <td className="border p-3">{cat.description}</td>
                      <td className="border p-3 text-center">
                        <button
                          className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 mr-2"
                          onClick={() => handleEdit(cat)}
                        >
                          Sửa
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                          onClick={() => handleDelete(cat.id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </AdminLayout>
  );
};

export default CategoryPage;
