"use server";
import "server-only";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/server";
import { getDb as openDb } from "@/lib/db";
import { accentColors } from "@/types";

const testimonialSchema = z.object({
  quote: z.string().min(1, "Citation requise.").max(1000),
  author: z.string().min(1, "Auteur requis.").max(200),
  color: z.enum(accentColors),
  visible: z.coerce.boolean().default(true),
});

type State = { error?: string; fieldErrors?: Record<string, string> };

/** Toute action admin vérifie la session avant d'accéder à la base. */
async function getDb() {
  await requireAdmin();
  return openDb();
}

export async function createTestimonial(_prev: State, formData: FormData): Promise<State> {
  const parsed = testimonialSchema.safeParse(Object.fromEntries(formData));
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
    .from("testimonials")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sort_order = (maxRow?.sort_order ?? 0) + 1;

  const { error } = await db.from("testimonials").insert({ ...parsed.data, sort_order });
  if (error) return { error: error.message };

  revalidatePath("/");
  return {};
}

export async function updateTestimonial(id: string, _prev: State, formData: FormData): Promise<State> {
  const parsed = testimonialSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      fieldErrors: Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v?.[0] ?? ""]),
      ),
    };
  }
  const db = await getDb();
  if (!db) return { error: "Non disponible." };

  const { error } = await db.from("testimonials").update(parsed.data).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/");
  return {};
}

export async function deleteTestimonial(id: string) {
  const db = await getDb();
  if (!db) return;
  await db.from("testimonials").delete().eq("id", id);
  revalidatePath("/");
}

export async function toggleTestimonialVisible(id: string, current: boolean) {
  const db = await getDb();
  if (!db) return;
  await db.from("testimonials").update({ visible: !current }).eq("id", id);
  revalidatePath("/");
}

export async function reorderTestimonial(id: string, direction: "up" | "down") {
  const db = await getDb();
  if (!db) return;

  const { data: all } = await db
    .from("testimonials")
    .select("id,sort_order")
    .order("sort_order", { ascending: true });

  if (!all) return;
  const idx = all.findIndex((t) => t.id === id);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapIdx < 0 || swapIdx >= all.length) return;

  const a = all[idx]!;
  const b = all[swapIdx]!;
  await Promise.all([
    db.from("testimonials").update({ sort_order: b.sort_order }).eq("id", a.id),
    db.from("testimonials").update({ sort_order: a.sort_order }).eq("id", b.id),
  ]);
  revalidatePath("/");
}
