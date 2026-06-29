import { View, Text } from "react-native";

export function FocusHeatmap() {
  const months = ["Feb", "Mar", "Apr", "May", "Jun"];

  // Create a 7x21 grid for mockup
  const generateGrid = () => {
    const cols = 21;
    const rows = 7;
    const grid = [];

    for (let r = 0; r < rows; r++) {
      const rowProps = [];
      for (let c = 0; c < cols; c++) {
        // Randomly assign a color intensity
        const rand = Math.random();
        let colorClass = "bg-white/5"; // empty
        if (rand > 0.8)
          colorClass = "bg-green-400"; // high
        else if (rand > 0.6)
          colorClass = "bg-green-500/80"; // medium
        else if (rand > 0.4)
          colorClass = "bg-green-600/60"; // low
        else if (rand > 0.2) colorClass = "bg-green-800/40"; // very low

        rowProps.push(
          <View
            key={`${r}-${c}`}
            className={`w-[10px] h-[10px] rounded-sm m-[2px] ${colorClass}`}
          />,
        );
      }
      grid.push(
        <View key={`row-${r}`} className="flex-row">
          {rowProps}
        </View>,
      );
    }
    return grid;
  };

  return (
    <View className="bg-white/5 rounded-3xl p-5 mb-24 border border-white/5">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-white font-semibold text-base">
          Focus Heatmap
        </Text>
        <Text className="text-gray-500 text-xs font-semibold tracking-wider">
          LAST 18 WKS
        </Text>
      </View>

      {/* Months Header */}
      <View className="flex-row justify-between mb-2 px-1">
        {months.map((month, index) => (
          <Text key={index} className="text-gray-500 text-[10px]">
            {month}
          </Text>
        ))}
      </View>

      {/* Grid */}
      <View className="flex-col">{generateGrid()}</View>

      {/* Legend */}
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
