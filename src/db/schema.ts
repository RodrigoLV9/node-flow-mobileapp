import { type SQLiteDatabase } from "expo-sqlite";

export const SCHEMA = `
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color_hex TEXT NOT NULL,
  icon TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  pyramid_level INTEGER NOT NULL DEFAULT 3,
  category_id TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  target_date TEXT NOT NULL,
  completed_at TEXT,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS pomodoro_sessions (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`;

export function seedDefaults(db: SQLiteDatabase) {
  const count = db.getFirstSync<{ c: number }>(
    "SELECT COUNT(*) as c FROM categories",
  );
  if (count && count.c > 0) return;

  db.execSync(`
    INSERT OR IGNORE INTO categories (id, name, color_hex, icon)
    VALUES
      ('cat_uni', 'Universidad', '#00D4FF', 'school-outline'),
      ('cat_dev', 'Desarrollo', '#00FF66', 'code-slash-outline'),
      ('cat_life', 'Personal', '#FF3B69', 'person-outline');

    INSERT OR IGNORE INTO settings (key, value)
    VALUES
      ('focus_time_minutes', '25'),
      ('short_break_minutes', '5'),
      ('long_break_minutes', '15'),
      ('theme', 'dark'),
      ('strict_block_mode', 'true');
  `);
}
