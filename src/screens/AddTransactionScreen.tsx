import { Feather } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import BottomNav from "../components/bottomNav";
import CategoryIcon from "../components/categoryIcon";
import CustomKeypad from "../components/customKeypad";
import {
  addTransaction,
  getCategoriesByType,
  updateTransaction,
} from "../database/queries";
import * as DateUtils from "../utils/date";

export default function AddTransactionScreen({ navigation, route }: any) {
  const editItem = route?.params?.editItem;

  const [expenseCategories, setExpenseCategories] = useState<any[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");

  const [currentDate, setCurrentDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("0");
  const [showKeypad, setShowKeypad] = useState(false);

  const [expenseCategory, setExpenseCategory] = useState("");
  const [incomeCategory, setIncomeCategory] = useState("");

  // Tự động tải lại danh mục mỗi khi màn hình được hiển thị (Focus)
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      const loadInitialData = async () => {
        try {
          const exp = (await getCategoriesByType("expense")) as any[];
          const inc = (await getCategoriesByType("income")) as any[];

          if (isMounted) {
            setExpenseCategories(exp);
            setIncomeCategories(inc);

            if (editItem) {
              setActiveTab(editItem.type);
              setAmount(editItem.amount.toString());
              setNote(editItem.note || "");
              setCurrentDate(new Date(editItem.date));
              if (editItem.type === "expense")
                setExpenseCategory(editItem.categoryId);
              else setIncomeCategory(editItem.categoryId);
            } else {
              if (exp.length > 0 && !expenseCategory)
                setExpenseCategory(exp[0].id);
              if (inc.length > 0 && !incomeCategory)
                setIncomeCategory(inc[0].id);
            }
          }
        } catch (error) {
          console.error("Lỗi tải danh mục:", error);
        }
      };
      loadInitialData();
      return () => {
        isMounted = false;
      };
    }, [editItem]),
  );

  const activeCategories =
    activeTab === "expense" ? expenseCategories : incomeCategories;
  const selectedCategory =
    activeTab === "expense" ? expenseCategory : incomeCategory;
  const setSelectedCategory =
    activeTab === "expense" ? setExpenseCategory : setIncomeCategory;
  const activeTailwindBg =
    activeTab === "expense" ? "bg-[#ff7f00]" : "bg-blue-500";

  const handleKeypadPress = (key: string) => {
    if (key === "backspace")
      setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
    else if (key === "C") setAmount("0");
    else if (key === "done") setShowKeypad(false);
    else {
      setAmount((prev) => {
        if (prev === "0") {
          if (key === "00" || key === "0") return "0";
          if (key === ".") return "0.";
          return key;
        }
        if (key === "." && prev.includes(".")) return prev;
        if (prev.length > 15) return prev;
        return prev + key;
      });
    }
  };

  const formatAmount = (val: string) => {
    if (!val) return "0";
    const parts = val.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",");
  };

  const onChangeDate = (event: DateTimePickerEvent, date?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (date) setCurrentDate(date);
  };

  const handleSubmit = async () => {
    try {
      const selectedCatObj = activeCategories.find(
        (c) => c.id === selectedCategory,
      );
      const transactionData = {
        type: activeTab,
        amount: parseFloat(amount.toString().replace(/\./g, "")),
        note: note,
        date: currentDate.toISOString().split("T")[0],
        categoryId: selectedCategory,
        categoryName: selectedCatObj ? selectedCatObj.name : "",
      };

      if (editItem) {
        await updateTransaction(editItem.id, transactionData);
      } else {
        await addTransaction(transactionData);
      }
      navigation?.navigate("Calendar");
    } catch (error) {
      console.error("Lỗi lưu:", error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <TouchableOpacity
          className="w-10"
          onPress={() =>
            editItem ? navigation?.goBack() : navigation?.navigate("Calendar")
          }
        >
          <Feather
            name={editItem ? "arrow-left" : "calendar"}
            size={24}
            color="#374151"
          />
        </TouchableOpacity>
        <View className="flex-1 flex-row justify-center">
          <View className="flex-row bg-gray-100 rounded-lg p-1 w-64">
            <TouchableOpacity
              onPress={() => setActiveTab("expense")}
              className={`flex-1 py-1.5 rounded-md items-center ${activeTab === "expense" ? "bg-[#ff7f00]" : ""}`}
            >
              <Text
                className={`text-sm font-medium ${activeTab === "expense" ? "text-white" : "text-gray-500"}`}
              >
                Tiền chi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("income")}
              className={`flex-1 py-1.5 rounded-md items-center ${activeTab === "income" ? "bg-[#ff7f00]" : ""}`}
            >
              <Text
                className={`text-sm font-medium ${activeTab === "income" ? "text-white" : "text-gray-500"}`}
              >
                Tiền thu
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center py-3 border-b border-gray-100">
          <Text className="w-20 text-gray-700 font-medium text-base">Ngày</Text>
          <TouchableOpacity
            onPress={() =>
              setCurrentDate((d) => new Date(d.setDate(d.getDate() - 1)))
            }
            className="p-1"
          >
            <Text className="text-gray-400 text-lg">{"<"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            className="flex-1 mx-2 bg-[#fdf8e9] py-2 rounded-md items-center"
          >
            <Text className="text-black font-medium">
              {DateUtils.getTodayFormatted(currentDate)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setCurrentDate((d) => new Date(d.setDate(d.getDate() + 1)))
            }
            className="p-1"
          >
            <Text className="text-gray-400 text-lg">{">"}</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center py-3 border-b border-gray-100">
          <Text className="w-20 text-gray-700 font-medium text-base">
            Ghi chú
          </Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Chưa nhập vào"
            placeholderTextColor="#D1D5DB"
            className="flex-1 py-2 text-base text-gray-700"
          />
        </View>
        <View className="flex-row items-center py-3 border-b border-gray-100">
          <Text className="w-20 text-gray-700 font-medium text-base">
            {activeTab === "expense" ? "Tiền chi" : "Tiền thu"}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowKeypad(true)}
            className={`flex-1 flex-row items-center justify-start rounded-md px-3 py-2 ${showKeypad ? "border-2 bg-[#fdf8e9] border-orange-400" : "bg-[#fdf8e9]"}`}
          >
            <Text
              className={`text-2xl font-medium ${activeTab === "income" ? "text-blue-600" : "text-gray-900"}`}
            >
              {formatAmount(amount)}
            </Text>
            {showKeypad && <View className="w-[2px] h-6 bg-orange-500 ml-1" />}
          </TouchableOpacity>
          <Text className="ml-3 font-medium text-gray-600 text-base">đ</Text>
        </View>

        <Text className="text-gray-700 font-medium text-base mt-4 mb-3">
          Danh mục {activeTab === "expense" ? "chi" : "thu"}
        </Text>
        <View className="flex-row flex-wrap -mx-1.5 pb-6">
          {activeCategories.map((cat) => (
            <View key={cat.id} className="w-1/3 px-1.5 mb-3">
              <TouchableOpacity
                onPress={() => setSelectedCategory(cat.id)}
                className={`w-full py-3 rounded-lg border items-center justify-center ${selectedCategory === cat.id ? "border-orange-400 bg-orange-50" : "border-gray-200"}`}
              >
                <CategoryIcon
                  icon={cat.icon}
                  color={selectedCategory === cat.id ? "#ff7f00" : "#4B5563"}
                  size={28}
                  containerClass="mb-1"
                />
                <Text
                  className={`text-xs text-center px-1 ${selectedCategory === cat.id ? "text-orange-600 font-medium" : "text-gray-600"}`}
                  numberOfLines={1}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
          <View className="w-1/3 px-1.5 mb-3">
            <TouchableOpacity
              onPress={() =>
                navigation?.navigate("EditCategory", { type: activeTab })
              }
              className="w-full py-3 rounded-lg border border-dashed border-gray-400 bg-gray-50 items-center justify-center"
            >
              <Feather name="settings" size={24} color="#6b7280" />
              <Text className="text-xs text-gray-600 text-center px-1 mt-1">
                Chỉnh sửa
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View className="bg-white border-t border-gray-100 pt-3 px-4 pb-24 z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <TouchableOpacity
          onPress={handleSubmit}
          className={`${activeTailwindBg} py-3.5 rounded-full items-center shadow-sm`}
        >
          <Text className="text-white font-bold text-lg">
            {editItem
              ? "Cập nhật thay đổi"
              : `Nhập khoản ${activeTab === "expense" ? "chi" : "thu"}`}
          </Text>
        </TouchableOpacity>
      </View>
      <BottomNav activeScreen="Input" navigation={navigation} />
      <CustomKeypad
        visible={showKeypad}
        onClose={() => setShowKeypad(false)}
        onKeyPress={handleKeypadPress}
        activeTailwindBg={activeTailwindBg}
      />
      {showPicker && (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display="spinner"
          locale="vi-VN"
          onChange={onChangeDate}
        />
      )}
    </View>
  );
}
