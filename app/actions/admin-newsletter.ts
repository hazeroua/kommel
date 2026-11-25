"use server";
import "server-only";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/server";
import { getDb } from "@/lib/db";

/** Désinscrire une personne (demande de désinscription, RGPD). */
export async function deleteSubscriber(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await getDb().from("newsletter_subscribers").delete().eq("id", id);
  revalidatePath("/admin/newsletter");
  revalidatePath("/admin");
}
