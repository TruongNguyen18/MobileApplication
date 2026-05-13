import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface BottomNavProps {
  activeScreen: "Input" | "Calendar" | "Report" | "Budget" | "Other";
  navigation: any;
}

export default function BottomNav({
  activeScreen,
  navigation,
}: BottomNavProps) {
  const getColor = (screenName: string) =>
    activeScreen === screenName ? "#ff7f00" : "#6b7280";

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 pt-2 pb-6 px-2 flex-row justify-between z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <TouchableOpacity
        className="items-center flex-1"
        onPress={() => navigation.navigate("AddTransaction")}
      >
        <Feather name="edit-2" size={24} color={getColor("Input")} />
        <Text
          style={{ color: getColor("Input") }}
          className="text-[10px] font-medium mt-1"
        >
          Nhập vào
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="items-center flex-1"
        onPress={() => navigation.navigate("Calendar")}
      >
        <Feather name="calendar" size={24} color={getColor("Calendar")} />
        <Text
          style={{ color: getColor("Calendar") }}
          className="text-[10px] font-medium mt-1"
        >
          Lịch
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="items-center flex-1">
        <Feather name="pie-chart" size={24} color={getColor("Report")} />
        <Text
          style={{ color: getColor("Report") }}
          className="text-[10px] font-medium mt-1"
        >
          Báo cáo
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="items-center flex-1">
        <Feather name="credit-card" size={24} color={getColor("Budget")} />
        <Text
          style={{ color: getColor("Budget") }}
          className="text-[10px] font-medium mt-1"
        >
          Ngân sách
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="items-center flex-1">
        <Feather name="more-horizontal" size={24} color={getColor("Other")} />
        <Text
          style={{ color: getColor("Other") }}
          className="text-[10px] font-medium mt-1"
        >
          Khác
        </Text>
      </TouchableOpacity>
    </View>
  );
}
