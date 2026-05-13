import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../types";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-white justify-center items-center px-4">
      <Text className="text-3xl font-bold mb-8 text-gray-800">
        Quản Lý Chi Tiêu
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("AddTransaction")}
        className="bg-orange-500 px-8 py-4 rounded-lg mb-4"
        activeOpacity={0.7}
      >
        <Text className="text-white font-bold text-lg">Thêm Giao Dịch</Text>
      </TouchableOpacity>

      <View className="mt-12 bg-gray-50 p-6 rounded-lg w-full">
        <Text className="text-gray-600 text-center">
          Chỉ bấm nút bên trên để bắt đầu quản lý giao dịch của bạn
        </Text>
      </View>
    </View>
  );
}
