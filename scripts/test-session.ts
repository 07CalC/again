/**
 * Generates a valid admin session cookie (same scheme as lib/auth.ts) so the
 * authed endpoints can be exercised with curl during testing.
 *
 * Usage: bun scripts/test-session.ts
 */
export {};

const password = process.env.ADMIN_PASSWORD ?? "dev-password";

const digest = await crypto.subtle.digest(
  "SHA-256",
  new TextEncoder().encode(`calc-admin:${password}`)
);
const key = await crypto.subtle.importKey(
  "raw",
  digest,
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["sign"]
);

const expires = Date.now() + 24 * 60 * 60 * 1000;
const payload = `${expires}.${crypto.randomUUID()}`;
const signature = await crypto.subtle.sign(
  "HMAC",
  key,
  new TextEncoder().encode(payload)
);
const hex = Array.from(new Uint8Array(signature))
  .map((b) => b.toString(16).padStart(2, "0"))
  .join("");

console.log(`${payload}.${hex}`);
