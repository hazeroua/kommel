import "server-only";
import { getConnection } from "@/lib/db";

/**
 * Limite simple par fenêtre fixe, stockée dans SQLite.
 * Renvoie false si la clé a dépassé `max` essais dans la fenêtre.
 */
export function checkRateLimit(key: string, max = 10, windowMinutes = 15): boolean {
  const db = getConnection();
  const windowMs = windowMinutes * 60_000;
  const windowStart = new Date(Math.floor(Date.now() / windowMs) * windowMs).toISOString();
  const row = db
    .prepare(
      `INSERT INTO rate_limits (key, window_start, count) VALUES (?, ?, 1)
       ON CONFLICT (key, window_start) DO UPDATE SET count = count + 1
       RETURNING count`,
    )
    .get(key, windowStart) as { count: number };
  // Ménage occasionnel des anciennes fenêtres
  if (Math.random() < 0.05) {
    db.prepare("DELETE FROM rate_limits WHERE window_start < ?").run(new Date(Date.now() - 24 * 3600_000).toISOString());
  }
  return row.count <= max;
}
