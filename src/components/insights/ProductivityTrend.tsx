import { View, Text } from "react-native";
import { Svg, Polyline, Circle, Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { useState } from "react";

interface ProductivityTrendProps {
  days: string[];
  bars: number[];
  barMax: number;
  points: number[];
  pointMax: number;
}

export function ProductivityTrend({
  days,
  bars,
  barMax,
  points,
  pointMax,
}: ProductivityTrendProps) {
  const [chartWidth, setChartWidth] = useState(0);
  const chartHeight = 140;
  const barCount = days.length;

  const getX = (index: number) => {
    if (chartWidth === 0) return 0;
    if (barCount <= 1) return chartWidth / 2;
    const barW = 16;
    const totalBars = barCount * barW;
    const totalGap = chartWidth - totalBars;
    const gap = barCount > 1 ? totalGap / (barCount - 1) : 0;
    return index * (barW + gap) + barW / 2;
  };

  const getBarHeight = (val: number) => {
    return barMax > 0 ? (val / barMax) * chartHeight : 0;
  };

  const getPointY = (val: number) => {
    return pointMax > 0 ? chartHeight - (val / pointMax) * chartHeight : chartHeight;
  };

  const pointsString =
    chartWidth > 0
      ? points.map((val, i) => `${getX(i)},${getPointY(val)}`).join(" ")
      : "";

  const pathData =
    chartWidth > 0
      ? `M ${getX(0)},${chartHeight} ` +
        points.map((val, i) => `L ${getX(i)},${getPointY(val)}`).join(" ") +
        ` L ${getX(barCount - 1)},${chartHeight} Z`
      : "";

  return (
    <View className="bg-white/5 rounded-3xl p-5 mb-5 border border-white/5">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-white font-semibold text-base">
          Productivity Trend
        </Text>
        <Text className="text-gray-500 text-xs font-semibold tracking-wider">
          HRS · TASKS
        </Text>
      </View>

      <View className="flex-row items-center mb-6">
        <View className="flex-row items-center mr-6">
          <View className="w-3 h-1 bg-white/20 mr-2 rounded" />
          <Text className="text-gray-400 text-xs">Hours Focused</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-1 bg-cyan-400 mr-2 rounded" />
          <Text className="text-gray-400 text-xs">Tasks Completed</Text>
        </View>
      </View>

      <View
        style={{ height: chartHeight }}
        className="flex-row items-end relative"
        onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}
      >
        {chartWidth > 0 && (
          <View
            className="absolute top-0 left-0 right-0 bottom-0 z-10"
            pointerEvents="none"
          >
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
                  cy={getPointY(val)}
                  r="4"
                  fill="#18181b"
                  stroke="#22d3ee"
                  strokeWidth="2.5"
                />
              ))}
            </Svg>
          </View>
        )}

        {days.map((day, i) => (
          <View key={i} className="items-center" style={{ width: chartWidth / barCount }}>
            <View
              className="w-3 bg-white/10 rounded-t-sm"
              style={{ height: Math.max(2, getBarHeight(bars[i])) }}
            />
          </View>
        ))}
      </View>

      <View className="flex-row justify-between mt-3 px-1">
        {days.map((day, i) => (
          <Text
            key={i}
            className="text-gray-500 text-[10px] text-center"
            style={{ width: chartWidth / barCount }}
          >
            {day}
          </Text>
        ))}
      </View>
    </View>
  );
}
