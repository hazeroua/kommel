"use server";
import "server-only";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/server";
import { getDb as openDb } from "@/lib/db";
import { saveUpload } from "@/lib/db/storage";
import { postKinds } from "@/types";

const postSchema = z.object({
  title: z.string().min(1, "Titre requis.").max(200),
  slug: z
    .string()
    .min(1, "Slug requis.")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug : lettres minuscules, chiffres et tirets uniquement."),
  excerpt: z.string().max(500).default(""),
  kind: z.enum(postKinds),
  published_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide."),
  cover_alt: z.string().max(200).default(""),
  image_rights_ok: z.coerce.boolean().default(false),
  content: z.string().optional(), // JSON Tiptap sérialisé
  status: z.enum(["brouillon", "publie"]).default("brouillon"),
});

type PostState = { error?: string; fieldErrors?: Record<string, string> };

/** Toute action admin vérifie la session avant d'accéder à la base. */
async function getDb() {
  await requireAdmin();
  return openDb();
}

export async function createPost(
  _prev: PostState,
  formData: FormData,
): Promise<PostState> {
  const raw = Object.fromEntries(formData);
  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      fieldErrors: Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v?.[0] ?? ""]),
      ),
    };
  }
  const db = await getDb();
  if (!db) return { error: "Non disponible." };

  let content = null;
  if (parsed.data.content) {
    try {
      content = JSON.parse(parsed.data.content);
    } catch {
      return { error: "Contenu JSON invalide." };
    }
  }

  const { data, error } = await db
    .from("posts")
    .insert({ ...parsed.data, content })
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/actualites");
  redirect(`/admin/posts/${data.id}`);
}

export async function updatePost(
  id: string,
  _prev: PostState,
  formData: FormData,
): Promise<PostState> {
  const raw = Object.fromEntries(formData);
  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      fieldErrors: Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v?.[0] ?? ""]),
      ),
    };
  }
  const db = await getDb();
  if (!db) return { error: "Non disponible." };

  let content = null;
  if (parsed.data.content) {
    try {
      content = JSON.parse(parsed.data.content);
    } catch {
      return { error: "Contenu JSON invalide." };
    }
  }

  const { error } = await db
    .from("posts")
    .update({ ...parsed.data, content })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/actualites");
  revalidatePath(`/actualites/${parsed.data.slug}`);
  return {};
}

export async function deletePost(id: string) {
  const db = await getDb();
  if (!db) return;
  await db.from("posts").delete().eq("id", id);
  revalidatePath("/actualites");
  redirect("/admin/posts");
}

export async function uploadCoverImage(postId: string, formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { error: "Fichier manquant." };
  if (!file.type.startsWith("image/")) return { error: "Fichier image requis." };
  if (file.size > 5 * 1024 * 1024) return { error: "Image trop lourde (max 5 Mo)." };

  const db = await getDb();
  if (!db) return { error: "Non disponible." };

  let publicUrl: string;
  try {
    publicUrl = await saveUpload(`posts/${postId.replace(/[^a-z0-9-]/gi, "")}`, "cover", file);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Envoi impossible." };
  }

  const { error: updateError } = await db
    .from("posts")
    .update({ cover_url: publicUrl })
    .eq("id", postId);

  if (updateError) return { error: updateError.message };

  revalidatePath(`/admin/posts/${postId}`);
  return { url: publicUrl };
}
