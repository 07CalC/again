import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  CATEGORY_LABELS,
  STATUS_LABELS,
  type PublicShelfItem,
} from "@/lib/shelf";

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5">
      <dt className="voice-label">{label}</dt>
      <dd className="voice-meta text-fg">{value}</dd>
    </div>
  );
}

export default function ShelfItemView({
  item,
  nearby = [],
  backHref = "/shelf",
  backLabel = "back to the shelf",
}: {
  item: PublicShelfItem;
  nearby?: PublicShelfItem[];
  backHref?: string;
  backLabel?: string;
}) {
  const categoryLabel = CATEGORY_LABELS[item.category] ?? item.category;
  const statusLabel = STATUS_LABELS[item.status as keyof typeof STATUS_LABELS] ?? item.status;
  const extraLinks: { label: string; url: string }[] = Array.isArray(item.meta?.links)
    ? (item.meta.links as { label?: string; url?: string }[])
        .filter((link): link is { label: string; url: string } => Boolean(link?.url))
        .map((link) => ({ label: link.label || "Link", url: link.url }))
    : [];

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      <nav className="pb-10 pt-10 sm:pt-14">
        <Link href={backHref} className="link-arrow font-mono text-[13px]">
          <ArrowLeft size={13} strokeWidth={1.75} />
          {backLabel}
        </Link>
      </nav>

      <div className="grid gap-8 border-t border-line pt-8 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)] md:gap-10 md:pt-10 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-20">
        <div>
          {item.imageUrl ? (
            <div className="frame relative w-full" style={{ aspectRatio: item.aspect === "landscape" ? "3 / 2" : item.aspect === "square" ? "1 / 1" : "2 / 3" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.imageUrl} alt={item.title} loading="eager" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          ) : (
            <div className="frame flex aspect-[2/3] w-full flex-col items-center justify-center bg-raised px-6 text-center">
              <span className="voice-display text-3xl leading-snug text-fg/90">{item.title}</span>
              {item.creator && <span className="mt-3 font-mono text-xs tracking-wide text-faint">{item.creator}</span>}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
            <span>{categoryLabel}</span><span aria-hidden>/</span>
            <span className={`status-${item.status} inline-flex items-center gap-1.5`}>
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-(--dot)" />{statusLabel}
            </span>
          </p>
          <h1 className="voice-display mt-4 text-4xl leading-tight text-fg sm:text-5xl">{item.title}</h1>
          {item.creator && <p className="voice-display mt-2 text-xl italic text-fg/75">{item.creator}</p>}
          {item.rating != null && <p className="mt-6 flex items-baseline gap-2"><span className="voice-display text-5xl text-fg">{item.rating}</span><span className="voice-label">/ 10</span></p>}
          {item.description && <p className="mt-6 max-w-2xl text-[15.5px] leading-relaxed text-muted">{item.description}</p>}
          {item.thoughts && (
            <section className="mt-8 max-w-2xl border-l-2 border-accent pl-5">
              <p className="voice-label">My notes</p>
              <p className="mt-3 whitespace-pre-line text-[15.5px] italic leading-relaxed text-fg/85">{item.thoughts}</p>
            </section>
          )}
          <dl className="mt-10 max-w-md border-t border-line">
            <MetaRow label="Added" value={item.addedAt} />
            {item.completedAt && <MetaRow label="Completed" value={item.completedAt} />}
            {item.tags.length > 0 && (
              <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5">
                <dt className="voice-label shrink-0">Tags</dt><dd className="min-w-0 text-right font-mono text-[11px] tracking-wide text-fg">{item.tags.join(" · ").toLowerCase()}</dd>
              </div>
            )}
          </dl>
          {(item.externalUrl || extraLinks.length > 0) && (
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {item.externalUrl && <a href={item.externalUrl} target="_blank" rel="noopener noreferrer" className="link-arrow font-mono text-[13px]">wherever it lives <span aria-hidden>↗</span></a>}
              {extraLinks.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="link-arrow font-mono text-[13px]">{link.label.toLowerCase()} <span aria-hidden>↗</span></a>)}
            </div>
          )}
        </div>
      </div>

      {nearby.length > 0 && (
        <section className="mt-20 border-t border-line pt-10" aria-label="More from the shelf">
          <p className="voice-label">Nearby on the shelf</p>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {nearby.map((entry) => (
              <Link key={entry.id} href={`/shelf/${entry.slug}`} className="group block" title={entry.title}>
                <div className={`frame relative w-full ${entry.status === "dropped" ? "grayscale opacity-90" : ""}`} style={{ aspectRatio: entry.aspect === "landscape" ? "3 / 2" : entry.aspect === "square" ? "1 / 1" : "2 / 3" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={entry.imageUrl!} alt={entry.title} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <p className="mt-2 truncate text-[13px] text-muted transition-colors group-hover:text-accent">{entry.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
