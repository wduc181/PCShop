import React, { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  uploadProductImages,
  getProductImages,
  setProductThumbnail,
  deleteProductImages,
} from "@/services/productService";
import { productImageUrl } from "@/config/env";

const normalizeImageRecords = (records) => {
  if (!Array.isArray(records)) return [];
  return records
    .map((item) => {
      if (!item) return null;
      if (typeof item === "string") {
        const path = item.trim();
        return path ? { id: path, path, url: productImageUrl(path) } : null;
      }
      const path = [item.imageUrl, item.url, item.path].find(
        (value) => typeof value === "string" && value.trim()
      );
      if (!path) return null;
      const trimmed = path.trim();
      const recordId = Number(item.id);
      return {
        id: item.id ?? trimmed,
        recordId: Number.isFinite(recordId) ? recordId : null,
        path: trimmed,
        url: productImageUrl(trimmed),
      };
    })
    .filter(Boolean);
};

const ProductImagesDialog = ({ open, onOpenChange, productId }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedThumb, setSelectedThumb] = useState(null);
  const [savingThumb, setSavingThumb] = useState(false);
  const [deleteIds, setDeleteIds] = useState([]);

  const loadExistingImages = useCallback(async () => {
    if (!productId) return;
    try {
      const res = await getProductImages(productId);
      setExistingImages(normalizeImageRecords(res));
      setDeleteIds([]);
    } catch (error) {
      console.error("Không thể tải ảnh sản phẩm:", error);
      setExistingImages([]);
      setDeleteIds([]);
    }
  }, [productId]);

  // 🟢 Fetch ảnh sẵn có khi mở dialog
  useEffect(() => {
    if (!open || !productId) return;
    let ignore = false;
    const fetchImages = async () => {
      await loadExistingImages();
      if (!ignore) setSelectedThumb(null);
    };
    fetchImages();
    return () => {
      ignore = true;
    };
  }, [open, productId, loadExistingImages]);

  // 🟢 Tạo preview khi chọn file
  const revokePreviews = useCallback((list) => {
    list.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (_) {
        // ignore
      }
    });
  }, []);

  const toggleDeleteSelection = (recordId) => {
    if (!Number.isFinite(recordId)) return;
    setDeleteIds((prev) =>
      prev.includes(recordId)
        ? prev.filter((value) => value !== recordId)
        : [...prev, recordId]
    );
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    revokePreviews(previews);
    const previewsArr = selected.map((file) => URL.createObjectURL(file));
    setPreviews(previewsArr);
  };

  useEffect(() => {
    if (open) return;
    if (previews.length) {
      revokePreviews(previews);
      setPreviews([]);
    }
    setFiles([]);
    setSelectedThumb(null);
    setDeleteIds([]);
  }, [open, previews, revokePreviews]);

  // 🟢 Upload ảnh mới (nếu có)
  const handleUpload = async () => {
    try {
      setUploading(true);
      let changed = false;
      if (files.length > 0) {
        await uploadProductImages(productId, files);
        changed = true;
        await loadExistingImages();
      }
      if (selectedThumb) {
        setSavingThumb(true);
        await setProductThumbnail(productId, selectedThumb);
        changed = true;
        await loadExistingImages();
      }
      if (deleteIds.length > 0) {
        await deleteProductImages(productId, deleteIds);
        changed = true;
        await loadExistingImages();
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
      setFiles([]);
      revokePreviews(previews);
      setPreviews([]);
      setDeleteIds([]);
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
              {existingImages.map((img) => {
                const isSelected = selectedThumb === img.path;
                const isMarkedForDeletion = img.recordId != null && deleteIds.includes(img.recordId);
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setSelectedThumb(img.path)}
                    className={`relative group rounded border overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSelected ? 'ring-2 ring-blue-600 border-blue-600' : isMarkedForDeletion ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'}`}
                    title={isSelected ? 'Đã chọn làm thumbnail' : 'Chọn làm thumbnail'}
                  >
                    <img
                      src={img.url}
                      alt={`product-img-${img.id}`}
                      className="w-full h-32 object-cover"
                      onError={(e) => (e.target.src = "/placeholder-image.png")}
                    />
                    <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs text-white font-medium`}>Chọn</div>
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded">
                        Thumbnail
                      </div>
                    )}
                    {img.recordId != null && (
                      <button
                        type="button"
                        className={`absolute top-1 left-1 text-[10px] px-2 py-0.5 rounded ${isMarkedForDeletion ? 'bg-red-600 text-white' : 'bg-white/80 text-red-600'}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleDeleteSelection(img.recordId);
                        }}
                      >
                        {isMarkedForDeletion ? 'Bỏ xóa' : 'Xóa'}
                      </button>
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
          {deleteIds.length > 0 && (
            <p className="mt-1 text-xs text-red-600">
              Sẽ xóa {deleteIds.length} ảnh khi lưu.
            </p>
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
