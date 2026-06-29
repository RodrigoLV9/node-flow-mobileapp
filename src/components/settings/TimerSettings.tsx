import { View, Text } from "react-native";
import { TimeSlider } from "./TimeSlider";

interface TimerSettingsProps {
  focusTime: number;
  shortBreak: number;
  longBreak: number;
  onFocusTimeChange: (value: number) => void;
  onShortBreakChange: (value: number) => void;
  onLongBreakChange: (value: number) => void;
}

export function TimerSettings({
  focusTime,
  shortBreak,
  longBreak,
  onFocusTimeChange,
  onShortBreakChange,
  onLongBreakChange,
}: TimerSettingsProps) {
  return (
    <View className="bg-white/5 rounded-3xl p-5 mb-5 border border-white/5">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-white font-semibold text-base">
          Timer Preferences
        </Text>
        <Text className="text-gray-500 text-xs font-semibold tracking-wider">
          POMODORO
        </Text>
      </View>

      <TimeSlider
        label="Focus Time"
        value={focusTime}
        min={5}
        max={90}
        step={5}
        unit="min"
        onChange={onFocusTimeChange}
      />

      <TimeSlider
        label="Short Break"
        value={shortBreak}
        min={1}
        max={30}
        step={1}
        unit="min"
        onChange={onShortBreakChange}
      />

      <TimeSlider
        label="Long Break"
        value={longBreak}
        min={5}
        max={60}
        step={5}
        unit="min"
        onChange={onLongBreakChange}
      />
    </View>
  );
}
