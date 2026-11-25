import "server-only";
import type { DatabaseSync } from "node:sqlite";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

const NOW = "(strftime('%Y-%m-%dT%H:%M:%fZ','now'))";

/**
 * Schéma SQLite (idempotent : exécuté à chaque démarrage).
 * Booléens stockés en 0/1, JSON stocké en texte — conversions faites dans query.ts.
 */
export const SCHEMA = `
CREATE TABLE IF NOT EXISTS admins (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT ${NOW}
);

CREATE TABLE IF NOT EXISTS posts (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  excerpt         TEXT NOT NULL DEFAULT '',
  kind            TEXT NOT NULL DEFAULT 'actualite' CHECK (kind IN ('actualite','evenement')),
  status          TEXT NOT NULL DEFAULT 'brouillon' CHECK (status IN ('brouillon','publie')),
  published_on    TEXT NOT NULL DEFAULT (date('now')),
  cover_url       TEXT,
  cover_alt       TEXT NOT NULL DEFAULT '',
  content         TEXT,
  image_rights_ok INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL DEFAULT ${NOW},
  updated_at      TEXT NOT NULL DEFAULT ${NOW}
);
CREATE TRIGGER IF NOT EXISTS posts_updated_at AFTER UPDATE ON posts
  FOR EACH ROW WHEN NEW.updated_at = OLD.updated_at
  BEGIN UPDATE posts SET updated_at = ${NOW} WHERE id = NEW.id; END;

CREATE TABLE IF NOT EXISTS testimonials (
  id         TEXT PRIMARY KEY,
  quote      TEXT NOT NULL,
  author     TEXT NOT NULL,
  color      TEXT NOT NULL DEFAULT 'corail',
  visible    INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT ${NOW}
);

CREATE TABLE IF NOT EXISTS key_stats (
  id         TEXT PRIMARY KEY,
  prefix     TEXT NOT NULL DEFAULT '',
  value      INTEGER NOT NULL,
  suffix     TEXT NOT NULL DEFAULT '',
  label      TEXT NOT NULL,
  color      TEXT NOT NULL DEFAULT 'corail',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS partners (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  logo_url   TEXT,
  url        TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT ${NOW}
);

CREATE TABLE IF NOT EXISTS instagram_posts (
  id         TEXT PRIMARY KEY,
  image_url  TEXT NOT NULL,
  alt        TEXT NOT NULL DEFAULT '',
  permalink  TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT ${NOW}
);

CREATE TABLE IF NOT EXISTS intervention_requests (
  id             TEXT PRIMARY KEY,
  structure_name TEXT NOT NULL,
  structure_type TEXT NOT NULL CHECK (structure_type IN ('ecole','college','lycee','universite','club','autre')),
  contact_name   TEXT NOT NULL,
  email          TEXT NOT NULL,
  phone          TEXT,
  youth_age      TEXT NOT NULL,
  participants   INTEGER,
  desired_dates  TEXT,
  action_type    TEXT NOT NULL CHECK (action_type IN ('scolaire','club','tout-public','autre')),
  message        TEXT,
  status         TEXT NOT NULL DEFAULT 'nouvelle' CHECK (status IN ('nouvelle','en_cours','traitee')),
  created_at     TEXT NOT NULL DEFAULT ${NOW}
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id           TEXT PRIMARY KEY,
  kind         TEXT NOT NULL DEFAULT 'contact' CHECK (kind IN ('contact','partenariat','benevolat')),
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT,
  organization TEXT,
  topic        TEXT,
  message      TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'nouvelle' CHECK (status IN ('nouvelle','en_cours','traitee')),
  created_at   TEXT NOT NULL DEFAULT ${NOW}
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id         TEXT PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE COLLATE NOCASE,
  first_name TEXT,
  created_at TEXT NOT NULL DEFAULT ${NOW}
);

CREATE TABLE IF NOT EXISTS rate_limits (
  key          TEXT NOT NULL,
  window_start TEXT NOT NULL,
  count        INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (key, window_start)
);
`;

/** Colonnes à convertir entre SQLite et JS. */
export const BOOLEAN_COLUMNS = new Set(["visible", "image_rights_ok"]);
export const JSON_COLUMNS = new Set(["content"]);

/**
 * Crée (ou met à jour) le compte admin défini par ADMIN_EMAIL / ADMIN_PASSWORD.
 * Changer ADMIN_PASSWORD puis redémarrer = réinitialiser le mot de passe.
 */
export function seed(db: DatabaseSync) {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  const existing = db.prepare("SELECT id, password_hash FROM admins WHERE email = ?").get(email) as
    | { id: string; password_hash: string }
    | undefined;

  if (!existing) {
    db.prepare("INSERT INTO admins (id, email, password_hash) VALUES (?, ?, ?)").run(
      crypto.randomUUID(),
      email,
      hashPassword(password),
    );
  } else if (!verifyPassword(password, existing.password_hash)) {
    db.prepare("UPDATE admins SET password_hash = ? WHERE id = ?").run(hashPassword(password), existing.id);
  }
}
