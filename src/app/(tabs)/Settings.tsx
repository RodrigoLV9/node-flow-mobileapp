import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { TimerSettings } from "../../components/settings/TimerSettings";
import { SystemSettings } from "../../components/settings/SystemSettings";
import { DataManagement } from "../../components/settings/DataManagement";
import appData from "../../data/example.json";

export default function Settings() {
  const [focusTime, setFocusTime] = useState(
    appData.preferences.focus_time_minutes,
  );
  const [shortBreak, setShortBreak] = useState(
    appData.preferences.short_break_minutes,
  );
  const [longBreak, setLongBreak] = useState(
    appData.preferences.long_break_minutes,
  );
  const [forceDarkMode, setForceDarkMode] = useState(
    appData.preferences.theme === "dark",
  );
  const [strictBlockMode, setStrictBlockMode] = useState(
    appData.preferences.strict_block_mode,
  );

  return (
    <SafeAreaView className="flex-1 bg-[#121111]">
      <ScrollView
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-6 mt-2">
          <Text className="text-white text-xl font-semibold">Settings</Text>
        </View>

        <TimerSettings
          focusTime={focusTime}
          shortBreak={shortBreak}
          longBreak={longBreak}
          onFocusTimeChange={setFocusTime}
          onShortBreakChange={setShortBreak}
          onLongBreakChange={setLongBreak}
        />

        <SystemSettings
          forceDarkMode={forceDarkMode}
          strictBlockMode={strictBlockMode}
          onForceDarkModeToggle={setForceDarkMode}
          onStrictBlockModeToggle={setStrictBlockMode}
        />

        <DataManagement />
      </ScrollView>
    </SafeAreaView>
  );
}
