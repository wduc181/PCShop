import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ProductImagesDialog from "./ProductImagesDialog";
import { getCategories } from "@/services/categoryService";
import { getAllBrands } from "@/services/brandService";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "@/services/productService";

const ProductFormDialog = forwardRef(({ onSuccess, trigger }, ref) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create"); // "create" hoặc "edit"
  const [loadingForm, setLoadingForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    brandId: "",
    categoryId: "",
  });
  const [openImagesDialog, setOpenImagesDialog] = useState(false);
  const [createdProductId, setCreatedProductId] = useState(null);

  useImperativeHandle(ref, () => ({
    openCreate: () => {
      setMode("create");
      setForm({
        id: null,
        name: "",
        description: "",
        price: 0,
        stockQuantity: 0,
        brandId: "",
        categoryId: "",
      });
      setOpen(true);
    },
    openEdit: async (id) => {
      setMode("edit");
      setLoadingForm(true);
      setOpen(true);
      try {
        const data = await getProductById(id);
        // Prefer direct ids; fallback to nested objects
        const rawBrandId =
          data.brandId ?? data.brand_id ?? data.brand?.id ?? data.brand?.brandId ?? null;
        const rawCategoryId =
          data.categoryId ?? data.category_id ?? data.category?.id ?? data.category?.categoryId ?? null;

        const brandId = rawBrandId != null ? String(rawBrandId) : "";
        const categoryId = rawCategoryId != null ? String(rawCategoryId) : "";

        setForm({
          id: data.id,
          name: data.name,
          description: data.description || "",
          price: Number(data.price) || 0,
          stockQuantity: Number(data.stockQuantity) || 0,
          brandId,
          categoryId,
        });
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
        alert("Không thể tải thông tin sản phẩm.");
        setOpen(false);
      } finally {
        setLoadingForm(false);
      }
    },
  }));

  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        const [brandRes, categoryRes] = await Promise.all([
          getAllBrands(),
          getCategories(),
        ]);
        setBrands(brandRes);
        setCategories(categoryRes);
      } catch (error) {
        console.error("Lỗi tải danh mục hoặc nhãn hàng:", error);
      }
    };
    fetchSelectData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stockQuantity"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Submit fired");
  setSaving(true);

  try {
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock_quantity: Number(form.stockQuantity),
      brand_id: Number(form.brandId),
      category_id: Number(form.categoryId),
    };

    if (mode === "create") {
      // ✅ THÊM MỚI
      const created = await createProduct(payload);
      alert("Tạo sản phẩm thành công!");

      setCreatedProductId(created.id);
      setOpen(false);
      // Mở dialog upload ảnh sau khi tạo
      setTimeout(() => setOpenImagesDialog(true), 300);
      onSuccess?.();

    } else {
      // ✅ CẬP NHẬT
      await updateProduct(form.id, payload);
      alert("Cập nhật sản phẩm thành công!");

      setOpen(false);
      onSuccess?.();

      // 👉 Mở dialog upload ảnh để người dùng có thể đổi ảnh
      setCreatedProductId(form.id); // Dùng id của sản phẩm đang sửa
      setTimeout(() => setOpenImagesDialog(true), 300);
    }
  } catch (error) {
    console.error("Lỗi lưu sản phẩm:", error);
    alert(error.response?.data?.message || "Không thể lưu sản phẩm.");
  } finally {
    setSaving(false);
  }
};


  return (
    <>
      {/* Nếu có trigger (ví dụ nút “+ Thêm sản phẩm”) */}
      {trigger &&
        React.cloneElement(trigger, {
          onClick: () => {
            setMode("create");
            setForm({
              id: null,
              name: "",
              description: "",
              price: 0,
              stockQuantity: 0,
              brandId: "",
              categoryId: "",
            });
            setOpen(true);
          },
        })}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Thêm sản phẩm" : "Chỉnh sửa sản phẩm"}
            </DialogTitle>
          </DialogHeader>

          {loadingForm ? (
            <p>Đang tải...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div>
                <Label>Tên sản phẩm</Label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Mô tả</Label>
                <Input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Giá</Label>
                  <Input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label>Tồn kho</Label>
                  <Input
                    type="number"
                    name="stockQuantity"
                    value={form.stockQuantity}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Danh mục</Label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  required
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Nhãn hàng</Label>
                <select
                  name="brandId"
                  value={form.brandId}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  required
                >
                  <option value="">-- Chọn nhãn hàng --</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving
                    ? "Đang lưu..."
                    : mode === "create"
                    ? "Tạo"
                    : "Cập nhật"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog upload ảnh sau khi tạo */}
      <ProductImagesDialog
        open={openImagesDialog}
        onOpenChange={setOpenImagesDialog}
        productId={createdProductId}
      />
    </>
  );
});

ProductFormDialog.displayName = "ProductFormDialog";
export default ProductFormDialog;
