import { View, Text } from "react-native";
import TaskCard from "./TaskCard";
import { Task, Category } from "../../types";

interface TaskListProps {
  tasks: Task[];
  categories: Category[];
  onToggleStatus: (id: string) => void;
  onPlay: (id: string) => void;
}

export default function TaskList({
  tasks,
  categories,
  onToggleStatus,
  onPlay,
}: TaskListProps) {
  const activeCount = tasks.filter((t) => t.status === "pending").length;

  return (
    <View className="px-6 flex-1">
      <View className="flex-row justify-between items-center mb-5 mt-2">
        <Text className="text-xl font-bold text-white">Today is Tasks</Text>
        <Text className="text-zinc-500 text-sm font-medium">
          {activeCount} active
        </Text>
      </View>

      <View className="pb-32">
        {tasks.map((task) => {
          const category = categories.find((c) => c.id === task.category_id);
          return (
            <TaskCard
              key={task.id}
              task={task}
              category={category}
              onToggleStatus={onToggleStatus}
              onPlay={onPlay}
            />
          );
        })}
      </View>
    </View>
  );
}
