import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Home from "./src/app/Home";

export default function Main() {
  return (
    <View className="flex-1 bg-[#121212]">
      <Home />
      <StatusBar style="light" />
    </View>
  );
}
