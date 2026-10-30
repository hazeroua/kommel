"use server";

import { newsletterSchema, type FormState } from "@/lib/validations/newsletter";

/**
 * Inscription newsletter.
 * Phase 2 : validation serveur seulement.
 * Phase 8 : envoi à la liste Brevo avec double opt-in (clé API côté serveur uniquement).
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
      return { status: "success", message: "Merci ! Vérifie ta boîte mail pour confirmer." };
    }
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "Certains champs sont à corriger.", fieldErrors };
  }

  // TODO phase 8 : appel Brevo (double opt-in) + limitation de débit
  return {
    status: "success",
    message: "Merci ! Vérifie ta boîte mail pour confirmer ton inscription.",
  };
}
