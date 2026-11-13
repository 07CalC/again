/**
 * Unit tests for lib/shelf.ts mutations against a tiny in-memory D1 stub.
 * Run: bun scripts/test-shelf.ts
 */
import {
  createShelfItem,
  updateShelfItem,
  setShelfItemPublished,
  deleteShelfItem,
  listPublishedShelfItems,
  getPublishedShelfItemBySlug,
  slugify,
  toPublicItem,
  type ShelfItemRow,
} from "../lib/shelf";

// --- in-memory D1 stub -------------------------------------------------------
type Row = Record<string, unknown>;

function makeStub() {
  const tables = new Map<string, Row[]>();
  const get = (name: string) => {
    if (!tables.has(name)) tables.set(name, []);
    return tables.get(name)!;
  };

  class Stmt {
    constructor(
      private sql: string,
      private params: unknown[] = []
    ) {}
    bind(...params: unknown[]) {
      return new Stmt(this.sql, params);
    }
    async first<T>() {
      const rows = runSelect(this.sql, this.params, tables) as T[];
      return rows[0] ?? null;
    }
    async all<T>() {
      return { results: runSelect(this.sql, this.params, tables) as T[] };
    }
    async run() {
      runWrite(this.sql, this.params, tables, get);
      return { success: true };
    }
  }

  return {
    prepare: (sql: string) => new Stmt(sql),
    _tables: tables,
  };
}

function runSelect(sql: string, params: unknown[], tables: Map<string, Row[]>) {
  const match = /from\s+shelf_items/i.exec(sql);
  if (!match) return [];
  let rows = tables.get("shelf_items") ?? [];

  const slugMatch = /where\s+slug\s*=\s*\?/i.exec(sql);
  if (slugMatch) {
    rows = rows.filter((r) => r.slug === params[0]);
    return rows;
  }
  const idMatch = /where\s+id\s*=\s*\?/i.exec(sql);
  if (idMatch) {
    rows = rows.filter((r) => r.id === params[0]);
    return rows;
  }
  const publishedMatch = /where\s+published\s*=\s*\?\s*and\s+slug\s+in/i.exec(sql);
  if (publishedMatch) {
    rows = rows.filter(
      (r) => r.published === 1 && (params as string[]).includes(r.slug as string)
    );
    return rows;
  }
  if (/where\s+published\s*=\s*\?/i.test(sql)) {
    rows = rows.filter((r) => r.published === params[0]);
  }
  return rows;
}

function runWrite(
  sql: string,
  params: unknown[],
  tables: Map<string, Row[]>,
  get: (name: string) => Row[]
) {
  const rows = get("shelf_items");
  if (/insert into/i.test(sql)) {
    const cols = [
      "id", "slug", "title", "category", "status", "creator", "description",
      "thoughts", "rating", "imageUrl", "aspect", "externalUrl", "tags",
      "meta", "addedAt", "completedAt", "published", "createdAt", "updatedAt",
    ];
    const row: Row = {};
    cols.forEach((c, i) => (row[c] = params[i]));
    rows.push(row);
    return;
  }
  if (/update/i.test(sql)) {
    const setSlug = /slug\s*=\s*\?/i.test(sql);
    const setPublished = /published\s*=\s*\?,\s*updatedAt/i.test(sql);
    const idIdx = params.length - 1;
    for (const row of rows) {
      if (row.id !== params[idIdx]) continue;
      if (setPublished) {
        row.published = params[0];
        row.updatedAt = params[1];
      } else {
        // full update — slug,title,category,status,creator,description,thoughts,
        // rating,imageUrl,aspect,externalUrl,tags,meta,addedAt,completedAt,
        // published,updatedAt, [id]
        const cols = [
          "slug", "title", "category", "status", "creator", "description",
          "thoughts", "rating", "imageUrl", "aspect", "externalUrl", "tags",
          "meta", "addedAt", "completedAt", "published", "updatedAt",
        ];
        cols.forEach((c, i) => (row[c] = params[i]));
      }
    }
    return;
  }
  if (/delete/i.test(sql)) {
    const idx = rows.findIndex((r) => r.id === params[0]);
    if (idx >= 0) rows.splice(idx, 1);
  }
}

