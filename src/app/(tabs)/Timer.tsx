import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef, useEffect, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { TimerHeader } from "../../components/pomodoro/TimerHeader";
import { TimerDisplay } from "../../components/pomodoro/TimerDisplay";
import { CycleIndicator } from "../../components/pomodoro/CycleIndicator";
import {
  buildPhases,
  getPhaseDuration,
  PomodoroPhase,
  PomodoroConfig,
  FOCUS_SESSIONS_PER_CYCLE,
} from "../../components/pomodoro/types";
import { getPomodoroConfig, addPomodoroSession } from "../../db/operations";

export default function Timer() {
  const db = useSQLiteContext();
  const dbRef = useRef(db);
  dbRef.current = db;

  const pomodoroConfig = getPomodoroConfig(db);
  const configRef = useRef(pomodoroConfig);
  const phasesRef = useRef(buildPhases(configRef.current));
  const phases = phasesRef.current;

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(
    getPhaseDuration(phases[0], configRef.current),
  );
  const [isRunning, setIsRunning] = useState(false);

  const startTsRef = useRef(0);
  const accumulatedRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseIndexRef = useRef(0);
  const isRunningRef = useRef(false);

  phaseIndexRef.current = phaseIndex;
  isRunningRef.current = isRunning;

  const clearInterval_ = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const getTotal = useCallback(
    (idx: number) => getPhaseDuration(phases[idx], configRef.current) * 1000,
    [phases],
  );

  const tickRef = useRef<() => void>(() => {});

  tickRef.current = () => {
    const now = Date.now();
    const idx = phaseIndexRef.current;
    const total = getTotal(idx);
    const running = isRunningRef.current;
    const elapsed =
      accumulatedRef.current +
      (running ? now - startTsRef.current : 0);
    const remaining = Math.max(0, total - elapsed);
    const seconds = Math.ceil(remaining / 1000);

    setTimeLeft(seconds);

    if (remaining <= 0) {
      clearInterval_();

      const completedPhase = phases[idx];
      const phaseDurationMs = getPhaseDuration(completedPhase, configRef.current) * 1000;
      const actualDuration = Math.round(
        (accumulatedRef.current + (running ? now - startTsRef.current : 0)) / 60000,
      );

      if (completedPhase.type === "focus" && actualDuration > 0) {
        addPomodoroSession(dbRef.current, {
          type: "focus",
          startTime: new Date(now - elapsed).toISOString(),
          durationMinutes: actualDuration,
        });
      }

      const nextIdx = idx + 1;
      if (nextIdx < phases.length) {
        phaseIndexRef.current = nextIdx;
        setPhaseIndex(nextIdx);
        setTimeLeft(getPhaseDuration(phases[nextIdx], configRef.current));
        accumulatedRef.current = 0;
        startTsRef.current = Date.now();
        intervalRef.current = setInterval(() => tickRef.current(), 200);
      } else {
        setIsRunning(false);
        isRunningRef.current = false;
        accumulatedRef.current = 0;
      }
    }
  };

  const startTimer = useCallback(() => {
    clearInterval_();
    startTsRef.current = Date.now();
    intervalRef.current = setInterval(() => tickRef.current(), 200);
  }, [clearInterval_]);

  const handleTogglePlay = useCallback(() => {
    if (isRunningRef.current) {
      accumulatedRef.current += Date.now() - startTsRef.current;
      clearInterval_();
      setIsRunning(false);
      isRunningRef.current = false;
    } else {
      setIsRunning(true);
      isRunningRef.current = true;
      startTimer();
    }
  }, [clearInterval_, startTimer]);

  const handleStop = useCallback(() => {
    clearInterval_();
    setIsRunning(false);
    isRunningRef.current = false;
    accumulatedRef.current = 0;
    startTsRef.current = 0;
    phaseIndexRef.current = 0;
    setPhaseIndex(0);
    setTimeLeft(getPhaseDuration(phases[0], configRef.current));
  }, [clearInterval_, phases]);

  const handleSkip = useCallback(() => {
    clearInterval_();
    accumulatedRef.current = 0;

    const idx = phaseIndexRef.current;
    const nextIdx = idx < phases.length - 1 ? idx + 1 : 0;

    phaseIndexRef.current = nextIdx;
    setPhaseIndex(nextIdx);
    setTimeLeft(getPhaseDuration(phases[nextIdx], configRef.current));

    if (isRunningRef.current) {
      startTimer();
    }
  }, [clearInterval_, phases, startTimer]);

  useEffect(() => {
    return clearInterval_;
  }, [clearInterval_]);

  const currentPhase = phases[phaseIndex];
  const completedFocus = phases
    .slice(0, phaseIndex)
    .filter((p) => p.type === "focus").length;

  return (
    <SafeAreaView className="flex-1 bg-[#121212]" edges={["top"]}>
      <View className="flex-1 px-5">
        <TimerHeader
          phase={currentPhase}
          focusCount={completedFocus}
        />

        <TimerDisplay
          phase={currentPhase}
          config={configRef.current}
          timeLeft={timeLeft}
          isRunning={isRunning}
          onTogglePlay={handleTogglePlay}
          onStop={handleStop}
          onSkip={handleSkip}
        />

        <CycleIndicator
          completedFocus={completedFocus}
          currentPhaseType={currentPhase.type}
          currentFocusIndex={currentPhase.focusIndex}
        />
      </View>
    </SafeAreaView>
  );
}
