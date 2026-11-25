"use server";
import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, destroySession } from "@/lib/auth/server";
import { verifyPassword } from "@/lib/auth/password";
import { getConnection } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";

const emailSchema = z.string().trim().email("Adresse e-mail invalide.");

type AuthState = { error?: string; success?: boolean };

/** Connexion e-mail + mot de passe. Redirige vers /admin si succès. */
export async function signInWithPassword(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  if (!parsed.success) return { error: "Adresse e-mail invalide." };
  if (!password) return { error: "Mot de passe requis." };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!checkRateLimit(`login:${ip}`, 10, 15)) {
    return { error: "Trop de tentatives. Réessayez dans quelques minutes." };
  }

  const admin = getConnection()
    .prepare("SELECT id, email, password_hash FROM admins WHERE email = ?")
    .get(parsed.data) as { id: string; email: string; password_hash: string } | undefined;

  // Même message (et même coût de calcul) que le compte existe ou non
  const ok = verifyPassword(password, admin?.password_hash ?? "scrypt$AAAAAAAAAAAAAAAAAAAAAA$AAAA");
  if (!admin || !ok) return { error: "E-mail ou mot de passe incorrect." };

  if (!(await createSession(admin.id, admin.email))) {
    return { error: "Connexion indisponible : AUTH_SECRET n'est pas configuré sur le serveur." };
  }
  redirect("/admin");
}

/** Déconnexion. */
export async function signOut() {
  await destroySession();
  redirect("/connexion");
}
