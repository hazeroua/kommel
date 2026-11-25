import "server-only";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEYLEN = 64;

/** Hash « scrypt$<sel>$<hash> » (sel aléatoire, comparaison à temps constant). */
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, KEYLEN);
  return `scrypt$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [algo, saltB64, hashB64] = stored.split("$");
  if (algo !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64url");
  const actual = scryptSync(password, Buffer.from(saltB64, "base64url"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
