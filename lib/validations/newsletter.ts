import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Indique ton adresse e-mail.")
    .email("Cette adresse e-mail n'est pas valide.")
    .max(254),
  firstName: z.string().trim().max(60, "Prénom trop long (60 caractères max).").optional(),
  consent: z.literal(true, {
    error: "Coche la case pour accepter de recevoir la newsletter.",
  }),
  // Honeypot : doit rester vide (champ invisible pour les humains)
  website: z.string().max(0).optional(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<string, string>>;
};
