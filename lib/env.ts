/**
 * Centralise l'accès aux variables d'environnement.
 * Utilise des valeurs vides en développement (sans Supabase).
 */
export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  brevoApiKey: process.env.BREVO_API_KEY ?? "",
  brevoListId: process.env.BREVO_LIST_ID ?? "",
  brevoDoiTemplateId: process.env.BREVO_DOI_TEMPLATE_ID ?? "",
  brevoDoiRedirectUrl: process.env.BREVO_DOI_REDIRECT_URL ?? "",
  brevoSenderEmail: process.env.BREVO_SENDER_EMAIL ?? "contact@kommel.fr",
  brevoSenderName: process.env.BREVO_SENDER_NAME ?? "KOM'MEL",
  notifyEmail: process.env.NOTIFY_EMAIL ?? "contact@kommel.fr",
  helloAssoWidgetUrl: process.env.NEXT_PUBLIC_HELLOASSO_WIDGET_URL ?? "",
  turnstiteSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
  turnstilesSecretKey: process.env.TURNSTILE_SECRET_KEY ?? "",
  rateLimitSalt: process.env.RATE_LIMIT_SALT ?? "",
} as const;
