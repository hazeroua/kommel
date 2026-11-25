/**
 * Jeton de session admin signé (HMAC-SHA256, Web Crypto).
 * Utilisable partout : proxy.ts comme Server Actions. Aucun état côté serveur.
 */

export const SESSION_COOKIE = "kommel_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 jours

export type SessionPayload = { sub: string; email: string; exp: number };

const encoder = new TextEncoder();

function getSecret(): string | null {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV !== "production") return "dev-only-secret-ne-pas-utiliser-en-production";
  console.error("[auth] AUTH_SECRET manquant ou trop court (32 caractères minimum) : connexion admin désactivée.");
  return null;
}

function b64url(bytes: ArrayBuffer | Uint8Array): string {
  return Buffer.from(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)).toString("base64url");
}

async function hmac(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(await crypto.subtle.sign("HMAC", key, encoder.encode(data)));
}

export async function signSession(sub: string, email: string): Promise<string | null> {
  const secret = getSecret();
  if (!secret) return null;
  const payload: SessionPayload = { sub, email, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE };
  const body = b64url(encoder.encode(JSON.stringify(payload)));
  return `${body}.${await hmac(body, secret)}`;
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  const secret = getSecret();
  if (!secret) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = await hmac(body, secret);
  // Comparaison à temps constant
  if (expected.length !== sig.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff !== 0) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    return payload.exp > Date.now() / 1000 ? payload : null;
  } catch {
    return null;
  }
}
