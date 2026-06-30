import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { PyramidLevelPicker } from "./PyramidLevelPicker";
import { CategoryPicker } from "./CategoryPicker";
import { Task, Category } from "../../types";

interface EditTaskModalProps {
  visible: boolean;
  task: Task | null;
  categories: Category[];
  onClose: () => void;
  onSave: (data: {
    id: string;
    title: string;
    pyramidLevel: number;
    targetDate: string;
    categoryId: string;
  }) => void;
  onDelete: (id: string) => void;
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function EditTaskModal({
  visible,
  task,
  categories,
  onClose,
  onSave,
  onDelete,
  onAddCategory,
  onEditCategory,
}: EditTaskModalProps) {
  const [title, setTitle] = useState("");
  const [pyramidLevel, setPyramidLevel] = useState(3);
  const [targetDate, setTargetDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible && task) {
      setTitle(task.title);
      setPyramidLevel(task.pyramid_level);
      setTargetDate(task.target_date);
      setCategoryId(task.category_id);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [visible, task]);

  const handleSave = () => {
    const trimmed = title.trim();
    if (!trimmed || !task) return;
    onSave({
      id: task.id,
      title: trimmed,
      pyramidLevel,
      targetDate,
      categoryId,
    });
    onClose();
  };

  const handleDelete = () => {
    if (!task) return;
    onDelete(task.id);
    onClose();
  };

  const cycleDate = () => {
    const d = new Date(targetDate + "T00:00:00");
    d.setDate(d.getDate() + 1);
    setTargetDate(d.toISOString().slice(0, 10));
  };

  if (!task) return null;

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const accentColor = selectedCategory?.color_hex ?? "#22d3ee";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/70 justify-end" onPress={onClose}>
        <Pressable onPress={() => {}}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View className="bg-[#1a1a1a] rounded-t-3xl px-6 pt-6 pb-10">
              <View className="w-10 h-1 bg-white/20 rounded-full self-center mb-6" />

              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-white text-xl font-semibold">
                  Edit Task
                </Text>
                <TouchableOpacity
                  onPress={onClose}
                  className="w-9 h-9 rounded-full bg-white/5 items-center justify-center"
                >
                  <Ionicons name="close" size={18} color="#71717a" />
                </TouchableOpacity>
              </View>

              <TextInput
                ref={inputRef}
                value={title}
                onChangeText={setTitle}
                placeholder="Task title"
                placeholderTextColor="#52525b"
                className="text-white text-base bg-white/5 rounded-xl px-4 py-4 mb-6"
                style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" }}
                returnKeyType="done"
                onSubmitEditing={handleSave}
              />

              <View className="mb-6">
                <Text className="text-gray-400 text-xs font-semibold mb-3 tracking-wider">
                  CATEGORY
                </Text>
                <CategoryPicker
                  categories={categories}
                  selectedId={categoryId}
                  onSelect={setCategoryId}
                  onAddCategory={onAddCategory}
                  onEditCategory={onEditCategory}
                />
              </View>

              <View className="mb-6">
                <Text className="text-gray-400 text-xs font-semibold mb-3 tracking-wider">
                  PYRAMID LEVEL
                </Text>
                <PyramidLevelPicker
                  value={pyramidLevel}
                  onChange={setPyramidLevel}
                />
              </View>

              <View className="mb-6">
                <Text className="text-gray-400 text-xs font-semibold mb-3 tracking-wider">
                  DATE
                </Text>
                <TouchableOpacity
                  onPress={cycleDate}
                  className="flex-row items-center justify-between bg-white/5 rounded-xl px-4 py-3"
                  style={{
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.06)",
                  }}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center">
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color="#71717a"
                    />
                    <Text className="ml-3 text-sm text-zinc-300">
                      {formatDate(targetDate)}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-zinc-600 text-xs mr-2">Change</Text>
                    <Ionicons name="chevron-forward" size={14} color="#52525b" />
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleSave}
                className="rounded-2xl py-4 items-center mb-3"
                activeOpacity={0.8}
                style={{
                  backgroundColor: accentColor,
                  shadowColor: accentColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                  elevation: 6,
                }}
              >
                <Text className="text-black font-bold text-base">
                  Save Changes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                className="rounded-2xl py-4 items-center bg-white/5"
                activeOpacity={0.7}
                style={{ borderWidth: 1, borderColor: "rgba(244,63,94,0.2)" }}
              >
                <View className="flex-row items-center">
                  <Ionicons name="trash-outline" size={16} color="#f43f5e" />
                  <Text className="text-rose-500 font-semibold text-sm ml-2">
                    Delete Task
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
