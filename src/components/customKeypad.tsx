import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface customKeypadProps {
  visible: boolean;
  onClose: () => void;
  onKeyPress: (key: string) => void;
  activeTailwindBg: string; // Truyền màu từ cha (Cam/Xanh) để đổi màu nút "Xong"
}

export default function CustomKeypad({
  visible,
  onClose,
  onKeyPress,
  activeTailwindBg,
}: customKeypadProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        {/* Lớp mờ nền bấm vào để đóng */}
        <TouchableOpacity
          activeOpacity={1}
          className="absolute inset-0 bg-black/5"
          onPress={onClose}
        />

        {/* Khối bàn phím */}
        <View className="bg-gray-200 pb-6 shadow-lg border-t border-gray-300">
          <View className="flex-row h-64">
            {/* Cột các phím số */}
            <View className="flex-[3]">
              <View className="flex-1 flex-row">
                <TouchableOpacity
                  onPress={() => onKeyPress("1")}
                  className="flex-1 bg-white m-[0.5px] items-center justify-center"
                >
                  <Text className="text-2xl font-medium">1</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onKeyPress("2")}
                  className="flex-1 bg-white m-[0.5px] items-center justify-center"
                >
                  <Text className="text-2xl font-medium">2</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onKeyPress("3")}
                  className="flex-1 bg-white m-[0.5px] items-center justify-center"
                >
                  <Text className="text-2xl font-medium">3</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-1 flex-row">
                <TouchableOpacity
                  onPress={() => onKeyPress("4")}
                  className="flex-1 bg-white m-[0.5px] items-center justify-center"
                >
                  <Text className="text-2xl font-medium">4</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onKeyPress("5")}
                  className="flex-1 bg-white m-[0.5px] items-center justify-center"
                >
                  <Text className="text-2xl font-medium">5</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onKeyPress("6")}
                  className="flex-1 bg-white m-[0.5px] items-center justify-center"
                >
                  <Text className="text-2xl font-medium">6</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-1 flex-row">
                <TouchableOpacity
                  onPress={() => onKeyPress("7")}
                  className="flex-1 bg-white m-[0.5px] items-center justify-center"
                >
                  <Text className="text-2xl font-medium">7</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onKeyPress("8")}
                  className="flex-1 bg-white m-[0.5px] items-center justify-center"
                >
                  <Text className="text-2xl font-medium">8</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onKeyPress("9")}
                  className="flex-1 bg-white m-[0.5px] items-center justify-center"
                >
                  <Text className="text-2xl font-medium">9</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-1 flex-row">
                <TouchableOpacity
                  onPress={() => onKeyPress("00")}
                  className="flex-1 bg-white m-[0.5px] items-center justify-center"
                >
                  <Text className="text-2xl font-medium">00</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onKeyPress("0")}
                  className="flex-1 bg-white m-[0.5px] items-center justify-center"
                >
                  <Text className="text-2xl font-medium">0</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onKeyPress(".")}
                  className="flex-1 bg-white m-[0.5px] items-center justify-center pb-2"
                >
                  <Text className="text-4xl font-medium">.</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Cột thao tác */}
            <View className="flex-1">
              <TouchableOpacity
                onPress={() => onKeyPress("backspace")}
                className="flex-1 bg-white m-[0.5px] items-center justify-center"
              >
                <Text className="text-gray-600 text-xl font-bold">⌫</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onKeyPress("C")}
                className="flex-1 bg-white m-[0.5px] items-center justify-center"
              >
                <Text className="text-red-500 text-xl font-medium">C</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onKeyPress("done")}
                className={`flex-[2] m-[0.5px] items-center justify-center ${activeTailwindBg}`}
              >
                <Text className="text-white text-xl font-medium">Xong</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
