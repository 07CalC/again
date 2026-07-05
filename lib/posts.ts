import fs from "fs";
import path from "path";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  image?: string;
};

function postsDir() {
  return path.join(process.cwd(), "content", "blog");
}

function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: raw };
  }

  const yaml = match[1];
  const content = match[2];

  const data: Record<string, unknown> = {};
  for (const line of yaml.split("\n")) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) {
      let value: unknown = kv[2].trim();
      if (typeof value === "string" && value.startsWith("[")) {
        try {
          value = JSON.parse(value.replace(/'/g, '"'));
        } catch {
          // keep as string
        }
      }
      if (typeof value === "string" && value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      if (typeof value === "string" && value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      data[kv[1]] = value;
    }
  }

  return { data, content };
}

export function getAllPosts(): PostMeta[] {
  const dir = postsDir();
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data } = parseFrontmatter(raw);
    return {
      slug: file.replace(/\.mdx$/, ""),
      title: (data.title as string) || file,
      date: (data.date as string) || "",
      description: (data.description as string) || "",
      tags: (data.tags as string[]) || [],
      image: data.image as string | undefined,
    };
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): { meta: PostMeta; content: string } | null {
  const dir = postsDir();
  const filePath = path.join(dir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    // Try case-insensitive match
    if (!fs.existsSync(dir)) return null;
    const files = fs.readdirSync(dir);
    const match = files.find((f) => f.toLowerCase() === `${slug.toLowerCase()}.mdx`);
    if (!match) return null;
    return getPostBySlug(match.replace(/\.mdx$/, ""));
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = parseFrontmatter(raw);

  return {
    meta: {
      slug,
      title: (data.title as string) || slug,
      date: (data.date as string) || "",
      description: (data.description as string) || "",
      tags: (data.tags as string[]) || [],
      image: data.image as string | undefined,
    },
    content,
  };
}
