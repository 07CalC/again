# vinm.me — personal site of Vinayak Maheshwari (CalC)

An editorial, print-flavoured personal site: writing, projects, a live
`/now` page, and **The Shelf** — a personal bookshelf of books, anime,
movies, research papers, and games, fully managed from an admin dashboard.

Built with Next.js (App Router) on Cloudflare Workers via
[@opennextjs/cloudflare](https://opennext.js.org/cloudflare). D1 stores shelf
items, R2 stores cover images, and integrations (Spotify, Monkeytype, GitHub
contributions) degrade gracefully when unconfigured.

## Stack

- **Next.js 16** — App Router, Turbopack builds, server components everywhere
- **Cloudflare Workers** — deploy target; D1 + R2 bindings via wrangler
- **Tailwind CSS 4** — tokens in `app/globals.css` (warm paper & ink palette)
- **Fonts** — Instrument Serif (display), IBM Plex Sans (body), IBM Plex Mono (labels)
- **No ORM** — raw D1 SQL with parameter binding (`db/index.ts`)

## Getting started

```bash
bun install
bun run db:migrate:dev   # apply D1 migrations locally
bun run dev              # dev server with real local bindings (miniflare)
```

Local dev uses `initOpenNextCloudflareForDev()` — bindings work locally
without an account. Secrets live in `.dev.vars` (local) and Worker secrets
(production):

| Secret | Purpose |
| --- | --- |
| `SPOTIFY_CLIENT_ID` / `_SECRET` / `_REFRESH_TOKEN` | now-playing widget |
| `ADMIN_PASSWORD` | unlocks `/admin` (the shelf dashboard) |
| `MONKEYTYPE_APE_KEY` | optional — typing stats on `/now` |

## The Shelf

Everything under `/shelf` is content-managed — there is no hardcoded data.
Publishing flow:

1. Sign in at `/admin` with `ADMIN_PASSWORD`.
2. Add items (title, category, status, rating, cover upload, personal notes,
   tags, dates, links). Drafts are invisible to the public site and API.
3. Publish → the item appears in `/shelf`, its detail page, the home teaser,
   and the public JSON API at `/api/shelf` (published items only).

Cover images upload to the `vinm-shelf` R2 bucket and are served from
`/api/media/*` with immutable cache headers.

## Infrastructure setup (production)

```bash
bunx wrangler r2 bucket create vinm-shelf
bunx wrangler secret put ADMIN_PASSWORD
bunx wrangler secret put SPOTIFY_CLIENT_ID
bunx wrangler secret put SPOTIFY_CLIENT_SECRET
bunx wrangler secret put SPOTIFY_REFRESH_TOKEN
bunx wrangler secret put MONKEYTYPE_APE_KEY   # optional
bun run deploy                           # generate posts, build, migrate D1, deploy
```

## Scripts

| Script | What it does |
| --- | --- |
| `bun run dev` | dev server with local Cloudflare bindings |
| `bun run build` | generate posts JSON + production build |
| `bun run deploy` | generate posts, build, apply remote D1 migrations, and deploy to Workers |
| `bun run db:migrate` | apply D1 migrations (remote) |
| `bun run db:migrate:dev` | apply D1 migrations (local) |

## Writing

Posts are MDX in `content/blog/` with frontmatter (`title`, `date`,
`description`, `tags`, optional `image`). `scripts/generate-posts.mjs` turns
them into `lib/generated/posts.json` at build time; reading time is computed
from the markdown. `<BlogFooter />` is available inside posts.
