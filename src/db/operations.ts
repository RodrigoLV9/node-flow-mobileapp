import { type SQLiteDatabase } from "expo-sqlite";
import { Category, Task } from "../types";

export interface DbPomodoroSession {
  id: string;
  type: "focus" | "short_break" | "long_break";
  start_time: string;
  end_time: string | null;
  duration_minutes: number;
}

export interface DayStats {
  date: string;
  focus_minutes: number;
  tasks_completed: number;
  task_weight: number;
}

function genId(prefix: string): string {
  return prefix + Math.random().toString(36).slice(2, 10);
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getCategories(db: SQLiteDatabase): Category[] {
  return db.getAllSync<Category>(
    "SELECT id, name, color_hex, icon FROM categories ORDER BY name",
  );
}

export function createCategory(
  db: SQLiteDatabase,
  data: { name: string; icon: string; color: string },
): Category {
  const id = genId("cat_");
  db.runSync(
    "INSERT INTO categories (id, name, color_hex, icon) VALUES (?, ?, ?, ?)",
    id,
    data.name,
    data.color,
    data.icon,
  );
  return { id, name: data.name, color_hex: data.color, icon: data.icon };
}

export function updateCategory(
  db: SQLiteDatabase,
  id: string,
  data: { name: string; icon: string; color: string },
) {
  db.runSync(
    "UPDATE categories SET name = ?, icon = ?, color_hex = ? WHERE id = ?",
    data.name,
    data.icon,
    data.color,
    id,
  );
}

export function deleteCategory(db: SQLiteDatabase, id: string) {
  db.runSync("DELETE FROM categories WHERE id = ?", id);
  db.runSync("UPDATE tasks SET category_id = '' WHERE category_id = ?", id);
}

export function getTasksByDate(db: SQLiteDatabase, date: string): Task[] {
  return db.getAllSync<Task>(
    "SELECT * FROM tasks WHERE target_date = ? ORDER BY status ASC, pyramid_level DESC",
    date,
  );
}

export function createTask(
  db: SQLiteDatabase,
  data: { title: string; pyramidLevel: number; categoryId: string; targetDate: string },
): Task {
  const id = genId("tsk_");
  const task: Task = {
    id,
    title: data.title,
    pyramid_level: data.pyramidLevel,
    category_id: data.categoryId,
    status: "pending",
    target_date: data.targetDate,
    completed_at: null,
  };
  db.runSync(
    `INSERT INTO tasks (id, title, pyramid_level, category_id, status, target_date, completed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    task.id,
    task.title,
    task.pyramid_level,
    task.category_id,
    task.status,
    task.target_date,
    task.completed_at,
  );
  return task;
}

export function toggleTask(db: SQLiteDatabase, id: string) {
  const task = db.getFirstSync<{ status: string }>(
    "SELECT status FROM tasks WHERE id = ?",
    id,
  );
  if (!task) return;
  const newStatus = task.status === "completed" ? "pending" : "completed";
  const completedAt = newStatus === "completed" ? new Date().toISOString() : null;
  db.runSync(
    "UPDATE tasks SET status = ?, completed_at = ? WHERE id = ?",
    newStatus,
    completedAt,
    id,
  );
}

export function deleteTask(db: SQLiteDatabase, id: string) {
  db.runSync("DELETE FROM tasks WHERE id = ?", id);
}

export function updateTask(
  db: SQLiteDatabase,
  id: string,
  data: {
    title: string;
    pyramidLevel: number;
    categoryId: string;
    targetDate: string;
  },
) {
  db.runSync(
    `UPDATE tasks SET title = ?, pyramid_level = ?, category_id = ?, target_date = ?
     WHERE id = ?`,
    data.title,
    data.pyramidLevel,
    data.categoryId,
    data.targetDate,
    id,
  );
}

export function getTasksByDateRange(
  db: SQLiteDatabase,
  startDate: string,
  endDate: string,
): Task[] {
  return db.getAllSync<Task>(
    "SELECT * FROM tasks WHERE target_date >= ? AND target_date <= ?",
    startDate,
    endDate,
  );
}

export function getCompletedTasksByDateRange(
  db: SQLiteDatabase,
  startDate: string,
  endDate: string,
): Task[] {
  return db.getAllSync<Task>(
    "SELECT * FROM tasks WHERE status = 'completed' AND target_date >= ? AND target_date <= ?",
    startDate,
    endDate,
  );
}

export function getTasksByPyramidLevel(
  db: SQLiteDatabase,
  startDate: string,
  endDate: string,
): { pyramid_level: number; count: number }[] {
  return db.getAllSync<{ pyramid_level: number; count: number }>(
    `SELECT pyramid_level, COUNT(*) as count
     FROM tasks
     WHERE target_date >= ? AND target_date <= ?
     GROUP BY pyramid_level
     ORDER BY pyramid_level`,
    startDate,
    endDate,
  );
}

export function getCompletedTasksByPyramidLevel(
  db: SQLiteDatabase,
  startDate: string,
  endDate: string,
): { pyramid_level: number; count: number }[] {
  return db.getAllSync<{ pyramid_level: number; count: number }>(
    `SELECT pyramid_level, COUNT(*) as count
     FROM tasks
     WHERE status = 'completed' AND target_date >= ? AND target_date <= ?
     GROUP BY pyramid_level
     ORDER BY pyramid_level`,
    startDate,
    endDate,
  );
}

export function addPomodoroSession(
  db: SQLiteDatabase,
  data: { type: string; startTime: string; durationMinutes: number },
): DbPomodoroSession {
  const id = genId("sess_");
  const endTime =
    data.durationMinutes > 0
      ? new Date(
          new Date(data.startTime).getTime() + data.durationMinutes * 60000,
        ).toISOString()
      : null;

  db.runSync(
    `INSERT INTO pomodoro_sessions (id, type, start_time, end_time, duration_minutes)
     VALUES (?, ?, ?, ?, ?)`,
    id,
    data.type,
    data.startTime,
    endTime,
    data.durationMinutes,
  );
  return {
    id,
    type: data.type as DbPomodoroSession["type"],
    start_time: data.startTime,
    end_time: endTime,
    duration_minutes: data.durationMinutes,
  };
}

export function getPomodoroFocusByDateRange(
  db: SQLiteDatabase,
  startDate: string,
  endDate: string,
): number {
  const row = db.getFirstSync<{ total: number | null }>(
    `SELECT SUM(duration_minutes) as total
     FROM pomodoro_sessions
     WHERE type = 'focus' AND start_time >= ? AND start_time < ?`,
    startDate,
    endDate,
  );
  return row?.total ?? 0;
}

export function getPomodoroSessionsByDateRange(
  db: SQLiteDatabase,
  startDate: string,
  endDate: string,
): DbPomodoroSession[] {
  return db.getAllSync<DbPomodoroSession>(
    `SELECT * FROM pomodoro_sessions
     WHERE start_time >= ? AND start_time < ?
     ORDER BY start_time`,
    startDate,
    endDate,
  );
}

export function getDailyStats(
  db: SQLiteDatabase,
  startDate: string,
  endDate: string,
): DayStats[] {
  const rows = db.getAllSync<{
    target_date: string;
    focus_minutes: number | null;
    tasks_completed: number | null;
    task_weight: number | null;
  }>(
    `SELECT
       t.target_date,
       COALESCE(ps.focus_minutes, 0) as focus_minutes,
       COALESCE(ts.tasks_completed, 0) as tasks_completed,
       COALESCE(ts.task_weight, 0) as task_weight
     FROM (SELECT DISTINCT target_date FROM tasks WHERE target_date >= ? AND target_date <= ?
           UNION
           SELECT DISTINCT date(start_time) FROM pomodoro_sessions WHERE start_time >= ? AND start_time < ?) t
     LEFT JOIN (
       SELECT date(start_time) as d, SUM(duration_minutes) as focus_minutes
       FROM pomodoro_sessions WHERE type = 'focus' AND start_time >= ? AND start_time < ?
       GROUP BY d
     ) ps ON t.target_date = ps.d
     LEFT JOIN (
       SELECT target_date as d,
              COUNT(*) as tasks_completed,
              SUM(pyramid_level) as task_weight
       FROM tasks WHERE status = 'completed' AND target_date >= ? AND target_date <= ?
       GROUP BY target_date
     ) ts ON t.target_date = ts.d
     ORDER BY t.target_date`,
    startDate,
    endDate,
    startDate,
    endDate,
    startDate,
    endDate,
    startDate,
    endDate,
  );

  return rows.map((r) => ({
    date: r.target_date,
    focus_minutes: r.focus_minutes ?? 0,
    tasks_completed: r.tasks_completed ?? 0,
    task_weight: r.task_weight ?? 0,
  }));
}

export function getSettings(db: SQLiteDatabase): Record<string, string> {
  const rows = db.getAllSync<{ key: string; value: string }>(
    "SELECT key, value FROM settings",
  );
  const map: Record<string, string> = {};
  rows.forEach((r) => {
    map[r.key] = r.value;
  });
  return map;
}

export function setSetting(db: SQLiteDatabase, key: string, value: string) {
  db.runSync(
    "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
    key,
    value,
  );
}

export function getPomodoroConfig(db: SQLiteDatabase): {
  focusTime: number;
  shortBreak: number;
  longBreak: number;
} {
  const settings = getSettings(db);
  return {
    focusTime: parseInt(settings.focus_time_minutes ?? "25", 10),
    shortBreak: parseInt(settings.short_break_minutes ?? "5", 10),
    longBreak: parseInt(settings.long_break_minutes ?? "15", 10),
  };
}

export function getTaskCompletionByDay(
  db: SQLiteDatabase,
  startDate: string,
  endDate: string,
): { date: string; count: number }[] {
  return db.getAllSync<{ date: string; count: number }>(
    `SELECT target_date as date, COUNT(*) as count
     FROM tasks
     WHERE status = 'completed' AND target_date >= ? AND target_date <= ?
     GROUP BY target_date
     ORDER BY target_date`,
    startDate,
    endDate,
  );
}

export function getDailyFocusMinutes(
  db: SQLiteDatabase,
  startDate: string,
  endDate: string,
): { date: string; minutes: number }[] {
  return db.getAllSync<{ date: string; minutes: number }>(
    `SELECT date(start_time) as date, SUM(duration_minutes) as minutes
     FROM pomodoro_sessions
     WHERE type = 'focus' AND start_time >= ? AND start_time < ?
     GROUP BY date(start_time)
     ORDER BY date`,
    startDate,
    endDate,
  );
}

export function getHeatmapData(
  db: SQLiteDatabase,
  startDate: string,
  endDate: string,
): { date: string; weight: number }[] {
  return db.getAllSync<{ date: string; weight: number }>(
    `SELECT target_date as date, SUM(pyramid_level) as weight
     FROM tasks
     WHERE status = 'completed' AND target_date >= ? AND target_date <= ?
     GROUP BY target_date
     ORDER BY target_date`,
    startDate,
    endDate,
  );
}
