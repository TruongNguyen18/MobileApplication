/**
 * Chuyển đổi số thành định dạng tiền tệ VNĐ
 * Ví dụ: 1000000 -> 1.000.000 ₫
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};
