import { View, Text } from "react-native";

interface HeatmapEntry {
  date: string;
  weight: number;
}

interface FocusHeatmapProps {
  data: HeatmapEntry[];
  maxWeight: number;
}

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function FocusHeatmap({ data, maxWeight }: FocusHeatmapProps) {
  const today = new Date();
  const cols = 21;
  const rows = 7;

  const dateMap = new Map<string, number>();
  data.forEach((d) => dateMap.set(d.date, d.weight));

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - cols * rows + 1);

  const months: string[] = [];
  const grid: { day: number; weight: number; date: string }[][] = [];

  let currentDate = new Date(startDate);
  let currentMonth = -1;
  let currentRow: { day: number; weight: number; date: string }[] = [];
  let dayCount = 0;

  while (dayCount < cols * rows) {
    const dateStr = currentDate.toISOString().slice(0, 10);
    const weight = dateMap.get(dateStr) ?? 0;
    const month = currentDate.getMonth();

    if (month !== currentMonth && dateStr >= today.toISOString().slice(0, 10)) {
      // skip future dates for month labels
    } else if (month !== currentMonth && dayCount < cols * rows) {
      currentMonth = month;
    }

    currentRow.push({
      day: currentDate.getDate(),
      weight,
      date: dateStr,
    });

    dayCount++;
    if (currentRow.length === cols) {
      grid.push(currentRow);
      currentRow = [];
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Collect unique months that appear
  for (let i = 0; i < Math.min(4, grid.length); i++) {
    const row = grid[i];
    if (row && row.length > 0) {
      const d = new Date(row[0].date + "T00:00:00");
      const m = MONTHS_SHORT[d.getMonth()];
      if (!months.includes(m)) months.push(m);
    }
  }

  const getColor = (weight: number): string => {
    if (weight <= 0) return "bg-white/5";
    const ratio = Math.min(1, weight / (maxWeight || 1));
    if (ratio > 0.75) return "bg-green-400";
    if (ratio > 0.5) return "bg-green-500/80";
    if (ratio > 0.25) return "bg-green-600/60";
    return "bg-green-800/40";
  };

  return (
    <View className="bg-white/5 rounded-3xl p-5 mb-24 border border-white/5">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-white font-semibold text-base">
          Focus Heatmap
        </Text>
        <Text className="text-gray-500 text-xs font-semibold tracking-wider">
          TASK WEIGHT
        </Text>
      </View>

      <View className="flex-row justify-between mb-2 px-1">
        {months.map((m, i) => (
          <Text key={i} className="text-gray-500 text-[10px]">
            {m}
          </Text>
        ))}
      </View>

      <View className="items-center">
        {grid.map((row, ri) => (
          <View key={ri} className="flex-row">
            {row.map((cell, ci) => (
              <View
                key={ci}
                className={`w-[10px] h-[10px] rounded-sm m-[2px] ${getColor(cell.weight)}`}
              />
            ))}
          </View>
        ))}
      </View>

      <View className="flex-row items-center justify-end mt-4">
        <Text className="text-gray-500 text-[10px] mr-2">Less</Text>
        <View className="flex-row">
          <View className="w-2.5 h-2.5 rounded-sm m-[1px] bg-white/5" />
          <View className="w-2.5 h-2.5 rounded-sm m-[1px] bg-green-800/40" />
          <View className="w-2.5 h-2.5 rounded-sm m-[1px] bg-green-600/60" />
          <View className="w-2.5 h-2.5 rounded-sm m-[1px] bg-green-500/80" />
          <View className="w-2.5 h-2.5 rounded-sm m-[1px] bg-green-400" />
        </View>
        <Text className="text-gray-500 text-[10px] ml-2">More</Text>
      </View>
    </View>
  );
}
