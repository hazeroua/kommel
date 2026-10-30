"use server";
import "server-only";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSessionClient } from "@/lib/supabase/server";
import { accentColors } from "@/types";

const statSchema = z.object({
  prefix: z.string().max(20).default(""),
  value: z.coerce.number().int("Nombre entier requis."),
  suffix: z.string().max(20).default(""),
  label: z.string().min(1, "Libellé requis.").max(200),
  color: z.enum(accentColors),
});

type State = { error?: string; fieldErrors?: Record<string, string> };

async function getDb() {
  return await createSessionClient();
}

export async function createStat(_prev: State, formData: FormData): Promise<State> {
  const parsed = statSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      fieldErrors: Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v?.[0] ?? ""]),
      ),
    };
  }
  const db = await getDb();
  if (!db) return { error: "Non disponible." };

  const { data: maxRow } = await db
    .from("key_stats")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sort_order = (maxRow?.sort_order ?? 0) + 1;

  const { error } = await db.from("key_stats").insert({ ...parsed.data, sort_order });
  if (error) return { error: error.message };
  revalidatePath("/");
  return {};
}

export async function updateStat(id: string, _prev: State, formData: FormData): Promise<State> {
  const parsed = statSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      fieldErrors: Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v?.[0] ?? ""]),
      ),
    };
  }
  const db = await getDb();
  if (!db) return { error: "Non disponible." };

  const { error } = await db.from("key_stats").update(parsed.data).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  return {};
}

export async function deleteStat(id: string) {
  const db = await getDb();
  if (!db) return;
  await db.from("key_stats").delete().eq("id", id);
  revalidatePath("/");
}

export async function reorderStat(id: string, direction: "up" | "down") {
  const db = await getDb();
  if (!db) return;
  const { data: all } = await db.from("key_stats").select("id,sort_order").order("sort_order");
  if (!all) return;
  const idx = all.findIndex((s) => s.id === id);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapIdx < 0 || swapIdx >= all.length) return;
  const a = all[idx]!;
  const b = all[swapIdx]!;
  await Promise.all([
    db.from("key_stats").update({ sort_order: b.sort_order }).eq("id", a.id),
    db.from("key_stats").update({ sort_order: a.sort_order }).eq("id", b.id),
  ]);
  revalidatePath("/");
}
