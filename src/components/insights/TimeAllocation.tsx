import { View, Text } from "react-native";
import { Svg, Circle, G } from "react-native-svg";

export function TimeAllocation() {
  const data = [
    { label: "Backend", value: 40, color: "#22d3ee", bgClass: "bg-cyan-400" }, // cyan-400
    { label: "Study", value: 35, color: "#4ade80", bgClass: "bg-green-400" }, // green-400
    { label: "Other", value: 25, color: "#f43f5e", bgClass: "bg-rose-500" }, // rose-500
  ];

  const size = 128;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const gap = 3; // percentage gap

  let currentOffset = 0;

  return (
    <View className="bg-white/5 rounded-3xl p-5 mb-5 border border-white/5">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-white font-semibold text-base">Time Allocation</Text>
        <Text className="text-gray-500 text-xs font-semibold tracking-wider">WK 23</Text>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="w-32 h-32 items-center justify-center relative">
          {/* Background circle track */}
          <Svg width={size} height={size} className="absolute">
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#27272a" // zinc-800
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Segments */}
            <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
              {data.map((item, index) => {
                const segmentValue = item.value - gap;
                const strokeLength = (segmentValue / 100) * circumference;
                const strokeDasharray = `${strokeLength} ${circumference - strokeLength}`;
                const strokeDashoffset = -((currentOffset / 100) * circumference);

                // Add the full value including gap so the next segment starts correctly
                currentOffset += item.value;

                return (
                  <Circle
                    key={index}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={item.color}
                    strokeWidth={strokeWidth}
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
             <Text className="text-gray-400 text-[10px] tracking-widest mb-0.5">TOTAL</Text>
             <Text className="text-white text-2xl font-bold">35h</Text>
          </View>
        </View>

        {/* Legend */}
        <View className="flex-1 ml-8">
          {data.map((item, index) => (
            <View key={index} className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <View className={`w-2.5 h-2.5 rounded-full ${item.bgClass} mr-3`} />
                <Text className="text-gray-300 text-sm">{item.label}</Text>
              </View>
              <Text className="text-gray-400 text-sm">{item.value}%</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
