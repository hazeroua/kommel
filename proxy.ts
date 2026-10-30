import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";

/**
 * Protège les routes /admin/* :
 * - si non configuré → passe (dev sans Supabase)
 * - si non authentifié → redirige vers /connexion
 * - si authentifié mais pas admin → redirige vers /connexion?erreur=acces
 *
 * Note Next.js 16 : middleware.ts est renommé proxy.ts, export "proxy" (ou default).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Seules les routes /admin/* sont protégées
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Sans Supabase configuré (dev local sans .env.local), on laisse passer
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const login = new URL("/connexion", request.url);
    login.searchParams.set("redirect", pathname);
    return NextResponse.redirect(login);
  }

  // Vérifier que l'utilisateur est dans la table admins
  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!admin) {
    const login = new URL("/connexion", request.url);
    login.searchParams.set("erreur", "acces");
    return NextResponse.redirect(login);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
