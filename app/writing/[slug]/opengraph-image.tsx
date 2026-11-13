import { ImageResponse } from "next/og";
import { getAllPostsDetailed, getPostBySlug } from "@/lib/posts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Post cover";

export function generateStaticParams() {
  return getAllPostsDetailed().map((post) => ({ slug: post.slug }));
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.meta.title ?? "Writing";
  const date = post
    ? new Date(post.meta.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "";

  // Wrap long titles so nothing clips.
  const words = title.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > 34) {
      lines.push(current.trim());
      current = word;
    } else {
      current = `${current} ${word}`;
    }
  }
  if (current.trim()) lines.push(current.trim());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#141210",
          color: "#e9e4da",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 12,
              background: "#d97e54",
            }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#9b9488",
            }}
          >
            vinm.me / writing
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            fontSize: lines.length > 2 ? 64 : 76,
            lineHeight: 1.15,
            fontWeight: 700,
            letterSpacing: -1,
          }}
        >
          {lines.map((line, i) => (
            <div key={i} style={{ display: "flex" }}>
              {line}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "#9b9488",
            borderTop: "1px solid #2b2823",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex" }}>Vinayak Maheshwari</div>
          <div style={{ display: "flex", color: "#d97e54" }}>{date}</div>
        </div>
      </div>
    ),
    size
  );
}
