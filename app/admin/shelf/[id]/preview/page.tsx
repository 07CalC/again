import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ShelfItemView from "@/components/ShelfItemView";
import { isAdmin } from "@/lib/auth";
import { getShelfItemById, toPublicItem } from "@/lib/shelf";

export const dynamic = "force-dynamic";

export default async function ShelfItemPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin");

  const { id } = await params;
  let item;
  try {
    item = await getShelfItemById(id);
  } catch (error) {
    console.error("admin: failed to load preview item", error);
    notFound();
  }
  if (!item) notFound();

  return (
    <>
      <div className="mx-auto mt-8 flex max-w-6xl flex-wrap items-center justify-between gap-3 border-y border-line px-5 py-3 sm:px-8">
        <p className="font-mono text-[11px] uppercase tracking-wider text-faint">
          Private preview · {item.published === 1 ? "currently published" : "draft"}
        </p>
        <Link href={`/admin/shelf/${item.id}`} className="font-mono text-[12px] text-muted hover:text-fg">
          edit item ↗
        </Link>
      </div>
      <ShelfItemView
        item={toPublicItem(item)}
        backHref={`/admin/shelf/${item.id}`}
        backLabel="back to editing"
      />
    </>
  );
}
