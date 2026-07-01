import { View, Text, TouchableOpacity, Alert, Platform, PermissionsAndroid } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Paths, File } from "expo-file-system";
import { type SQLiteDatabase } from "expo-sqlite";
import { getCategories, getTasksByDateRange } from "../../db/operations";

const DOWNLOADS_PATH = "/storage/emulated/0/Download/nodeflow-export.json";

interface DataManagementProps {
  db: SQLiteDatabase;
}

export function DataManagement({ db }: DataManagementProps) {
  const handleExport = async () => {
    try {
      const categories = getCategories(db);
      const tasks = getTasksByDateRange(db, "2000-01-01", "2099-12-31");

      const json = JSON.stringify(
        {
          version: 1,
          app: "NodeFlow",
          exported_at: new Date().toISOString(),
          categories,
          tasks,
        },
        null,
        2,
      );

      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission",
            message: "NodeFlow needs access to save exported data.",
            buttonPositive: "Allow",
          },
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert("Permission denied", "Cannot save file without storage access.");
          return;
        }

        const downloadFile = new File("file://" + DOWNLOADS_PATH);
        downloadFile.create({ overwrite: true, intermediates: true });
        downloadFile.write(json);
        Alert.alert("Exported", "Saved to Downloads/nodeflow-export.json");
      } else {
        const file = new File(Paths.document, "nodeflow-export.json");
        file.create({ overwrite: true, intermediates: true });
        file.write(json);
        Alert.alert("Exported", "Saved to Documents/nodeflow-export.json");
      }
    } catch (e) {
      Alert.alert("Error", "Could not export data: " + String(e));
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to delete all history and cache? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            db.execSync(
              "DELETE FROM pomodoro_sessions; DELETE FROM tasks; DELETE FROM categories",
            );
            Alert.alert("Done", "History has been cleared.");
          },
        },
      ],
    );
  };

  return (
    <View className="bg-white/5 rounded-3xl p-5 mb-24 border border-white/5">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-white font-semibold text-base">
          Data Management
        </Text>
        <Text className="text-gray-500 text-xs font-semibold tracking-wider">
          STORAGE
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleExport}
        className="flex-row items-center py-3 border-b border-white/5"
        activeOpacity={0.7}
      >
        <View className="w-9 h-9 rounded-xl bg-cyan-500/10 items-center justify-center mr-4">
          <Ionicons name="download-outline" size={18} color="#22d3ee" />
        </View>
        <View className="flex-1">
          <Text className="text-gray-300 text-sm">Export Data (JSON)</Text>
          <Text className="text-gray-600 text-xs mt-0.5">
            Backup your tasks and categories
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#52525b" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleClearHistory}
        className="flex-row items-center pt-3"
        activeOpacity={0.7}
      >
        <View className="w-9 h-9 rounded-xl bg-rose-500/10 items-center justify-center mr-4">
          <Ionicons name="trash-outline" size={18} color="#f43f5e" />
        </View>
        <View className="flex-1">
          <Text className="text-gray-300 text-sm">Clear History / Cache</Text>
          <Text className="text-gray-600 text-xs mt-0.5">
            Remove all session data and local cache
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#52525b" />
      </TouchableOpacity>
    </View>
  );
}
