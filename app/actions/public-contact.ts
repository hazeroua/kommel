"use server";
import { z } from "zod";
import { createSessionClient } from "@/lib/supabase/server";

const schema = z.object({ name: z.string().trim().min(2), email: z.string().email(), phone: z.string().trim().optional(), organization: z.string().trim().optional(), topic: z.string().trim().optional(), message: z.string().trim().min(10), website: z.string().optional() });
export type ContactState = { status: "idle" | "success" | "error"; message?: string };
export async function sendContactMessage(_: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Vérifie les champs obligatoires et ton adresse e-mail." };
  if (parsed.data.website) return { status: "success", message: "Merci !" };
  const db = await createSessionClient();
  if (!db) return { status: "error", message: "Le formulaire est momentanément indisponible. Écris-nous directement par e-mail." };
  const { error } = await db.from("contact_messages").insert({ kind: "contact", name: parsed.data.name, email: parsed.data.email, phone: parsed.data.phone || null, organization: parsed.data.organization || null, topic: parsed.data.topic || null, message: parsed.data.message });
  return error ? { status: "error", message: "Le message n’a pas pu être envoyé. Réessaie dans un instant." } : { status: "success", message: "Merci, ton message est bien arrivé chez KOM’MEL." };
}
