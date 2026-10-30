"use server";
import "server-only";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import { z } from "zod";

const emailSchema = z.string().email("Adresse e-mail invalide.");

/** Envoie un magic link si l'e-mail est dans la liste des admins. */
export async function sendMagicLink(_prev: { error?: string }, formData: FormData) {
  const email = formData.get("email");
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "E-mail invalide." };

  // Vérification via service role (contourne RLS pour la vérification d'admin)
  const service = createServiceClient();
  if (!service) return { error: "Service non disponible." };

  const { data: admin } = await service
    .from("admins")
    .select("id")
    .eq("email", parsed.data)
    .maybeSingle();

  if (!admin) {
    // Ne pas révéler si l'e-mail est inconnu — même réponse dans tous les cas
    return { success: true };
  }

  const callbackUrl = `${env.siteUrl}/auth/callback`;
  const supabase = await createSessionClient();
  if (!supabase) return { error: "Service non disponible." };

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data,
    options: { emailRedirectTo: callbackUrl },
  });

  if (error) {
    console.error("[admin-auth] signInWithOtp", error.message);
    return { error: "Impossible d'envoyer le lien. Réessayez plus tard." };
  }

  return { success: true };
}

/** Déconnexion. */
export async function signOut() {
  const supabase = await createSessionClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/connexion");
}
