import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB — plenty for covers/posters

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

/**
 * Admin-only upload endpoint. Accepts a single file in a multipart form
 * (`file` field), stores it in the vinm-shelf R2 bucket under a random key,
 * and returns the public URL it will be served from.
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { env } = await getCloudflareContext({ async: true });
  if (!env.SHELF_MEDIA) {
    return NextResponse.json(
      { error: "R2 binding is not available — is the bucket configured?" },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no file provided" }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "file is empty" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "file is too large (max 8MB)" },
      { status: 413 }
    );
  }

  const ext = EXTENSIONS[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "unsupported type — use jpg, png, webp, gif, avif, or svg" },
      { status: 415 }
    );
  }

  const key = `shelf/${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;

  try {
    await env.SHELF_MEDIA.put(key, file, {
      httpMetadata: { contentType: file.type },
    });
  } catch (err) {
    console.error("api/admin/upload: R2 put failed", err);
    return NextResponse.json(
      { error: "upload failed — check the bucket exists" },
      { status: 500 }
    );
  }

  return NextResponse.json({ key, url: `/api/media/${key}` });
}
