import { db } from "./database";

// ==========================================
// NHÓM 1: QUẢN LÝ GIAO DỊCH (TRANSACTIONS)
// ==========================================

export const addTransaction = async (t: any) => {
  return await db.runAsync(
    "INSERT INTO transactions (type, amount, date, categoryId, categoryName, note) VALUES (?, ?, ?, ?, ?, ?)",
    [t.type, t.amount, t.date, t.categoryId, t.categoryName, t.note],
  );
};

export const getTransactionsByMonth = async (month: string) => {
  return await db.getAllAsync(
    "SELECT * FROM transactions WHERE date LIKE ? ORDER BY date DESC",
    [`${month}%`],
  );
};

export const deleteTransaction = async (id: number) => {
  return await db.runAsync("DELETE FROM transactions WHERE id = ?", [id]);
};

// ==========================================
// NHÓM 2: QUẢN LÝ DANH MỤC (CATEGORIES)
// ==========================================

// Lấy danh sách danh mục theo loại (expense hoặc income)
export const getCategoriesByType = async (type: string) => {
  return await db.getAllAsync("SELECT * FROM categories WHERE type = ?", [
    type,
  ]);
};

// Thêm danh mục mới (Người dùng tự tạo)
export const addCategory = async (
  name: string,
  type: string,
  icon: string,
  color: string,
) => {
  // Sinh id ngẫu nhiên (hoặc bạn có thể dùng thư viện uuid)
  const id = Date.now().toString();
  return await db.runAsync(
    "INSERT INTO categories (id, name, type, icon, color, isDefault) VALUES (?, ?, ?, ?, ?, 0)",
    [id, name, type, icon, color],
  );
};

// Xóa danh mục (Chỉ cho phép xóa nếu isDefault = 0)
export const deleteCategory = async (id: string) => {
  return await db.runAsync(
    "DELETE FROM categories WHERE id = ? AND isDefault = 0",
    [id],
  );
};

// Sửa danh mục
export const updateCategory = async (
  id: string,
  name: string,
  icon: string,
  color: string, // Thêm color vào đây
) => {
  return await db.runAsync(
    "UPDATE categories SET name = ?, icon = ?, color = ? WHERE id = ?",
    [name, icon, color, id],
  );
};

export const updateTransaction = async (id: number, t: any) => {
  return await db.runAsync(
    "UPDATE transactions SET type = ?, amount = ?, date = ?, categoryId = ?, categoryName = ?, note = ? WHERE id = ?",
    [t.type, t.amount, t.date, t.categoryId, t.categoryName, t.note, id],
  );
};
