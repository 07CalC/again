import Link from "next/link";

const socialLinks = [
  {
    href: "https://github.com/calcmath",
    label: "GitHub",
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    href: "https://x.com/not_calc",
    label: "X",
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
  },
  {
    href: "mailto:hello@vinm.me",
    label: "Email",
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    href: "https://linkedin.com/in/maheshwarivinayak",
    label: "LinkedIn",
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-gray-200/60 dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-xl">
      <div className="mx-auto max-w-[1200px] px-8 py-16">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-12">
          <div className="flex flex-col gap-4 max-w-xs">
            <h3 className="text-base font-semibold font-mono text-gray-900 dark:text-gray-100 tracking-widest uppercase">
              About
            </h3>
            <p className="text-sm font-mono text-gray-500 dark:text-gray-400 leading-relaxed">
              Who am i without my silliness? A CalC. Building things, breaking things, and writing about it along the way.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-base font-semibold font-mono text-gray-900 dark:text-gray-100 tracking-widest uppercase">
              Find me
            </h3>
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                  aria-label={link.label}
                >
                  {link.svg}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200/60 dark:border-white/10">
        <div className="mx-auto max-w-[1200px] px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm font-mono text-gray-500 dark:text-gray-500">
            &copy; {new Date().getFullYear()} Vinayak Maheshwari
          </p>
          <p className="text-sm font-mono text-gray-500 dark:text-gray-500">
            built with Next.js &bull; hosted on Cloudflare
          </p>
        </div>
      </div>
    </footer>
  );
}
