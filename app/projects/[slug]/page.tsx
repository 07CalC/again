import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { getProjectBySlug, projects, STATUS_META } from "@/lib/projects";
import { getPostBySlug } from "@/lib/posts";

export function generateStaticParams() {
  return projects
    .filter((p) => p.detail)
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || !project.detail) notFound();

  const meta = STATUS_META[project.status];
  const related = project.detail.relatedPost
    ? getPostBySlug(project.detail.relatedPost.slug)
    : null;

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      <nav className="pb-10 pt-10 sm:pt-14">
        <Link href="/projects" className="link-arrow font-mono text-[13px]">
          <ArrowLeft size={13} strokeWidth={1.75} />
          all projects
        </Link>
      </nav>

      <header className="grid gap-10 border-t border-line pt-10 lg:grid-cols-[1fr_260px] lg:gap-20">
        <div>
          <p className="voice-meta">{project.year}</p>
          <h1 className="voice-display mt-3 text-5xl text-fg sm:text-6xl">
            {project.title}
            <span className="text-accent">.</span>
          </h1>
          <p className="voice-display mt-3 text-2xl italic text-fg/75">
            {project.tagline}
          </p>
          {project.image && (
            <div className="frame mt-10 max-w-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt={`${project.title} interface`}
                width={1200}
                height={630}
                loading="eager"
                decoding="async"
                className="w-full object-cover"
              />
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-8 border-t border-line pt-8 lg:border-t-0 lg:pt-1">
          <div>
            <p className="voice-label">Status</p>
            <p className="mt-2 font-mono text-sm text-fg" title={meta.hint}>
              {meta.label}
            </p>
          </div>
          <div>
            <p className="voice-label">Stack</p>
            <p className="mt-2 font-mono text-[13px] leading-relaxed text-muted">
              {project.stack.join(" · ")}
            </p>
          </div>
          <div>
            <p className="voice-label">Links</p>
            <div className="mt-2 flex flex-col gap-1.5">
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-quiet w-fit text-sm text-muted hover:text-fg"
                >
                  Live ↗
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-quiet w-fit text-sm text-muted hover:text-fg"
                >
                  Source ↗
                </a>
              )}
            </div>
          </div>
        </aside>
      </header>

      <article className="mt-14 max-w-2xl">
        <p className="text-lg leading-relaxed text-fg/90">
          {project.detail.intro}
        </p>

        {project.detail.sections.map((section) => (
          <section key={section.heading} className="mt-12 border-t border-line pt-8">
            <h2 className="voice-display text-3xl text-fg">{section.heading}</h2>
            <div className="mt-5 space-y-4">
              {section.body.map((paragraph, i) => (
                <p key={i} className="text-[15.5px] leading-relaxed text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
            {section.list && (
              <ul className="mt-5 space-y-2">
                {section.list.map((item) => (
                  <li key={item} className="flex items-baseline gap-3 text-[15.5px] text-muted">
                    <span aria-hidden className="text-accent">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {related && (
          <section className="mt-12 border-t border-line pt-8">
            <p className="voice-label">Written about this</p>
            <Link
              href={`/writing/${related.meta.slug}`}
              className="group mt-4 flex items-baseline justify-between gap-4"
            >
              <span className="voice-display text-2xl text-fg transition-colors group-hover:text-accent">
                {related.meta.title}
              </span>
              <ArrowRight
                size={16}
                strokeWidth={1.75}
                className="shrink-0 text-faint transition-all group-hover:translate-x-1 group-hover:text-accent"
              />
            </Link>
            <p className="mt-2 text-sm text-muted">{related.meta.description}</p>
          </section>
        )}
      </article>

      <footer className="mt-16 flex items-center justify-between border-t border-line pt-6">
        <Link href="/projects" className="link-arrow font-mono text-[13px]">
          <ArrowLeft size={13} strokeWidth={1.75} />
          all projects
        </Link>
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="link-arrow font-mono text-[13px]"
          >
            view source
            <ArrowUpRight size={13} strokeWidth={1.75} />
          </a>
        )}
      </footer>
    </main>
  );
}
