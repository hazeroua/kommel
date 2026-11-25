import "server-only";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { SCHEMA, seed } from "./schema";

/**
 * Toutes les données vivent dans un seul dossier :
 *   - DATA_DIR si défini,
 *   - sinon /data en production (volume Railway),
 *   - sinon ./data en développement.
 *
 * Contenu : kommel.db (base SQLite) + uploads/ (images envoyées depuis l'admin).
 */
export const DATA_DIR =
  process.env.DATA_DIR ||
  (process.env.NODE_ENV === "production" ? "/data" : path.join(process.cwd(), "data"));

export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

// Une seule connexion par processus (survit au rechargement à chaud en dev)
const globalForDb = globalThis as unknown as { __kommelDb?: DatabaseSync };

export function getConnection(): DatabaseSync {
  if (globalForDb.__kommelDb) return globalForDb.__kommelDb;

  mkdirSync(UPLOADS_DIR, { recursive: true });
  const db = new DatabaseSync(path.join(DATA_DIR, "kommel.db"));
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
  db.exec(SCHEMA);
  seed(db);

  globalForDb.__kommelDb = db;
  return db;
}
