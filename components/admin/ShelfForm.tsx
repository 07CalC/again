"use client";

import { useActionState, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Upload } from "lucide-react";
import { saveShelfItem, type FormState } from "@/app/admin/actions";
import {
  SHELF_CATEGORIES,
  SHELF_STATUSES,
  STATUS_LABELS,
  type ShelfItemRow,
} from "@/lib/shelf";

const ASPECTS = ["portrait", "landscape", "square"] as const;

const labelCls = "voice-label block";
const inputCls =
  "mt-2 w-full border-b border-line bg-transparent py-2 text-sm text-fg placeholder:text-faint focus:border-line-strong focus:outline-none";

function parseLinksText(text: string): { label: string; url: string }[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, url] = line.split("|").map((s) => s.trim());
      if (!url) return null;
      return { label: label || "Link", url };
    })
    .filter((l): l is { label: string; url: string } => l !== null);
}

export default function ShelfForm({ item }: { item?: ShelfItemRow }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    saveShelfItem,
    { error: null }
  );

  const editing = Boolean(item);

  const [status, setStatus] = useState(item?.status ?? "want");
  const [aspect, setAspect] = useState(item?.aspect ?? "portrait");
  const [imageUrl, setImageUrl] = useState(item?.imageUrl ?? "");
  const [linksText, setLinksText] = useState(() => {
    if (!item?.meta) return "";
    try {
      const links = JSON.parse(item.meta).links;
      if (Array.isArray(links)) {
        return links
          .map((l: { label?: string; url?: string }) => `${l.label ?? "Link"}|${l.url ?? ""}`)
          .join("\n");
      }
    } catch {
      // ignore malformed meta
    }
    return "";
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const today = new Date().toISOString().slice(0, 10);

  async function handleUpload(file: File) {
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error ?? "upload failed");
      setImageUrl(json.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "upload failed");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  const aspectRatio =
    aspect === "landscape" ? "3 / 2" : aspect === "square" ? "1 / 1" : "2 / 3";

  return (
    <form action={action} className="mt-10 grid gap-12 lg:grid-cols-[1fr_300px]">
      {editing && <input type="hidden" name="id" value={item!.id} />}
      <input type="hidden" name="aspect" value={aspect} />
      <input type="hidden" name="imageUrl" value={imageUrl} />
      <input
        type="hidden"
        name="meta"
        value={
          parseLinksText(linksText).length > 0
            ? JSON.stringify({ links: parseLinksText(linksText) })
            : ""
        }
      />

      {/* ------------------------------------------------------ main fields */}
      <div className="space-y-9">
        <div>
          <label htmlFor="title" className={labelCls}>
            Title <span className="text-accent">*</span>
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={item?.title ?? ""}
            placeholder="Designing Data-Intensive Applications"
            className={inputCls}
          />
        </div>

        <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
          <div>
            <label htmlFor="slug" className={labelCls}>
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              defaultValue={item?.slug ?? ""}
              placeholder="auto from title"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="category" className={labelCls}>
              Category <span className="text-accent">*</span>
            </label>
            <input
              id="category"
              name="category"
              required
              defaultValue={item?.category ?? ""}
              placeholder="books"
              list="shelf-categories"
              className={inputCls}
            />
            <datalist id="shelf-categories">
              {SHELF_CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <p className="mt-1.5 font-mono text-[10px] text-faint">
              pick a suggestion or type your own
            </p>
          </div>
        </div>

        {/* status */}
        <fieldset>
          <legend className={labelCls}>Status</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {SHELF_STATUSES.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setStatus(s)}
                aria-pressed={status === s}
                className={`flex items-center gap-2 border px-3.5 py-1.5 font-mono text-[12px] transition-colors ${
                  status === s
                    ? "border-fg text-fg"
                    : "border-line text-faint hover:border-line-strong hover:text-muted"
                }`}
              >
                <span
                  aria-hidden
                  className={`status-${s} h-1.5 w-1.5 rounded-full bg-(--dot)`}
                />
                {STATUS_LABELS[s].toLowerCase()}
              </button>
            ))}
          </div>
          <input type="hidden" name="status" value={status} />
        </fieldset>

        <div>
          <label htmlFor="creator" className={labelCls}>
            Creator
          </label>
          <input
            id="creator"
            name="creator"
            defaultValue={item?.creator ?? ""}
            placeholder="author, studio, developer…"
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="description" className={labelCls}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={item?.description ?? ""}
            placeholder="what it is — a line or two"
            className={`${inputCls} resize-y`}
          />
        </div>

        <div>
          <label htmlFor="thoughts" className={labelCls}>
            My notes
          </label>
          <textarea
            id="thoughts"
            name="thoughts"
            rows={5}
            defaultValue={item?.thoughts ?? ""}
            placeholder="what you actually thought — shown on the item page"
            className={`${inputCls} resize-y`}
          />
        </div>

        <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
          <div>
            <label htmlFor="externalUrl" className={labelCls}>
              Primary link
            </label>
            <input
              id="externalUrl"
              name="externalUrl"
              type="url"
              defaultValue={item?.externalUrl ?? ""}
              placeholder="https://…"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="tags" className={labelCls}>
              Tags
            </label>
            <input
              id="tags"
              name="tags"
              defaultValue={
                item?.tags
                  ? (() => {
                      try {
                        const parsed = JSON.parse(item.tags);
                        return Array.isArray(parsed) ? parsed.join(", ") : "";
                      } catch {
                        return "";
                      }
                    })()
                  : ""
              }
              placeholder="systems, 2025, favourite"
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label htmlFor="links" className={labelCls}>
            Extra links
          </label>
          <textarea
            id="links"
            rows={2}
            value={linksText}
            onChange={(e) => setLinksText(e.target.value)}
            placeholder={"Goodreads|https://goodreads.com/…\nWiki|https://…"}
            className={`${inputCls} resize-y font-mono text-xs`}
          />
          <p className="mt-1.5 font-mono text-[10px] text-faint">
            one per line: label|url
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------- rail */}
      <aside className="space-y-9">
        {/* cover */}
        <div>
          <p className={labelCls}>Cover</p>
          <div
            className="frame relative mt-3 w-full"
            style={{ aspectRatio: aspectRatio }}
          >
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="Cover preview"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-raised text-faint">
                <Upload size={18} strokeWidth={1.5} />
                <span className="font-mono text-[10px] tracking-wide">
                  no cover yet
                </span>
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-bg/70">
                <Loader2 size={18} className="animate-spin text-accent" />
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
              className="border border-line px-3 py-1.5 font-mono text-[12px] text-muted transition-colors hover:border-line-strong hover:text-fg disabled:opacity-40"
            >
              upload
            </button>
            {imageUrl && (
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="font-mono text-[12px] text-faint transition-colors hover:text-accent"
              >
                remove
              </button>
            )}
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/svg+xml"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleUpload(file);
              }}
            />
          </div>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="…or paste an image URL"
            className={inputCls}
          />
          {uploadError && (
            <p role="alert" className="mt-2 font-mono text-[11px] text-accent-ink dark:text-accent">
              {uploadError}
            </p>
          )}
        </div>

        {/* aspect */}
        <div>
          <p className={labelCls}>Cover shape</p>
          <div className="mt-3 flex gap-2">
            {ASPECTS.map((a) => (
              <button
                type="button"
                key={a}
                onClick={() => setAspect(a)}
                aria-pressed={aspect === a}
                className={`border px-3 py-1.5 font-mono text-[11px] transition-colors ${
                  aspect === a
                    ? "border-fg text-fg"
                    : "border-line text-faint hover:border-line-strong hover:text-muted"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* rating */}
        <div>
          <label htmlFor="rating" className={labelCls}>
            Rating (0–10)
          </label>
          <input
            id="rating"
            name="rating"
            type="number"
            min={0}
            max={10}
            step={1}
            defaultValue={item?.rating ?? ""}
            placeholder="leave blank if unrated"
            className={inputCls}
          />
        </div>

        {/* dates */}
        <div className="space-y-6">
          <div>
            <label htmlFor="addedAt" className={labelCls}>
              Date added
            </label>
            <input
              id="addedAt"
              name="addedAt"
              type="date"
              defaultValue={item?.addedAt ?? today}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="completedAt" className={labelCls}>
              Date completed
            </label>
            <input
              id="completedAt"
              name="completedAt"
              type="date"
              defaultValue={item?.completedAt ?? ""}
              className={inputCls}
            />
            <p className="mt-1.5 font-mono text-[10px] text-faint">
              shown for finished items
            </p>
          </div>
        </div>

        {/* published */}
        <label className="flex cursor-pointer items-center gap-3 border-t border-line pt-6">
          <input
            type="checkbox"
            name="published"
            defaultChecked={item ? item.published === 1 : false}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          <span className="text-sm text-fg">Published</span>
        </label>
        <p className="-mt-5 font-mono text-[10px] leading-relaxed text-faint">
          drafts are invisible to the public site and API
        </p>

        {/* save */}
        <div className="border-t border-line pt-6">
          <button
            type="submit"
            disabled={pending}
            className="w-full bg-fg py-2.5 font-mono text-[13px] text-bg transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {pending ? "saving…" : editing ? "save changes" : "add to shelf"}
          </button>
          {state.error && (
            <p role="alert" className="mt-3 font-mono text-[11px] text-accent-ink dark:text-accent">
              {state.error}
            </p>
          )}
          <Link
            href="/admin"
            className="mt-4 block text-center font-mono text-[12px] text-faint transition-colors hover:text-fg"
          >
            ← back to dashboard
          </Link>
        </div>
      </aside>
    </form>
  );
}
