import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export default function CategoryIcon({
  icon,
  color = "#4B5563",
  size = 24,
  containerClass = "",
}: any) {
  // CƠ CHẾ PHÒNG THỦ 1: Kiểm tra icon phải là chuỗi hợp lệ
  // CƠ CHẾ PHÒNG THỦ 2: Cho phép chữ cái (a-z), số (0-9), gạch ngang và gạch dưới (VD: inventory-2)
  const isMaterialIcon =
    typeof icon === "string" &&
    /^[a-zA-Z0-9_-]+$/.test(icon) &&
    icon.length > 2;

  return (
    <View className={`items-center justify-center ${containerClass}`}>
      {isMaterialIcon ? (
        <MaterialIcons name={icon as any} size={size} color={color} />
      ) : (
        /* Tránh in ra cả chữ dài gây tràn UI nếu dữ liệu lỗi, chỉ in 2 ký tự đầu hoặc icon mặc định */
        <Text style={{ fontSize: size }}>
          {typeof icon === "string" && icon.length > 0
            ? icon.substring(0, 2)
            : "💰"}
        </Text>
      )}
    </View>
  );
}
