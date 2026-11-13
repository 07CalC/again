import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { STATUS_META, type Project } from "@/lib/projects";

export default function ProjectRow({
  project,
  withDescription = false,
}: {
  project: Project;
  withDescription?: boolean;
}) {
  const meta = STATUS_META[project.status];

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-x-3 py-6 sm:gap-x-8 sm:py-7"
    >
      {/* meta column */}
      <div className="flex flex-col gap-1 pt-1">
        <span className="voice-meta">{project.year}</span>
        <span
          className="font-mono text-[11px] tracking-wide"
          title={meta.hint}
          style={{ color: "var(--faint)" }}
        >
          {meta.label}
        </span>
      </div>

      {/* title column */}
      <div className="min-w-0">
        <h3 className="voice-display text-2xl text-fg transition-colors group-hover:text-accent sm:text-[1.75rem]">
          {project.title}
        </h3>
        <p className="mt-1 text-[15px] text-muted">{project.tagline}</p>
        {withDescription && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            {project.description}
          </p>
        )}
        <p className="mt-2.5 font-mono text-[11px] tracking-wide text-faint">
          {project.stack.join(" · ")}
        </p>
      </div>

      {/* arrow column */}
      <div className="pt-1 text-faint transition-colors group-hover:text-accent">
        <ArrowUpRight
          size={17}
          strokeWidth={1.75}
          className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>
    </Link>
  );
}
