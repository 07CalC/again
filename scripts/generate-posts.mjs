/**
 * generate-posts.mjs
 *
 * Reads every .mdx file in content/blog/, parses its YAML-ish frontmatter,
 * and writes a JSON manifest to lib/generated/posts.json.
 *
 * Run before `next build` so the data is available at build time without
 * needing Node `fs` at runtime (which doesn't exist on Cloudflare Workers).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BLOG_DIR = path.join(ROOT, "content", "blog");
const OUT_DIR = path.join(ROOT, "lib", "generated");
const OUT_FILE = path.join(OUT_DIR, "posts.json");

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const yaml = match[1];
  const content = match[2];
  const data = {};

  for (const line of yaml.split("\n")) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (!kv) continue;

    let value = kv[2].trim();

    if (value.startsWith("[")) {
      try {
        value = JSON.parse(value.replace(/'/g, '"'));
      } catch {
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

  return { data, content };
}


if (!fs.existsSync(BLOG_DIR)) {
  console.warn("[generate-posts] content/blog/ not found – writing empty manifest");
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, "[]", "utf-8");
  process.exit(0);
}

const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

const posts = files.map((file) => {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
  const { data, content } = parseFrontmatter(raw);

  return {
    slug: file.replace(/\.mdx$/, ""),
    title: data.title || file,
    date: data.date || "",
    description: data.description || "",
    tags: data.tags || [],
    image: data.image || undefined,
    content,
  };
});

posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(posts, null, 2), "utf-8");

console.log(`[generate-posts] wrote ${posts.length} posts to lib/generated/posts.json`);
