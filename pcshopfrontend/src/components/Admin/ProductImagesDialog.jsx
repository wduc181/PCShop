import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadProductImages } from "@/services/productsService";

const ProductImagesDialog = ({ open, onClose, productId }) => {
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 5) {
      alert("Chỉ được chọn tối đa 5 ảnh!");
      return;
    }
    setFiles(selected);
    setPreviewUrls(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleUpload = async () => {
    if (!productId) {
      alert("Không tìm thấy sản phẩm để thêm ảnh.");
      return;
    }
    if (files.length === 0) {
      alert("Vui lòng chọn ít nhất một ảnh.");
      return;
    }

    setLoading(true);
    try {
      await uploadProductImages(productId, files);
      alert("Tải ảnh sản phẩm thành công!");
      onClose();
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      alert("Không thể upload ảnh. Kiểm tra console để biết thêm chi tiết.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Thêm ảnh sản phẩm</DialogTitle>
          <DialogDescription>
            Bạn có thể thêm tối đa 5 ảnh cho sản phẩm này. Ảnh đầu tiên sẽ được đặt làm thumbnail.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input type="file" multiple accept="image/*" onChange={handleFileChange} />
          <div className="grid grid-cols-3 gap-2">
            {previewUrls.map((url, idx) => (
              <div key={idx} className="relative">
                <img
                  src={url}
                  alt={`preview-${idx}`}
                  className="w-full h-28 object-cover rounded border"
                />
                {idx === 0 && (
                  <span className="absolute top-1 left-1 bg-black text-white text-xs px-1 rounded">
                    Thumbnail
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handleUpload} disabled={loading}>
            {loading ? "Đang tải lên..." : "Lưu ảnh"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductImagesDialog;
