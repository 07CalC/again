import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function RecentWriting() {
  const posts = getAllPosts().slice(0, 5);

  return (
    <div className="flex flex-col gap-6 w-full">
      <h2 className="text-blue-500 dark:text-blue-400 font-mono text-sm">/ recent writing</h2>

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/writing/${post.slug}`}
            className="group rounded-xl border border-gray-200/60 dark:border-white/10 bg-white/40 dark:bg-white/[0.03] p-4 transition-all hover:border-gray-300/80 dark:hover:border-white/20"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {post.title}
                </h3>
                <span className="text-[11px] font-mono text-gray-500 dark:text-gray-500 whitespace-nowrap mt-0.5 shrink-0">
                  {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-gray-200/60 dark:bg-white/5 text-gray-500 dark:text-gray-500"
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

      <div className="mt-2">
        <Link
          href="/writing"
          className="text-sm font-mono text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
        >
          view all writing &rarr;
        </Link>
      </div>
    </div>
  );
}
