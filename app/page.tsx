import Link from "next/link";
import Hero from "@/components/Hero";
import NowPlaying from "@/components/NowPlaying";
import { getAllPosts } from "@/lib/posts";
import { Calendar, ArrowRight } from "lucide-react";

export default function Home() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <main className="min-h-screen max-w-[1200px] mx-auto px-8 pb-24 pt-20 flex flex-col font-sans">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
        <div className="lg:w-1/2 flex items-center justify-start">
          <Hero />
        </div>
        <div className="lg:w-1/2 flex items-center justify-end">
          <NowPlaying />
        </div>
      </div>

      <section className="mt-32 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-gray-900 dark:text-gray-100">
            Writings
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
            I write too (sometimes)
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/writing/${post.slug}`}
              className="group rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white/40 dark:bg-white/[0.03] p-5 backdrop-blur-xl transition-all hover:border-gray-300/80 dark:hover:border-white/20 hover:shadow-lg"
            >
              <div className="flex flex-col gap-3 h-full">
                <div className="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-500">
                  <Calendar size={12} />
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>

                <h3 className="text-base font-medium text-gray-900 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed flex-grow line-clamp-3">
                  {post.description}
                </p>

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gray-200/60 dark:bg-white/5 text-gray-500 dark:text-gray-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/writing"
          className="flex items-center gap-1.5 text-sm font-mono text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors w-fit mt-2"
        >
          all writings <ArrowRight size={14} />
        </Link>
      </section>
    </main>
  );
}
