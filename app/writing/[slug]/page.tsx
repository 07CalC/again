import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { compileMDX, MDXRemote } from "next-mdx-remote/rsc";
import { MDXComponents } from "@/components/MDXComponents";
import rehypeHighlight from "rehype-highlight";
import { Calendar, ArrowLeft } from "lucide-react";
import BlogFooter from "@/content/BlogFooter";

export const dynamic = "force-static"; 1
export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const { content } = await compileMDX({
    source: post?.content || "",
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [rehypeHighlight],
      }
    },
    components: MDXComponents
  })
  if (!post) notFound();

  return (
    <div className="min-h-screen w-full max-w-[1200px] mx-auto px-4 sm:px-8 pb-24 pt-8 flex flex-col overflow-x-hidden">
      <div className="flex flex-col gap-12 w-full md:max-w-[60vw] min-w-0 mx-auto overflow-x-hidden">
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

            <div className="flex items-center gap-3 text-xs font-mono text-gray-500 dark:text-gray-500 flex-wrap">
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

        <article className="rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white/40 dark:bg-black/20 p-4 sm:p-8 backdrop-blur-xl overflow-x-auto">
          {content}
        </article>
      </div>
    </div>
  );
}
