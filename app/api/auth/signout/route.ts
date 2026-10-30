import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

export async function POST() {
  if (env.supabaseUrl && env.supabaseAnonKey) {
    const cookieStore = await cookies();
    const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    });
    await supabase.auth.signOut();
  }
  return NextResponse.redirect(new URL("/connexion", env.siteUrl ?? "http://localhost:3000"));
}
