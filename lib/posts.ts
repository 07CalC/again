import postsData from "./generated/posts.json";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  image?: string;
};

type PostEntry = PostMeta & { content: string };

export type PostWithReadingTime = PostMeta & { readingTime: number; words: number };

const posts: PostEntry[] = postsData as PostEntry[];

function countWords(markdown: string): number {
  return markdown
    // strip code fences and inline code so they don't inflate the count
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

const detailed = posts.map((post) => {
  const words = countWords(post.content);
  // ~210 wpm is a comfortable technical reading pace.
  const readingTime = Math.max(1, Math.round(words / 210));
  return { ...post, words, readingTime };
});

export function getAllPostsDetailed(): PostWithReadingTime[] {
  return detailed.map(({ content: _content, ...meta }) => meta);
}

export function getPostBySlug(
  slug: string
): { meta: PostMeta & { readingTime: number; words: number }; content: string } | null {
  const post =
    detailed.find((p) => p.slug === slug) ||
    detailed.find((p) => p.slug.toLowerCase() === slug.toLowerCase());

  if (!post) return null;

  const { content, ...meta } = post;
  return { meta, content };
}
