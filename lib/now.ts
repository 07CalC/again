/**
 * "Now" — what I'm currently working on, learning, and exploring.
 *
 * This is the file to edit when life changes. Entries are plain strings;
 * `updatedAt` is shown publicly so readers know how stale this is.
 */

export type NowEntry = {
  label: string;
  items: string[];
};

export const nowData = {
  updatedAt: "2026-11-13",

  location: "Prayagraj, India",

  intro:
    "A rolling snapshot of what has my attention right now. This page changes when my focus does — last touched November 2026.",

  entries: [
    {
      label: "Building",
      items: [
        "Mortar — pushing the email infrastructure product forward",
        "Mist v2 — reworking the deployment pipeline of my self-hostable PaaS",
        "flarebase — a PocketBase-style backend that runs entirely on Workers",
      ],
    },
    {
      label: "Learning",
      items: [
        "Distributed systems — consensus, replication, and the compromises in between",
        "Storage engine internals beyond LSM trees: WALs, page layouts, recovery",
        "Email plumbing at the protocol level (SMTP, MIME, RFC 5322) via meowlman",
      ],
    },
    {
      label: "Reading",
      items: [
        "Designing Data-Intensive Applications — Kleppmann",
        "Research papers on LSM-tree compaction strategies",
      ],
    },
    {
      label: "Exploring",
      items: [
        "Rust async runtimes and what tokio actually costs",
        "Writing a tiny email server from scratch with meowlman",
        "Typing faster — monkeytype is now part of the site",
      ],
    },
  ],

  /** One-line answers to the implied "why?" of each interest. */
  beliefs: [
    "Systems are best understood by building them twice: once badly, once properly.",
    "Open source is the default — if it runs on my machine, it can run on yours.",
    "Tools should be boring. Infrastructure should be invisible. Interfaces should be fast.",
  ],
} as const;
