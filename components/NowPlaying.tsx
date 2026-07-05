import {
  CurrentlyPlayingResponse,
  getSpotifyToken,
  RecentlyPlayedResponse,
  Track,
} from "@/lib/spotify";
import Link from "next/link";

export default async function NowPlaying() {
  const accessToken = await getSpotifyToken();

  let track: Track | null = null;
  let isPlaying = false;
  let progress = 0;

  const currentRes = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing?market=IN",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  );

  if (currentRes.status === 200) {
    const data: CurrentlyPlayingResponse =
      await currentRes.json();

    if (data?.item) {
      track = data.item;
      isPlaying = data.is_playing;

      if (isPlaying) {
        const progressMs = data.progress_ms ?? 0;
        const durationMs = data.item.duration_ms;

        progress =
          (progressMs / durationMs) * 100;

      }
    }
  }

  if (!track) {
    const recentRes = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (recentRes.status === 200) {
      const recentData: RecentlyPlayedResponse =
        await recentRes.json();

      track =
        recentData.items?.[0]?.track ?? null;

      if (track) {
      }
    }
  }

  if (!track) {
    return null;
  }

  const albumArt =
    track.album.images?.[0]?.url;

  return (
    <Link
      href={track.external_urls.spotify}
      target="_blank"
      className="
        group
        relative
        block
        w-full
        max-w-[360px]
        lg:w-[360px]
        rounded-[32px]
        border border-gray-200/60 dark:border-white/10
        bg-white/40 dark:bg-black/20
        p-6 sm:p-8
        backdrop-blur-xl
        transition
        hover:border-gray-300/80 dark:hover:border-white/20
      "
    >
      <div
        className="
          absolute inset-0 rounded-[32px]
          bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.06),transparent_65%)] dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_65%)]
        "
      />

      {/* VINYL */}
      <div className="relative mx-auto h-[200px] w-[200px] sm:h-[240px] sm:w-[240px] md:h-[280px] md:w-[280px]">
        <div className="absolute inset-0 rounded-full bg-black shadow-[0_30px_80px_rgba(0,0,0,0.7)]" />

        <div
          className={`
            absolute inset-0 overflow-hidden rounded-full bg-black
            shadow-[inset_0_0_50px_rgba(255,255,255,0.04)]
            ${isPlaying ? "animate-spin-slow" : ""}
          `}
        >
          {/* grooves */}
          <div
            className="
              absolute inset-0 rounded-full
              bg-[repeating-radial-gradient(circle_at_center,#050505_0px,#050505_2px,#0d0d0d_3px,#050505_4px)]
            "
          />

          {/* highlight */}
          <div
            className="
              absolute inset-0 rounded-full
              bg-[conic-gradient(from_40deg,transparent,rgba(255,255,255,0.18),transparent_35%)]
            "
          />

          {/* album art */}
          <div
            className="
              absolute left-1/2 top-1/2
              h-24 w-24 sm:h-[120px] sm:w-[120px]
              -translate-x-1/2 -translate-y-1/2
              overflow-hidden
              rounded-full
              border border-white/10
              bg-black
              shadow-xl
            "
          >
            <img
              src={albumArt}
              alt={track.name}
              sizes="150px"
              className="object-cover"
            />

          </div>
        </div>

        {/* base */}
        <div
          className="
            absolute right-[-1.25rem] top-0
            flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center
            rounded-full bg-zinc-900 shadow-xl
          "
        >
          <div
            className="
              h-6 w-6 sm:h-8 sm:w-8 rounded-full
              bg-gradient-to-b
              from-zinc-100 to-zinc-400
            "
          />
        </div>

        <div
          className={`
            absolute right-[14px] top-[22px] sm:right-[20px] sm:top-[28px]
            h-[120px] w-[6px] sm:h-[140px] sm:w-[7px] md:h-[170px] md:w-[8px]
            origin-top rounded-full
            bg-gradient-to-b
            from-zinc-100 via-zinc-300 to-zinc-600
            shadow-lg
            transition-transform duration-700 ease-in-out
            ${isPlaying
              ? "rotate-[15deg]"
              : "rotate-[-10deg]"
            }
          `}
        >
          <div
            className="
              absolute bottom-[-10px] left-1/2 sm:bottom-[-12px]
              h-6 w-8 sm:h-7 sm:w-10
              -translate-x-1/2
              rotate-[10deg]
              rounded-md bg-zinc-800 shadow-xl
            "
          >
            <div className="absolute bottom-1 left-1.5 sm:left-2 h-1.5 w-[2px] sm:h-2 bg-zinc-400" />
            <div className="absolute bottom-1 left-4 sm:left-5 h-1.5 w-[2px] sm:h-2 bg-zinc-400" />
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        <div className="mb-3 flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${isPlaying
              ? "bg-green-400 animate-pulse"
              : "bg-zinc-500"
              }`}
          />

          <span
            className={`font-mono text-[11px] tracking-widest ${isPlaying
              ? "text-green-400"
              : "text-gray-500 dark:text-zinc-500"
              }`}
          >
            {isPlaying
              ? "NOW PLAYING"
              : "LAST PLAYED"}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-900 dark:text-white truncate">
          {track.name}
        </h3>

        <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-500 dark:text-zinc-400 truncate">
          {track.artists
            .map((a) => a.name)
            .join(", ")}
        </p>
      </div>

    </Link>
  );
}