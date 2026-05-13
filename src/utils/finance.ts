/**
 * Tính phần trăm ngân sách đã sử dụng
 */
export const calculateBudgetProgress = (spent: number, limit: number): number => {
  if (limit <= 0) return 0;
  const progress = (spent / limit) * 100;
  return progress > 100 ? 100 : progress;
};

/**
 * Kiểm tra xem một giao dịch là Thu nhập hay Chi tiêu dựa trên ID danh mục hoặc Type
 */
export const isExpense = (type: 'income' | 'expense'): boolean => {
  return type === 'expense';
};