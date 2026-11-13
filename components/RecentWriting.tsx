import Link from "next/link";
import { getAllPostsDetailed } from "@/lib/posts";

export default function RecentWriting({ limit = 3 }: { limit?: number }) {
  const posts = getAllPostsDetailed().slice(0, limit);

  return (
    <div>
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/writing/${post.slug}`}
          className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-x-3 border-t border-line py-5 first:border-t-0 first:pt-0 sm:gap-x-8 sm:py-6"
        >
          <time
            dateTime={post.date}
            className="voice-meta shrink-0 pt-1"
          >
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </time>
          <div className="min-w-0">
            <h3 className="min-w-0 text-[17px] font-medium text-fg transition-colors group-hover:text-accent">
              {post.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
              {post.description}
            </p>
          </div>
          <span className="voice-meta shrink-0 pt-1 text-faint transition-colors group-hover:text-accent">
            {post.readingTime} min
          </span>
        </Link>
      ))}
      <span className="sr-only">
        <Link href="/writing">All writing</Link>
      </span>
    </div>
  );
}
