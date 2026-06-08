import { View, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
export default function BottomNav() {
  return (
    <View className="absolute bottom-6 left-0 right-0 items-center">
      <View
        className="flex-row items-center justify-between bg-zinc-900 border border-zinc-800 rounded-3xl px-6 py-3 w-[260px]"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.5,
          shadowRadius: 15,
          elevation: 10,
        }}
      >
        <Link
          href="/Home"
          className="relative h-12 w-12 items-center justify-center"
        >
          <View
            className="absolute inset-0 rounded-2xl bg-[#00D4FF] opacity-10"
            style={{
              shadowColor: "#00D4FF",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
              shadowRadius: 20,
            }}
          />
          <Ionicons name="home-outline" size={22} color="#00D4FF" />
        </Link>

        {/* Timer */}
        <Link href="/Timer" className="h-12 w-12 items-center justify-center">
          <Ionicons name="timer-outline" size={24} color="#71717A" />
        </Link>

        {/* Analytics/Chart */}
        <TouchableOpacity className="h-12 w-12 items-center justify-center">
          <Ionicons name="bar-chart-outline" size={22} color="#71717A" />
        </TouchableOpacity>

        {/* Settings */}
        <TouchableOpacity className="h-12 w-12 items-center justify-center">
          <Ionicons name="settings-outline" size={22} color="#71717A" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
