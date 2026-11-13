import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import ShelfForm from "@/components/admin/ShelfForm";

export const dynamic = "force-dynamic";

export default async function NewShelfItemPage() {
  if (!(await isAdmin())) redirect("/admin");

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8">
      <header>
        <p className="voice-label">/admin/shelf/new</p>
        <h1 className="voice-display mt-2 text-4xl text-fg sm:text-5xl">
          Add to the shelf<span className="text-accent">.</span>
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
          Fill what you know, leave the rest blank. Items stay drafts until you
          publish them — everything here is editable later.
        </p>
      </header>

      <ShelfForm />
    </main>
  );
}
