import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { TimerSettings } from "../../components/settings/TimerSettings";
import { PomodoroPreferences } from "../../components/settings/PomodoroPreferences";
import { DataManagement } from "../../components/settings/DataManagement";
import { getPomodoroConfig, getSettings, setSetting } from "../../db/operations";

export default function Settings() {
  const db = useSQLiteContext();

  const pomodoroConfig = getPomodoroConfig(db);
  const settings = getSettings(db);

  const [focusTime, setFocusTime] = useState(pomodoroConfig.focusTime);
  const [shortBreak, setShortBreak] = useState(pomodoroConfig.shortBreak);
  const [longBreak, setLongBreak] = useState(pomodoroConfig.longBreak);
  const [vibrate, setVibrate] = useState(
    (settings.vibrate ?? "true") === "true",
  );
  const [autostartBreaks, setAutostartBreaks] = useState(
    (settings.autostart_breaks ?? "true") === "true",
  );
  const [autostartPomodoros, setAutostartPomodoros] = useState(
    (settings.autostart_pomodoros ?? "true") === "true",
  );
  const [showNotifications, setShowNotifications] = useState(
    (settings.show_notifications ?? "false") === "true",
  );
  const [keepScreenAwake, setKeepScreenAwake] = useState(
    (settings.keep_screen_awake ?? "true") === "true",
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

        <PomodoroPreferences
          vibrate={vibrate}
          autostartBreaks={autostartBreaks}
          autostartPomodoros={autostartPomodoros}
          showNotifications={showNotifications}
          keepScreenAwake={keepScreenAwake}
          onVibrateToggle={(v) => {
            setVibrate(v);
            setSetting(db, "vibrate", String(v));
          }}
          onAutostartBreaksToggle={(v) => {
            setAutostartBreaks(v);
            setSetting(db, "autostart_breaks", String(v));
          }}
          onAutostartPomodorosToggle={(v) => {
            setAutostartPomodoros(v);
            setSetting(db, "autostart_pomodoros", String(v));
          }}
          onShowNotificationsToggle={(v) => {
            setShowNotifications(v);
            setSetting(db, "show_notifications", String(v));
          }}
          onKeepScreenAwakeToggle={(v) => {
            setKeepScreenAwake(v);
            setSetting(db, "keep_screen_awake", String(v));
          }}
        />

        <DataManagement db={db} />
      </ScrollView>
    </SafeAreaView>
  );
}
