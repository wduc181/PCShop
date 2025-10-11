import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createProduct,
  updateProduct,
  getProductById,
} from "@/services/productsService";
import { getAllBrands } from "@/services/brandService";
import { getCategories } from "@/services/categoryService";
import ProductImagesDialog from "@/components/Admin/ProductImagesDialog";

const ProductFormDialog = forwardRef(({ onSuccess, trigger = null }, ref) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [productId, setProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openImagesDialog, setOpenImagesDialog] = useState(false);
  const [newProductId, setNewProductId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stockQuantity: "",
    brandId: "",
    categoryId: "",
    description: "",
  });
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const mountedRef = useRef(true);

  useEffect(() => {
    if (open) {
      const fetchOptions = async () => {
        try {
          const [brandsData, categoriesData] = await Promise.all([
            getAllBrands(),
            getCategories(),
          ]);
          setBrands(brandsData || []);
          setCategories(categoriesData || []);
        } catch (error) {
          console.error("Error fetching form data:", error);
          alert("Không thể tải danh sách nhãn hàng và danh mục");
        }
      };
      fetchOptions();
    }
  }, [open]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useImperativeHandle(ref, () => ({
    openCreate: () => {
      setMode("create");
      setProductId(null);
      setForm({
        name: "",
        price: "",
        stockQuantity: "",
        brandId: "",
        categoryId: "",
        description: "",
      });
      setOpen(true);
    },
    openEdit: async (id) => {
      if (!id) return;
      setMode("edit");
      setProductId(id);
      setLoading(true);
      setOpen(true);
      try {
        const data = await getProductById(id);
        if (!mountedRef.current) return;
        setForm({
          name: data.name ?? "",
          price: data.price ?? "",
          stockQuantity: data.stockQuantity ?? "",
          brandId: data.brandId ?? "",
          categoryId: data.categoryId ?? "",
          description: data.description ?? "",
        });
      } catch (err) {
        console.error("Lỗi tải sản phẩm để sửa:", err);
        alert("Không tải được dữ liệu sản phẩm.");
        setOpen(false);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSelectChange = (value, name) => {
    setForm((prev) => ({
      ...prev,
      [name]: value ? Number(value) : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.name || form.name.trim() === "") {
      alert("Vui lòng nhập tên sản phẩm.");
      setLoading(false);
      return;
    }

    try {
      if (!form.brandId || !form.categoryId) {
        alert("Vui lòng chọn nhãn hàng và danh mục");
        setLoading(false);
        return;
      }

      const payload = {
        name: form.name,
        price: form.price === "" ? 0 : parseFloat(form.price),
        stock_quantity:
          form.stockQuantity === "" ? 0 : parseInt(form.stockQuantity, 10),
        brand_id: Number(form.brandId),
        category_id: Number(form.categoryId),
        description: form.description,
      };

      console.log("Submitting payload:", payload);

      if (mode === "create") {
        const res = await createProduct(payload);
        const createdId =
          res?.id ?? res?.data?.id ?? res?.product?.id ?? null;

        if (createdId) {
          setNewProductId(createdId);
          setOpen(false);
          setOpenImagesDialog(true);
          alert("Tạo sản phẩm thành công! Hãy thêm ảnh cho sản phẩm này.");
        } else {
          alert("Tạo sản phẩm thành công nhưng không nhận được ID trả về!");
        }
      } else {
        await updateProduct(productId, payload);
        alert("Cập nhật sản phẩm thành công!");
        onSuccess?.();
        setOpen(false);
      }
    } catch (err) {
      console.error("Lỗi khi lưu sản phẩm:", err);
      alert("Lưu sản phẩm thất bại. Kiểm tra console để biết chi tiết.");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        {open && (
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {mode === "edit" ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
            </DialogTitle>
            <DialogDescription>
              Điền thông tin sản phẩm vào form bên dưới
            </DialogDescription>
          </DialogHeader>

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

            <div className="flex gap-4">
              <div className="flex-1">
                <Label>Giá (VNĐ)</Label>
                <Input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1">
                <Label>Tồn kho</Label>
                <Input
                  type="number"
                  name="stockQuantity"
                  value={form.stockQuantity}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <Label>Nhãn hàng</Label>
                <Select
                  value={form.brandId?.toString() || ""}
                  onValueChange={(value) =>
                    handleSelectChange(value, "brandId")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn nhãn hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(brands) && brands.length > 0 ? (
                      brands.map((brand) => (
                        <SelectItem
                          key={brand.id}
                          value={brand.id?.toString() ?? ""}
                        >
                          {brand.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-brands" disabled>
                        Không có nhãn hàng
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Label>Danh mục</Label>
                <Select
                  value={form.categoryId?.toString() || ""}
                  onValueChange={(value) =>
                    handleSelectChange(value, "categoryId")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(categories) && categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id?.toString() ?? ""}
                        >
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-categories" disabled>
                        Không có danh mục
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Mô tả</Label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Đang lưu..." : "Lưu"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
        )}
      </Dialog>

      {/* Dialog sau khi tạo thành công */}
      {newProductId && (
        <ProductImagesDialog
          open={openImagesDialog}
          onClose={() => {
            setOpenImagesDialog(false);
            setNewProductId(null);
            onSuccess?.();
          }}
          productId={newProductId}
        />
      )}
    </>
  );
});

export default ProductFormDialog;
