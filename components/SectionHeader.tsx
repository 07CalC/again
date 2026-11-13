import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SectionHeader({
  index,
  title,
  note,
  href,
  linkLabel,
}: {
  index: string;
  title: string;
  note?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 sm:gap-x-6">
      <div className="flex min-w-0 items-baseline gap-3 sm:gap-4">
        <span className="section-index">
          <b>{index}</b> / {title.toLowerCase()}
        </span>
        {note && (
          <span className="hidden text-sm text-faint sm:block">{note}</span>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="link-arrow font-mono text-[13px] shrink-0"
        >
          {linkLabel ?? "view all"}
          <ArrowRight size={13} strokeWidth={1.75} />
        </Link>
      )}
    </div>
  );
}
