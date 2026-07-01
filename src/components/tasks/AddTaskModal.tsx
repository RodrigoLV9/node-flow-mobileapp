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
import { Category } from "../../types";
import { todayStr, formatDate } from "../../lib/dateUtils";

interface AddTaskModalProps {
  visible: boolean;
  defaultDate: string;
  categories: Category[];
  onClose: () => void;
  onCreate: (task: {
    title: string;
    pyramidLevel: number;
    targetDate: string;
    categoryId: string;
  }) => void;
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
}

export function AddTaskModal({
  visible,
  defaultDate,
  categories,
  onClose,
  onCreate,
  onAddCategory,
  onEditCategory,
}: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [pyramidLevel, setPyramidLevel] = useState(3);
  const [targetDate, setTargetDate] = useState(defaultDate);
  const [categoryId, setCategoryId] = useState("");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setTitle("");
      setPyramidLevel(3);
      setTargetDate(defaultDate);
      setCategoryId("");
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [visible, defaultDate, categories]);

  const handleCreate = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onCreate({
      title: trimmed,
      pyramidLevel,
      targetDate,
      categoryId,
    });
    onClose();
  };

  const cycleDate = () => {
    const d = new Date(targetDate + "T00:00:00");
    d.setDate(d.getDate() + 1);
    setTargetDate(d.toISOString().slice(0, 10));
  };

  const isToday = targetDate === todayStr();
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
                  New Task
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
                placeholder="What do you need to focus on?"
                placeholderTextColor="#52525b"
                className="text-white text-base bg-white/5 rounded-xl px-4 py-4 mb-6"
                style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" }}
                returnKeyType="done"
                onSubmitEditing={handleCreate}
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

              <View className="mb-8">
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
                      name={isToday ? "today-outline" : "calendar-outline"}
                      size={18}
                      color={isToday ? accentColor : "#71717a"}
                    />
                    <Text
                      className={`ml-3 text-sm ${
                        isToday ? "text-cyan-400" : "text-zinc-300"
                      }`}
                      style={{ color: isToday ? accentColor : "#d4d4d8" }}
                    >
                      {isToday ? "Today" : formatDate(targetDate)}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-zinc-600 text-xs mr-2">Change</Text>
                    <Ionicons name="chevron-forward" size={14} color="#52525b" />
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleCreate}
                className="rounded-2xl py-4 items-center"
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
                  Create Task
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
