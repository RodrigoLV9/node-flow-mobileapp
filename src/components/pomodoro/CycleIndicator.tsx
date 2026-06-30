import { View } from "react-native";
import { PhaseType, FOCUS_SESSIONS_PER_CYCLE } from "./types";

interface CycleIndicatorProps {
  completedFocus: number;
  currentPhaseType: PhaseType;
  currentFocusIndex: number;
}

export function CycleIndicator({
  completedFocus,
  currentPhaseType,
  currentFocusIndex,
}: CycleIndicatorProps) {
  const dots = Array.from({ length: FOCUS_SESSIONS_PER_CYCLE });

  return (
    <View className="flex-row items-center justify-center mt-4 pb-8">
      {dots.map((_, i) => {
        const isCompleted = i < completedFocus;
        const isCurrent =
          currentPhaseType === "focus" && currentFocusIndex === i;
        const active = isCompleted || isCurrent;
        const isSeparator = i === 4;

        return (
          <View key={i} className="flex-row items-center">
            {isSeparator && <View className="w-2" />}
            <View
              className="rounded-full bg-cyan-400"
              style={{
                width: active ? 12 : 10,
                height: active ? 12 : 10,
                marginHorizontal: 5,
                backgroundColor: active ? "#22d3ee" : "rgba(255,255,255,0.1)",
                shadowColor: active ? "#22d3ee" : "transparent",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: active ? 0.6 : 0,
                shadowRadius: 4,
                elevation: active ? 4 : 0,
              }}
            />
          </View>
        );
      })}
    </View>
  );
}
