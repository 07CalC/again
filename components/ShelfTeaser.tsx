import Link from "next/link";
import { listPublishedShelfItems } from "@/lib/shelf";

/**
 * Small row of the newest shelf covers, streamed via Suspense. Renders
 * nothing when the database is unavailable or empty — the home page never
 * depends on it.
 */
export default async function ShelfTeaser() {
  let items;
  try {
    const all = await listPublishedShelfItems();
    items = all.filter((i) => i.imageUrl).slice(0, 6);
  } catch {
    return null;
  }
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/shelf/${item.slug}`}
          className="group block"
          title={`${item.title}${item.creator ? ` — ${item.creator}` : ""}`}
        >
          <div
            className="frame relative w-full"
            style={{ aspectRatio: item.aspect === "landscape" ? "3 / 2" : "2 / 3" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl!}
              alt={item.title}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </Link>
      ))}
    </div>
  );
}

export function ShelfTeaserSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-6" aria-hidden>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="frame relative w-full" style={{ aspectRatio: "2 / 3" }}>
          <div className="absolute inset-0 bg-line/60" />
        </div>
      ))}
    </div>
  );
}
