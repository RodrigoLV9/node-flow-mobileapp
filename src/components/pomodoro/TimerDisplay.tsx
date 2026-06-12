import { View, Text } from "react-native";

export const TimerDisplay = () => {
  return (
    <View className="items-center justify-center my-10 flex-1">
      <View className="w-72 h-72 items-center justify-center relative">
        <View
          className="absolute inset-0 rounded-full border-4 border-cyan-400 opacity-90"
          style={{
            transform: [{ rotate: "-15deg" }],
          }}
        />
        <Text className="text-white text-7xl font-light tracking-wide mt-2">
          24:59
        </Text>
        <Text className="text-gray-400 text-xs tracking-[0.2em] mt-3 font-semibold">
          FOCUS TIME
        </Text>
      </View>
      <View className="flex-row items-center justify-center gap-3 mt-14">
        <View className="w-2.5 h-2.5 rounded-full bg-white" />
        <View className="w-2.5 h-2.5 rounded-full bg-white" />
        <View className="w-2.5 h-2.5 rounded-full border-2 border-gray-600" />
        <View className="w-2.5 h-2.5 rounded-full border-2 border-gray-600" />
      </View>
    </View>
  );
};