// --- tests -------------------------------------------------------------------
let failures = 0;
function check(name: string, cond: boolean, extra?: unknown) {
  if (cond) {
    console.log(`✓ ${name}`);
  } else {
    failures++;
    console.error(`✗ ${name}`, extra ?? "");
  }
}

const stub = makeStub() as unknown as Parameters<typeof createShelfItem>[1] & {
  _tables: Map<string, Row[]>;
};

check("slugify", slugify("Designing Data-Intensive Applications!") === "designing-data-intensive-applications");
check("slugify unicode", slugify("Héllo — World") === "hello-world");

const id1 = await createShelfItem(
  {
    title: "Moby Dick",
    category: "books",
    status: "done",
    rating: 9,
    tags: ["classics"],
    published: true,
  },
  stub
);
check("create returns id", id1.length === 36);

const rows1 = [...(stub._tables.get("shelf_items") ?? [])] as ShelfItemRow[];
check("slug auto-generated", rows1[0].slug === "moby-dick", rows1[0].slug);
check("completedAt filled when done", rows1[0].completedAt != null);
check("rating clamped/preserved", rows1[0].rating === 9);

// duplicate title → unique slug
const id2 = await createShelfItem(
  { title: "Moby Dick", category: "books", status: "want", published: true },
  stub
);
check("create returns different id", id2 !== id1);
const rows2 = (stub._tables.get("shelf_items") ?? []) as ShelfItemRow[];
check("slug de-duplicated", rows2.some((r) => r.slug === "moby-dick-2"), rows2.map((r) => r.slug));

// update: change title + status
await updateShelfItem(
  id1,
  { title: "Moby Dick (reread)", category: "books", status: "current", published: false },
  stub
);
const afterUpdate = (stub._tables.get("shelf_items") ?? []) as ShelfItemRow[];
const updated = afterUpdate.find((r) => r.id === id1)!;
check("update changes slug", updated.slug === "moby-dick-reread", updated.slug);
check("update unpublished", updated.published === 0);
check("update clears completedAt for non-done", updated.completedAt === null);

// publish toggle
await setShelfItemPublished(id1, true, stub);
const republished = ((stub._tables.get("shelf_items") ?? []) as ShelfItemRow[]).find(
  (r) => r.id === id1
)!;
check("republished", republished.published === 1);

// public queries via stub
const published = await listPublishedShelfItems(stub);
check("listPublished excludes drafts", published.length === 2, published.length);
const bySlug = await getPublishedShelfItemBySlug("moby-dick", stub);
check("old slug gone after rename", bySlug === null);
const renamed = await getPublishedShelfItemBySlug("moby-dick-reread", stub);
check("renamed item found", renamed?.title === "Moby Dick (reread)");
check("public item strips published flag", renamed !== null && !("published" in renamed));
check("public item parses tags", renamed?.tags.length === 0); // tags weren't set on rename — cleared

// tags/meta round trip
const id3 = await createShelfItem(
  {
    title: "Ghost in the Shell",
    category: "anime",
    status: "done",
    rating: 10,
    tags: ["cyberpunk", "1995"],
    meta: { links: [{ label: "Wiki", url: "https://example.com" }] },
    published: true,
  },
  stub
);
const ghost = await getPublishedShelfItemBySlug("ghost-in-the-shell", stub);
check("tags round trip", ghost?.tags.join(",") === "cyberpunk,1995", ghost?.tags);
check("meta round trip", (ghost?.meta?.links as { label: string }[])?.[0]?.label === "Wiki");

// delete
await deleteShelfItem(id2, stub);
await deleteShelfItem(id3, stub);
await deleteShelfItem(id1, stub);
check("all deleted", (stub._tables.get("shelf_items") ?? []).length === 0);

// malformed tags/meta tolerated
const weird = toPublicItem({
  id: "x", slug: "x", title: "X", category: "other", status: "want",
  creator: null, description: null, thoughts: null, rating: null,
  imageUrl: null, aspect: null, externalUrl: null,
  tags: "{not json", meta: "also bad", addedAt: "2026-01-01",
  completedAt: null, published: 1, createdAt: null, updatedAt: null,
});
check("malformed tags tolerated", weird.tags.length === 0 && weird.meta === null);

if (failures > 0) {
  console.error(`\n${failures} FAILURES`);
  process.exit(1);
}
console.log("\nall shelf tests passed");
