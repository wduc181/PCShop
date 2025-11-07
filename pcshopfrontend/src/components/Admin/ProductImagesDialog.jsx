import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { uploadProductImages, getProductImages, setProductThumbnail } from "@/services/productService";
import { productImageUrl, UPLOADS_PRODUCTS } from "@/config/env";

const ProductImagesDialog = ({ open, onOpenChange, productId }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedThumb, setSelectedThumb] = useState(null);
  const [savingThumb, setSavingThumb] = useState(false);

  // 🟢 Fetch ảnh sẵn có khi mở dialog
  useEffect(() => {
    if (open && productId) {
      const fetchImages = async () => {
        try {
          const res = await getProductImages(productId);
          setExistingImages(res || []);
        } catch (error) {
          console.error("Không thể tải ảnh sản phẩm:", error);
        }
      };
      fetchImages();
      // reset selection when opening
      setSelectedThumb(null);
    }
  }, [open, productId]);

  // 🟢 Tạo preview khi chọn file
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    const previewsArr = selected.map((file) => URL.createObjectURL(file));
    setPreviews(previewsArr);
  };

  // 🟢 Upload ảnh mới (nếu có)
  const handleUpload = async () => {
    try {
      setUploading(true);
      let changed = false;
      if (files.length > 0) {
        await uploadProductImages(productId, files);
        changed = true;
      }
      if (selectedThumb) {
        setSavingThumb(true);
        await setProductThumbnail(productId, selectedThumb);
        changed = true;
      }
      if (changed) {
        alert("Đã lưu thay đổi ảnh sản phẩm.");
      } else {
        alert("Không có thay đổi nào.");
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Lỗi khi lưu ảnh/thumbnail:", error);
      alert("Không thể lưu. Kiểm tra console để biết chi tiết.");
    } finally {
      setUploading(false);
      setSavingThumb(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ảnh sản phẩm</DialogTitle>
        </DialogHeader>

        {/* Ảnh sản phẩm hiện có & chọn thumbnail */}
        <div className="mt-6">
          <h3 className="font-medium mb-2">Chọn thumbnail (click để chọn):</h3>
          {existingImages.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {existingImages.map((img, idx) => {
                const isSelected = selectedThumb === img;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedThumb(img)}
                    className={`relative group rounded border overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSelected ? 'ring-2 ring-blue-600 border-blue-600' : 'border-gray-300'}`}
                    title={isSelected ? 'Đã chọn làm thumbnail' : 'Chọn làm thumbnail'}
                  >
                    <img
                      src={productImageUrl(img)}
                      alt={`product-img-${idx}`}
                      className="w-full h-32 object-cover"
                      onError={(e) => (e.target.src = "/placeholder-image.png")}
                    />
                    <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs text-white font-medium`}>Chọn</div>
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded">
                        Thumbnail
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Chưa có ảnh nào cho sản phẩm này.</p>
          )}
          {selectedThumb && (
            <p className="mt-2 text-xs text-blue-600">Ảnh được chọn: {selectedThumb}</p>
          )}
        </div>

        {/* Upload ảnh mới */}
        <div className="mt-4">
          <h3 className="font-medium mb-2">Thêm ảnh mới (tùy chọn):</h3>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} />
          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {previews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`preview-${idx}`}
                  className="w-full h-32 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={uploading}>
            Hủy
          </Button>
          <Button onClick={handleUpload} disabled={uploading || savingThumb}>
            {uploading || savingThumb ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductImagesDialog;
