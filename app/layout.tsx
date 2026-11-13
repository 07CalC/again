import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const siteUrl = "https://vinm.me";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vinayak Maheshwari — CalC",
    template: "%s — CalC",
  },
  description:
    "Software engineer & engineering student. Building storage engines, PaaS platforms, and developer tools. Who am I without my silliness? A CalC.",
  keywords: [
    "Vinayak Maheshwari",
    "CalC",
    "vinm",
    "07calc",
    "software engineer",
    "systems programming",
    "rust",
    "linux",
    "open source",
  ],
  authors: [{ name: "Vinayak Maheshwari", url: siteUrl }],
  creator: "Vinayak Maheshwari",
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${siteUrl}/feed.xml` },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Vinayak Maheshwari — CalC",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@not_calc",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f3ee" },
    { media: "(prefers-color-scheme: dark)", color: "#141210" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full ${plexSans.variable} ${plexMono.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:bg-raised focus:text-fg focus:border focus:border-line focus:px-3 focus:py-2 voice-meta"
          >
            Skip to content
          </a>
          <SiteNav />
          <div id="content" className="flex-1">
            {children}
          </div>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
