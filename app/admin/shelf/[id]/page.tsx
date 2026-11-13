import Link from "next/link";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getShelfItemById } from "@/lib/shelf";
import ShelfForm from "@/components/admin/ShelfForm";

export const dynamic = "force-dynamic";

export default async function EditShelfItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin");

  const { id } = await params;
  let item;
  try {
    item = await getShelfItemById(id);
  } catch (err) {
    console.error("admin: failed to load item", err);
    item = null;
  }
  if (!item) notFound();

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8">
      <header>
        <p className="voice-label">/admin/shelf/{item.id.slice(0, 8)}…</p>
          <h1 className="voice-display mt-2 break-words text-4xl text-fg sm:text-5xl">
          Editing “{item.title}”<span className="text-accent">.</span>
        </h1>
        {item.published === 1 && (
          <p className="mt-3 font-mono text-xs text-faint">
            live at{" "}
            <Link
              href={`/shelf/${item.slug}`}
              className="link-quiet text-accent-ink dark:text-accent"
            >
              /shelf/{item.slug}
            </Link>
          </p>
        )}
      </header>

      <ShelfForm item={item} />
    </main>
  );
}
