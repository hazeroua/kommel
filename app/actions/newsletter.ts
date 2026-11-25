"use server";

import { headers } from "next/headers";
import { getConnection } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { newsletterSchema, type FormState } from "@/lib/validations/newsletter";

/**
 * Inscription newsletter : enregistrée dans la base (visible dans /admin/newsletter).
 * L'envoi des e-mails (Brevo, double opt-in) n'est pas encore branché.
 */
export async function subscribeNewsletter(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = newsletterSchema.safeParse({
    email: formData.get("email"),
    firstName: formData.get("firstName") || undefined,
    consent: formData.get("consent") === "on",
    website: formData.get("website") || undefined,
  });

  if (!parsed.success) {
    // Honeypot rempli : on répond comme un succès pour ne pas renseigner le robot
    if (parsed.error.issues.some((i) => i.path[0] === "website")) {
      return { status: "success", message: "Merci, ton inscription est bien enregistrée !" };
    }
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "Certains champs sont à corriger.", fieldErrors };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!checkRateLimit(`newsletter:${ip}`, 10, 60)) {
    return { status: "error", message: "Trop d'essais, réessaie un peu plus tard." };
  }

  try {
    // Déjà inscrit·e : on ne duplique pas, et on répond pareil (pas de fuite d'info)
    getConnection()
      .prepare(
        `INSERT INTO newsletter_subscribers (id, email, first_name) VALUES (?, ?, ?)
         ON CONFLICT (email) DO NOTHING`,
      )
      .run(crypto.randomUUID(), parsed.data.email, parsed.data.firstName ?? null);
  } catch (e) {
    console.error("[newsletter]", e);
    return { status: "error", message: "L'inscription n'a pas pu être enregistrée. Réessaie dans un instant." };
  }

  return { status: "success", message: "Merci, ton inscription est bien enregistrée !" };
}
