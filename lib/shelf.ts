/**
 * The Shelf — data access layer.
 *
 * All SQL lives here. Public pages consume `PublicShelfItem` shapes; the
 * admin dashboard consumes full rows. Drafts are physically filtered out of
 * every public query, so they can never leak into rendered pages.
 */

import { getDB, query, queryOne, execute, type DB } from "@/db";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const SHELF_CATEGORIES = [
  "books",
  "movies",
  "anime",
  "papers",
  "games",
  "other",
] as const;

export type ShelfCategory = (typeof SHELF_CATEGORIES)[number] | (string & {});

export const CATEGORY_LABELS: Record<string, string> = {
  books: "Books",
  anime: "Anime",
  movies: "Movies",
  papers: "Research Papers",
  games: "Games",
  other: "Other",
};

export const SHELF_STATUSES = ["want", "current", "done", "dropped"] as const;

export type ShelfStatus = (typeof SHELF_STATUSES)[number];

export const STATUS_LABELS: Record<ShelfStatus, string> = {
  want: "Want to explore",
  current: "Currently consuming",
  done: "Completed",
  dropped: "Dropped",
};

export const SHELF_ASPECTS = ["portrait", "landscape", "square"] as const;

export type ShelfAspect = (typeof SHELF_ASPECTS)[number];

// ---------------------------------------------------------------------------
// Row types
// ---------------------------------------------------------------------------

/** Shape of a row in the `shelf_items` table. */
export type ShelfItemRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: string;
  creator: string | null;
  description: string | null;
  thoughts: string | null;
  rating: number | null;
  imageUrl: string | null;
  aspect: string | null;
  externalUrl: string | null;
  tags: string | null;
  meta: string | null;
  addedAt: string;
  completedAt: string | null;
  published: number;
  createdAt: string | null;
  updatedAt: string | null;
};

/** Fields safe to expose on public pages / the public API. */
export type PublicShelfItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: string;
  creator: string | null;
  description: string | null;
  thoughts: string | null;
  rating: number | null;
  imageUrl: string | null;
  aspect: string;
  externalUrl: string | null;
  tags: string[];
  meta: Record<string, unknown> | null;
  addedAt: string;
  completedAt: string | null;
};

// ---------------------------------------------------------------------------
// Row mapping
// ---------------------------------------------------------------------------

export function toPublicItem(row: ShelfItemRow): PublicShelfItem {
  let tags: string[] = [];
  try {
    const parsed = row.tags ? JSON.parse(row.tags) : [];
    if (Array.isArray(parsed)) tags = parsed.filter((t) => typeof t === "string");
  } catch {
    // malformed JSON — treat as no tags
  }

  let meta: Record<string, unknown> | null = null;
  if (row.meta) {
    try {
      const parsed = JSON.parse(row.meta);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        meta = parsed as Record<string, unknown>;
      }
    } catch {
      // ignore malformed meta
    }
  }

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    status: row.status,
    creator: row.creator,
    description: row.description,
    thoughts: row.thoughts,
    rating: row.rating,
    imageUrl: row.imageUrl,
    aspect: row.aspect ?? "portrait",
    externalUrl: row.externalUrl,
    tags,
    meta,
    addedAt: row.addedAt,
    completedAt: row.completedAt,
  };
}

// ---------------------------------------------------------------------------
// Queries — public (published only)
// ---------------------------------------------------------------------------

export async function listPublishedShelfItems(
  db?: DB
): Promise<PublicShelfItem[]> {
  const d = db ?? (await getDB());
  const rows = await query<ShelfItemRow>(
    d,
    `SELECT * FROM shelf_items
     WHERE published = 1
     ORDER BY addedAt DESC, createdAt DESC`
  );
  return rows.map(toPublicItem);
}

export async function listPublishedShelfItemsByActivity(
  db?: DB
): Promise<PublicShelfItem[]> {
  const d = db ?? (await getDB());
  const rows = await query<ShelfItemRow>(
    d,
    `SELECT * FROM shelf_items
     WHERE published = 1
     ORDER BY
       CASE WHEN status = 'current' THEN 0 ELSE 1 END ASC,
       COALESCE(updatedAt, createdAt, addedAt) DESC,
       addedAt DESC`
  );
  return rows.map(toPublicItem);
}

export async function getPublishedShelfItemBySlug(
  slug: string,
  db?: DB
): Promise<PublicShelfItem | null> {
  const d = db ?? (await getDB());
  const row = await queryOne<ShelfItemRow>(
    d,
    "SELECT * FROM shelf_items WHERE slug = ? AND published = 1 LIMIT 1",
    slug
  );
  return row ? toPublicItem(row) : null;
}

export async function getPublishedShelfItemsBySlugs(
  slugs: string[],
  db?: DB
): Promise<PublicShelfItem[]> {
  if (slugs.length === 0) return [];
  const d = db ?? (await getDB());
  const placeholders = slugs.map(() => "?").join(",");
  const rows = await query<ShelfItemRow>(
    d,
    `SELECT * FROM shelf_items
     WHERE published = 1 AND slug IN (${placeholders})`,
    ...slugs
  );
  return rows.map(toPublicItem);
}

// ---------------------------------------------------------------------------
// Queries — admin (all items)
// ---------------------------------------------------------------------------

