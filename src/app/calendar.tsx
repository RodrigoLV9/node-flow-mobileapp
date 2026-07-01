import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { setCalendarDate, getCalendarDate } from "../lib/shared";
import { getTasksByDateRange } from "../db/operations";
import { todayStr, MONTHS } from "../lib/dateUtils";

const DAY_HEADERS = ["S", "M", "T", "W", "T", "F", "S"];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function buildCalendarGrid(year: number, month: number) {
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getFirstDayOfMonth(year, month);
  const grid: (number | null)[] = [];

  for (let i = 0; i < startDay; i++) {
    grid.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    grid.push(d);
  }
  while (grid.length % 7 !== 0) {
    grid.push(null);
  }

  const rows: (number | null)[][] = [];
  for (let i = 0; i < grid.length; i += 7) {
    rows.push(grid.slice(i, i + 7));
  }
  return rows;
}

function fmtDateStr(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export default function CalendarScreen() {
  const db = useSQLiteContext();

  const initialDate = getCalendarDate() ?? todayStr();
  const initialDateParsed = new Date(initialDate + "T00:00:00");

  const [viewYear, setViewYear] = useState(initialDateParsed.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDateParsed.getMonth());
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const monthStart = fmtDateStr(viewYear, viewMonth, 1);
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const monthEnd = fmtDateStr(viewYear, viewMonth, daysInMonth);

  const tasksByDate = useMemo(() => {
    const tasks = getTasksByDateRange(db, monthStart, monthEnd);
    const map = new Set<string>();
    tasks.forEach((t) => map.add(t.target_date));
    return map;
  }, [db, monthStart, monthEnd]);

  const rows = buildCalendarGrid(viewYear, viewMonth);
  const currentDate = todayStr();

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const dateStr = fmtDateStr(viewYear, viewMonth, day);
    setSelectedDate(dateStr);
    setCalendarDate(dateStr);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <View className="flex-row items-center justify-between px-5 py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 rounded-2xl bg-white/5 items-center justify-center"
          style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}
        >
          <Ionicons name="chevron-back" size={22} color="#71717a" />
        </TouchableOpacity>

        <Text className="text-white text-lg font-semibold">
          {MONTHS[viewMonth]} {viewYear}
        </Text>

        <View className="w-11" />
      </View>

      <View className="flex-row items-center justify-between px-8 mb-6">
        <TouchableOpacity
          onPress={goToPrevMonth}
          className="w-10 h-10 rounded-full bg-white/5 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={18} color="#71717a" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goToNextMonth}
          className="w-10 h-10 rounded-full bg-white/5 items-center justify-center"
        >
          <Ionicons name="chevron-forward" size={18} color="#71717a" />
        </TouchableOpacity>
      </View>

      <View className="flex-row px-4 mb-2">
        {DAY_HEADERS.map((h, i) => (
          <View key={i} className="flex-1 items-center">
            <Text className="text-zinc-600 text-xs font-semibold">{h}</Text>
          </View>
        ))}
      </View>

      <View className="px-4">
        {rows.map((row, ri) => (
          <View key={ri} className="flex-row mb-2">
            {row.map((day, di) => {
              if (day === null) {
                return <View key={di} className="flex-1 h-11" />;
              }

              const dateStr = fmtDateStr(viewYear, viewMonth, day);
              const isToday = dateStr === currentDate;
              const isSelected = dateStr === selectedDate;
              const hasTasks = tasksByDate.has(dateStr);
              const isHighlighted = isSelected;

              return (
                <TouchableOpacity
                  key={di}
                  onPress={() => handleSelectDay(day)}
                  className="flex-1 h-11 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: isHighlighted
                      ? "rgba(34,211,238,0.15)"
                      : "transparent",
                    borderWidth: isHighlighted || isToday ? 1 : 0,
                    borderColor: isHighlighted
                      ? "rgba(34,211,238,0.4)"
                      : isToday
                      ? "rgba(255,255,255,0.1)"
                      : "transparent",
                  }}
                >
                  <Text
                    className={`text-sm font-medium ${
                      isHighlighted ? "text-cyan-400" : isToday ? "text-zinc-400" : "text-zinc-300"
                    }`}
                  >
                    {day}
                  </Text>
                  {hasTasks && (
                    <View
                      className="w-1 h-1 rounded-full bg-cyan-400 mt-0.5"
                      style={{
                        shadowColor: "#22d3ee",
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.6,
                        shadowRadius: 2,
                        elevation: 2,
                      }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}
