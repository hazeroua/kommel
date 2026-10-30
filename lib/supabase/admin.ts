import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/**
 * Client Supabase avec la service_role key.
 * ⚠️  Bypasse le RLS — utiliser UNIQUEMENT pour des checks d'admin côté serveur.
 * Ne jamais exposer ce client aux composants "use client".
 */
export function createServiceClient() {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) return null;
  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });
}
