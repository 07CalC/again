import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import SectionHeader from "@/components/SectionHeader";
import Listening, { ListeningSkeleton } from "@/components/Listening";
import Monkeytype from "@/components/Monkeytype";
import Heatmap from "@/components/Heatmap";
import { nowData } from "@/lib/now";

export const metadata: Metadata = {
  title: "Now",
  description:
    "What I'm currently building, learning, reading, and exploring — a rolling snapshot of where my attention is.",
};

export default function NowPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      <header className="pb-12 pt-14 sm:pt-20">
        <p className="voice-label">/now</p>
        <h1 className="voice-display mt-4 text-5xl text-fg sm:text-6xl">
          What has my attention<span className="text-accent">.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          {nowData.intro}
        </p>
        <p className="mt-4 font-mono text-xs text-faint">
          {nowData.location} · last updated{" "}
          {new Date(nowData.updatedAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </header>

      <div className="grid gap-14 border-t border-line pt-10 lg:grid-cols-[1fr_290px] lg:gap-20">
        {/* main entries */}
        <div className="divide-y divide-line">
          {nowData.entries.map((entry) => (
            <section key={entry.label} className="py-8 first:pt-0">
              <h2 className="voice-display text-3xl text-fg">
                {entry.label}
                <span className="text-accent">.</span>
              </h2>
              <ul className="mt-5 space-y-3">
                {entry.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-4 text-[15.5px] leading-relaxed text-muted"
                  >
                    <span aria-hidden className="shrink-0 text-accent">
                      —
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* right rail: listening + typing */}
        <aside className="flex flex-col gap-10 border-t border-line pt-10 lg:border-t-0 lg:pt-1">
          <div>
            <p className="voice-label">On the record player</p>
            <div className="mt-4">
              <Suspense fallback={<ListeningSkeleton />}>
                <Listening />
              </Suspense>
            </div>
          </div>
          <Suspense fallback={null}>
            <Monkeytype />
          </Suspense>
        </aside>
      </div>

      <div className="mt-6">
        <SectionHeader index="99" title="Commit history" note="the greyscale graph of attention" />
        <Suspense fallback={null}>
          <Heatmap />
        </Suspense>
      </div>

      <footer className="mt-20 border-t border-line pt-12">
        <p className="voice-label">What I believe, roughly</p>
        <div className="mt-6 max-w-2xl space-y-4">
          {nowData.beliefs.map((belief) => (
            <p key={belief} className="voice-display text-2xl italic text-fg/85">
              {belief}
            </p>
          ))}
        </div>
        <p className="mt-12 max-w-xl text-sm leading-relaxed text-muted">
          This page is inspired by the{" "}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="link-quiet text-fg"
          >
            /now page movement
          </a>
          . If something here is stale, that&apos;s honest too.
        </p>
      </footer>
    </main>
  );
}
