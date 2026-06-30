import { View, TouchableOpacity } from "react-native";
import { COLORS } from "./constants";

interface ColorPickerProps {
  selected: string;
  onSelect: (color: string) => void;
}

export function ColorPicker({ selected, onSelect }: ColorPickerProps) {
  return (
    <View className="flex-row flex-wrap justify-start mt-2">
      {COLORS.map((color) => {
        const isActive = color === selected;
        return (
          <TouchableOpacity
            key={color}
            onPress={() => onSelect(color)}
            className="m-1.5 items-center justify-center rounded-full"
            activeOpacity={0.7}
            style={{
              width: 36,
              height: 36,
              backgroundColor: color,
              borderWidth: isActive ? 3 : 0,
              borderColor: "#ffffff",
              shadowColor: isActive ? color : "transparent",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 6,
              elevation: isActive ? 6 : 0,
            }}
          />
        );
      })}
    </View>
  );
}
