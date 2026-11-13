import Link from "next/link";
import { CATEGORY_LABELS, type PublicShelfItem } from "@/lib/shelf";

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
export default function ShelfCard({ item }: { item: PublicShelfItem }) {
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
