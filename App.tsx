import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initDatabase } from "./src/database/schema";
import "./src/global.css";
import AddTransactionScreen from "./src/screens/AddTransactionScreen";
import CalendarScreen from "./src/screens/CalendarScreen";
import EditCategoryScreen from "./src/screens/EditCategoryScreen";
import HomeScreen from "./src/screens/HomeScreen";
import { RootStackParamList } from "./src/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  // 1. Thêm state để chặn màn hình render khi Database chưa khởi tạo xong
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initDatabase();
        console.log("Database đã khởi tạo thành công!");
        setIsDbReady(true); // 2. Báo hiệu tạo bảng xong
      } catch (err) {
        console.error("Lỗi khởi tạo Database:", err);
      }
    };

    setupDatabase();
  }, []);
  // 3. Hiện vòng xoay màu cam trong lúc chờ
  if (!isDbReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  // 4. Render App bình thường khi Database đã sẵn sàng
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            screenOptions={{
              headerShown: true,
              headerTintColor: "#FF6B35",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: "Quản Lý Chi Tiêu" }}
            />
            <Stack.Screen
              name="AddTransaction"
              component={AddTransactionScreen}
              options={{ title: "Thêm Giao Dịch" }}
            />
            <Stack.Screen
              name="Calendar"
              component={CalendarScreen}
              options={{ title: "Lịch" }}
            />
            <Stack.Screen
              name="EditCategory"
              component={EditCategoryScreen}
              options={{ title: "Quản lý danh mục" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
