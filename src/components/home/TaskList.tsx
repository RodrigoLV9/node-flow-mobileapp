import { View, Text, TouchableOpacity } from "react-native";
import { useMemo, useState, useCallback } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import TaskCard from "./TaskCard";
import { Task, Category } from "../../types";

type SortMode = "default" | "level" | "category";
type SortDir = "asc" | "desc";

interface TaskListProps {
  tasks: Task[];
  categories: Category[];
  onToggleStatus: (id: string) => void;
  onLongPress: (task: Task) => void;
}

export default function TaskList({
  tasks,
  categories,
  onToggleStatus,
  onLongPress,
}: TaskListProps) {
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const pending = tasks.filter((t) => t.status === "pending");
  const completed = tasks.filter((t) => t.status === "completed");

  const usedCategories = useMemo(() => {
    const ids = new Set(tasks.map((t) => t.category_id).filter(Boolean));
    return categories.filter((c) => ids.has(c.id));
  }, [tasks, categories]);

  const handleSortChange = useCallback((mode: SortMode) => {
    setSortMode((prev) => {
      if (prev === mode) {
        setSortDir((d) => (d === "desc" ? "asc" : "desc"));
        return prev;
      }
      setSortDir("desc");
      return mode;
    });
  }, []);

  const sortTasks = (list: Task[]): Task[] => {
    let result: Task[];
    if (sortMode === "default") {
      result = list;
    } else if (sortMode === "level") {
      result = [...list].sort((a, b) => b.pyramid_level - a.pyramid_level);
    } else {
      const order = usedCategories.map((c) => c.id);
      result = [...list].sort((a, b) => {
        const ai = order.indexOf(a.category_id);
        const bi = order.indexOf(b.category_id);
        if (ai === -1 && bi === -1) return 0;
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      });
    }
    if (sortDir === "asc") result = [...result].reverse();
    return result;
  };

  const sortedPending = useMemo(
    () => sortTasks(pending),
    [pending, sortMode, sortDir, usedCategories],
  );
  const sortedCompleted = useMemo(
    () => sortTasks(completed),
    [completed, sortMode, sortDir, usedCategories],
  );

  const sortOptions: { mode: SortMode; label: string }[] = [
    { mode: "default", label: "Default" },
    { mode: "level", label: "Level" },
    { mode: "category", label: "Category" },
  ];

  if (tasks.length === 0) {
    return (
      <View className="px-6 flex-1 items-center mt-20">
        <Ionicons name="document-text-outline" size={48} color="#27272a" />
        <Text className="text-zinc-600 text-sm mt-4 text-center">
          No tasks for this day{"\n"}Tap + to create one
        </Text>
      </View>
    );
  }

  return (
    <View className="px-6 flex-1">
      <View className="flex-row justify-between items-center mb-4 mt-2">
        <Text className="text-xl font-bold text-white">Tasks</Text>

        <View className="flex-row bg-white/5 rounded-lg p-0.5">
          {sortOptions.map((opt) => {
            const isActive = sortMode === opt.mode;
            return (
              <TouchableOpacity
                key={opt.mode}
                onPress={() => handleSortChange(opt.mode)}
                className={`flex-row items-center px-3 py-1.5 rounded-md ${
                  isActive ? "bg-cyan-500/20" : ""
                }`}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-xs font-semibold mr-1 ${
                    isActive ? "text-cyan-400" : "text-zinc-500"
                  }`}
                >
                  {opt.label}
                </Text>
                {isActive && (
                  <Ionicons
                    name={sortDir === "desc" ? "chevron-down" : "chevron-up"}
                    size={10}
                    color="#22d3ee"
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {pending.length > 0 && (
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <View className="w-1.5 h-4 bg-cyan-400 rounded-full mr-2" />
            <Text className="text-white font-semibold text-sm">Pending</Text>
            <Text className="text-zinc-600 text-xs ml-2">
              {pending.length}
            </Text>
          </View>
          {sortedPending.map((task) => {
            const category = categories.find((c) => c.id === task.category_id);
            return (
              <TaskCard
                key={task.id}
                task={task}
                category={category}
                onToggleStatus={onToggleStatus}
                onLongPress={onLongPress}
              />
            );
          })}
        </View>
      )}

      {completed.length > 0 && (
        <View className="pb-32">
          <View className="flex-row items-center mb-3">
            <View className="w-1.5 h-4 bg-green-500 rounded-full mr-2" />
            <Text className="text-white font-semibold text-sm">Completed</Text>
            <Text className="text-zinc-600 text-xs ml-2">
              {completed.length}
            </Text>
          </View>
          {sortedCompleted.map((task) => {
            const category = categories.find((c) => c.id === task.category_id);
            return (
              <TaskCard
                key={task.id}
                task={task}
                category={category}
                onToggleStatus={onToggleStatus}
                onLongPress={onLongPress}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}
