import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Category } from "../../types";

interface CategoryPickerProps {
  categories: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
}

export function CategoryPicker({
  categories,
  selectedId,
  onSelect,
  onAddCategory,
  onEditCategory,
}: CategoryPickerProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="flex-row"
    >
      {/* Add new button */}
      <TouchableOpacity
        onPress={onAddCategory}
        className="items-center justify-center rounded-xl mr-3"
        activeOpacity={0.7}
        style={{
          width: 64,
          height: 72,
          backgroundColor: "rgba(255,255,255,0.03)",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.06)",
          borderStyle: "dashed",
        }}
      >
        <Ionicons name="add" size={20} color="#52525b" />
        <Text className="text-gray-600 text-[9px] mt-1 font-semibold">
          New
        </Text>
      </TouchableOpacity>

      {categories.map((cat) => {
        const isActive = cat.id === selectedId;

        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => onSelect(cat.id)}
            onLongPress={() => onEditCategory(cat)}
            className="items-center justify-center rounded-xl mr-3"
            activeOpacity={0.7}
            style={{
              width: 64,
              height: 72,
              backgroundColor: isActive ? cat.color_hex + "20" : "rgba(255,255,255,0.03)",
              borderWidth: 1,
              borderColor: isActive
                ? cat.color_hex + "60"
                : "rgba(255,255,255,0.06)",
            }}
          >
            <View
              className="w-8 h-8 rounded-full items-center justify-center mb-1"
              style={{ backgroundColor: cat.color_hex + "20" }}
            >
              <Ionicons
                name={cat.icon as any}
                size={15}
                color={isActive ? cat.color_hex : "#52525b"}
              />
            </View>
            <Text
              className="text-[9px] font-semibold text-center leading-tight"
              style={{
                color: isActive ? cat.color_hex : "#71717a",
              }}
              numberOfLines={1}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}

      <View className="w-4" />
    </ScrollView>
  );
}
