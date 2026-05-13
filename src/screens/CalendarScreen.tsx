import { Feather } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import BottomNav from "../components/bottomNav";
import TransactionItem from "../components/transactionItem";
import {
  getCategoriesByType,
  getTransactionsByMonth,
} from "../database/queries";

// --- CÁC HÀM TRỢ GIÚP ---
const formatCurrency = (amount: number) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
};

const formatDateString = (d: Date) => {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
};

const formatDayHeader = (dateString: string) => {
  const d = new Date(dateString);
  const days = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"];
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()} (${days[d.getDay()]})`;
};

const isSameDay = (d1: Date, d2: Date) => {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

export default function CalendarScreen() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  // --- REFS ĐỂ ĐIỀU KHIỂN CUỘN TRONG DANH SÁCH ---
  const scrollViewRef = useRef<ScrollView>(null);
  const sectionLayouts = useRef<{ [key: string]: number }>({});

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categoriesMap, setCategoriesMap] = useState<Record<string, any>>({});

  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [tempYear, setTempYear] = useState(currentMonth.getFullYear());

  // --- TẢI DỮ LIỆU ---
  const loadData = useCallback(async () => {
    try {
      const exp = await getCategoriesByType("expense");
      const inc = await getCategoriesByType("income");
      const catMap: Record<string, any> = {};
      [...(exp as any[]), ...(inc as any[])].forEach((c) => {
        catMap[c.id] = c;
      });

      const monthStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`;
      const data = await getTransactionsByMonth(monthStr);

      setCategoriesMap(catMap);
      setTransactions(data as any[]);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    }
  }, [currentMonth]);

  useEffect(() => {
    if (isFocused) loadData();
  }, [isFocused, loadData]);

  // --- HÀM XỬ LÝ KHI NHẤN NGÀY TRÊN LỊCH ---
  const handleDayPress = (fullDate: Date) => {
    setSelectedDate(fullDate);
    const dateStr = formatDateString(fullDate);

    // Lấy tọa độ Y của ngày đó trong ScrollView
    const yPos = sectionLayouts.current[dateStr];

    if (yPos !== undefined && scrollViewRef.current) {
      // Cuộn chính xác đến vị trí Y đó
      scrollViewRef.current.scrollTo({
        y: yPos,
        animated: true,
      });
    }
  };

  // --- GỘP NHÓM DỮ LIỆU THEO NGÀY ---
  const groupedTransactions = useMemo(() => {
    const groups: {
      [key: string]: { date: string; total: number; data: any[] };
    } = {};
    transactions.forEach((t) => {
      if (!groups[t.date])
        groups[t.date] = { date: t.date, total: 0, data: [] };
      groups[t.date].data.push(t);
      groups[t.date].total += t.type === "income" ? t.amount : -t.amount;
    });
    return Object.values(groups).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [transactions]);

  // --- LƯỚI LỊCH ---
  const calendarData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    let startingDay = firstDay.getDay() - 1;
    if (startingDay === -1) startingDay = 6;
    const days = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    for (let i = 0; i < startingDay; i++) {
      days.push({
        day: prevMonthLastDay - startingDay + i + 1,
        isCurrentMonth: false,
        fullDate: new Date(
          year,
          month - 1,
          prevMonthLastDay - startingDay + i + 1,
        ),
      });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        fullDate: new Date(year, month, i),
      });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, i),
      });
    }
    return days;
  }, [currentMonth]);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const netTotal = totalIncome - totalExpense;

  const selectMonth = (monthIndex: number) => {
    setCurrentMonth(new Date(tempYear, monthIndex, 1));
    setShowMonthPicker(false);
  };

  return (
    <View className="flex-1 bg-[#f4f6f8]">
      {/* =========================================================
          PHẦN 1: CỐ ĐỊNH (KHÔNG CUỘN)
          Bao gồm: Header đổi tháng, Lưới lịch, và Bảng tổng kết
          ========================================================= */}
      <View>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Feather name="arrow-left" size={24} color="#374151" />
          </TouchableOpacity>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1,
                    1,
                  ),
                )
              }
              className="p-2"
            >
              <Feather name="chevron-left" size={24} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setTempYear(currentMonth.getFullYear());
                setShowMonthPicker(true);
              }}
              className="mx-4 flex-row items-center bg-orange-50 px-4 py-2 rounded-lg"
            >
              <Text className="text-xl font-bold text-gray-800 mr-2">
                {String(currentMonth.getMonth() + 1).padStart(2, "0")}/
                {currentMonth.getFullYear()}
              </Text>
              <Feather name="calendar" size={18} color="#FF7F00" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1,
                    1,
                  ),
                )
              }
              className="p-2"
            >
              <Feather name="chevron-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          <View className="w-10" />
        </View>

        {/* Lưới Lịch */}
        <View className="bg-white px-2 pb-2">
          <View className="flex-row border-b border-gray-100 py-2">
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d, i) => (
              <Text
                key={i}
                className={`flex-1 text-center text-xs font-medium ${d === "CN" || d === "T7" ? "text-blue-500" : "text-gray-500"}`}
              >
                {d}
              </Text>
            ))}
          </View>
          <View className="flex-row flex-wrap">
            {calendarData.map((item, idx) => {
              const isSelected = isSameDay(item.fullDate, selectedDate);
              const dateStr = formatDateString(item.fullDate);
              const dayTrans = transactions.filter((t) => t.date === dateStr);
              const dayInc = dayTrans
                .filter((t) => t.type === "income")
                .reduce((s, t) => s + t.amount, 0);
              const dayExp = dayTrans
                .filter((t) => t.type === "expense")
                .reduce((s, t) => s + t.amount, 0);

              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() =>
                    item.isCurrentMonth && handleDayPress(item.fullDate)
                  }
                  className={`w-[14.28%] h-[52px] pt-1 items-center border-b border-gray-50 ${!item.isCurrentMonth ? "opacity-20" : ""}`}
                >
                  <View
                    className={`w-7 h-7 items-center justify-center rounded-full ${isSelected ? "bg-[#ff7f00]" : ""}`}
                  >
                    <Text
                      className={`font-medium ${isSelected ? "text-white" : "text-gray-800"}`}
                    >
                      {item.day}
                    </Text>
                  </View>
                  <View className="mt-0.5 items-center w-full px-0.5">
                    {dayInc > 0 && (
                      <Text
                        className="text-[9px] text-blue-500 truncate"
                        numberOfLines={1}
                      >
                        +{formatCurrency(dayInc)}
                      </Text>
                    )}
                    {dayExp > 0 && (
                      <Text
                        className="text-[9px] text-red-500 truncate"
                        numberOfLines={1}
                      >
                        -{formatCurrency(dayExp)}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Tổng Kết Tháng */}
        <View className="bg-white flex-row py-3 mt-2 border-y border-gray-100 shadow-sm">
          <View className="flex-1 items-center border-r border-gray-100">
            <Text className="text-gray-500 text-xs mb-1 font-medium">
              Thu nhập
            </Text>
            <Text className="text-blue-500 font-bold text-base">
              {formatCurrency(totalIncome)}
            </Text>
          </View>
          <View className="flex-1 items-center border-r border-gray-100">
            <Text className="text-gray-500 text-xs mb-1 font-medium">
              Chi tiêu
            </Text>
            <Text className="text-red-500 font-bold text-base">
              {formatCurrency(totalExpense)}
            </Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-gray-500 text-xs mb-1 font-medium">Tổng</Text>
            <Text
              className={`font-bold text-base ${netTotal >= 0 ? "text-blue-500" : "text-red-500"}`}
            >
              {netTotal > 0 ? "+" : ""}
              {formatCurrency(netTotal)}
            </Text>
          </View>
        </View>
      </View>

      {/* =========================================================
          PHẦN 2: CHO PHÉP CUỘN (SCROLLABLE)
          Chỉ chứa danh sách các giao dịch chi tiết
          ========================================================= */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 bg-white mt-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }} // Chừa khoảng trống cho Bottom Nav
      >
        {groupedTransactions.length === 0 ? (
          <Text className="text-center text-gray-400 mt-10">
            Chưa có giao dịch nào trong tháng này
          </Text>
        ) : (
          groupedTransactions.map((group) => (
            <View
              key={group.date}
              // Lấy tọa độ Y chính xác bên trong ScrollView
              onLayout={(event) => {
                sectionLayouts.current[group.date] = event.nativeEvent.layout.y;
              }}
            >
              {/* Tiêu đề Ngày */}
              <View className="flex-row justify-between items-center px-4 py-2 bg-gray-100 border-y border-gray-200 mt-2">
                <Text className="text-sm font-semibold text-gray-700">
                  {formatDayHeader(group.date)}
                </Text>
                <Text
                  className={`text-sm font-bold ${group.total >= 0 ? "text-blue-600" : "text-red-500"}`}
                >
                  {group.total > 0 ? "+" : ""}
                  {formatCurrency(group.total)}
                </Text>
              </View>

              {/* Các giao dịch trong ngày */}
              {group.data.map((t) => (
                <TransactionItem
                  key={t.id}
                  transaction={t}
                  category={categoriesMap[t.categoryId]}
                  onPress={() =>
                    navigation.navigate("AddTransaction", { editItem: t })
                  }
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>

      {/* MODAL CHỌN THÁNG */}
      <Modal
        visible={showMonthPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
          activeOpacity={1}
          onPress={() => setShowMonthPicker(false)}
        >
          <View
            className="bg-white w-[85%] rounded-2xl p-4"
            onStartShouldSetResponder={() => true}
          >
            <View className="flex-row justify-between items-center mb-6">
              <TouchableOpacity
                onPress={() => setTempYear((y) => y - 1)}
                className="p-2 bg-gray-100 rounded-full"
              >
                <Feather name="chevron-left" size={24} color="#374151" />
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-gray-800">
                {tempYear}
              </Text>
              <TouchableOpacity
                onPress={() => setTempYear((y) => y + 1)}
                className="p-2 bg-gray-100 rounded-full"
              >
                <Feather name="chevron-right" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            <View className="flex-row flex-wrap justify-between">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m, index) => {
                const isActive =
                  tempYear === currentMonth.getFullYear() &&
                  index === currentMonth.getMonth();
                return (
                  <TouchableOpacity
                    key={m}
                    onPress={() => selectMonth(index)}
                    className={`w-[30%] py-4 rounded-xl mb-3 items-center ${isActive ? "bg-[#FF7F00]" : "bg-gray-50"}`}
                  >
                    <Text
                      className={`font-medium text-base ${isActive ? "text-white" : "text-gray-700"}`}
                    >
                      Tháng {m}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <BottomNav activeScreen="Calendar" navigation={navigation} />
    </View>
  );
}
