import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { IconPicker } from "./IconPicker";
import { ColorPicker } from "./ColorPicker";
import { Category } from "../../types";

interface ManageCategoryModalProps {
  visible: boolean;
  editing: Category | null;
  onClose: () => void;
  onSave: (data: { id?: string; name: string; icon: string; color: string }) => void;
  onDelete?: (id: string) => void;
}

export function ManageCategoryModal({
  visible,
  editing,
  onClose,
  onSave,
  onDelete,
}: ManageCategoryModalProps) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("briefcase-outline");
  const [color, setColor] = useState("#22d3ee");
  const nameRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      if (editing) {
        setName(editing.name);
        setIcon(editing.icon);
        setColor(editing.color_hex);
      } else {
        setName("");
        setIcon("briefcase-outline");
        setColor("#22d3ee");
      }
      setTimeout(() => nameRef.current?.focus(), 200);
    }
  }, [visible, editing]);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave({
      id: editing?.id,
      name: trimmed,
      icon,
      color,
    });
  };

  const handleDelete = () => {
    if (editing && onDelete) {
      onDelete(editing.id);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/70 justify-end" onPress={onClose}>
        <Pressable onPress={() => {}}>
          <View className="bg-[#1a1a1a] rounded-t-3xl px-6 pt-6 pb-10">
            <View className="w-10 h-1 bg-white/20 rounded-full self-center mb-6" />

            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white text-xl font-semibold">
                {editing ? "Edit Category" : "New Category"}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className="w-9 h-9 rounded-full bg-white/5 items-center justify-center"
              >
                <Ionicons name="close" size={18} color="#71717a" />
              </TouchableOpacity>
            </View>

            <TextInput
              ref={nameRef}
              value={name}
              onChangeText={setName}
              placeholder="Category name"
              placeholderTextColor="#52525b"
              className="text-white text-base bg-white/5 rounded-xl px-4 py-4 mb-5"
              style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" }}
              returnKeyType="done"
            />

            <View className="flex-row items-center mb-2">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: color + "20" }}
              >
                <Ionicons name={icon as any} size={18} color={color} />
              </View>
              <View>
                <Text className="text-gray-400 text-xs font-semibold tracking-wider">
                  PREVIEW
                </Text>
                <Text className="text-white text-sm">{name || "Category"}</Text>
              </View>
            </View>

            <View className="mb-5">
              <Text className="text-gray-400 text-xs font-semibold mb-3 tracking-wider">
                COLOR
              </Text>
              <ColorPicker selected={color} onSelect={setColor} />
            </View>

            <View className="mb-6">
              <Text className="text-gray-400 text-xs font-semibold mb-3 tracking-wider">
                ICON
              </Text>
              <View style={{ height: 200 }}>
                <IconPicker
                  selected={icon}
                  activeColor={color}
                  onSelect={setIcon}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSave}
              className="rounded-2xl py-4 items-center mb-3"
              activeOpacity={0.8}
              style={{
                backgroundColor: color,
                shadowColor: color,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <Text className="text-black font-bold text-base">
                {editing ? "Save Changes" : "Create Category"}
              </Text>
            </TouchableOpacity>

            {editing && (
              <TouchableOpacity
                onPress={handleDelete}
                className="rounded-2xl py-4 items-center bg-white/5"
                activeOpacity={0.7}
                style={{ borderWidth: 1, borderColor: "rgba(244,63,94,0.2)" }}
              >
                <View className="flex-row items-center">
                  <Ionicons name="trash-outline" size={16} color="#f43f5e" />
                  <Text className="text-rose-500 font-semibold text-sm ml-2">
                    Delete Category
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
