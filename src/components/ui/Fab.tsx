import { TouchableOpacity, View } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

interface FabProps {
  onPress: () => void;
}

export default function Fab({ onPress }: FabProps) {
  return (
    <View className="absolute bottom-[100px] right-6">
      <TouchableOpacity
        onPress={onPress}
        className="h-16 w-16 items-center justify-center rounded-full bg-[#00D4FF]"
        style={{
          shadowColor: "#00D4FF",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.6,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={32} color="black" />
      </TouchableOpacity>
    </View>
  );
}
