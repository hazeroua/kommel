import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getConnection } from "@/lib/db";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession, type SessionPayload } from "./session";

/** Session admin valide (signature, expiration, et compte toujours présent en base) ou null. */
export async function getAdminSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const session = await verifySession(store.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const exists = getConnection().prepare("SELECT 1 FROM admins WHERE id = ?").get(session.sub);
  return exists ? session : null;
}

/**
 * À appeler en tête de CHAQUE Server Action / lecture admin.
 * Les Server Actions sont des points d'entrée publics : le proxy ne suffit pas.
 */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getAdminSession();
  if (!session) redirect("/connexion");
  return session;
}

export async function createSession(adminId: string, email: string): Promise<boolean> {
  const token = await signSession(adminId, email);
  if (!token) return false;
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return true;
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}
