import { View, Text } from "react-native";
import { Svg, Circle, G } from "react-native-svg";

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface TimeAllocationProps {
  segments: Segment[];
  total: number;
}

const SIZE = 128;
const STROKE_WIDTH = 14;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const BG_CLASS: Record<string, string> = {
  "#22d3ee": "bg-cyan-400",
  "#4ade80": "bg-green-400",
  "#facc15": "bg-yellow-400",
  "#fb923c": "bg-orange-400",
  "#f43f5e": "bg-rose-500",
};

export function TimeAllocation({ segments, total }: TimeAllocationProps) {
  let currentOffset = 0;
  const gap = 2;

  return (
    <View className="bg-white/5 rounded-3xl p-5 mb-5 border border-white/5">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-white font-semibold text-base">
          Tasks by Level
        </Text>
        <Text className="text-gray-500 text-xs font-semibold tracking-wider">
          COMPLETION
        </Text>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="w-32 h-32 items-center justify-center relative">
          <Svg width={SIZE} height={SIZE} className="absolute">
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke="#27272a"
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />
            <G rotation="-90" origin={`${SIZE / 2}, ${SIZE / 2}`}>
              {segments.map((item, index) => {
                const segmentValue = Math.max(0, item.value - gap);
                const segmentPct = total > 0 ? segmentValue / total : 0;
                const strokeLength = segmentPct * CIRCUMFERENCE;
                const strokeDasharray = `${strokeLength} ${CIRCUMFERENCE - strokeLength}`;
                const strokeDashoffset =
                  -(currentOffset / (total || 1)) * CIRCUMFERENCE;
                currentOffset += item.value;

                return (
                  <Circle
                    key={index}
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    stroke={item.color}
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                );
              })}
            </G>
          </Svg>

          <View className="items-center justify-center bg-[#1E1E1E] w-20 h-20 rounded-full z-10 absolute">
            <Text className="text-gray-400 text-[10px] tracking-widest mb-0.5">
              TOTAL
            </Text>
            <Text className="text-white text-2xl font-bold">{total}</Text>
          </View>
        </View>

        <View className="flex-1 ml-8">
          {segments.map((item, index) => (
            <View
              key={index}
              className="flex-row items-center justify-between mb-3"
            >
              <View className="flex-row items-center">
                <View
                  className={`w-2.5 h-2.5 rounded-full ${BG_CLASS[item.color] ?? "bg-gray-400"} mr-3`}
                />
                <Text className="text-gray-300 text-sm">{item.label}</Text>
              </View>
              <Text className="text-gray-400 text-sm">{item.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
