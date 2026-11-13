import { NextResponse } from "next/server";
import { listPublishedShelfItems } from "@/lib/shelf";

export const dynamic = "force-dynamic";

/**
 * Public shelf API — published items only, public fields only.
 * Drafts never appear here, no matter how they are stored.
 */
export async function GET() {
  try {
    const items = await listPublishedShelfItems();
    return NextResponse.json(
      { count: items.length, items },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (err) {
    console.error("api/shelf: failed to list items", err);
    return NextResponse.json(
      { error: "shelf temporarily unavailable" },
      { status: 503 }
    );
  }
}
