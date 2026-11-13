/**
 * Spotify "currently playing / last played" integration.
 *
 * Authenticates with the Client Credentials flow using a refresh token
 * (SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET / SPOTIFY_REFRESH_TOKEN) and
 * exposes one function, `getListening()`, that tolerates every failure mode:
 * missing env, failed token refresh, expired key, or Spotify being down —
 * returning null instead of throwing so pages degrade gracefully.
 */

type SpotifyTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export type Track = {
  name: string;
  artists: { name: string }[];
  album: { images: { url: string; height?: number; width?: number }[] };
  external_urls: { spotify: string };
  duration_ms: number;
};

export type Listening = {
  track: Track;
  isPlaying: boolean;
};

let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;

async function getSpotifyToken(): Promise<string | null> {
  const now = Date.now();
  if (cachedAccessToken && now < tokenExpiresAt) return cachedAccessToken;

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      }),
    });
    if (!response.ok) return null;

    const data = (await response.json()) as SpotifyTokenResponse;
    cachedAccessToken = data.access_token;
    tokenExpiresAt = now + data.expires_in * 1000 - 60 * 1000;
    return cachedAccessToken;
  } catch {
    return null;
  }
}

const API = "https://api.spotify.com/v1/me/player";

/**
 * Returns the currently playing track, falling back to the most recently
 * played one. Returns null when nothing could be resolved.
 */
export async function getListening(): Promise<Listening | null> {
  const token = await getSpotifyToken();
  if (!token) return null;

  const headers = { Authorization: `Bearer ${token}` };

  try {
    const currentRes = await fetch(`${API}/currently-playing?market=IN`, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (currentRes.status === 200) {
      const data = (await currentRes.json()) as {
        is_playing: boolean;
        item: Track | null;
      };
      if (data?.item) {
        return { track: data.item, isPlaying: Boolean(data.is_playing) };
      }
    }

    const recentRes = await fetch(`${API}/recently-played?limit=1`, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (recentRes.status === 200) {
      const data = (await recentRes.json()) as {
        items: { track: Track }[];
      };
      const track = data.items?.[0]?.track ?? null;
      if (track) return { track, isPlaying: false };
    }
  } catch {
    return null;
  }

  return null;
}
