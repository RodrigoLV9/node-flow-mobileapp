import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Slot } from "expo-router";
import "../../global.css";

export default function Layout() {
  return (
    <View className="flex-1 bg-[#07080d]">
      <Slot />
      <StatusBar style="light" />
    </View>
  );
}
