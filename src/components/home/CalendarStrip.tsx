import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRef, useEffect, useMemo } from "react";

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const RANGE = 6;

function buildDates(centerDateStr: string) {
  const center = new Date(centerDateStr + "T00:00:00");
  const dates: Date[] = [];
  for (let i = -RANGE; i <= RANGE; i++) {
    const d = new Date(center);
    d.setDate(center.getDate() + i);
    dates.push(d);
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().slice(0, 10);
  const todayIndex = dates.findIndex(
    (d) => d.toISOString().slice(0, 10) === todayStr,
  );
  return { dates, todayIndex };
}

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

interface CalendarStripProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export default function CalendarStrip({
  selectedDate,
  onSelectDate,
}: CalendarStripProps) {
  const scrollRef = useRef<ScrollView>(null);
  const { dates, todayIndex } = useMemo(
    () => buildDates(selectedDate),
    [selectedDate],
  );

  const activeIndex = dates.findIndex((d) => fmtDate(d) === selectedDate);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeIndex >= 0) {
        scrollRef.current?.scrollTo({
          x: activeIndex * 80 - 60,
          animated: true,
        });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  return (
    <View className="mb-8 pl-6">
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        {dates.map((d, i) => {
          const dateStr = fmtDate(d);
          const isActive = dateStr === selectedDate;
          const isToday = i === todayIndex;

          return (
            <TouchableOpacity
              key={dateStr}
              onPress={() => onSelectDate(dateStr)}
              className={`mr-4 items-center justify-center rounded-2xl py-3 w-16 bg-zinc-900 border ${
                isActive ? "border-cyan-400" : "border-zinc-800"
              }`}
              style={
                isActive
                  ? {
                      shadowColor: "#00D4FF",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.8,
                      shadowRadius: 10,
                      elevation: 10,
                    }
                  : {}
              }
            >
              <Text
                className={`text-xs font-semibold mb-1 ${
                  isToday ? "text-cyan-400" : "text-zinc-500"
                }`}
              >
                {DAY_NAMES[d.getDay()]}
              </Text>
              <Text
                className={`text-xl font-bold ${
                  isActive ? "text-white" : "text-zinc-300"
                }`}
              >
                {d.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
        <View className="w-6" />
      </ScrollView>
    </View>
  );
}
