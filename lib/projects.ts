/**
 * Projects — curated, grounded in the actual repositories.
 *
 * Every entry links back to the real repo/demo. Detail content is written
 * from the repos' READMEs and the author's own blog posts. No invented
 * metrics or achievements.
 */

export type ProjectStatus =
  | "maintained"
  | "building"
  | "dormant"
  | "archived";

export const STATUS_META: Record<
  ProjectStatus,
  { label: string; hint: string }
> = {
  maintained: { label: "maintained", hint: "Receives fixes and updates" },
  building: { label: "building", hint: "Actively being built" },
  dormant: { label: "dormant", hint: "Works, but paused for now" },
  archived: { label: "archived", hint: "Left as a record" },
};

export type ProjectDetail = {
  intro: string;
  sections: {
    heading: string;
    body: string[]; // paragraphs
    list?: string[];
  }[];
  relatedPost?: { slug: string; title: string };
};

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  status: ProjectStatus;
  year: string;
  stack: string[];
  image?: string;
  imageAspect?: "portrait" | "landscape";
  github?: string;
  demo?: string;
  featured?: boolean;
  detail?: ProjectDetail;
};

export const projects: Project[] = [
  {
    slug: "mist",
    title: "Mist",
    tagline: "A self-hostable PaaS that doesn't suck (mostly)",
    description:
      "Deploy web apps straight from a git repo on your own server — a single Go binary with SQLite, Docker, and Traefik. Heroku's UX, your hardware.",
    status: "building",
    year: "2024 —",
    stack: ["Go", "SQLite", "Docker", "Traefik", "WebSockets", "React"],
    image: "/mist.png",
    github: "https://github.com/trymist/mist",
    demo: "https://trymist.cloud",
    featured: true,
    detail: {
      intro:
        "Heroku killed its free tier, Vercel locks you in, AWS is AWS — meanwhile most self-hostable PaaS alternatives (Coolify, Dokploy, CapRover) need Node.js plus PostgreSQL or MongoDB. Mist is a deliberate counter-argument: one ~20MB Go binary, one SQLite file, Docker, and a VPS you already own. Idle footprint sits around 30–50MB of RAM instead of the 500MB+ the Node-based alternatives burn.",
      sections: [
        {
          heading: "How a deploy works",
          body: [
            "A GitHub webhook lands, a deployment record goes into an in-memory queue, and a single worker goroutine processes jobs sequentially: clone the repo, docker build with env vars as build args, gracefully stop the old container, start the new one with resource limits, reconfigure Traefik, prune old images (keeping the last five).",
            "Everything streams live — build logs, deployment status, container logs, and system metrics arrive over WebSockets instead of polling. The metrics broadcaster only samples while clients are actually connected.",
          ],
        },
        {
          heading: "Why SQLite",
          body: [
            "The entire state of the platform is one file at /var/lib/mist/mist.db — 29 tables covering users, teams, apps, deployments, domains, env vars, GitHub integration, and audit logs. Migrations run automatically on startup, so there is no separate database server and no separate migration tool to babysit. Backups are a file copy.",
          ],
        },
        {
          heading: "Under the hood",
          body: [
            "Mist talks to Docker through /var/run/docker.sock. Every container gets configurable CPU and memory limits, restart policies, env vars, host-path volumes, and Traefik labels for routing — Traefik watches the containers and rewrites routes automatically, so there are no nginx configs to edit.",
            "The codebase is roughly 13k lines of Go plus a React/Vite dashboard.",
          ],
        },
      ],
      relatedPost: { slug: "Mist-self-hostable-PAAS", title: "Mist: A self-hostable PAAS that doesn't suck (mostly)" },
    },
  },
  {
    slug: "keylite",
    title: "keylite",
    tagline: "An embedded key-value store in Rust",
    description:
      "A lightweight embedded key-value database with a RocksDB-inspired SSTable architecture: memtable, sorted runs, sparse indexes, bloom filters, checksums — and bindings for other languages.",
    status: "maintained",
    year: "2025",
    stack: ["Rust", "SSTables", "Bloom filters", "CRC32"],
    github: "https://github.com/07calc/keylite",
    featured: true,
    detail: {
      intro:
        "keylite is a study in how the storage engines underneath real databases work, built by lifting the ideas of RocksDB, LevelDB, and WiredTiger into a small, readable Rust crate. It is a key-value engine first, with a document layer (keylite-db) on the way.",
      sections: [
        {
          heading: "The architecture",
          body: [
            "Writes land in an in-memory memtable (a BTreeMap). Once it passes roughly 4MB it is flushed to an immutable SSTable on disk by a background thread. Reads check the memtable first, then walk the SSTables newest to oldest.",
            "Each SSTable stores 16KB data blocks of sorted key–value pairs, a sparse index with one entry per block, a bloom filter for fast negative lookups, and CRC32 checksums per block for integrity. When too many SSTables accumulate, compaction merges them in the background.",
          ],
        },
        {
          heading: "What it taught me",
          body: [
            "LSM-tree design is mostly about managing the gap between fast volatile memory and slow durable disk: why sorted runs beat per-key files, why sparse indexes work, and why a probabilistic filter saves an enormous number of pointless disk reads.",
            "The accompanying write-up walks through the hybrid approach step by step — from storing offsets in a hashmap to proper sorted string tables.",
          ],
        },
      ],
      relatedPost: { slug: "Lets-make-a-key-value-storage-engine", title: "Let's make a key-value storage engine" },
    },
  },
  {
    slug: "mortar",
    title: "Mortar",
    tagline: "Email infrastructure without the pain",
    description:
      "An all-in-one email platform: custom-domain mailboxes for your team plus transactional email APIs for your app, without operating your own mail servers.",
    status: "maintained",
    year: "2025 —",
    stack: ["TypeScript", "SMTP", "IMAP", "DNS"],
    image: "https://mortar.email/og.webp",
    demo: "https://mortar.email",
    featured: true,
  },
  {
    slug: "fyrer",
    title: "fyrer",
    tagline: "A monorepo task orchestrator in Rust",
    description:
      "Declarative, language-agnostic monorepo tool: describe packages and tasks in fyrer.yml, and fyrer resolves the task dependency graph, runs each level concurrently, streams prefixed output, and skips cached builds whose inputs didn't change.",
    status: "building",
    year: "2025 —",
    stack: ["Rust", "YAML", "Task graphs", "Hashing"],
    image: "/fyrer.png",
    github: "https://github.com/07calc/fyrer",
    demo: "https://crates.io/crates/fyrer",
    featured: true,
    detail: {
      intro:
        "Running three dev servers and a build by hand in five terminals is not a workflow, it is a chore. fyrer reads a fyrer.yml file describing the packages in a monorepo and their tasks, and orchestrates everything: it resolves the dependency graph between tasks, runs each level of the graph concurrently, and streams every task's output through a colorized, prefixed logger so you can tell who is talking.",
      sections: [
        {
          heading: "Design choices",
          body: [
            "Long-running dev servers keep running until you quit; finite tasks are tracked to completion. Cached builds are skipped when their inputs haven't changed, which makes rebuild loops cheap.",
            "It ships as a single static binary with an install script (SHA-256-verified releases from GitHub) and via cargo install — no runtime, no plugins, no daemon.",
          ],
        },
        {
          heading: "Status",
          body: [
            "V2 is in development — the declarative config format is stabilizing and the graph runner is being reworked to cover more task shapes.",
          ],
        },
      ],
    },
  },
  {
    slug: "flarebase",
    title: "flarebase",
    tagline: "PocketBase-inspired backend for Cloudflare Workers",
    description:
      "A backend-as-a-service designed for Workers: D1 for collections, R2 for files, a bundled dashboard, session tokens, and a written API rules spec. PocketBase's ergonomics, Cloudflare's runtime.",
    status: "building",
    year: "2026",
    stack: ["TypeScript", "Cloudflare D1", "R2", "Workers"],
    github: "https://github.com/07calc/flarebase",
    detail: {
      intro:
        "flarebase takes PocketBase's shape — a single small backend with an admin dashboard, collections, file storage, and auth — and rebuilds it on the Cloudflare platform: D1 holds every collection, an R2 bucket holds uploaded files, and the dashboard ships as static assets. No servers to rent; the Worker is the server.",
      sections: [
        {
          heading: "How it's put together",
          body: [
            "Bindings are the configuration surface: D1 for data, R2 for files, a JWT secret as a Wrangler secret, and a configurable session TTL (5 minutes to 30 days) validated at startup with a clear misconfiguration error instead of a silent footgun.",
            "The API behavior is specified up front in API_RULES.md, the architecture in ARCHITECTURE.md, and the implementation plan in ROADMAP.md — the repo is written like a small product, not a script.",
          ],
        },
      ],
    },
  },
  {
    slug: "meowlman",
    title: "meowlman",
    tagline: "Everything SMTP, in Rust",
    description:
      "A Rust email toolkit aiming to cover the whole stack: SMTP servers and clients, MIME parsing, RFC 5322 message generation, and raw email processing — in one crate family.",
    status: "building",
    year: "2026",
    stack: ["Rust", "SMTP", "MIME", "RFC 5322"],
    github: "https://github.com/07calc/meowlman",
    detail: {
      intro:
        "Email is one of those protocols everyone depends on and nobody wants to touch. meowlman is an attempt to make Rust a reasonable place to build email software: start from the wire protocol (SMTP) and the message format (RFC 5322 + MIME), and expose building blocks clean enough to compose servers, clients, and tooling from.",
      sections: [
        {
          heading: "Why",
          body: [
            "Building Mortar meant living inside email plumbing. The existing Rust ecosystem is fragmented across dozens of partial crates, so meowlman is the consolidation experiment: one place for SMTP conversations, MIME trees, and message construction.",
          ],
        },
      ],
    },
  },
  {
    slug: "crux",
    title: "Crux",
    tagline: "JoSAA/CSAB opening & closing ranks",
    description:
      "Previous years' opening and closing ranks for colleges under JoSAA and CSAB, packaged as a web platform so students can make counseling decisions with actual data.",
    status: "maintained",
    year: "2024 —",
    stack: ["TypeScript", "Data pipelines"],
    image: "https://crux.vinm.me/og.png",
    github: "https://github.com/07calc/crux",
    demo: "https://crux.vinm.me",
  },
  {
    slug: "cook-nvim",
    title: "cook.nvim",
    tagline: "Compile or run the current file from Neovim",
    description:
      "A modular Neovim plugin that builds or runs the current file based on its filetype — inside a floating terminal. Configurable per-project, extensible per-language.",
    status: "maintained",
    year: "2024 —",
    stack: ["Lua", "Neovim API"],
    image: "/cook.gif",
    github: "https://github.com/07calc/cook.nvim",
  },
  {
    slug: "doit-nvim",
    title: "doit.nvim",
    tagline: "Project-scoped todos for Neovim",
    description:
      "A todo/task manager that scopes itself to your project via the git root, with a floating-window UI, pinning, and per-project task lists.",
    status: "maintained",
    year: "2025 —",
    stack: ["Lua", "Neovim API"],
    github: "https://github.com/07calc/doit.nvim",
  },
  {
    slug: "laxci",
    title: "laxci",
    tagline: "GitHub Actions, but offline",
    description:
      "A minimal local CI runner in Rust: define jobs and steps in laxci.yml — with per-workflow/job/step env and working directories — and run your build/test/lint loop without a remote CI.",
    status: "dormant",
    year: "2025",
    stack: ["Rust", "YAML"],
    github: "https://github.com/07calc/laxci",
  },
  {
    slug: "jeelore",
    title: "JeeLore",
    tagline: "Community Q&A for JEE/NEET aspirants",
    description:
      "A community-driven forum where JEE and NEET aspirants post questions, share answers, and work through academic doubts together.",
    status: "archived",
    year: "2024",
    stack: ["JavaScript"],
    image: "/jeelore.png",
    github: "https://github.com/07calc/jeelore",
  },
  {
    slug: "batua",
    title: "Batua",
    tagline: "Expense tracking with insights",
    description:
      "A web app for tracking expenses and surfacing patterns in spending habits over time.",
    status: "archived",
    year: "2024",
    stack: ["JavaScript"],
    image: "/batua.jpg",
    github: "https://github.com/07calc/batua",
  },
];

/** Smaller utilities and experiments — a single quiet row, not cards. */
export const smallerThings: { name: string; href: string; note: string }[] = [
  { name: "Aurora", href: "https://github.com/07calc/aurora", note: "catppuccin hyprland rice for arch" },
  { name: "LnGraph", href: "https://github.com/07calc/LnGraph", note: "toy graph db on a filesystem" },
  { name: "ncore", href: "https://github.com/07calc/ncore", note: "neovim config" },
  { name: "vtreex", href: "https://github.com/07calc/vtreex", note: "directory trees in the terminal" },
  { name: "moj", href: "https://github.com/07calc/moj", note: "snake & flappy bird, in nvim" },
  { name: "hutc", href: "https://github.com/07calc/hutc", note: "rest client in lua" },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function featuredProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
