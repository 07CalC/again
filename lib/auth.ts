/**
 * Minimal password-based admin auth for the shelf dashboard.
 *
 * - Password comes from the ADMIN_PASSWORD environment variable.
 * - Sessions are stateless: `expires.timestamp.signature` where signature is
 *   an HMAC-SHA256 over `expires.timestamp` keyed with a secret derived from
 *   the password. Changing the password invalidates every session.
 * - Uses only Web Crypto so it runs on Cloudflare Workers.
 */

import { cookies } from "next/headers";
import { getSecret } from "@/lib/env";

const SESSION_COOKIE = "calc_admin";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function bytesToHex(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  return Array.from(view)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function getSecretKey(): Promise<CryptoKey | null> {
  const password = await getSecret("ADMIN_PASSWORD");
  if (!password) return null;

  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`calc-admin:${password}`)
  );

  return crypto.subtle.importKey(
    "raw",
    digest,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function verifyPassword(candidate: string): Promise<boolean> {
  const password = await getSecret("ADMIN_PASSWORD");
  if (!password) return false;
  return timingSafeEqual(candidate, password);
}

async function sign(payload: string): Promise<string> {
  const key = await getSecretKey();
  if (!key) throw new Error("ADMIN_PASSWORD is not configured");
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return bytesToHex(signature);
}

async function verify(payload: string, signature: string): Promise<boolean> {
  const expected = await sign(payload);
  return timingSafeEqual(signature, expected);
}

export async function createSessionToken(): Promise<string> {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `${expires}.${crypto.randomUUID()}`;
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

/**
 * Returns true when the current request carries a valid, unexpired session.
 */
export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [expires, nonce, signature] = parts;
  const expiresAt = Number(expires);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
  if (!nonce) return false;

  return verify(`${expires}.${nonce}`, signature);
}

export async function setSessionCookie(token: string): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function clearSessionCookie(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
