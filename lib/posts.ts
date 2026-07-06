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

const posts: PostEntry[] = postsData as PostEntry[];

export function getAllPosts(): PostMeta[] {
  return posts.map(({ content: _content, ...meta }) => meta);
}

export function getPostBySlug(slug: string): { meta: PostMeta; content: string } | null {
  const post =
    posts.find((p) => p.slug === slug) ||
    posts.find((p) => p.slug.toLowerCase() === slug.toLowerCase());

  if (!post) return null;

  const { content, ...meta } = post;
  return { meta, content };
}
