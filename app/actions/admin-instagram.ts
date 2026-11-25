"use server";
import "server-only";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/server";
import { getDb as openDb } from "@/lib/db";

const igSchema = z.object({
  image_url: z.string().url("URL d'image invalide."),
  permalink: z.string().url("URL du post invalide.").optional().or(z.literal("")),
  alt: z.string().max(300).optional(),
});

type State = { error?: string; fieldErrors?: Record<string, string> };

/** Toute action admin vérifie la session avant d'accéder à la base. */
async function getDb() {
  await requireAdmin();
  return openDb();
}

export async function createInstagramPost(_prev: State, formData: FormData): Promise<State> {
  const raw = Object.fromEntries(formData);
  const parsed = igSchema.safeParse(raw);
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
    .from("instagram_posts")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sort_order = (maxRow?.sort_order ?? 0) + 1;

  const { error } = await db.from("instagram_posts").insert({
    image_url: parsed.data.image_url,
    permalink: parsed.data.permalink || "",
    alt: parsed.data.alt || "",
    sort_order,
  });
  if (error) return { error: error.message };
  revalidatePath("/");
  return {};
}

export async function updateInstagramPost(
  id: string,
  _prev: State,
  formData: FormData,
): Promise<State> {
  const raw = Object.fromEntries(formData);
  const parsed = igSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      fieldErrors: Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v?.[0] ?? ""]),
      ),
    };
  }
  const db = await getDb();
  if (!db) return { error: "Non disponible." };

  const { error } = await db.from("instagram_posts").update({
    image_url: parsed.data.image_url,
    permalink: parsed.data.permalink || "",
    alt: parsed.data.alt || "",
  }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  return {};
}

export async function deleteInstagramPost(id: string) {
  const db = await getDb();
  if (!db) return;
  await db.from("instagram_posts").delete().eq("id", id);
  revalidatePath("/");
}

export async function reorderInstagramPost(id: string, direction: "up" | "down") {
  const db = await getDb();
  if (!db) return;
  const { data: all } = await db
    .from("instagram_posts")
    .select("id,sort_order")
    .order("sort_order");
  if (!all) return;
  const idx = all.findIndex((p) => p.id === id);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapIdx < 0 || swapIdx >= all.length) return;
  const a = all[idx]!;
  const b = all[swapIdx]!;
  await Promise.all([
    db.from("instagram_posts").update({ sort_order: b.sort_order }).eq("id", a.id),
    db.from("instagram_posts").update({ sort_order: a.sort_order }).eq("id", b.id),
  ]);
  revalidatePath("/");
}
