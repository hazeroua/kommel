"use server";
import "server-only";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import { z } from "zod";

const emailSchema = z.string().email("Adresse e-mail invalide.");

/**
 * Connexion email + mot de passe.
 * Redirige vers /admin si succès.
 */
type AuthState = { error?: string; success?: boolean };

export async function signInWithPassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) return { error: "Adresse e-mail invalide." };
  if (!password) return { error: "Mot de passe requis." };

  const supabase = await createSessionClient();
  if (!supabase) return { error: "Service non disponible." };

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data,
    password,
  });

  if (error) {
    console.error("[admin-auth] signInWithPassword", error.message);
    return { error: "E-mail ou mot de passe incorrect." };
  }

  redirect("/admin");
}

/**
 * Envoie un magic link si l'e-mail est dans la liste des admins.
 */
export async function sendMagicLink(_prev: { error?: string }, formData: FormData) {
  const email = formData.get("email");
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "E-mail invalide." };

  const service = createServiceClient();
  if (!service) return { error: "Service non disponible." };

  const { data: admin } = await service
    .from("admins")
    .select("id")
    .eq("email", parsed.data)
    .maybeSingle();

  if (!admin) {
    return { success: true };
  }

  const rawOrigin = String(formData.get("origin") ?? "").trim();
  const origin =
    rawOrigin && /^https?:\/\//.test(rawOrigin)
      ? rawOrigin
      : (env.siteUrl ?? "http://localhost:3000");

  const callbackUrl = `${origin}/auth/callback`;

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
