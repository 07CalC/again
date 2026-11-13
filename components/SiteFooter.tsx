import Link from "next/link";

const elsewhere = [
  { href: "https://github.com/07calc", label: "GitHub" },
  { href: "https://x.com/not_calc", label: "X" },
  { href: "https://linkedin.com/in/maheshwarivinayak", label: "LinkedIn" },
  { href: "https://crates.io/users/07Calc", label: "crates.io" },
  { href: "mailto:hello@vinm.me", label: "Email" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12 sm:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="voice-display text-2xl text-fg">
              Vinayak Maheshwari
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Software engineer & engineering student. Building things,
              breaking things, writing about the difference.
            </p>
          </div>

          <nav aria-label="Elsewhere" className="flex flex-col gap-3">
            <p className="voice-label">Elsewhere</p>
            <ul className="flex flex-col gap-2">
              {elsewhere.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="link-quiet text-sm text-muted hover:text-fg"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Site" className="flex flex-col gap-3">
            <p className="voice-label">Site</p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/writing" className="link-quiet text-sm text-muted hover:text-fg">
                  Writing
                </Link>
              </li>
              <li>
                <Link href="/shelf" className="link-quiet text-sm text-muted hover:text-fg">
                  The shelf
                </Link>
              </li>
              <li>
                <Link href="/now" className="link-quiet text-sm text-muted hover:text-fg">
                  Now
                </Link>
              </li>
              <li>
                <a href="/feed.xml" className="link-quiet text-sm text-muted hover:text-fg">
                  RSS
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <hr className="rule my-10" />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="voice-meta">© {new Date().getFullYear()} Vinayak Maheshwari</p>
          <p className="voice-meta">
            Next.js &amp; Cloudflare Workers · set in Plex &amp; Instrument Serif
          </p>
        </div>
      </div>
    </footer>
  );
}
