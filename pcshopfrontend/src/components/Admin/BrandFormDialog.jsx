import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const BrandFormDialog = ({
  open,
  setOpen,
  brandData,
  setBrandData,
  onSubmit,
  title,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-3">
          <Input
            type="text"
            placeholder="Tên nhãn hàng"
            value={brandData.name}
            onChange={(e) =>
              setBrandData({ ...brandData, name: e.target.value })
            }
          />
          <Textarea
            placeholder="Mô tả nhãn hàng"
            value={brandData.description}
            onChange={(e) =>
              setBrandData({ ...brandData, description: e.target.value })
            }
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setBrandData({ ...brandData, logoUrl: e.target.files[0] })
            }
          />
          <Button onClick={onSubmit} className="w-full">
            Lưu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BrandFormDialog;
