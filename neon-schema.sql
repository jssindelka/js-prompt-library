-- Prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  prompt TEXT NOT NULL DEFAULT '',
  image TEXT,
  categories TEXT[] DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT ''
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  prompt TEXT NOT NULL DEFAULT '',
  example TEXT DEFAULT '',
  categories TEXT[] DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT ''
);
