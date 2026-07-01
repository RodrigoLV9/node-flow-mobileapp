import { View, Text } from "react-native";
import { PomodoroPhase } from "./types";

interface TimerHeaderProps {
  taskTitle?: string;
  taskLevel?: number;
  phase: PomodoroPhase;
  focusCount: number;
}

export function TimerHeader({
  taskTitle,
  taskLevel,
  phase,
  focusCount,
}: TimerHeaderProps) {
  const isBreak = phase.type === "short_break" || phase.type === "long_break";

  return (
    <View className="items-center py-4 mt-6">
      {taskTitle ? (
        <>
          <Text
            className="text-white text-sm font-semibold"
            numberOfLines={1}
          >
            {taskTitle}
          </Text>
          <View className="flex-row items-center mt-1">
            {taskLevel && (
              <View className="px-2 py-0.5 rounded bg-[#E5A84D15]">
                <Text className="text-[#E5A84D] text-[10px] font-semibold">
                  Nivel {taskLevel}
                </Text>
              </View>
            )}
          </View>
        </>
      ) : (
        <Text className="text-gray-500 text-sm font-medium">
          {isBreak ? "Break Time" : `Focus Session ${focusCount + 1}`}
        </Text>
      )}
    </View>
  );
}
