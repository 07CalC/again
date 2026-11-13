import type { Metadata } from "next";
import { Suspense } from "react";
import ShelfBrowser from "@/components/ShelfBrowser";
import { listPublishedShelfItems } from "@/lib/shelf";

export const metadata: Metadata = {
  title: "The Shelf",
  description:
    "What I read, watch, play, and skim — books, anime, movies, research papers, games. Rated honestly, with notes when something moved me.",
};

export const dynamic = "force-dynamic";

function ShelfSkeleton() {
  return (
    <div aria-hidden>
      <div className="border-y border-line py-4">
        <div className="flex gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-3 w-16 bg-line" />
          ))}
        </div>
      </div>
      <div className="shelf-wall mt-10">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="frame relative w-full" style={{ aspectRatio: "2 / 3" }}>
            <div className="absolute inset-0 bg-line/60" />
          </div>
        ))}
      </div>
    </div>
  );
}

async function ShelfWall() {
  let items;
  try {
    items = await listPublishedShelfItems();
  } catch (err) {
    // DB unreachable — fail soft, the page itself must still render.
    console.error("shelf: failed to load items", err);
    return (
      <p className="border-y border-line py-20 text-center font-mono text-sm text-faint">
        the shelf is unreachable right now — try again in a moment.
      </p>
    );
  }

  return <ShelfBrowser items={items} />;
}

export default function ShelfPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      <header className="pb-10 pt-14 sm:pt-20">
        <p className="voice-label">/shelf</p>
        <h1 className="voice-display mt-4 text-5xl text-fg sm:text-6xl">
          The Shelf<span className="text-accent">.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          Everything I read, watch, play, and skim — kept like a real
          bookshelf: stacked, occasionally reorganized, rated honestly. Notes
          only when something actually earned them.
        </p>
      </header>

      <Suspense fallback={<ShelfSkeleton />}>
        <ShelfWall />
      </Suspense>
    </main>
  );
}
