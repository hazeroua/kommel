"use server";
import "server-only";
import { revalidatePath } from "next/cache";
import { createSessionClient } from "@/lib/supabase/server";
import { requestStatuses } from "@/types";
import { z } from "zod";

const statusSchema = z.enum(requestStatuses);

async function getDb() {
  return await createSessionClient();
}

export async function updateInterventionStatus(id: string, status: string) {
  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) return { error: "Statut invalide." };
  const db = await getDb();
  if (!db) return { error: "Non disponible." };
  const { error } = await db.from("intervention_requests").update({ status: parsed.data }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/demandes");
  return {};
}

export async function updateMessageStatus(id: string, status: string) {
  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) return { error: "Statut invalide." };
  const db = await getDb();
  if (!db) return { error: "Non disponible." };
  const { error } = await db.from("contact_messages").update({ status: parsed.data }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/messages");
  return {};
}
