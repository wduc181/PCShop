import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { uploadProductImages, getProductImages } from "@/services/productService";
import { productImageUrl, UPLOADS_PRODUCTS } from "@/config/env";

const ProductImagesDialog = ({ open, onOpenChange, productId }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  // 🟢 Fetch ảnh sẵn có khi mở dialog
  useEffect(() => {
    if (open && productId) {
      const fetchImages = async () => {
        try {
          const res = await getProductImages(productId);
          // res có thể là mảng tên file, ví dụ ["img1.jpg", "img2.png"]
          setExistingImages(res || []);
        } catch (error) {
          console.error("Không thể tải ảnh sản phẩm:", error);
        }
      };
      fetchImages();
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

      if (files.length > 0) {
        await uploadProductImages(productId, files);
        alert("Upload ảnh thành công!");
      } else {
        alert("Không có ảnh mới — giữ nguyên ảnh cũ.");
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      alert("Không thể upload ảnh. Kiểm tra console để biết chi tiết.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ảnh sản phẩm</DialogTitle>
        </DialogHeader>

        {/* Ảnh sẵn có */}
        <div>
          <h3 className="font-medium mb-2">Ảnh hiện có:</h3>
          {existingImages.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {existingImages.map((img, idx) => (
                <img
                  key={idx}
                  src={productImageUrl(img)}
                  alt={`product-img-${idx}`}
                  className="w-full h-32 object-cover rounded border"
                  onError={(e) => (e.target.src = "/placeholder-image.png")}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Chưa có ảnh nào cho sản phẩm này.</p>
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
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? "Đang tải..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductImagesDialog;
