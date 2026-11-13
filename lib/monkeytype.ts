/** Monkeytype 15-second personal best integration. */

import { getSecret } from "@/lib/env";

type MonkeytypeResponse<T> = {
  data: T;
};

export type MonkeytypePersonalBest = {
  wpm: number;
  acc: number;
  raw: number | null;
  consistency: number | null;
  mode: string;
  mode2: string;
  timestamp: number;
};

type MonkeytypePersonalBestRecord = {
  wpm: number;
  acc: number;
  raw?: number | null;
  consistency?: number | null;
  mode?: string;
  mode2?: string | number;
  timestamp?: number;
};

export type MonkeytypeSnapshot = {
  best: MonkeytypePersonalBest;
  fetchedAt: number;
};

const BASE_URL = "https://api.monkeytype.com";
const CACHE_TTL_MS = 30 * 60 * 1000;

let cached: MonkeytypeSnapshot | null = null;
let cachedAt = 0;

async function getPersonalBest(
  key: string
): Promise<MonkeytypePersonalBest | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/users/personalBests?mode=time&mode2=15`,
      {
        headers: { Authorization: `ApeKey ${key}` },
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      }
    );
    if (!res.ok) return null;

    const json = (await res.json()) as MonkeytypeResponse<
      MonkeytypePersonalBestRecord | MonkeytypePersonalBestRecord[]
    >;
    const records = Array.isArray(json.data)
      ? json.data
      : json.data
        ? [json.data]
        : [];
    const best = records
      .filter(
        (record) =>
          Number.isFinite(record.wpm) && Number.isFinite(record.acc)
      )
      .map(
        (record): MonkeytypePersonalBest => ({
          wpm: record.wpm,
          acc: record.acc,
          raw: record.raw ?? null,
          consistency: record.consistency ?? null,
          mode: record.mode ?? "time",
          mode2: String(record.mode2 ?? "15"),
          timestamp: record.timestamp ?? 0,
        })
      )
      .reduce<MonkeytypePersonalBest | null>(
        (highest, record) =>
          !highest || record.wpm > highest.wpm ? record : highest,
        null
      );

    return best;
  } catch {
    return null;
  }
}

export async function getMonkeytypeData(): Promise<MonkeytypeSnapshot | null> {
  const key = await getSecret("MONKEYTYPE_APE_KEY");
  if (!key) return null;

  if (cached && Date.now() - cachedAt < CACHE_TTL_MS) return cached;

  const best = await getPersonalBest(key);
  if (!best) return null;

  const snapshot = { best, fetchedAt: Date.now() };
  cached = snapshot;
  cachedAt = snapshot.fetchedAt;
  return snapshot;
}
