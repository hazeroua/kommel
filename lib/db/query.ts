import "server-only";
import type { DatabaseSync, SQLInputValue } from "node:sqlite";
import { BOOLEAN_COLUMNS, JSON_COLUMNS } from "./schema";

/**
 * Mini query builder au-dessus de SQLite.
 * Volontairement proche de l'API utilisée auparavant (Supabase) pour garder les appels lisibles :
 *
 *   const { data, error } = await db.from("posts").select("id,title").eq("status", "publie").order("published_on", { ascending: false });
 *   await db.from("posts").insert({ title }).select("id").single();
 *   await db.from("posts").update({ title }).eq("id", id);
 *   await db.from("posts").delete().eq("id", id);
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;
export type DbError = { message: string };
export type DbResult<T> = { data: T; error: DbError | null; count: number | null };

const IDENT = /^[a-z_][a-z0-9_]*$/i;
function ident(name: string): string {
  if (!IDENT.test(name)) throw new Error(`Identifiant SQL invalide : ${name}`);
  return `"${name}"`;
}

function toDb(column: string, value: unknown): SQLInputValue {
  if (value === undefined || value === null) return null;
  if (JSON_COLUMNS.has(column)) return typeof value === "string" ? value : JSON.stringify(value);
  if (typeof value === "boolean") return value ? 1 : 0;
  if (typeof value === "number" || typeof value === "string" || typeof value === "bigint") return value;
  if (value instanceof Date) return value.toISOString();
  return JSON.stringify(value);
}

function fromDb(row: Row): Row {
  const out: Row = {};
  for (const [k, v] of Object.entries(row)) {
    if (BOOLEAN_COLUMNS.has(k)) out[k] = Boolean(v);
    else if (JSON_COLUMNS.has(k) && typeof v === "string") {
      try {
        out[k] = JSON.parse(v);
      } catch {
        out[k] = null;
      }
    } else out[k] = v;
  }
  return out;
}

type Mode = "select" | "insert" | "update" | "delete";

class Query<T = Row[]> implements PromiseLike<DbResult<T>> {
  private mode: Mode = "select";
  private columns = "*";
  private wantCount = false;
  private headOnly = false;
  private filters: { col: string; op: string; value: unknown }[] = [];
  private orders: { col: string; asc: boolean }[] = [];
  private limitN: number | null = null;
  private singleMode: "one" | "maybe" | null = null;
  private payload: Row[] = [];
  private returning = false;

  constructor(
    private db: DatabaseSync,
    private table: string,
  ) {
    ident(table);
  }

  select(columns = "*", opts?: { count?: "exact"; head?: boolean }) {
    if (this.mode === "select") {
      this.wantCount = opts?.count === "exact";
      this.headOnly = Boolean(opts?.head);
    } else {
      this.returning = true;
    }
    this.columns = columns
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => (c === "*" ? "*" : ident(c)))
      .join(", ") || "*";
    return this;
  }

  insert(values: Row | Row[]) {
    this.mode = "insert";
    this.payload = Array.isArray(values) ? values : [values];
    return this;
  }

  update(values: Row) {
    this.mode = "update";
    this.payload = [values];
    return this;
  }

  delete() {
    this.mode = "delete";
    return this;
  }

  eq(col: string, value: unknown) {
    this.filters.push({ col, op: "=", value });
    return this;
  }

  neq(col: string, value: unknown) {
    this.filters.push({ col, op: "!=", value });
    return this;
  }

  order(col: string, opts?: { ascending?: boolean }) {
    this.orders.push({ col, asc: opts?.ascending ?? true });
    return this;
  }

  limit(n: number) {
    this.limitN = Math.max(0, Math.floor(n));
    return this;
  }

  maybeSingle<R = Row>() {
    this.singleMode = "maybe";
    return this as unknown as Query<R | null>;
  }

  single<R = Row>() {
    this.singleMode = "one";
    return this as unknown as Query<R>;
  }

  private where(params: SQLInputValue[]): string {
    if (!this.filters.length) return "";
    return (
      " WHERE " +
      this.filters
        .map((f) => {
          params.push(toDb(f.col, f.value));
          return `${ident(f.col)} ${f.op} ?`;
        })
        .join(" AND ")
    );
  }

  private run(): DbResult<unknown> {
    const params: SQLInputValue[] = [];

    if (this.mode === "select") {
      if (this.headOnly) {
        const sql = `SELECT COUNT(*) AS n FROM ${ident(this.table)}${this.where(params)}`;
        const { n } = this.db.prepare(sql).get(...params) as { n: number };
        return { data: null, error: null, count: n };
      }
      let sql = `SELECT ${this.columns} FROM ${ident(this.table)}${this.where(params)}`;
      if (this.orders.length) sql += " ORDER BY " + this.orders.map((o) => `${ident(o.col)} ${o.asc ? "ASC" : "DESC"}`).join(", ");
      if (this.limitN !== null) sql += ` LIMIT ${this.limitN}`;
      const rows = (this.db.prepare(sql).all(...params) as Row[]).map(fromDb);
      return this.shape(rows, this.wantCount ? rows.length : null);
    }

    if (this.mode === "insert") {
      const ids: string[] = [];
      for (const raw of this.payload) {
        const row: Row = { id: crypto.randomUUID(), ...raw };
        const cols = Object.keys(row).filter((k) => row[k] !== undefined);
        const sql = `INSERT INTO ${ident(this.table)} (${cols.map(ident).join(", ")}) VALUES (${cols.map(() => "?").join(", ")})`;
        this.db.prepare(sql).run(...cols.map((c) => toDb(c, row[c])));
        ids.push(String(row.id));
      }
      return this.returnRows(ids);
    }

    if (this.mode === "update") {
      const values = this.payload[0] ?? {};
      const cols = Object.keys(values).filter((k) => values[k] !== undefined);
      if (!cols.length) return { data: null, error: null, count: 0 };
      const set = cols.map((c) => {
        params.push(toDb(c, values[c]));
        return `${ident(c)} = ?`;
      });
      const idParams: SQLInputValue[] = [];
      const ids = this.returning
        ? (this.db.prepare(`SELECT id FROM ${ident(this.table)}${this.where(idParams)}`).all(...idParams) as { id: string }[]).map((r) => r.id)
        : [];
      const res = this.db.prepare(`UPDATE ${ident(this.table)} SET ${set.join(", ")}${this.where(params)}`).run(...params);
      return this.returning ? this.returnRows(ids) : { data: null, error: null, count: Number(res.changes) };
    }

    // delete
    if (!this.filters.length) throw new Error("DELETE sans filtre refusé.");
    const res = this.db.prepare(`DELETE FROM ${ident(this.table)}${this.where(params)}`).run(...params);
    return { data: null, error: null, count: Number(res.changes) };
  }

  private returnRows(ids: string[]): DbResult<unknown> {
    if (!this.returning) return { data: null, error: null, count: ids.length };
    const rows = ids
      .map((id) => this.db.prepare(`SELECT ${this.columns} FROM ${ident(this.table)} WHERE id = ?`).get(id) as Row | undefined)
      .filter((r): r is Row => Boolean(r))
      .map(fromDb);
    return this.shape(rows, null);
  }

  private shape(rows: Row[], count: number | null): DbResult<unknown> {
    if (this.singleMode === "maybe") return { data: rows[0] ?? null, error: null, count };
    if (this.singleMode === "one") {
      return rows.length === 1
        ? { data: rows[0], error: null, count }
        : { data: null, error: { message: `Une ligne attendue, ${rows.length} trouvée(s).` }, count };
    }
    return { data: rows, error: null, count };
  }

  then<R1 = DbResult<T>, R2 = never>(
    onfulfilled?: ((value: DbResult<T>) => R1 | PromiseLike<R1>) | null,
    onrejected?: ((reason: unknown) => R2 | PromiseLike<R2>) | null,
  ): PromiseLike<R1 | R2> {
    let result: DbResult<T>;
    try {
      result = this.run() as DbResult<T>;
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.error(`[db] ${this.mode} ${this.table} :`, message);
      result = { data: null as T, error: { message }, count: null };
    }
    return Promise.resolve(result).then(onfulfilled, onrejected);
  }
}

export function createQueryClient(db: DatabaseSync) {
  return {
    from: (table: string) => new Query(db, table),
  };
}

export type QueryClient = ReturnType<typeof createQueryClient>;
