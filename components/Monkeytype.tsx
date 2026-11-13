import Link from "next/link";
import { getMonkeytypeData } from "@/lib/monkeytype";

/**
 * Typing stats from Monkeytype, streamed via Suspense. Renders nothing when
 * no ApeKey is configured or the API is unreachable.
 */
export default async function Monkeytype() {
  const data = await getMonkeytypeData();
  if (!data) return null;

  const { best } = data;

  return (
    <section aria-label="Monkeytype stats">
      <div className="flex items-baseline justify-between">
        <p className="voice-label">typing · monkeytype</p>
        <Link
          href="https://monkeytype.com/profile/notcalc"
          target="_blank"
          rel="noopener noreferrer"
          className="link-quiet font-mono text-[11px] text-faint hover:text-fg"
        >
          profile ↗
        </Link>
      </div>

      <div className="mt-5 flex items-baseline gap-3">
        <span className="voice-display text-5xl text-fg">
          {Math.round(best.wpm)}
        </span>
        <span className="voice-label">
          15s pb · {Math.round(best.acc)}% acc
        </span>
      </div>
    </section>
  );
}
