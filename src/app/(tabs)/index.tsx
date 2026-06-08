import { View, ScrollView } from "react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Header from "../../components/home/Header";
import CalendarStrip from "../../components/home/CalendarStrip";
import TaskList from "../../components/home/TaskList";
import Fab from "../../components/ui/Fab";

import appData from "../../data/example.json";
import { Task, Category } from "../../types";

export default function Home() {
  const insets = useSafeAreaInsets();
  const [tasks, setTasks] = useState<Task[]>(appData.tasks as Task[]);
  const categories = appData.categories as Category[];

  const handleToggleStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const isCompleted = task.status === "completed";
          return {
            ...task,
            status: isCompleted ? "pending" : "completed",
            completed_at: isCompleted ? null : new Date().toISOString(),
          };
        }
        return task;
      }),
    );
  };

  const handlePlay = (id: string) => {
    console.log("Play task", id);
  };

  const handleAddTask = () => {
    console.log("Add new task");
  };

  return (
    <View className="flex-1 bg-[#121212]">
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Header name="Usuario" />
        <CalendarStrip />
        <TaskList
          tasks={tasks}
          categories={categories}
          onToggleStatus={handleToggleStatus}
          onPlay={handlePlay}
        />
      </ScrollView>
      <Fab onPress={handleAddTask} />
    </View>
  );
}
