import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-6xl flex-col items-start justify-center px-5 sm:px-8">
      <p className="voice-label">404 · lost in the stacks</p>
      <h1 className="voice-display mt-4 text-6xl text-fg sm:text-7xl">
        Nothing shelved here<span className="text-accent">.</span>
      </h1>
      <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
        The page you asked for isn&apos;t on this shelf — it may have been
        moved, renamed, or never existed at all.
      </p>
      <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
        <Link href="/" className="link-arrow font-mono text-[13px]">
          home
        </Link>
        <Link href="/writing" className="link-arrow font-mono text-[13px]">
          writing
        </Link>
        <Link href="/projects" className="link-arrow font-mono text-[13px]">
          projects
        </Link>
        <Link href="/shelf" className="link-arrow font-mono text-[13px]">
          the shelf
        </Link>
      </div>
    </main>
  );
}
