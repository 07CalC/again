import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ProjectRow from "@/components/ProjectRow";
import { projects, smallerThings, STATUS_META } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A curated collection of things I've built: storage engines, self-hosted platforms, developer tools, and the occasional abandoned experiment.",
};

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      <header className="pb-12 pt-14 sm:pb-16 sm:pt-20">
        <p className="voice-label">/projects</p>
        <h1 className="voice-display mt-4 text-5xl text-fg sm:text-6xl">
          Things I&apos;ve built<span className="text-accent">.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          A curated shelf of software — the substantial and the small. Every
          entry links to the real repository; the interesting ones get a page
          of their own with the engineering decisions.
        </p>
        <p className="mt-4 font-mono text-xs text-faint">
          {projects.length} projects ·{" "}
          {Object.values(STATUS_META)
            .map((s) => s.label)
            .join(" / ")}
        </p>
      </header>

      <div className="divide-y divide-line border-t border-line">
        {projects.map((project) => (
          <ProjectRow key={project.slug} project={project} withDescription />
        ))}
      </div>

      {/* quieter row for the small utilities */}
      <section className="mt-16" aria-labelledby="smaller-heading">
        <h2 id="smaller-heading" className="voice-label">
          Smaller things
        </h2>
        <ul className="mt-5 grid gap-x-10 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {smallerThings.map((thing) => (
            <li key={thing.name}>
              <a
                href={thing.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-baseline justify-between gap-3 border-b border-line py-2.5 text-sm"
              >
                <span className="min-w-0">
                  <span className="text-fg transition-colors group-hover:text-accent">
                    {thing.name}
                  </span>
                  <span className="ml-2 text-muted sm:ml-3">{thing.note}</span>
                </span>
                <ArrowUpRight
                  size={13}
                  strokeWidth={1.75}
                  className="shrink-0 text-faint transition-colors group-hover:text-accent"
                />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-faint">
          The rest of the graveyard lives on{" "}
          <a
            href="https://github.com/07calc?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="link-quiet"
          >
            GitHub
          </a>
          .
        </p>
      </section>

      <p className="mt-16 text-sm text-muted">
        Curious how any of this was built? The{" "}
        <Link href="/writing" className="link-quiet text-fg">
          writing
        </Link>{" "}
        section covers the deep dives.
      </p>
    </main>
  );
}
