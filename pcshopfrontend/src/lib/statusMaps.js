export const ORDER_STATUS_EN2VI = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  shipped: "Đã gửi",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
  canceled: "Đã hủy",
};

export const PAYMENT_STATUS_EN2VI = {
  pending: "Chưa thanh toán",
  paid: "Đã thanh toán",
  refunded: "Hoàn tiền",
};

export const toVIOrderStatus = (val) => {
  if (!val) return "—";
  const key = String(val).toLowerCase();
  return ORDER_STATUS_EN2VI[key] ?? String(val);
};

export const toVIPaymentStatus = (val) => {
  if (!val) return "—";
  const key = String(val).toLowerCase();
  return PAYMENT_STATUS_EN2VI[key] ?? String(val);
};
