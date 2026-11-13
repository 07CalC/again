import Link from "next/link";
import ShelfCard from "@/components/ShelfCard";
import {
  CATEGORY_LABELS,
  SHELF_CATEGORIES,
  type PublicShelfItem,
} from "@/lib/shelf";

const PREVIEW_COUNT = 5;

export default function ShelfCollections({
  items,
}: {
  items: PublicShelfItem[];
}) {
  const collections = SHELF_CATEGORIES.map((category) => ({
    category,
    label: CATEGORY_LABELS[category] ?? category,
    items: items.filter((item) => item.category === category),
  })).filter((collection) => collection.items.length > 0);

  if (collections.length === 0) {
    return (
      <p className="border-y border-line py-20 text-center font-mono text-sm text-faint">
        the shelf is being restocked — check back soon.
      </p>
    );
  }

  return (
    <div className="space-y-14 border-t border-line pt-10">
      {collections.map(({ category, label, items: collectionItems }) => (
        <section key={category} aria-labelledby={`shelf-${category}`}>
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="voice-label">{collectionItems.length} items</p>
              <h2
                id={`shelf-${category}`}
                className="voice-display mt-2 text-3xl text-fg"
              >
                {label}<span className="text-accent">.</span>
              </h2>
            </div>
            <Link
              href={`/shelf/${category}`}
              className="link-arrow shrink-0 font-mono text-[12px]"
            >
              show more <span aria-hidden>→</span>
            </Link>
          </div>

          <div
            role="list"
            aria-label={`${label} shelf items`}
            className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3"
          >
            {collectionItems.slice(0, PREVIEW_COUNT).map((item) => (
              <div
                key={item.id}
                role="listitem"
                className="w-[42vw] min-w-[145px] max-w-[190px] shrink-0 snap-start sm:w-[180px]"
              >
                <ShelfCard item={item} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
