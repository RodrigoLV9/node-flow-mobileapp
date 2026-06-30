import { View, Text, TouchableOpacity } from "react-native";
import { Svg, Circle, G } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { PomodoroPhase, PomodoroConfig, getPhaseDuration } from "./types";

const RING_SIZE = 280;
const STROKE_WIDTH = 10;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface TimerDisplayProps {
  phase: PomodoroPhase;
  config: PomodoroConfig;
  timeLeft: number;
  isRunning: boolean;
  onTogglePlay: () => void;
  onStop: () => void;
  onSkip: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function getPhaseLabel(phase: PomodoroPhase): string {
  switch (phase.type) {
    case "focus":
      return "FOCUS TIME";
    case "short_break":
      return "SHORT BREAK";
    case "long_break":
      return "LONG BREAK";
  }
}

export function TimerDisplay({
  phase,
  config,
  timeLeft,
  isRunning,
  onTogglePlay,
  onStop,
  onSkip,
}: TimerDisplayProps) {
  const total = getPhaseDuration(phase, config);
  const progress = total > 0 ? (total - timeLeft) / total : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const isBreak = phase.type === "short_break" || phase.type === "long_break";
  const accentColor = isBreak ? "#4ade80" : "#22d3ee";
  const accentBg = isBreak ? "bg-green-400" : "bg-cyan-400";

  return (
    <View className="items-center justify-center flex-1">
      <View
        className="items-center justify-center relative"
        style={{ width: RING_SIZE, height: RING_SIZE }}
      >
        <Svg
          width={RING_SIZE}
          height={RING_SIZE}
          style={{ position: "absolute" }}
        >
          <G rotation="-90" origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}>
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke={accentColor}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          </G>
        </Svg>

        <Text
          className="text-white font-light tracking-widest"
          style={{ fontSize: 64 }}
        >
          {formatTime(timeLeft)}
        </Text>

        <Text
          className="text-gray-400 text-xs tracking-[0.25em] mt-3 font-semibold"
        >
          {getPhaseLabel(phase)}
        </Text>
      </View>

      <View className="flex-row items-center justify-center gap-6 mt-12">
        <TouchableOpacity
          onPress={onSkip}
          className="w-14 h-14 rounded-full bg-white/5 items-center justify-center"
          activeOpacity={0.6}
        >
          <Ionicons name="play-skip-forward" size={22} color="#71717a" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onTogglePlay}
          className={`w-[72px] h-[72px] rounded-full items-center justify-center shadow-lg ${accentBg}`}
          activeOpacity={0.8}
          style={{
            shadowColor: accentColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <Ionicons
            name={isRunning ? "pause" : "play"}
            size={30}
            color="#0a0a0a"
            style={{ marginLeft: isRunning ? 0 : 3 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onStop}
          className="w-14 h-14 rounded-full bg-white/5 items-center justify-center"
          activeOpacity={0.6}
        >
          <Ionicons name="stop" size={22} color="#71717a" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
