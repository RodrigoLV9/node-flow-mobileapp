import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useMemo } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { PeriodSelector } from "../../components/insights/PeriodSelector";
import { TimeAllocation } from "../../components/insights/TimeAllocation";
import { ProductivityTrend } from "../../components/insights/ProductivityTrend";
import { FocusHeatmap } from "../../components/insights/FocusHeatmap";
import {
  getTasksByPyramidLevel,
  getDailyFocusMinutes,
  getTaskCompletionByDay,
  getHeatmapData,
} from "../../db/operations";
import { todayStr, tomorrowStr, daysAgo } from "../../lib/dateUtils";
import { LEVEL_COLORS, LEVEL_LABELS } from "../../lib/constants";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDayLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return DAY_NAMES[d.getDay()];
}

export default function Insights() {
  const db = useSQLiteContext();
  const [activePeriod, setActivePeriod] = useState("Week");
  const periods = ["Day", "Week", "Month", "Year"];

  const { startDate, endDate } = useMemo(() => {
    switch (activePeriod) {
      case "Day":
        return { startDate: todayStr(), endDate: todayStr() };
      case "Week":
        return { startDate: daysAgo(6), endDate: todayStr() };
      case "Month":
        return { startDate: daysAgo(29), endDate: todayStr() };
      case "Year":
        return { startDate: daysAgo(364), endDate: todayStr() };
      default:
        return { startDate: daysAgo(6), endDate: todayStr() };
    }
  }, [activePeriod]);

  const endDateExcl = useMemo(
    () => (activePeriod === "Day" ? tomorrowStr() : daysAgo(-1)),
    [activePeriod],
  );

  const pyramidData = useMemo(() => {
    const rows = getTasksByPyramidLevel(db, startDate, endDate);
    return rows.map((r) => ({
      label: LEVEL_LABELS[r.pyramid_level] ?? `Level ${r.pyramid_level}`,
      value: r.count,
      color: LEVEL_COLORS[r.pyramid_level] ?? "#71717a",
    }));
  }, [db, startDate, endDate]);

  const totalTasks = useMemo(
    () => pyramidData.reduce((s, d) => s + d.value, 0),
    [pyramidData],
  );

  const { days, focusBars, taskPoints, maxFocus, maxTasks } = useMemo(() => {
    const focusData = getDailyFocusMinutes(db, startDate, endDateExcl);
    const taskData = getTaskCompletionByDay(db, startDate, endDate);

    const dateSet = new Set<string>();
    focusData.forEach((d) => dateSet.add(d.date));
    taskData.forEach((d) => dateSet.add(d.date));

    const sorted = Array.from(dateSet).sort();

    const focusMap = new Map<string, number>();
    focusData.forEach((d) => focusMap.set(d.date, d.minutes));
    const taskMap = new Map<string, number>();
    taskData.forEach((d) => taskMap.set(d.date, d.count));

    const d = sorted.map((date) => getDayLabel(date));
    const f = sorted.map((date) => Math.round((focusMap.get(date) ?? 0) / 60 * 10) / 10);
    const t = sorted.map((date) => taskMap.get(date) ?? 0);

    return {
      days: d,
      focusBars: f,
      taskPoints: t,
      maxFocus: Math.max(1, ...f),
      maxTasks: Math.max(1, ...t),
    };
  }, [db, startDate, endDateExcl, endDate]);

  const heatmapData = useMemo(() => {
    const hmEnd = activePeriod === "Day" ? tomorrowStr() : daysAgo(-1);
    return getHeatmapData(db, daysAgo(364), hmEnd);
  }, [db, activePeriod]);

  const maxHeatWeight = useMemo(
    () => Math.max(1, ...heatmapData.map((d) => d.weight)),
    [heatmapData],
  );

  return (
    <SafeAreaView className="flex-1 bg-[#121111]">
      <ScrollView
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-6 mt-2">
          <Text className="text-white text-xl font-semibold">Insights</Text>
        </View>

        <PeriodSelector
          periods={periods}
          activePeriod={activePeriod}
          onSelect={setActivePeriod}
        />

        <TimeAllocation segments={pyramidData} total={totalTasks} />

        <ProductivityTrend
          days={days}
          bars={focusBars}
          barMax={maxFocus}
          points={taskPoints}
          pointMax={maxTasks}
        />

        <FocusHeatmap data={heatmapData} maxWeight={maxHeatWeight} />
      </ScrollView>
    </SafeAreaView>
  );
}