export async function listAllShelfItems(db?: DB): Promise<ShelfItemRow[]> {
  const d = db ?? (await getDB());
  return query<ShelfItemRow>(
    d,
    `SELECT * FROM shelf_items
     ORDER BY addedAt DESC, createdAt DESC`
  );
}

export async function getShelfItemById(
  id: string,
  db?: DB
): Promise<ShelfItemRow | null> {
  const d = db ?? (await getDB());
  return queryOne<ShelfItemRow>(
    d,
    "SELECT * FROM shelf_items WHERE id = ? LIMIT 1",
    id
  );
}

// ---------------------------------------------------------------------------
// Mutations — admin
// ---------------------------------------------------------------------------

export type ShelfItemInput = {
  slug?: string;
  title: string;
  category: string;
  status: string;
  creator?: string | null;
  description?: string | null;
  thoughts?: string | null;
  rating?: number | null;
  imageUrl?: string | null;
  aspect?: string | null;
  externalUrl?: string | null;
  tags?: string[] | null;
  meta?: Record<string, unknown> | null;
  addedAt?: string | null;
  completedAt?: string | null;
  published?: boolean;
};

export function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64) || "item"
  );
}

async function uniqueSlug(db: DB, base: string, excludeId?: string): Promise<string> {
  let candidate = base;
  let n = 2;
  for (;;) {
    const row = await queryOne<{ id: string }>(
      db,
      "SELECT id FROM shelf_items WHERE slug = ? LIMIT 1",
      candidate
    );
    if (!row || (excludeId && row.id === excludeId)) return candidate;
    candidate = `${base}-${n++}`;
  }
}

function normalizeInput(input: ShelfItemInput) {
  return {
    title: input.title.trim(),
    category: input.category.trim().toLowerCase(),
    status: input.status.trim(),
    creator: input.creator?.trim() || null,
    description: input.description?.trim() || null,
    thoughts: input.thoughts?.trim() || null,
    rating:
      typeof input.rating === "number" && Number.isFinite(input.rating)
        ? Math.min(10, Math.max(0, Math.round(input.rating)))
        : null,
    imageUrl: input.imageUrl?.trim() || null,
    aspect: input.aspect || "portrait",
    externalUrl: input.externalUrl?.trim() || null,
    tags: JSON.stringify((input.tags ?? []).map((t) => t.trim()).filter(Boolean)),
    meta: input.meta ? JSON.stringify(input.meta) : null,
    addedAt:
      input.addedAt?.trim() || new Date().toISOString().slice(0, 10),
    completedAt:
      input.status === "done"
        ? input.completedAt?.trim() || new Date().toISOString().slice(0, 10)
        : input.completedAt?.trim() || null,
    published: input.published ? 1 : 0,
  };
}

export async function createShelfItem(
  input: ShelfItemInput,
  db?: DB
): Promise<string> {
  const d = db ?? (await getDB());
  const v = normalizeInput(input);
  const id = crypto.randomUUID();
  const slug = await uniqueSlug(d, input.slug?.trim() || slugify(v.title));

  await execute(
    d,
    `INSERT INTO shelf_items
       (id, slug, title, category, status, creator, description, thoughts,
        rating, imageUrl, aspect, externalUrl, tags, meta,
        addedAt, completedAt, published, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    slug,
    v.title,
    v.category,
    v.status,
    v.creator,
    v.description,
    v.thoughts,
    v.rating,
    v.imageUrl,
    v.aspect,
    v.externalUrl,
    v.tags,
    v.meta,
    v.addedAt,
    v.completedAt,
    v.published,
    new Date().toISOString(),
    new Date().toISOString()
  );
  return id;
}

export async function updateShelfItem(
  id: string,
  input: ShelfItemInput,
  db?: DB
): Promise<void> {
  const d = db ?? (await getDB());
  const existing = await getShelfItemById(id, d);
  if (!existing) throw new Error("Item not found");

  const v = normalizeInput(input);
  const slug = await uniqueSlug(
    d,
    input.slug?.trim() || slugify(v.title),
    id
  );

  await execute(
    d,
    `UPDATE shelf_items SET
       slug = ?, title = ?, category = ?, status = ?, creator = ?,
       description = ?, thoughts = ?, rating = ?, imageUrl = ?, aspect = ?,
       externalUrl = ?, tags = ?, meta = ?, addedAt = ?, completedAt = ?,
       published = ?, updatedAt = ?
     WHERE id = ?`,
    slug,
    v.title,
    v.category,
    v.status,
    v.creator,
    v.description,
    v.thoughts,
    v.rating,
    v.imageUrl,
    v.aspect,
    v.externalUrl,
    v.tags,
    v.meta,
    v.addedAt,
    v.completedAt,
    v.published,
    new Date().toISOString(),
    id
  );
}

export async function setShelfItemPublished(
  id: string,
  published: boolean,
  db?: DB
): Promise<void> {
  const d = db ?? (await getDB());
  await execute(
    d,
    "UPDATE shelf_items SET published = ?, updatedAt = ? WHERE id = ?",
    published ? 1 : 0,
    new Date().toISOString(),
    id
  );
}

export async function deleteShelfItem(id: string, db?: DB): Promise<void> {
  const d = db ?? (await getDB());
  await execute(d, "DELETE FROM shelf_items WHERE id = ?", id);
}
