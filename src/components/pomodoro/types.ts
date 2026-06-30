export type PhaseType = "focus" | "short_break" | "long_break";

export interface PomodoroPhase {
  type: PhaseType;
  focusIndex: number;
}

export interface PomodoroConfig {
  focusTime: number;
  shortBreak: number;
  longBreak: number;
}

export const FOCUS_SESSIONS_PER_CYCLE = 8;

export function buildPhases(config: PomodoroConfig): PomodoroPhase[] {
  const phases: PomodoroPhase[] = [];
  let focusIndex = 0;

  for (let i = 0; i < FOCUS_SESSIONS_PER_CYCLE; i++) {
    phases.push({ type: "focus", focusIndex });
    focusIndex++;

    if (i === 3) {
      phases.push({ type: "long_break", focusIndex: -1 });
    } else if (i < FOCUS_SESSIONS_PER_CYCLE - 1) {
      phases.push({ type: "short_break", focusIndex: -1 });
    }
  }

  return phases;
}

export function getPhaseDuration(
  phase: PomodoroPhase,
  config: PomodoroConfig,
): number {
  switch (phase.type) {
    case "focus":
      return config.focusTime * 60;
    case "short_break":
      return config.shortBreak * 60;
    case "long_break":
      return config.longBreak * 60;
  }
}
