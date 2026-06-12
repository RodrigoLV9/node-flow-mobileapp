import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TimerHeader } from "../../components/pomodoro/TimerHeader";
import { TimerDisplay } from "../../components/pomodoro/TimerDisplay";

export default function Timer() {
  return (
    <SafeAreaView className="flex-1 bg-[#121212]" edges={["top"]}>
      <View className="flex-1 px-6">
        <TimerHeader />
        <TimerDisplay />
      </View>
    </SafeAreaView>
  );
}
