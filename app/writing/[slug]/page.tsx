import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAllPostsDetailed, getPostBySlug } from "@/lib/posts";
import { compileMDX } from "next-mdx-remote/rsc";
import { MDXComponents } from "@/components/MDXComponents";
import rehypeHighlight from "rehype-highlight";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPostsDetailed().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.meta.title,
    description: post.meta.description,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: "article",
      publishedTime: post.meta.date,
      authors: ["Vinayak Maheshwari"],
      tags: post.meta.tags,
    },
  };
}

export default async function WritingPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
    options: {
      mdxOptions: {
        rehypePlugins: [rehypeHighlight],
      },
    },
    components: MDXComponents,
  });

  const all = getAllPostsDetailed();
  const index = all.findIndex((p) => p.slug === post.meta.slug);
  const next = index > 0 ? all[index - 1] : null;

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      <nav className="pb-10 pt-10 sm:pt-14">
        <Link href="/writing" className="link-arrow font-mono text-[13px]">
          <ArrowLeft size={13} strokeWidth={1.75} />
          all writing
        </Link>
      </nav>

      <article className="mx-auto w-full max-w-[46rem]">
        <header className="border-t border-line pt-8">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <time dateTime={post.meta.date} className="voice-meta">
              {new Date(post.meta.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className="voice-meta text-faint">
              {post.meta.readingTime} min read
            </span>
          </div>
          <h1 className="voice-display mt-5 text-4xl leading-[1.1] text-fg sm:text-[3.25rem]">
            {post.meta.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {post.meta.description}
          </p>
        </header>

        <div className="article mt-12">{content}</div>

        <footer className="mt-20 border-t border-line pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4">
            <Link href="/writing" className="link-arrow font-mono text-[13px]">
              <ArrowLeft size={13} strokeWidth={1.75} />
              all writing
            </Link>
            {next && (
              <Link
                href={`/writing/${next.slug}`}
                className="group flex min-w-0 items-baseline justify-end gap-3"
              >
                <span className="truncate">
                  <span className="voice-label mr-2">next</span>
                  <span className="text-sm text-muted transition-colors group-hover:text-accent">
                    {next.title}
                  </span>
                </span>
                <ArrowRight
                  size={14}
                  strokeWidth={1.75}
                  className="shrink-0 text-faint transition-all group-hover:translate-x-0.5 group-hover:text-accent"
                />
              </Link>
            )}
          </div>
        </footer>
      </article>
    </main>
  );
}
