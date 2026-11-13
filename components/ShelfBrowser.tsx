"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ShelfCard from "@/components/ShelfCard";
import {
  SHELF_STATUSES,
  STATUS_LABELS,
  type PublicShelfItem,
} from "@/lib/shelf";

export default function ShelfBrowser({ items }: { items: PublicShelfItem[] }) {
  const [status, setStatus] = useState<string>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items.filter((item) => {
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
  }, [items, status, q]);

  return (
    <div>
      {/* ------------------------------------------------ filter bar */}
      <div className="border-y border-line py-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
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
              <ShelfCard item={item} />
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
