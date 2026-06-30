import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ICONS } from "./constants";

interface IconPickerProps {
  selected: string;
  activeColor: string;
  onSelect: (icon: string) => void;
}

export function IconPicker({
  selected,
  activeColor,
  onSelect,
}: IconPickerProps) {
  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 16 }}
    >
      <View className="flex-row flex-wrap justify-start">
        {ICONS.map((icon) => {
          const isActive = icon === selected;

          return (
            <TouchableOpacity
              key={icon}
              onPress={() => onSelect(icon)}
              className="items-center justify-center m-1.5 rounded-xl"
              activeOpacity={0.7}
              style={{
                width: 56,
                height: 56,
                backgroundColor: isActive
                  ? activeColor + "20"
                  : "rgba(255,255,255,0.03)",
                borderWidth: 1,
                borderColor: isActive
                  ? activeColor + "50"
                  : "rgba(255,255,255,0.06)",
              }}
            >
              <Ionicons
                name={icon as any}
                size={22}
                color={isActive ? activeColor : "#52525b"}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
