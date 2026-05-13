import { db } from "./database";

export const initDatabase = async () => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      categoryId TEXT,
      categoryName TEXT,
      note TEXT
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      icon TEXT,
      color TEXT,
      isDefault INTEGER DEFAULT 0
    );
  `);

  const result = await db.getAllAsync(
    "SELECT COUNT(*) as count FROM categories",
  );
  const count = (result[0] as any).count;

  // Nếu chưa có dữ liệu (lần đầu mở app), chèn dữ liệu mặc định bằng MaterialIcons
  if (count === 0) {
    await db.execAsync(`
      INSERT INTO categories (id, name, type, icon, color, isDefault) VALUES 
      -- DANH MỤC CHI (EXPENSE) - ĐÃ CHUYỂN SANG MATERIAL ICONS
      ('food', 'Ăn uống', 'expense', 'restaurant', '#FF7F00', 1),
      ('daily', 'Chi tiêu hàng ngày', 'expense', 'water-drop', '#10B981', 1),
      ('clothes', 'Quần áo', 'expense', 'checkroom', '#3B82F6', 1),
      ('transport', 'Đi lại', 'expense', 'directions-bus', '#F59E0B', 1),
      ('debt', 'Trả nợ', 'expense', 'payments', '#EF4444', 1),
      ('edu', 'Giáo dục', 'expense', 'school', '#EC4899', 1),
      ('rent', 'Tiền nhà', 'expense', 'house', '#8B5CF6', 1),
      ('medicine', 'Thuốc men', 'expense', 'medical-services', '#10B981', 1),
      ('internet', 'Internet', 'expense', 'laptop-mac', '#06B6D4', 1),
      ('coffee', 'Cà phê', 'expense', 'local-cafe', '#78350F', 1),

      -- DANH MỤC THU (INCOME) - ĐÃ CHUYỂN SANG MATERIAL ICONS
      ('salary', 'Tiền lương', 'income', 'account-balance-wallet', '#10B981', 1),
      ('bonus', 'Tiền thưởng', 'income', 'celebration', '#F59E0B', 1),
      ('investment', 'Đầu tư', 'income', 'show-chart', '#059669', 1),
      ('gift', 'Được tặng', 'income', 'card-giftcard', '#D946EF', 1),
      ('selling', 'Bán đồ', 'income', 'inventory-2', '#F97316', 1),
      ('freelance', 'Làm thêm', 'income', 'history-edu', '#6366F1', 1),
      ('other_inc', 'Khác', 'income', 'more-horiz', '#6B7280', 1);
    `);
    console.log("Đã tạo dữ liệu danh mục mặc định với MaterialIcons!");
  }
};
