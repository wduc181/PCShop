import React, { useEffect, useState, useRef } from "react";
import AdminLayout from "@/components/Layouts/AdminLayout";
import AdminTable from "@/components/Admin/AdminTable";
import AdminPagination from "@/components/Admin/AdminPagination";
import { Button } from "@/components/ui/button";
import ProductFormDialog from "@/components/Admin/ProductFormDialog";
import { getAllProducts, deleteProduct, discountProduct, recommendProduct } from "@/services/productsService";
import { productImageUrl } from "@/config/env";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";

const ProductsPage = () => {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const productFormRef = useRef();
  const [discountDialogOpen, setDiscountDialogOpen] = useState(false);
  const [discountTarget, setDiscountTarget] = useState(null); // { id, name, currentDiscount }
  const [discountValue, setDiscountValue] = useState(0);

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
    productFormRef.current?.openEdit(id);
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

  const openDiscountDialog = (product) => {
    setDiscountTarget({ id: product.id, name: product.name, currentDiscount: product.discount ?? 0 });
    setDiscountValue(product.discount ?? 0);
    setDiscountDialogOpen(true);
  };

  const toggleRecommend = async (product) => {
    // cố gắng đọc cờ từ cả featured và isFeatured để tương thích backend
    const isFeatured = Boolean(product?.featured ?? product?.isFeatured ?? false);
    try {
      setLoading(true);
      await recommendProduct(product.id, !isFeatured);
      await fetchProducts(page);
    } catch (error) {
      console.error("Lỗi cập nhật recommend:", error);
      alert(error.response?.data?.message || "Không thể cập nhật recommend.");
    } finally {
      setLoading(false);
    }
  };

  const submitDiscount = async () => {
    if (!discountTarget) return;
    const value = Number(discountValue);
    if (Number.isNaN(value) || value < 0 || value > 100) {
      alert("Giá trị giảm giá phải trong khoảng 0 - 100");
      return;
    }
    try {
      setLoading(true);
      await discountProduct(discountTarget.id, value);
      setDiscountDialogOpen(false);
      await fetchProducts(page);
    } catch (error) {
      console.error("Lỗi áp dụng giảm giá:", error);
      alert(error.response?.data?.message || "Không thể áp dụng giảm giá.");
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
          <Button onClick={() => productFormRef.current?.openCreate()}>
            + Thêm sản phẩm
          </Button>
        </div>

        {/* Bảng sản phẩm */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-500 border-r-transparent" />
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
                "Giảm giá (%)",
              ]}
              data={products.map((p) => ({
                id: p.id,
                image: (
                  <div className="w-16 h-16 relative bg-gray-100 rounded">
                    {p.thumbnail ? (
                      <img
                        src={productImageUrl(p.thumbnail)}
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
                discount: p.discount ?? 0,
              }))}
              onEdit={handleEdit}
              onDelete={handleDelete}
              renderActions={(item) => {
                const product = products.find((p) => p.id === item.id) || {};
                const hasDiscount = (product.discount ?? 0) > 0;
                const isFeatured = Boolean(product?.featured ?? product?.isFeatured ?? false);
                return (
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item.id)}>
                      Sửa
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                      Xóa
                    </Button>
                    <Button
                      size="sm"
                      className={hasDiscount ? "bg-green-600 text-white hover:bg-green-700" : "bg-white text-black border"}
                      onClick={() => openDiscountDialog({ id: product.id, name: product.name, discount: product.discount })}
                      title={hasDiscount ? `Đang giảm ${product.discount}%` : "Áp dụng giảm giá"}
                    >
                      Giảm giá
                    </Button>
                    <Button
                      size="sm"
                      className={isFeatured ? "bg-yellow-500 text-black hover:bg-yellow-600" : "bg-white text-black border"}
                      onClick={() => toggleRecommend(product)}
                      title={isFeatured ? "Đang recommend" : "Bật recommend"}
                    >
                      <Star className="w-4 h-4 mr-1" /> {isFeatured ? "Đang bật" : "Bật"}
                    </Button>
                  </div>
                );
              }}
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

      {/* Form thêm/sửa sản phẩm */}
      <ProductFormDialog
        ref={productFormRef}
        onSuccess={() => fetchProducts(page)}
      />

      {/* Dialog áp dụng giảm giá */}
      <Dialog open={discountDialogOpen} onOpenChange={setDiscountDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Áp dụng giảm giá</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              Sản phẩm: <span className="font-medium">{discountTarget?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                max={100}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
              />
              <span>%</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDiscountDialogOpen(false)}>Hủy</Button>
            <Button onClick={submitDiscount}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ProductsPage;
