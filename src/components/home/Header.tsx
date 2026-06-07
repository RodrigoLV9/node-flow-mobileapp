import { View, Text } from "react-native";

interface HeaderProps {
  name: string;
}

export default function Header({ name }: HeaderProps) {
  return (
    <View className="mb-6 px-6">
      <Text className="text-3xl font-bold text-white mb-1">Hello, {name}</Text>
      <Text className="text-zinc-400 text-base">
        Let s enter the flow state
      </Text>
    </View>
  );
}
