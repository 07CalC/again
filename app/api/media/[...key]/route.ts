import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

/**
 * Serves media from the vinm-shelf R2 bucket. Keys are random UUIDs, so
 * unguessable; the endpoint is public by design — covers are meant to be
 * hot-linked by the shelf itself and cached hard.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key: keyParts } = await params;
  const key = keyParts.join("/");

  // Guard against path traversal weirdness and empty keys.
  if (!key || key.includes("..") || key.startsWith("/")) {
    return new NextResponse("not found", { status: 404 });
  }

  const { env } = await getCloudflareContext({ async: true });
  if (!env.SHELF_MEDIA) {
    return new NextResponse("media unavailable", { status: 500 });
  }

  const object = await env.SHELF_MEDIA.get(key);
  if (!object) {
    return new NextResponse("not found", { status: 404 });
  }

  return new Response(object.body, {
    status: 200,
    headers: {
      "Content-Type":
        object.httpMetadata?.contentType ?? "application/octet-stream",
      "Content-Length": String(object.size),
      ETag: object.httpEtag,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
