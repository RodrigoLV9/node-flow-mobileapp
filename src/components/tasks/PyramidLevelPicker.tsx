import { View, Text, TouchableOpacity } from "react-native";
import { LEVEL_COLORS } from "../../lib/constants";

const LEVELS = [1, 2, 3, 4, 5].map((level) => ({
  level,
  color: LEVEL_COLORS[level],
}));

interface PyramidLevelPickerProps {
  value: number;
  onChange: (level: number) => void;
}

export function PyramidLevelPicker({
  value,
  onChange,
}: PyramidLevelPickerProps) {
  return (
    <View className="items-center">
      <View className="flex-row">
        {LEVELS.map((item) => {
          const isActive = value === item.level;
          const baseWidth = 48 + (5 - item.level) * 4;

          return (
            <TouchableOpacity
              key={item.level}
              onPress={() => onChange(item.level)}
              className="items-center justify-center mx-1 rounded-lg"
              activeOpacity={0.7}
              style={{
                width: baseWidth,
                height: 44,
                backgroundColor: isActive
                  ? item.color + "20"
                  : "rgba(255,255,255,0.03)",
                borderWidth: 1,
                borderColor: isActive
                  ? item.color + "60"
                  : "rgba(255,255,255,0.06)",
              }}
            >
              <Text
                className="font-bold text-sm"
                style={{ color: isActive ? item.color : "#52525b" }}
              >
                {item.level}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="flex-row items-center mt-2">
        <Text className="text-gray-600 text-[10px] mr-2">Easy</Text>
        {LEVELS.map((item, i) => (
          <View
            key={i}
            className="h-0.5 mx-[3px]"
            style={{
              width: 32 - i * 2,
              backgroundColor: value >= item.level ? item.color : "transparent",
            }}
          />
        ))}
        <Text className="text-gray-600 text-[10px] ml-2">Intense</Text>
      </View>
    </View>
  );
}
