
type SpotifyTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export type Track = {
  name: string;
  artists: Artist[];
  album: Album;
  external_urls: {
    spotify: string;
  };
  duration_ms: number;
};

export type Artist = {
  name: string;
};

export type Album = {
  images: Image[];
};

export type Image = {
  url: string;
  height?: number;
  width?: number;
};

export type CurrentlyPlayingResponse = {
  is_playing: boolean;
  progress_ms: number | null;
  item: Track | null;
};

export type RecentlyPlayedResponse = {
  items: {
    track: Track;
  }[];
};

let cachedAccessToken: string | null = null;
let tokenExpiresAt: number | null = null;
export async function getSpotifyToken(): Promise<string> {
  const now = Date.now();

  if (cachedAccessToken && tokenExpiresAt && now < tokenExpiresAt) {
    return cachedAccessToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN!;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    cache: "no-store",
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Spotify token");
  }

  const data: SpotifyTokenResponse = await response.json();
  cachedAccessToken = data.access_token;
  tokenExpiresAt = now + data.expires_in * 1000 - 60 * 1000;

  return cachedAccessToken;
}
