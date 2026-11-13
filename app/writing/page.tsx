import type { Metadata } from "next";
import Link from "next/link";
import { getAllPostsDetailed } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Long-form articles, technical notes, and experiments — databases, storage engines, the web, and whatever else I'm taking apart.",
};

export default function WritingPage() {
  const posts = getAllPostsDetailed();

  const years = Array.from(new Set(posts.map((p) => new Date(p.date).getFullYear())))
    .sort((a, b) => b - a);

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      <header className="pb-12 pt-14 sm:pb-14 sm:pt-20">
        <p className="voice-label">/writing</p>
        <h1 className="voice-display mt-4 text-5xl text-fg sm:text-6xl">
          Writing<span className="text-accent">.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          Long-form articles, short notes, and experiments — mostly about how
          systems actually work underneath: databases, storage engines, the
          web, the occasional strong opinion.
        </p>
        <p className="mt-4 font-mono text-xs text-faint">
          {posts.length} posts ·{" "}
          <a href="/feed.xml" className="link-quiet">
            RSS
          </a>
        </p>
      </header>

      <div className="max-w-3xl">
        {years.map((year) => (
          <section key={year} className="mt-2 first:mt-0">
            <div className="flex items-baseline justify-between">
              <h2 className="voice-label">{year}</h2>
              <hr className="rule flex-1 ml-6" />
            </div>
            <div className="mt-2 divide-y divide-line">
              {posts
                .filter((p) => new Date(p.date).getFullYear() === year)
                .map((post) => (
                  <Link
                    key={post.slug}
                    href={`/writing/${post.slug}`}
                    className="group block py-5 sm:py-6"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="voice-display min-w-0 text-[1.65rem] leading-tight text-fg transition-colors group-hover:text-accent sm:text-3xl">
                        {post.title}
                      </h3>
                      <span className="voice-meta shrink-0 pt-1.5 text-faint">
                        {post.readingTime} min
                      </span>
                    </div>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                      {post.description}
                    </p>
                    <p className="mt-3 font-mono text-[11px] tracking-wide text-faint">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })}
                      {post.tags.length > 0 && (
                        <span className="ml-3">{post.tags.join(" · ").toLowerCase()}</span>
                      )}
                    </p>
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
