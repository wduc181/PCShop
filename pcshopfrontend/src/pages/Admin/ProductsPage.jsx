import React, { useEffect, useState, useRef } from "react";
import AdminLayout from "@/components/Layouts/AdminLayout";
import AdminTable from "@/components/Admin/AdminTable";
import AdminPagination from "@/components/Admin/AdminPagination";
import { Button } from "@/components/ui/button";
import ProductFormDialog from "@/components/Admin/ProductFormDialog";
import { getAllProducts, deleteProduct } from "@/services/productsService";

const ProductsPage = () => {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const productFormRef = useRef();

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const fetchProducts = async (pageNumber) => {
    try {
      setLoading(true);
      const res = await getAllProducts(pageNumber, 10);
      setProducts(res.products || []);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      console.error("Lỗi tải danh sách sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    if (productFormRef.current) {
      productFormRef.current.openEdit(id);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) return;
    try {
      setLoading(true);
      await deleteProduct(id);
      alert("Đã xóa sản phẩm thành công!");
      await fetchProducts(page);
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
      alert(error.response?.data?.message || "Không thể xóa sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* Nền hoa văn */}
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
        {/* Tiêu đề + nút thêm */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Sản phẩm</h1>
          <ProductFormDialog 
            ref={productFormRef}
            onSuccess={() => fetchProducts(page)}
            trigger={<Button>+ Thêm sản phẩm</Button>}
          />
        </div>

        {/* Bảng sản phẩm */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em]" />
              <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có sản phẩm nào.
            </div>
          ) : (
            <AdminTable
              columns={[
                "id",
                "Ảnh",
                "Tên sản phẩm",
                "Danh mục",
                "Nhãn hàng",
                "Giá (VNĐ)",
                "Tồn kho",
              ]}
              data={products.map((p) => ({
                id: p.id,
                image: (
                  <div className="w-16 h-16 relative bg-gray-100 rounded">
                    {p.thumbnail ? (
                      <img
                        src={`http://localhost:8088/uploads/products/${p.thumbnail}`}
                        alt={p.name}
                        className="w-full h-full object-contain rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder-image.png";
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                ),
                name: p.name,
                category: p.categoryName || "—",
                brand: p.brandName || "—",
                price: p.price?.toLocaleString("vi-VN"),
                stock: p.stockQuantity ?? 0,
              }))}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
        )}

        {/* Phân trang */}
          <div className="mt-4">
            <AdminPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductsPage;
