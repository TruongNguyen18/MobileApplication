import { Feather, MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import CategoryIcon from "../components/categoryIcon";
import {
  addCategory,
  deleteCategory,
  getCategoriesByType,
  updateCategory,
} from "../database/queries";

const ICON_LIST = [
  "shopping-cart",
  "restaurant",
  "directions-bus",
  "local-gas-station",
  "house",
  "electrical-services",
  "water-drop",
  "checkroom",
  "payments",
  "medical-services",
  "school",
  "sports-soccer",
  "directions-bike",
  "shopping-bag",
  "phone-android",
  "laptop-mac",
  "fitness-center",
  "flight",
  "movie",
  "fastfood",
  "local-bar",
  "celebration",
  "card-giftcard",
  "pets",
  "build",
  "cleaning-services",
  "spa",
  "local-laundry-service",
  "savings",
  "account-balance",
];

export default function EditCategoryScreen({ navigation, route }: any) {
  // ✅ CHỈ LẤY TYPE MỘT LẦN DUY NHẤT TỪ TRANG NGOÀI TRUYỀN VÀO
  const type: "expense" | "income" = route?.params?.type || "expense";

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [formVisible, setFormVisible] = useState(false);
  const [selectedCat, setSelectedCat] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("shopping-cart");

  // Hàm tải dữ liệu cho duy nhất 1 loại danh mục
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCategoriesByType(type);
      setCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Lỗi SQLite:", e);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSave = async () => {
    if (!editName.trim()) return Alert.alert("Thông báo", "Vui lòng nhập tên");
    try {
      if (selectedCat) {
        await updateCategory(selectedCat.id, editName, editIcon, "#4B5563");
      } else {
        await addCategory(editName, type, editIcon, "#4B5563");
      }
      setFormVisible(false);
      fetchCategories();
    } catch (e) {
      Alert.alert("Lỗi", "Không thể lưu dữ liệu");
    }
  };

  const handleDelete = (id: string, isDefault: number) => {
    if (isDefault === 1)
      return Alert.alert("Thông báo", "Không xóa được mục mặc định.");
    Alert.alert("Xác nhận", "Xóa danh mục này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          await deleteCategory(id);
          setFormVisible(false);
          fetchCategories();
        },
      },
    ]);
  };

  const openForm = (cat?: any) => {
    if (cat) {
      setSelectedCat(cat);
      setEditName(cat.name || "");
      setEditIcon(cat.icon || "shopping-cart");
    } else {
      setSelectedCat(null);
      setEditName("");
      setEditIcon("shopping-cart");
    }
    setFormVisible(true);
  };

  return (
    <View className="flex-1 bg-white">
      {/* HEADER ĐÃ ĐƠN GIẢN HÓA: CHỈ HIỂN THỊ TIÊU ĐỀ */}
      <View className="bg-white pt-12 pb-4 border-b border-gray-100 flex-row items-center px-4">
        <TouchableOpacity onPress={() => navigation?.goBack()} className="p-2">
          <Feather name="chevron-left" size={28} color="#FF7F00" />
        </TouchableOpacity>

        <View className="flex-1 items-center">
          <Text className="text-xl font-bold text-gray-800">
            Quản lý danh mục {type === "expense" ? "Chi tiêu" : "Thu nhập"}
          </Text>
        </View>

        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1 bg-gray-50"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          onPress={() => openForm()}
          className="bg-white m-4 p-4 rounded-xl flex-row justify-between items-center shadow-sm"
        >
          <Text className="text-gray-500 text-lg font-medium">
            Thêm mới {type === "expense" ? "chi tiêu" : "thu nhập"}
          </Text>
          <Feather name="plus-circle" size={24} color="#FF7F00" />
        </TouchableOpacity>

        <View className="bg-white mx-4 rounded-xl overflow-hidden shadow-sm mb-20">
          {loading ? (
            <ActivityIndicator size="large" color="#FF7F00" className="my-10" />
          ) : categories.length === 0 ? (
            <Text className="text-center py-10 text-gray-400">
              Chưa có danh mục nào.
            </Text>
          ) : (
            categories.map((cat, index) => (
              <TouchableOpacity
                key={cat?.id || index}
                onPress={() => openForm(cat)}
                className={`flex-row items-center p-4 ${index !== categories.length - 1 ? "border-b border-gray-50" : ""}`}
              >
                <CategoryIcon icon={cat?.icon} color="#4B5563" size={24} />
                <Text className="flex-1 text-gray-700 text-base ml-4 font-medium">
                  {cat?.name}
                </Text>
                <Feather name="edit-3" size={18} color="#D1D5DB" />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* MODAL THÊM / SỬA GIỮ NGUYÊN */}
      <Modal
        visible={formVisible}
        animationType="slide"
        onRequestClose={() => setFormVisible(false)}
      >
        <View className="flex-1 bg-white">
          <View className="pt-12 pb-4 border-b border-gray-100 flex-row items-center px-4">
            <TouchableOpacity
              onPress={() => setFormVisible(false)}
              className="p-2"
            >
              <Feather name="x" size={28} color="#374151" />
            </TouchableOpacity>
            <Text className="flex-1 text-center text-lg font-bold text-gray-800">
              {selectedCat ? "Chỉnh sửa" : "Tạo mới"}
            </Text>
            <TouchableOpacity onPress={handleSave} className="p-2">
              <Text className="text-[#FF7F00] font-bold text-base">Lưu</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1 px-4"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="mt-6">
              <Text className="text-sm text-gray-500 mb-2 ml-1">
                Tên danh mục
              </Text>
              <TextInput
                value={editName}
                onChangeText={setEditName}
                className="bg-gray-100 rounded-xl px-4 py-3 text-lg text-gray-800"
                placeholder="Nhập tên..."
              />
            </View>

            <Text className="text-sm text-gray-500 mt-8 mb-4 ml-1">
              Chọn biểu tượng
            </Text>
            <View className="flex-row flex-wrap justify-between pb-6">
              {ICON_LIST.map((iconName) => (
                <TouchableOpacity
                  key={iconName}
                  onPress={() => setEditIcon(iconName)}
                  className={`w-[18%] aspect-square items-center justify-center rounded-2xl mb-3 border ${
                    editIcon === iconName
                      ? "border-[#FF7F00] bg-orange-50"
                      : "border-gray-100 bg-gray-50"
                  }`}
                >
                  <MaterialIcons
                    name={iconName as any}
                    size={28}
                    color={editIcon === iconName ? "#FF7F00" : "#6B7280"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {selectedCat && (
              <TouchableOpacity
                onPress={() =>
                  handleDelete(selectedCat.id, selectedCat.isDefault)
                }
                className="mt-4 mb-20 bg-red-50 py-4 rounded-2xl border border-red-100 items-center shadow-sm"
              >
                <Text className="text-red-500 font-bold text-base">
                  Xóa danh mục này
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
