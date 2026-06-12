import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const TimerHeader = () => {
  return (
    <View className="flex-row items-center justify-between py-4 mt-6">
      <TouchableOpacity className="w-12 h-12 rounded-full bg-white/5 items-center justify-center">
        <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};
