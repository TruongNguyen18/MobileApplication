import { Feather, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
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
  // 1. Quản lý Tab đang hiển thị
  const [type, setType] = useState<"expense" | "income">(
    route?.params?.type || "expense",
  );

  // 2. Tách riêng 2 danh sách để an toàn
  const [expenseCats, setExpenseCats] = useState<any[]>([]);
  const [incomeCats, setIncomeCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 3. Quản lý Modal
  const [formVisible, setFormVisible] = useState(false);
  const [selectedCat, setSelectedCat] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("shopping-cart");

  // KHẮC PHỤC LỖI MẤT DỮ LIỆU: Bắt buộc tải tuần tự từng bảng
  const loadData = async () => {
    setLoading(true);
    try {
      // Dùng await tuần tự thay vì Promise.all để SQLite không bị nghẽn
      const exp = await getCategoriesByType("expense");
      const inc = await getCategoriesByType("income");

      setExpenseCats(Array.isArray(exp) ? exp : []);
      setIncomeCats(Array.isArray(inc) ? inc : []);
    } catch (error) {
      console.error("Lỗi tải danh mục:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tải dữ liệu lần đầu
  useEffect(() => {
    loadData();
  }, []);

  // Bắt sự kiện chuyển hướng từ màn hình AddTransaction vào
  useEffect(() => {
    if (route?.params?.type) {
      setType(route.params.type);
    }
  }, [route?.params?.type]);

  // Trích xuất danh sách cần hiển thị
  const activeCategories = type === "expense" ? expenseCats : incomeCats;

  const handleSave = async () => {
    if (!editName.trim())
      return Alert.alert("Thông báo", "Vui lòng nhập tên danh mục");
    try {
      if (selectedCat) {
        await updateCategory(selectedCat.id, editName, editIcon, "#4B5563");
      } else {
        await addCategory(editName, type, editIcon, "#4B5563");
      }
      setFormVisible(false);
      loadData(); // Tải lại lập tức
    } catch (e) {
      Alert.alert("Lỗi", "Không thể lưu dữ liệu");
    }
  };

  const handleDelete = (id: string, isDefault: number) => {
    if (isDefault === 1) {
      return Alert.alert("Thông báo", "Không thể xóa danh mục mặc định.");
    }
    Alert.alert("Xóa danh mục", "Bạn có chắc chắn muốn xóa?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          await deleteCategory(id);
          setFormVisible(false);
          loadData(); // Tải lại lập tức
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
      {/* KHẮC PHỤC LỖI LIỆT NÚT: Xóa bỏ hoàn toàn Z-index ảo */}
      <View className="bg-white pt-12 pb-3 border-b border-gray-100 flex-row items-center px-4">
        <TouchableOpacity onPress={() => navigation?.goBack()} className="p-2">
          <Feather name="chevron-left" size={28} color="#FF7F00" />
        </TouchableOpacity>

        <View className="flex-1 flex-row bg-gray-100 rounded-lg p-1 mx-2">
          <TouchableOpacity
            onPress={() => setType("expense")}
            className={`flex-1 py-2 rounded-md items-center ${type === "expense" ? "bg-white shadow-sm" : ""}`}
          >
            <Text
              className={`font-bold ${type === "expense" ? "text-[#FF7F00]" : "text-gray-400"}`}
            >
              Chi tiêu
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setType("income")}
            className={`flex-1 py-2 rounded-md items-center ${type === "income" ? "bg-white shadow-sm" : ""}`}
          >
            <Text
              className={`font-bold ${type === "income" ? "text-[#FF7F00]" : "text-gray-400"}`}
            >
              Thu nhập
            </Text>
          </TouchableOpacity>
        </View>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1 bg-gray-50"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => openForm()}
          className="bg-white m-4 p-4 rounded-xl flex-row justify-between items-center shadow-sm"
        >
          <Text className="text-gray-500 text-lg font-medium">
            Thêm {type === "expense" ? "chi tiêu" : "thu nhập"} mới
          </Text>
          <Feather name="plus-circle" size={24} color="#FF7F00" />
        </TouchableOpacity>

        <View className="bg-white mx-4 rounded-xl overflow-hidden shadow-sm mb-20">
          {loading ? (
            <ActivityIndicator size="large" color="#FF7F00" className="my-10" />
          ) : activeCategories.length === 0 ? (
            <Text className="text-center py-10 text-gray-400">
              Chưa có danh mục nào. Hãy tạo mới!
            </Text>
          ) : (
            activeCategories.map((cat, index) => (
              <TouchableOpacity
                key={cat?.id || index}
                onPress={() => openForm(cat)}
                className={`flex-row items-center p-4 ${index !== activeCategories.length - 1 ? "border-b border-gray-50" : ""}`}
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

      {/* MODAL THÊM / SỬA / XÓA */}
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
              {selectedCat ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
            </Text>
            <TouchableOpacity onPress={handleSave} className="p-2">
              <Text className="text-[#FF7F00] font-bold text-base">Lưu</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1 px-4"
            showsVerticalScrollIndicator={false}
          >
            <View className="mt-6">
              <Text className="text-sm text-gray-500 mb-2 ml-1">
                Tên danh mục
              </Text>
              <TextInput
                value={editName}
                onChangeText={setEditName}
                className="bg-gray-100 rounded-xl px-4 py-3 text-lg text-gray-800"
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

            {/* NÚT XÓA CHỈ HIỆN KHI ĐANG SỬA */}
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
