import { View, Text } from "react-native";
import { ToggleRow } from "./ToggleRow";

interface PomodoroPreferencesProps {
  vibrate: boolean;
  autostartBreaks: boolean;
  autostartPomodoros: boolean;
  showNotifications: boolean;
  keepScreenAwake: boolean;
  onVibrateToggle: (value: boolean) => void;
  onAutostartBreaksToggle: (value: boolean) => void;
  onAutostartPomodorosToggle: (value: boolean) => void;
  onShowNotificationsToggle: (value: boolean) => void;
  onKeepScreenAwakeToggle: (value: boolean) => void;
}

export function PomodoroPreferences({
  vibrate,
  autostartBreaks,
  autostartPomodoros,
  showNotifications,
  keepScreenAwake,
  onVibrateToggle,
  onAutostartBreaksToggle,
  onAutostartPomodorosToggle,
  onShowNotificationsToggle,
  onKeepScreenAwakeToggle,
}: PomodoroPreferencesProps) {
  return (
    <View className="bg-white/5 rounded-3xl p-5 mb-5 border border-white/5">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-white font-semibold text-base">
          Pomodoro Preferences
        </Text>
        <Text className="text-gray-500 text-xs font-semibold tracking-wider">
          BEHAVIOR
        </Text>
      </View>

      <View className="mt-3">
        <ToggleRow
          label="Vibrate"
          description="Vibrate when a session finishes"
          value={vibrate}
          onToggle={onVibrateToggle}
        />

        <ToggleRow
          label="Auto-Start Breaks"
          description="Automatically start break after focus time ends"
          value={autostartBreaks}
          onToggle={onAutostartBreaksToggle}
        />

        <ToggleRow
          label="Auto-Start Pomodoros"
          description="Automatically start next focus after break ends"
          value={autostartPomodoros}
          onToggle={onAutostartPomodorosToggle}
        />

        <ToggleRow
          label="Show Notifications"
          description="Send a notification on phase change"
          value={showNotifications}
          onToggle={onShowNotificationsToggle}
        />

        <ToggleRow
          label="Keep Screen Awake"
          description="Prevent screen from sleeping during focus"
          value={keepScreenAwake}
          onToggle={onKeepScreenAwakeToggle}
        />
      </View>
    </View>
  );
}
