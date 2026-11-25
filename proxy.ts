import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/session";

/**
 * Protège les pages /admin/* : sans session admin valide → /connexion.
 * (Chaque Server Action admin revérifie aussi la session avec requireAdmin().)
 */
export async function proxy(request: NextRequest) {
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  if (!session) {
    const login = new URL("/connexion", request.url);
    login.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
