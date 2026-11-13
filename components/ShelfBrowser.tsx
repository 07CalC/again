"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import {
  SHELF_CATEGORIES,
  CATEGORY_LABELS,
  SHELF_STATUSES,
  STATUS_LABELS,
  type PublicShelfItem,
} from "@/lib/shelf";

type Sort = "recent" | "completed" | "rated" | "title";

const sortLabels: Record<Sort, string> = {
  recent: "recently added",
  completed: "recently completed",
  rated: "highest rated",
  title: "a–z",
};

function aspectOf(item: PublicShelfItem): string {
  if (item.aspect === "landscape") return "3 / 2";
  if (item.aspect === "square") return "1 / 1";
  return "2 / 3";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function StatusDot({ status }: { status: string }) {
  return (
    <span
      aria-hidden
      className={`status-${status} mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-(--dot)`}
    />
  );
}

/** A cover tile — image when available, otherwise a quiet spine. */
function ShelfTile({ item }: { item: PublicShelfItem }) {
  return (
    <Link
      href={`/shelf/${item.slug}`}
      className="group block"
      aria-label={`${item.title} — ${CATEGORY_LABELS[item.category] ?? item.category}${
        item.creator ? ` by ${item.creator}` : ""
      }`}
    >
      {item.imageUrl ? (
        <div
          className={`frame relative w-full ${item.status === "dropped" ? "grayscale opacity-90" : ""}`}
          style={{ aspectRatio: aspectOf(item) }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      ) : (
        <div
          className="frame relative flex w-full flex-col items-center justify-center gap-2 bg-raised px-3 text-center"
          style={{ aspectRatio: aspectOf(item) }}
        >
          <span
            aria-hidden
            className="absolute inset-x-6 top-0 border-t-2 border-line-strong"
          />
          <span className="voice-display text-lg leading-snug text-fg/90 transition-colors group-hover:text-accent">
            {item.title}
          </span>
          {item.creator && (
            <span className="font-mono text-[10px] tracking-wide text-faint">
              {item.creator}
            </span>
          )}
        </div>
      )}

      <div className="mt-2.5 flex items-baseline gap-2">
        <StatusDot status={item.status} />
        <span className="min-w-0 flex-1 truncate text-[13px] text-fg/90 transition-colors group-hover:text-accent">
          {item.title}
        </span>
        {item.rating != null && (
          <span className="font-mono text-[11px] text-faint">{item.rating}/10</span>
        )}
      </div>
      <p className="mt-0.5 font-mono text-[10px] tracking-wide text-faint">
        {(CATEGORY_LABELS[item.category] ?? item.category).toLowerCase()}
        {item.completedAt && item.status === "done" && <> · {formatDate(item.completedAt)}</>}
      </p>
    </Link>
  );
}

export default function ShelfBrowser({ items }: { items: PublicShelfItem[] }) {
  const [category, setCategory] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [sort, setSort] = useState<Sort>("recent");
  const [q, setQ] = useState("");

  // Which categories actually exist on this shelf (keeps the bar honest).
  const presentCategories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return SHELF_CATEGORIES.filter((c) => set.has(c));
  }, [items]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = items.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (status !== "all" && item.status !== status) return false;
      if (query) {
        const hay = [item.title, item.creator, item.description, item.thoughts, ...item.tags]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });

    if (sort === "rated") {
      list = [...list].sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
    } else if (sort === "completed") {
      list = [...list].sort((a, b) => {
        if (!a.completedAt) return b.completedAt ? 1 : 0;
        if (!b.completedAt) return -1;
        return b.completedAt.localeCompare(a.completedAt);
      });
    } else if (sort === "title") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [items, category, status, sort, q]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) {
      map.set(item.category, (map.get(item.category) ?? 0) + 1);
    }
    return map;
  }, [items]);

  return (
    <div>
      {/* ------------------------------------------------ filter bar */}
      <div className="border-y border-line py-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {/* categories */}
          <nav aria-label="Filter by category" className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-4">
            <button
              onClick={() => setCategory("all")}
              aria-pressed={category === "all"}
              className={`py-1.5 font-mono text-[12.5px] tracking-wide transition-colors ${
                category === "all" ? "text-fg" : "text-faint hover:text-muted"
              }`}
            >
              all
            </button>
            {presentCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                aria-pressed={category === cat}
                className={`py-1.5 font-mono text-[12.5px] tracking-wide transition-colors ${
                  category === cat ? "text-fg" : "text-faint hover:text-muted"
                }`}
              >
                {(CATEGORY_LABELS[cat] ?? cat).toLowerCase()}
                <span className="ml-1.5 text-[10px] text-faint">
                  {counts.get(cat)}
                </span>
              </button>
            ))}
          </nav>

          <span aria-hidden className="hidden h-4 w-px bg-line md:block" />

          {/* status */}
          <nav aria-label="Filter by status" className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {(["all", ...SHELF_STATUSES] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatus(st)}
                aria-pressed={status === st}
                className={`py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                  status === st ? "text-fg" : "text-faint hover:text-muted"
                }`}
              >
                {st === "all" ? "any state" : STATUS_LABELS[st].toLowerCase()}
              </button>
            ))}
          </nav>

          {/* sort */}
          <nav aria-label="Sort" className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {(Object.keys(sortLabels) as Sort[]).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                aria-pressed={sort === s}
                className={`py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                  sort === s ? "text-fg" : "text-faint hover:text-muted"
                }`}
              >
                {sortLabels[s]}
              </button>
            ))}
          </nav>

          {/* search */}
          <div className="relative min-w-0 basis-full flex-1 sm:ml-auto sm:basis-auto sm:min-w-[180px] sm:max-w-[240px]">
            <Search
              size={13}
              strokeWidth={1.75}
              className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-faint"
            />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="search the shelf…"
              aria-label="Search shelf items"
              className="w-full border-b border-line bg-transparent py-1.5 pl-5 pr-2 font-mono text-[12.5px] text-fg placeholder:text-faint focus:border-line-strong focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ wall */}
      {filtered.length > 0 ? (
        <div className="shelf-wall mt-10" role="list">
          {filtered.map((item) => (
            <div key={item.id} role="listitem">
              <ShelfTile item={item} />
            </div>
          ))}
        </div>
      ) : (
        <p className="py-24 text-center font-mono text-sm text-faint">
          {items.length === 0
            ? "the shelf is being restocked — check back soon."
            : "nothing matches that on the shelf."}
        </p>
      )}

      <p className="mt-14 font-mono text-[11px] text-faint">
        {filtered.length} of {items.length} items ·{" "}
        {STATUS_LABELS.current.toLowerCase()} items have a rust dot
      </p>
    </div>
  );
}
