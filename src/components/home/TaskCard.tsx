import { View, Text, TouchableOpacity, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Task, Category } from "../../types";

function getIcon(name: string): string {
  return name || "shapes";
}

interface TaskCardProps {
  task: Task;
  category?: Category;
  onToggleStatus: (id: string) => void;
  onLongPress: (task: Task) => void;
}

export default function TaskCard({
  task,
  category,
  onToggleStatus,
  onLongPress,
}: TaskCardProps) {
  const isCompleted = task.status === "completed";

  return (
    <Pressable
      onLongPress={() => onLongPress(task)}
      delayLongPress={400}
    >
      <View className="mb-3 flex-row items-center rounded-2xl bg-zinc-900 border border-zinc-800 p-4">
        <TouchableOpacity
          onPress={() => onToggleStatus(task.id)}
          className="mr-4 items-center justify-center h-8 w-8"
        >
          {isCompleted ? (
            <View
              className="h-7 w-7 rounded-full items-center justify-center bg-[#00FF66]"
              style={{
                shadowColor: "#00FF66",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Ionicons name="checkmark-sharp" size={16} color="black" />
            </View>
          ) : (
            <View className="h-7 w-7 rounded-full border-[1.5px] border-zinc-700" />
          )}
        </TouchableOpacity>

        <View className="flex-1">
          <Text
            className={`text-[17px] font-medium mb-2 ${
              isCompleted ? "text-zinc-500 line-through" : "text-white"
            }`}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          <View className="flex-row items-center">
            <View className="flex-row items-center rounded-lg bg-[#E5A84D15] px-2 py-1 mr-2">
              <FontAwesome5
                name="caret-up"
                size={12}
                color="#E5A84D"
              />
              <Text className="text-[#E5A84D] text-xs font-semibold ml-1">
                Level {task.pyramid_level}
              </Text>
            </View>

            {category && (
              <View
                className="flex-row items-center rounded-lg px-2 py-1"
                style={{ backgroundColor: `${category.color_hex}15` }}
              >
                <Ionicons
                  name={getIcon(category.icon) as any}
                  size={11}
                  color={category.color_hex}
                />
                <Text
                  className="text-xs font-semibold ml-1"
                  style={{ color: category.color_hex }}
                >
                  {category.name}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
