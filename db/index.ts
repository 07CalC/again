/**
 * Raw D1 (SQLite) access — no ORM.
 *
 * The binding comes from wrangler.jsonc (`d1_databases[].binding = "DB"`).
 * Locally, `@opennextjs/cloudflare` provisions the binding through miniflare
 * when `initOpenNextCloudflareForDev()` runs; in production it is the real D1.
 *
 * Usage:
 *   const db = await getDB();
 *   const { results } = await db
 *     .prepare("SELECT * FROM shelf_items WHERE published = ?")
 *     .bind(true)
 *     .all<ShelfRow>();
 */

import { getCloudflareContext } from "@opennextjs/cloudflare";

export type DB = D1Database;

export async function getDB(): Promise<DB> {
  const env = (await getCloudflareContext({ async: true })).env;
  return env.DB;
}

/** Run a SELECT and return all rows. */
export async function query<T>(
  db: DB,
  sql: string,
  ...params: unknown[]
): Promise<T[]> {
  const { results } = await db
    .prepare(sql)
    .bind(...params)
    .all<T>();
  return results ?? [];
}

/** Run a SELECT and return the first row, or null. */
export async function queryOne<T>(
  db: DB,
  sql: string,
  ...params: unknown[]
): Promise<T | null> {
  const row = await db
    .prepare(sql)
    .bind(...params)
    .first<T>();
  return row ?? null;
}

/** Run an INSERT/UPDATE/DELETE. */
export async function execute(
  db: DB,
  sql: string,
  ...params: unknown[]
): Promise<void> {
  await db
    .prepare(sql)
    .bind(...params)
    .run();
}
