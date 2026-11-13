import Link from "next/link";
import { getListening } from "@/lib/spotify";

/**
 * Compact listening line for the home page. Streams in via Suspense;
 * renders nothing when Spotify is unavailable (it should never break a page).
 */
export default async function Listening() {
  const listening = await getListening();
  if (!listening) return null;

  const { track, isPlaying } = listening;
  const artists = track.artists.map((a) => a.name).join(", ");

  return (
    <Link
      href={track.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3.5 py-1"
      title={isPlaying ? "Now playing on Spotify" : "Last played on Spotify"}
    >
      {track.album.images[0]?.url && (
        <img
          src={track.album.images[0].url}
          alt=""
          width={44}
          height={44}
          loading="lazy"
          decoding="async"
          className="h-11 w-11 shrink-0 object-cover"
        />
      )}
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span
            aria-hidden
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
              isPlaying ? "bg-accent animate-pulse" : "bg-faint"
            }`}
          />
          <span className="voice-label">{isPlaying ? "Now playing" : "Last played"}</span>
        </span>
        <span className="mt-1 block truncate text-[13.5px] text-fg transition-colors group-hover:text-accent">
          {track.name} <span className="text-faint">—</span>{" "}
          <span className="text-muted">{artists}</span>
        </span>
      </span>
    </Link>
  );
}

export function ListeningSkeleton() {
  return (
    <div className="flex items-center gap-3.5 py-1" aria-hidden>
      <div className="h-11 w-11 shrink-0 bg-line" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-2.5 w-20 bg-line" />
        <div className="h-3 w-48 max-w-full bg-line" />
      </div>
    </div>
  );
}
