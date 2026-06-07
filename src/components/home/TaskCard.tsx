import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Task, Category } from "../../types";

interface TaskCardProps {
  task: Task;
  category?: Category;
  onToggleStatus: (id: string) => void;
  onPlay: (id: string) => void;
}

export default function TaskCard({
  task,
  category,
  onToggleStatus,
  onPlay,
}: TaskCardProps) {
  const isCompleted = task.status === "completed";

  return (
    <View className="mb-4 flex-row items-center rounded-2xl bg-zinc-900 border border-zinc-800 p-4 shadow-sm">
      {/* Checkbox */}
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

      {/* Content */}
      <View className="flex-1">
        <Text
          className={`text-[17px] font-medium mb-2 ${
            isCompleted ? "text-zinc-500 line-through" : "text-white"
          }`}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        <View className="flex-row items-center space-x-2">
          {/* Level Tag */}
          <View className="flex-row items-center rounded-lg bg-[#E5A84D15] px-2 py-1 mr-2">
            <FontAwesome5
              name="caret-up"
              size={12}
              color="#E5A84D"
              className="mr-1"
            />
            <Text className="text-[#E5A84D] text-xs font-semibold ml-1">
              Level {task.pyramid_level}
            </Text>
          </View>

          {/* Category Tag */}
          {category && (
            <View
              className="flex-row items-center rounded-lg px-2 py-1"
              style={{ backgroundColor: `${category.color_hex}15` }}
            >
              <FontAwesome5
                name="shapes"
                size={10}
                color={category.color_hex}
                className="mr-1"
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

      {/* Play Button */}
      <TouchableOpacity
        onPress={() => onPlay(task.id)}
        className="ml-2 h-10 w-10 items-center justify-center rounded-full bg-zinc-800/80"
      >
        <Ionicons name="play" size={18} color="#00D4FF" />
      </TouchableOpacity>
    </View>
  );
}
