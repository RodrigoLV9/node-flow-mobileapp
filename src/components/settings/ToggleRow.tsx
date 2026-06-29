import { View, Text, Switch } from "react-native";

interface ToggleRowProps {
  label: string;
  description: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}

export function ToggleRow({
  label,
  description,
  value,
  onToggle,
}: ToggleRowProps) {
  return (
    <View className="flex-row items-center justify-between mb-4">
      <View className="flex-1 mr-4">
        <Text className="text-gray-300 text-sm">{label}</Text>
        <Text className="text-gray-600 text-xs mt-0.5">{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#3f3f46", true: "#0891b2" }}
        thumbColor={value ? "#22d3ee" : "#71717a"}
        ios_backgroundColor="#3f3f46"
      />
    </View>
  );
}
