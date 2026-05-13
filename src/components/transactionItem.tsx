import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CategoryIcon from "./categoryIcon"; // BẮT BUỘC PHẢI IMPORT CÁI NÀY

interface TransactionItemProps {
  transaction: any;
  category: any;
  onPress: () => void;
}

export default function TransactionItem({
  transaction,
  category,
  onPress,
}: TransactionItemProps) {
  const isIncome = transaction.type === "income";
  const categoryName = transaction.categoryName || "Khác";

  const formatCurrency = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center px-4 py-3 border-b border-gray-50 active:bg-gray-100"
    >
      <View
        className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${isIncome ? "bg-blue-50" : "bg-orange-50"}`}
      >
        {/* ĐIỂM CHÚT CHỐT: Đã thay thẻ <Text> cũ bằng <CategoryIcon> */}
        <CategoryIcon
          icon={
            category?.icon ||
            (isIncome ? "account-balance-wallet" : "shopping-cart")
          }
          color={category?.color || (isIncome ? "#2563EB" : "#EA580C")}
          size={24}
        />
      </View>

      <View className="flex-1">
        <Text className="text-base text-gray-800 font-medium">
          {categoryName}{" "}
          {transaction.note && (
            <Text className="text-gray-400 font-normal">
              ({transaction.note})
            </Text>
          )}
        </Text>
      </View>

      <Text
        className={`font-medium ${isIncome ? "text-blue-600" : "text-red-500"}`}
      >
        {isIncome ? "+" : "-"}
        {formatCurrency(transaction.amount)}
      </Text>
    </TouchableOpacity>
  );
}
