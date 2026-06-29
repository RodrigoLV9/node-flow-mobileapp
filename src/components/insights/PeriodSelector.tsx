import { View, Text, TouchableOpacity } from "react-native";

interface PeriodSelectorProps {
  periods: string[];
  activePeriod: string;
  onSelect: (period: string) => void;
}

export function PeriodSelector({ periods, activePeriod, onSelect }: PeriodSelectorProps) {
  return (
    <View className="flex-row items-center justify-between rounded-xl border border-white/10 p-1 mb-6">
      {periods.map((period) => {
        const isActive = period === activePeriod;
        return (
          <TouchableOpacity
            key={period}
            onPress={() => onSelect(period)}
            className={`flex-1 items-center justify-center py-2 rounded-lg ${
              isActive ? "bg-white/5 border border-cyan-500/50" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                isActive ? "text-cyan-400" : "text-gray-400"
              }`}
            >
              {period}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
