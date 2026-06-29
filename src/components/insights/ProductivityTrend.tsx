import { View, Text } from "react-native";
import { Svg, Polyline, Circle, Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { useState } from "react";

export function ProductivityTrend() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const bars = [40, 60, 80, 50, 100, 45, 65];   // Percentages for bar heights
  const points = [30, 50, 60, 40, 85, 45, 55];  // Percentages for line points

  const [chartWidth, setChartWidth] = useState(0);
  const chartHeight = 160;

  // Assuming `justify-between` on container for X-coords calculation
  // item width is 32px (w-8). Space between items depends on total width.
  // There are 7 items, total width taken by items is 7 * 32 = 224px.
  // Gap width total = chartWidth - 224. Gap per space = (chartWidth - 224) / 6.
  // Center of item `i` = i * 32 + i * gap + 16(half width of the item).
  // which simplifies to:
  const getX = (index: number) => {
    if (chartWidth === 0) return 0;
    if (index === 0) return 16;
    if (index === 6) return chartWidth - 16;
    const gap = (chartWidth - 224) / 6;
    return index * (32 + gap) + 16;
  };

  const getY = (percentage: number) => {
    return chartHeight - (percentage / 100) * chartHeight;
  };

  const pointsString = points
    .map((val, i) => `${getX(i)},${getY(val)}`)
    .join(" ");

  // Create a filled area under the line with gradient
  const pathData = chartWidth > 0 ? `M 16,${chartHeight} ` +
    points.map((val, i) => `L ${getX(i)},${getY(val)}`).join(" ") +
    ` L ${chartWidth - 16},${chartHeight} Z` : "";

  return (
    <View className="bg-white/5 rounded-3xl p-5 mb-5 border border-white/5">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-white font-semibold text-base">Productivity Trend</Text>
        <Text className="text-gray-500 text-xs font-semibold tracking-wider">HRS · TASKS</Text>
      </View>

      <View className="flex-row items-center mb-8">
        <View className="flex-row items-center mr-6">
          <View className="w-3 h-1 bg-white/20 mr-2 rounded" />
          <Text className="text-gray-400 text-xs">Hours Focused</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-1 bg-cyan-400 mr-2 rounded" />
          <Text className="text-gray-400 text-xs">Tasks Completed</Text>
        </View>
      </View>

      {/* Chart Area */}
      <View 
        style={{ height: chartHeight }} 
        className="flex-row items-end justify-between relative"
        onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}
      >
        {chartWidth > 0 && (
          <View className="absolute top-0 left-0 right-0 bottom-0 z-10">
            <Svg width="100%" height="100%">
              <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#22d3ee" stopOpacity="0.3" />
                  <Stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
                </LinearGradient>
              </Defs>
              <Path d={pathData} fill="url(#grad)" />
              <Polyline
                points={pointsString}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2"
              />
              {points.map((val, i) => (
                <Circle
                  key={i}
                  cx={getX(i)}
                  cy={getY(val)}
                  r="4"
                  fill="#18181b" // zinc-900 (background to simulate hole)
                  stroke="#22d3ee"
                  strokeWidth="2.5"
                />
              ))}
            </Svg>
          </View>
        )}

        {days.map((day, index) => (
          <View key={index} className="items-center w-8">
             {/* Bar */}
            <View 
               className="w-4 bg-white/10 rounded-t-sm" 
               style={{ height: `${bars[index]}%` }}
            />
          </View>
        ))}
      </View>

      {/* X-Axis Labels */}
      <View className="flex-row justify-between mt-3 px-1">
        {days.map((day, index) => (
          <Text key={index} className="text-gray-500 text-[10px] w-8 text-center">{day}</Text>
        ))}
      </View>
    </View>
  );
}
