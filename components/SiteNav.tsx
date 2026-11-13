"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "/writing", label: "writing" },
  { href: "/projects", label: "projects" },
  { href: "/shelf", label: "shelf" },
  { href: "/now", label: "now" },
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 supports-[backdrop-filter]:bg-bg/80 backdrop-blur-sm">
      <nav
        aria-label="Main"
        className="mx-auto flex min-h-14 max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 sm:px-8"
      >
        <Link
          href="/"
          className="group flex items-baseline gap-2 text-fg"
          aria-label="CalC — home"
        >
          <span className="font-mono text-[15px] tracking-tight">
            calc
            <span className="text-accent transition-transform duration-200 inline-block group-hover:translate-x-0.5">
              _
            </span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 sm:gap-x-7">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-nav font-mono text-[12px] sm:text-[13px]"
              aria-current={pathname.startsWith(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <span aria-hidden className="hidden h-4 w-px bg-line sm:block" />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
