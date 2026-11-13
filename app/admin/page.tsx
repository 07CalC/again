import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import {
  listAllShelfItems,
  CATEGORY_LABELS,
  STATUS_LABELS,
  SHELF_CATEGORIES,
  SHELF_STATUSES,
} from "@/lib/shelf";
import LoginForm from "@/components/admin/LoginForm";
import ItemActions from "@/components/admin/ItemActions";

export const dynamic = "force-dynamic";

type AdminSearchParams = {
  q?: string | string[];
  category?: string | string[];
  status?: string | string[];
  visibility?: string | string[];
};

function firstParam(value: string | string[] | undefined, fallback: string): string {
  return (Array.isArray(value) ? value[0] : value) || fallback;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  if (!(await isAdmin())) {
    return <LoginForm />;
  }

  let items;
  try {
    items = await listAllShelfItems();
  } catch (err) {
    console.error("admin: failed to load items", err);
    return (
      <main className="mx-auto max-w-6xl px-5 py-20">
        <p className="font-mono text-sm text-accent-ink dark:text-accent">
          Could not reach the database. Run the migrations and try again.
        </p>
      </main>
    );
  }

  const params = await searchParams;
  const q = firstParam(params.q, "");
  const category = firstParam(params.category, "all");
  const status = firstParam(params.status, "all");
  const visibility = firstParam(params.visibility, "all");
  const normalizedQuery = q.trim().toLowerCase();
  const filteredItems = items.filter((item) => {
    if (category !== "all" && item.category !== category) return false;
    if (status !== "all" && item.status !== status) return false;
    if (visibility === "published" && item.published !== 1) return false;
    if (visibility === "draft" && item.published === 1) return false;
    if (normalizedQuery) {
      const searchable = [item.title, item.creator, item.slug, item.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!searchable.includes(normalizedQuery)) return false;
    }
    return true;
  });
  const categories = Array.from(
    new Set([...SHELF_CATEGORIES, ...items.map((item) => item.category)])
  ).filter((value) => items.some((item) => item.category === value));
  const published = items.filter((i) => i.published === 1).length;
  const drafts = items.length - published;

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="voice-label">the shelf · control room</p>
          <h1 className="voice-display mt-2 text-4xl text-fg sm:text-5xl">
            Dashboard<span className="text-accent">.</span>
          </h1>
          <p className="mt-3 font-mono text-xs text-faint">
            {items.length} items · {published} live · {drafts} draft
            {drafts === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin/shelf/new"
          className="bg-fg px-5 py-2.5 font-mono text-[13px] text-bg transition-opacity hover:opacity-85"
        >
          + new item
        </Link>
      </header>

      {items.length === 0 ? (
        <div className="mt-16 border-y border-line py-20 text-center">
          <p className="voice-display text-3xl text-fg/80">
            The shelf is empty.
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            Add the first book, show, paper, or game — it only goes public once
            you press publish.
          </p>
          <Link
            href="/admin/shelf/new"
            className="mt-6 inline-block font-mono text-[13px] text-accent-ink underline decoration-accent/40 underline-offset-4 hover:decoration-accent dark:text-accent"
          >
            add something now ↗
          </Link>
        </div>
      ) : (
        <>
          <form method="get" className="mt-8 grid gap-4 border-y border-line py-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-[minmax(0,1fr)_repeat(4,minmax(9rem,auto))] 2xl:items-end">
            <label className="font-mono text-[11px] text-faint">
              Search
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="title, creator, or slug…"
                className="mt-1 block w-full border-b border-line bg-transparent px-0 py-2 text-sm text-fg placeholder:text-faint focus:border-line-strong focus:outline-none"
              />
            </label>
            <label className="font-mono text-[11px] text-faint">
              Category
              <select name="category" defaultValue={category} className="mt-1 block w-full border-b border-line bg-bg py-2 text-sm text-fg focus:border-line-strong focus:outline-none">
                <option value="all">All categories</option>
                {categories.map((value) => (
                  <option key={value} value={value}>{(CATEGORY_LABELS[value] ?? value).toLowerCase()}</option>
                ))}
              </select>
            </label>
            <label className="font-mono text-[11px] text-faint">
              Status
              <select name="status" defaultValue={status} className="mt-1 block w-full border-b border-line bg-bg py-2 text-sm text-fg focus:border-line-strong focus:outline-none">
                <option value="all">All statuses</option>
                {SHELF_STATUSES.map((value) => (
                  <option key={value} value={value}>{STATUS_LABELS[value].toLowerCase()}</option>
                ))}
              </select>
            </label>
            <label className="font-mono text-[11px] text-faint">
              Visibility
              <select name="visibility" defaultValue={visibility} className="mt-1 block w-full border-b border-line bg-bg py-2 text-sm text-fg focus:border-line-strong focus:outline-none">
                <option value="all">Published &amp; drafts</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>
            </label>
            <div className="flex items-center gap-4 sm:col-span-2 lg:col-span-1 2xl:col-span-1">
              <button type="submit" className="font-mono text-[12px] text-fg hover:text-accent">filter</button>
              <Link href="/admin" className="font-mono text-[12px] text-muted hover:text-fg">clear</Link>
            </div>
          </form>
          <p className="mt-4 font-mono text-[11px] text-faint" aria-live="polite">
            Showing {filteredItems.length} of {items.length} items
          </p>
          {filteredItems.length === 0 ? (
            <p className="border-b border-line py-12 text-center font-mono text-sm text-faint">No shelf items match these filters.</p>
          ) : (
        <div className="mt-4 divide-y divide-line border-t border-line">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-1 py-4 sm:grid-cols-[44px_minmax(0,1fr)_auto_auto] sm:gap-x-6"
            >
              {/* thumb */}
              <div className="frame relative h-14 w-10 shrink-0">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-raised" />
                )}
              </div>

              {/* title block */}
              <div className="min-w-0">
                <div className="flex items-baseline gap-2.5">
                  <Link
                    href={`/admin/shelf/${item.id}`}
                    className="min-w-0 truncate text-[15px] font-medium text-fg transition-colors hover:text-accent"
                  >
                    {item.title}
                  </Link>
                  {item.published === 1 ? (
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-accent-ink dark:text-accent">
                      live
                    </span>
                  ) : (
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-faint">
                      draft
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate font-mono text-[11px] text-faint">
                  {(CATEGORY_LABELS[item.category] ?? item.category).toLowerCase()}
                  {item.creator && <> · {item.creator}</>}
                  {" · "}
                  {(STATUS_LABELS[item.status as keyof typeof STATUS_LABELS] ?? item.status).toLowerCase()}
                  {item.rating != null && <> · {item.rating}/10</>}
                  {" · "}
                  {item.slug}
                </p>
              </div>

              {/* A private admin preview also works for drafts. */}
              <Link
                  href={`/admin/shelf/${item.id}/preview`}
                  className="col-span-2 font-mono text-[12px] text-muted transition-colors hover:text-fg sm:col-span-1 sm:block"
                >
                  preview ↗
              </Link>

              <div className="col-span-2 sm:col-span-1">
                <ItemActions id={item.id} published={item.published === 1} />
              </div>
            </div>
          ))}
        </div>
          )}
        </>
      )}
    </main>
  );
}
