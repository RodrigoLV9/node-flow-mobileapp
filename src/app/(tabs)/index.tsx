import { View, ScrollView } from "react-native";
import { useState, useCallback, useEffect } from "react";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";

import Header from "../../components/home/Header";
import CalendarStrip from "../../components/home/CalendarStrip";
import TaskList from "../../components/home/TaskList";
import Fab from "../../components/ui/Fab";
import { AddTaskModal } from "../../components/tasks/AddTaskModal";
import { EditTaskModal } from "../../components/tasks/EditTaskModal";
import { ManageCategoryModal } from "../../components/tasks/ManageCategoryModal";
import { setCalendarDate, consumeCalendarDate } from "../../lib/shared";
import { todayStr } from "../../lib/dateUtils";

import {
  getCategories,
  getTasksByDate,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../db/operations";
import { Task, Category } from "../../types";

export default function Home() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const date = consumeCalendarDate();
    if (date) setSelectedDate(date);
  });

  useEffect(() => {
    setTasks(getTasksByDate(db, selectedDate));
    setCategories(getCategories(db));
  }, [db, selectedDate, refreshKey]);

  const handleToggleStatus = useCallback(
    (id: string) => {
      toggleTask(db, id);
      setRefreshKey((k) => k + 1);
    },
    [db],
  );

  const handleAddTask = useCallback(() => {
    setTaskModalVisible(true);
  }, []);

  const handleCreateTask = useCallback(
    (data: {
      title: string;
      pyramidLevel: number;
      targetDate: string;
      categoryId: string;
    }) => {
      createTask(db, data);
      setRefreshKey((k) => k + 1);
    },
    [db],
  );

  const handleLongPress = useCallback((task: Task) => {
    setEditingTask(task);
    setEditModalVisible(true);
  }, []);

  const handleEditSave = useCallback(
    (data: {
      id: string;
      title: string;
      pyramidLevel: number;
      targetDate: string;
      categoryId: string;
    }) => {
      updateTask(db, data.id, data);
      setEditModalVisible(false);
      setRefreshKey((k) => k + 1);
    },
    [db],
  );

  const handleEditDelete = useCallback(
    (id: string) => {
      deleteTask(db, id);
      setEditModalVisible(false);
      setRefreshKey((k) => k + 1);
    },
    [db],
  );

  const openAddCategory = useCallback(() => {
    setEditingCategory(null);
    setCategoryModalVisible(true);
  }, []);

  const openEditCategory = useCallback((category: Category) => {
    setEditingCategory(category);
    setCategoryModalVisible(true);
  }, []);

  const handleSaveCategory = useCallback(
    (data: { id?: string; name: string; icon: string; color: string }) => {
      if (data.id) {
        updateCategory(db, data.id, {
          name: data.name,
          icon: data.icon,
          color: data.color,
        });
      } else {
        createCategory(db, {
          name: data.name,
          icon: data.icon,
          color: data.color,
        });
      }
      setCategoryModalVisible(false);
      setRefreshKey((k) => k + 1);
    },
    [db],
  );

  const handleDeleteCategory = useCallback(
    (id: string) => {
      deleteCategory(db, id);
      setCategoryModalVisible(false);
      setRefreshKey((k) => k + 1);
    },
    [db],
  );

  const handleCalendarPress = useCallback(() => {
    setCalendarDate(selectedDate);
    router.push("/calendar");
  }, [selectedDate]);

  return (
    <View className="flex-1 bg-[#121212]">
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Header name="User" selectedDate={selectedDate} onCalendarPress={handleCalendarPress} />
        <CalendarStrip
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
        <TaskList
          tasks={tasks}
          categories={categories}
          onToggleStatus={handleToggleStatus}
          onLongPress={handleLongPress}
        />
      </ScrollView>

      <Fab onPress={handleAddTask} />

      <AddTaskModal
        visible={taskModalVisible}
        defaultDate={selectedDate}
        categories={categories}
        onClose={() => setTaskModalVisible(false)}
        onCreate={handleCreateTask}
        onAddCategory={openAddCategory}
        onEditCategory={openEditCategory}
      />

      <EditTaskModal
        visible={editModalVisible}
        task={editingTask}
        categories={categories}
        onClose={() => setEditModalVisible(false)}
        onSave={handleEditSave}
        onDelete={handleEditDelete}
        onAddCategory={openAddCategory}
        onEditCategory={openEditCategory}
      />

      <ManageCategoryModal
        visible={categoryModalVisible}
        editing={editingCategory}
        onClose={() => setCategoryModalVisible(false)}
        onSave={handleSaveCategory}
        onDelete={handleDeleteCategory}
      />
    </View>
  );
}
