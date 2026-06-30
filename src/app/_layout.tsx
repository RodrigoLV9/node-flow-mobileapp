import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Slot } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { SCHEMA, seedDefaults } from "../db/schema";
import "../../global.css";

export default function Layout() {
  return (
    <SQLiteProvider
      databaseName="nodeflow.db"
      onInit={async (db) => {
        await db.execAsync(SCHEMA);
        seedDefaults(db);
      }}
    >
      <View className="flex-1 bg-[#07080d]">
        <Slot />
        <StatusBar style="light" />
      </View>
    </SQLiteProvider>
  );
}
