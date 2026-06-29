import { View, Text } from "react-native";
import { ToggleRow } from "./ToggleRow";

interface SystemSettingsProps {
  forceDarkMode: boolean;
  strictBlockMode: boolean;
  onForceDarkModeToggle: (value: boolean) => void;
  onStrictBlockModeToggle: (value: boolean) => void;
}

export function SystemSettings({
  forceDarkMode,
  strictBlockMode,
  onForceDarkModeToggle,
  onStrictBlockModeToggle,
}: SystemSettingsProps) {
  return (
    <View className="bg-white/5 rounded-3xl p-5 mb-5 border border-white/5">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-white font-semibold text-base">
          System Preferences
        </Text>
        <Text className="text-gray-500 text-xs font-semibold tracking-wider">
          APP
        </Text>
      </View>

      <View>
        <ToggleRow
          label="Force Dark Mode"
          description="Overrides system theme with dark appearance"
          value={forceDarkMode}
          onToggle={onForceDarkModeToggle}
        />

        <ToggleRow
          label="Strict Block Mode"
          description="Prevents switching apps during focus sessions"
          value={strictBlockMode}
          onToggle={onStrictBlockModeToggle}
        />
      </View>
    </View>
  );
}
