import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface HeaderProps {
  name: string;
  selectedDate: string;
}

export default function Header({ name, selectedDate }: HeaderProps) {
  const d = new Date(selectedDate + "T00:00:00");
  const monthLabel = MONTHS[d.getMonth()];
  const yearLabel = String(d.getFullYear());

  return (
    <View className="mb-6 px-6 flex-row items-start justify-between">
      <View className="flex-1">
        <Text className="text-3xl font-bold text-white mb-1">
          Hello, {name}
        </Text>
        <View className="flex-row items-center">
          <Text className="text-zinc-400 text-base mr-2">
            Let's enter the flow state
          </Text>
          <View className="bg-white/5 rounded-lg px-2.5 py-1">
            <Text className="text-cyan-400 text-xs font-semibold">
              {monthLabel} {yearLabel}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/calendar")}
        className="w-11 h-11 rounded-2xl bg-white/5 items-center justify-center ml-3"
        activeOpacity={0.6}
        style={{
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <Ionicons name="calendar-outline" size={20} color="#22d3ee" />
      </TouchableOpacity>
    </View>
  );
}
