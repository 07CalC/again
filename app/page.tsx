import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import ProjectRow from "@/components/ProjectRow";
import RecentWriting from "@/components/RecentWriting";
import Listening, { ListeningSkeleton } from "@/components/Listening";
import Monkeytype from "@/components/Monkeytype";
import Heatmap from "@/components/Heatmap";
import ShelfTeaser, { ShelfTeaserSkeleton } from "@/components/ShelfTeaser";
import { featuredProjects } from "@/lib/projects";
import { getAllPostsDetailed } from "@/lib/posts";
import { nowData } from "@/lib/now";

export default function Home() {
  const selected = featuredProjects().slice(0, 4);
  const latestPost = getAllPostsDetailed()[0];

  return (
    <main className="mx-auto max-w-6xl px-5 sm:px-8">
      {/* ---------------------------------------------------------- hero */}
      <section className="grid gap-12 pb-20 pt-16 sm:pb-24 sm:pt-24 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
        <div>
          <p className="voice-label">India · 21 · M · Tired</p>
          <h1 className="voice-display mt-5 text-[clamp(3.25rem,8.5vw,5.5rem)] text-fg sm:text-7xl md:text-[5.5rem]">
            Vinayak
            <br />
            Maheshwari<span className="text-accent">.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
            I build things and take them apart to see how they work — storage
            engines, self-hosted platforms, developer tools. Comfortable at the
            systems layer, curious everywhere else.
          </p>
          <p className="voice-display mt-5 max-w-xl text-2xl italic text-fg/80">
            Who am I without my silliness? A CalC.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href="https://github.com/07calc"
              target="_blank"
              rel="noopener noreferrer"
              className="link-arrow font-mono text-[13px]"
            >
              github/07calc
              <ArrowRight size={13} strokeWidth={1.75} />
            </a>
            <a
              href="mailto:hello@vinm.me"
              className="link-arrow font-mono text-[13px]"
            >
              hello@vinm.me
              <ArrowRight size={13} strokeWidth={1.75} />
            </a>
            <a
              href="https://linkedin.com/in/maheshwarivinayak"
              target="_blank"
              rel="noopener noreferrer"
              className="link-arrow font-mono text-[13px]"
            >
              linkedin
              <ArrowRight size={13} strokeWidth={1.75} />
            </a>
            <Link href="/now" className="link-arrow font-mono text-[13px]">
              what i&apos;m doing now
              <ArrowRight size={13} strokeWidth={1.75} />
            </Link>
          </div>
        </div>

        <aside className="flex flex-col gap-8 border-t border-line pt-7 lg:mt-12 lg:justify-center lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div>
            <p className="voice-label">On the record player</p>
            <div className="mt-3">
              <Suspense fallback={<ListeningSkeleton />}>
                <Listening />
              </Suspense>
            </div>
          </div>
          {latestPost && (
            <div>
              <p className="voice-label">Latest writing</p>
              <Link
                href={`/writing/${latestPost.slug}`}
                className="link-quiet mt-3 block text-sm leading-relaxed text-fg hover:text-accent"
              >
                {latestPost.title}
              </Link>
              <p className="mt-2 font-mono text-[11px] text-faint">
                {latestPost.readingTime} min read
              </p>
            </div>
          )}
          <Suspense fallback={null}>
            <Monkeytype />
          </Suspense>
        </aside>
      </section>

      <hr className="rule" />

      {/* ---------------------------------------------------------- now */}
      <section className="py-14 sm:py-16" aria-labelledby="now-heading">
        <div id="now-heading">
          <SectionHeader index="01" title="Currently" note="a live-ish snapshot" href="/now" linkLabel="full /now" />
          <ul className="mt-8 space-y-3.5">
            {nowData.entries.slice(0, 2).flatMap((entry) =>
              entry.items.slice(0, 2).map((item) => (
                <li key={item} className="flex items-baseline gap-4">
                  <span className="voice-label w-20 shrink-0">{entry.label}</span>
                  <span className="text-sm leading-relaxed text-muted">{item}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      <div className="pb-14 sm:pb-16">
        <Suspense fallback={null}>
          <Heatmap className="mt-0" />
        </Suspense>
      </div>

      <hr className="rule" />

      {/* ------------------------------------------------------ projects */}
      <section className="py-14 sm:py-16" aria-labelledby="projects-heading">
        <div id="projects-heading">
          <SectionHeader
            index="02"
            title="Selected work"
            note="things i build and maintain"
            href="/projects"
            linkLabel="all projects"
          />
        </div>
        <div className="mt-6 divide-y divide-line">
          {selected.map((project) => (
            <ProjectRow key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <hr className="rule" />

      {/* ------------------------------------------------------- writing */}
      <section className="py-14 sm:py-16" aria-labelledby="writing-heading">
        <div id="writing-heading">
          <SectionHeader
            index="03"
            title="Writing"
            note="learnings, logged"
            href="/writing"
            linkLabel="all writing"
          />
        </div>
        <div className="mt-6 divide-y divide-line">
          <RecentWriting limit={3} />
        </div>
      </section>

      <hr className="rule" />

      {/* --------------------------------------------------------- shelf */}
      <section className="py-14 sm:pb-20 sm:py-16" aria-labelledby="shelf-heading">
        <div id="shelf-heading">
          <SectionHeader
            index="04"
            title="The shelf"
            note="what i read, watch & play"
            href="/shelf"
            linkLabel="browse the shelf"
          />
        </div>
        <div className="mt-8">
          <Suspense fallback={<ShelfTeaserSkeleton />}>
            <ShelfTeaser />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
