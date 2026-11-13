import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Reads a secret/variable by name, preferring the Cloudflare context
 * (where `.dev.vars` locally and `wrangler secret put` values in production
 * live) and falling back to `process.env` for non-Worker contexts.
 *
 * Returns undefined when the secret is not configured anywhere — callers
 * must treat that as "feature off", never crash.
 */
export async function getSecret(name: string): Promise<string | undefined> {
  try {
    const env = (await getCloudflareContext({ async: true })).env;
    const value = Reflect.get(env, name) as unknown;
    if (typeof value === "string" && value.length > 0) return value;
  } catch {
    // No Cloudflare context available (e.g. build step) — try process.env.
  }

  const fromProcess = process.env[name];
  return fromProcess && fromProcess.length > 0 ? fromProcess : undefined;
}
