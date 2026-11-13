"use server";

import { redirect } from "next/navigation";
import {
  verifyPassword,
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  isAdmin,
} from "@/lib/auth";
import {
  createShelfItem,
  updateShelfItem,
  setShelfItemPublished,
  deleteShelfItem,
  SHELF_STATUSES,
  type ShelfItemInput,
} from "@/lib/shelf";

export type FormState = { error: string | null };

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function login(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const password = String(formData.get("password") ?? "");

  if (!(await verifyPassword(password))) {
    return { error: "Wrong password. The shelf stays locked." };
  }

  await setSessionCookie(await createSessionToken());
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin");
}

// ---------------------------------------------------------------------------
// Shelf CRUD — every mutation re-checks the session server-side.
// ---------------------------------------------------------------------------

function parseItemForm(formData: FormData): {
  input?: ShelfItemInput;
  id?: string;
  error?: string;
} {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "A title is required." };

  const category = String(formData.get("category") ?? "").trim().toLowerCase();
  if (!category) return { error: "A category is required." };

  const status = String(formData.get("status") ?? "want");
  if (!SHELF_STATUSES.includes(status as (typeof SHELF_STATUSES)[number])) {
    return { error: "Unknown status." };
  }

  const ratingRaw = String(formData.get("rating") ?? "").trim();
  const rating =
    ratingRaw === ""
      ? null
      : Number.isFinite(Number(ratingRaw))
        ? Math.min(10, Math.max(0, Math.round(Number(ratingRaw))))
        : null;

  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 12);

  const id = String(formData.get("id") ?? "").trim() || undefined;

  // Optional structured meta (currently just extra links from the admin form).
  let meta: Record<string, unknown> | null = null;
  const metaRaw = String(formData.get("meta") ?? "").trim();
  if (metaRaw) {
    try {
      const parsed = JSON.parse(metaRaw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        meta = parsed as Record<string, unknown>;
      }
    } catch {
      return { error: "Extra links are malformed — check the label|url lines." };
    }
  }

  return {
    id,
    input: {
      title,
      category,
      status,
      creator: String(formData.get("creator") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      thoughts: String(formData.get("thoughts") ?? "").trim() || null,
      rating,
      imageUrl: String(formData.get("imageUrl") ?? "").trim() || null,
      aspect: String(formData.get("aspect") ?? "portrait"),
      externalUrl: String(formData.get("externalUrl") ?? "").trim() || null,
      tags,
      meta,
      addedAt: String(formData.get("addedAt") ?? "").trim() || null,
      completedAt: String(formData.get("completedAt") ?? "").trim() || null,
      published: formData.get("published") === "on",
    },
  };
}

export async function saveShelfItem(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  if (!(await isAdmin())) {
    return { error: "Session expired — sign in again." };
  }

  const { input, id, error } = parseItemForm(formData);
  if (error || !input) return { error: error ?? "Invalid input." };

  try {
    if (id) {
      await updateShelfItem(id, input);
    } else {
      await createShelfItem(input);
    }
  } catch (err) {
    console.error("admin: save shelf item failed", err);
    return { error: "Could not save — database write failed." };
  }

  redirect("/admin");
}

export async function setPublished(id: string, published: boolean): Promise<FormState> {
  if (!(await isAdmin())) {
    return { error: "Session expired — sign in again." };
  }
  try {
    await setShelfItemPublished(id, published);
  } catch (err) {
    console.error("admin: set published failed", err);
    return { error: "Could not update the item." };
  }
  return { error: null };
}

export async function removeItem(id: string): Promise<FormState> {
  if (!(await isAdmin())) {
    return { error: "Session expired — sign in again." };
  }
  try {
    await deleteShelfItem(id);
  } catch (err) {
    console.error("admin: delete failed", err);
    return { error: "Could not delete the item." };
  }
  return { error: null };
}
