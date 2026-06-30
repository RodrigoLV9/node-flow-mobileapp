import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { PeriodSelector } from "../../components/insights/PeriodSelector";
import { TimeAllocation } from "../../components/insights/TimeAllocation";
import { ProductivityTrend } from "../../components/insights/ProductivityTrend";
import { FocusHeatmap } from "../../components/insights/FocusHeatmap";

export default function Insights() {
  const [activePeriod, setActivePeriod] = useState("Week");
  const periods = ["Day", "Week", "Month", "Year"];

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

        <TimeAllocation />
        <ProductivityTrend />
        <FocusHeatmap />
      </ScrollView>
    </SafeAreaView>
  );
}
