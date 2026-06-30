import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { TimerSettings } from "../../components/settings/TimerSettings";
import { SystemSettings } from "../../components/settings/SystemSettings";
import { DataManagement } from "../../components/settings/DataManagement";
import { getPomodoroConfig, getSettings, setSetting } from "../../db/operations";

export default function Settings() {
  const db = useSQLiteContext();

  const pomodoroConfig = getPomodoroConfig(db);
  const settings = getSettings(db);

  const [focusTime, setFocusTime] = useState(pomodoroConfig.focusTime);
  const [shortBreak, setShortBreak] = useState(pomodoroConfig.shortBreak);
  const [longBreak, setLongBreak] = useState(pomodoroConfig.longBreak);
  const [forceDarkMode, setForceDarkMode] = useState(
    (settings.theme ?? "dark") === "dark",
  );
  const [strictBlockMode, setStrictBlockMode] = useState(
    (settings.strict_block_mode ?? "true") === "true",
  );

  const handleFocusTimeChange = (value: number) => {
    setFocusTime(value);
    setSetting(db, "focus_time_minutes", String(value));
  };

  const handleShortBreakChange = (value: number) => {
    setShortBreak(value);
    setSetting(db, "short_break_minutes", String(value));
  };

  const handleLongBreakChange = (value: number) => {
    setLongBreak(value);
    setSetting(db, "long_break_minutes", String(value));
  };

  const handleForceDarkModeToggle = (value: boolean) => {
    setForceDarkMode(value);
    setSetting(db, "theme", value ? "dark" : "light");
  };

  const handleStrictBlockModeToggle = (value: boolean) => {
    setStrictBlockMode(value);
    setSetting(db, "strict_block_mode", String(value));
  };

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
          onFocusTimeChange={handleFocusTimeChange}
          onShortBreakChange={handleShortBreakChange}
          onLongBreakChange={handleLongBreakChange}
        />

        <SystemSettings
          forceDarkMode={forceDarkMode}
          strictBlockMode={strictBlockMode}
          onForceDarkModeToggle={handleForceDarkModeToggle}
          onStrictBlockModeToggle={handleStrictBlockModeToggle}
        />

        <DataManagement />
      </ScrollView>
    </SafeAreaView>
  );
}
