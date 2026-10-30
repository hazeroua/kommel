import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

/**
 * Client Supabase côté serveur qui lit/écrit les cookies de session.
 * À utiliser dans les Server Actions et les Route Handlers.
 */
export async function createSessionClient() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) return null;

  const cookieStore = await cookies();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // En lecture seule (Server Component) — ignoré
        }
      },
    },
  });
}
