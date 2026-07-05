import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import BlogFooter from "@/content/BlogFooter";
import { Calendar, ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

const mdxComponents = {
  BlogFooter,
};

export default async function BlogPostPage(props: Promise<{ slug: string }>) {
  const { slug } = await props;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen max-w-[1200px] mx-auto px-8 pb-24 pt-8 flex flex-col">
      <div className="flex flex-col gap-12 max-w-3xl mx-auto w-full">
        <div className="flex flex-col gap-6">
          <Link
            href="/writing"
            className="flex items-center gap-1.5 text-sm font-mono text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors w-fit"
          >
            <ArrowLeft size={14} /> back to writing
          </Link>

          <div className="flex flex-col gap-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal tracking-tight text-gray-900 dark:text-gray-100 leading-tight">
              {post.meta.title}
            </h1>

            <div className="flex items-center gap-3 text-xs font-mono text-gray-500 dark:text-gray-500">
              <span className="flex items-center gap-1.5">
                <Calendar size={12} />
                {new Date(post.meta.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {post.meta.tags.length > 0 && (
                <span className="flex items-center gap-1.5">
                  {post.meta.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 rounded-full bg-gray-200/60 dark:bg-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              )}
            </div>
          </div>
        </div>

        <article className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-a:text-blue-500 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:bg-gray-200/60 dark:prose-code:bg-white/5 prose-code:text-gray-800 dark:prose-code:text-gray-200 prose-code:text-[13px] prose-pre:bg-gray-200/60 dark:prose-pre:bg-white/5 prose-pre:border prose-pre:border-gray-200/60 dark:prose-pre:border-white/10 prose-img:rounded-xl">
          <MDXRemote source={post.content} components={mdxComponents} />
        </article>
      </div>
    </div>
  );
}
