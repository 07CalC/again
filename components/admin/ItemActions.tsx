"use client";

import { useTransition } from "react";
import { setPublished, removeItem, type FormState } from "@/app/admin/actions";

/**
 * Row-level actions for the admin dashboard: publish/unpublish and delete
 * (with a confirm step). Calls server actions directly and keeps the row
 * responsive during the round trip.
 */
export default function ItemActions({
  id,
  published,
}: {
  id: string;
  published: boolean;
}) {
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    startTransition(async () => {
      const res: FormState = await setPublished(id, !published);
      if (res?.error) console.error(res.error);
    });
  };

  const remove = () => {
    if (!window.confirm("Delete this item from the shelf for good?")) return;
    startTransition(async () => {
      const res: FormState = await removeItem(id);
      if (res?.error) console.error(res.error);
    });
  };

  return (
    <div className="flex items-center gap-3.5">
      <button
        onClick={toggle}
        disabled={pending}
        className="font-mono text-[12px] text-muted transition-colors hover:text-fg disabled:opacity-40"
      >
        {published ? "unpublish" : "publish"}
      </button>
      <button
        onClick={remove}
        disabled={pending}
        className="font-mono text-[12px] text-faint transition-colors hover:text-accent disabled:opacity-40"
      >
        delete
      </button>
    </div>
  );
}
