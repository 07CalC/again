import type { Metadata } from "next";
import Link from "next/link";
import ShelfBrowser from "@/components/ShelfBrowser";
import {
  CATEGORY_LABELS,
  listPublishedShelfItemsByActivity,
  type ShelfCategory,
} from "@/lib/shelf";

export default async function ShelfCategoryPage({
  category,
}: {
  category: ShelfCategory;
}) {
  const label = CATEGORY_LABELS[category] ?? category;
  let items;

  try {
    items = (await listPublishedShelfItemsByActivity()).filter(
      (item) => item.category === category
    );
  } catch (error) {
    console.error(`shelf ${category}: failed to load items`, error);
    return (
      <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <p className="py-24 text-center font-mono text-sm text-faint">
          this part of the shelf is unreachable right now — try again in a moment.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      <header className="pb-10 pt-14 sm:pt-20">
        <Link href="/shelf" className="link-quiet font-mono text-xs text-faint">
          ← the shelf
        </Link>
        <p className="voice-label mt-8">/shelf/{category}</p>
        <h1 className="voice-display mt-4 text-5xl text-fg sm:text-6xl">
          {label}<span className="text-accent">.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          {items.length} {items.length === 1 ? "item" : "items"} · currently
          consuming first, then most recently edited.
        </p>
      </header>

      <ShelfBrowser items={items} />
    </main>
  );
}

export function shelfCategoryMetadata(category: ShelfCategory): Metadata {
  const label = CATEGORY_LABELS[category] ?? category;
  return {
    title: `${label} · The Shelf`,
    description: `Bookshelf entries for ${label.toLowerCase()} — what I'm consuming, collecting, and thinking about.`,
  };
}
