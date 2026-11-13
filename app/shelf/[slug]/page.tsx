import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ShelfItemView from "@/components/ShelfItemView";
import {
  getPublishedShelfItemBySlug,
  listPublishedShelfItems,
  CATEGORY_LABELS,
  type PublicShelfItem,
} from "@/lib/shelf";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let item;
  try {
    item = await getPublishedShelfItemBySlug(slug);
  } catch {
    return {};
  }
  if (!item) return {};

  const parts = [item.creator, CATEGORY_LABELS[item.category] ?? item.category].filter(Boolean);
  return {
    title: item.title,
    description: item.description ?? `${item.title}${parts.length > 0 ? ` — ${parts.join(" · ")}` : ""}`,
  };
}

export default async function ShelfItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let item: PublicShelfItem | undefined;
  let nearby: PublicShelfItem[] = [];
  try {
    const found = await getPublishedShelfItemBySlug(slug);
    if (found) {
      item = found;
      const all = await listPublishedShelfItems();
      nearby = all
        .filter((entry) => entry.id !== found.id && entry.category === found.category && entry.imageUrl)
        .slice(0, 4);
      if (nearby.length < 4) {
        nearby = [
          ...nearby,
          ...all
            .filter((entry) => entry.id !== found.id && entry.category !== found.category && entry.imageUrl && !nearby.some((n) => n.id === entry.id))
            .slice(0, 4 - nearby.length),
        ];
      }
    }
  } catch (error) {
    console.error("shelf item: failed to load", error);
  }
  if (!item) notFound();

  return <ShelfItemView item={item} nearby={nearby} />;
}
