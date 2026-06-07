import { View, Text, ScrollView, TouchableOpacity } from "react-native";

const days = [
  { day: "MON", date: "15" },
  { day: "TUE", date: "16" },
  { day: "WED", date: "17", active: true },
  { day: "THU", date: "18" },
  { day: "FRI", date: "19" },
  { day: "SAT", date: "20" },
];

export default function CalendarStrip() {
  return (
    <View className="mb-8 pl-6">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        {days.map((item, index) => {
          const isActive = item.active;
          return (
            <TouchableOpacity
              key={index}
              className={`mr-4 items-center justify-center rounded-2xl py-3 w-16 bg-zinc-900 border ${
                isActive ? "border-cyan-400" : "border-zinc-800"
              }`}
              style={
                isActive
                  ? {
                      shadowColor: "#00D4FF",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.8,
                      shadowRadius: 10,
                      elevation: 10,
                    }
                  : {}
              }
            >
              <Text className="text-zinc-500 text-xs font-semibold mb-1">
                {item.day}
              </Text>
              <Text
                className={`text-xl font-bold ${
                  isActive ? "text-white" : "text-zinc-300"
                }`}
              >
                {item.date}
              </Text>
            </TouchableOpacity>
          );
        })}
        <View className="w-6" />
      </ScrollView>
    </View>
  );
}
