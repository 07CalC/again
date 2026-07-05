import type { Metadata } from "next";
import "./globals.css";
import { IBM_Plex_Sans } from "next/font/google"
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vinm.me"),
  title: "Vinayak Maheshwari | CalC",
  description: "Who am i without my silliness? A CalC.",
  icons: {
    icon: '/capy.png',
    shortcut: '/capy.png',
    apple: '/capy.png',
  },
  openGraph: {
    title: "Vinayak Maheshwari | CalC",
    description: "Who am i without my silliness? A CalC.",
    url: "https://vinm.me",
    siteName: "Vinayak Maheshwari | CalC",
    images: [
      {
        url: "/og.png",
        width: 622,
        height: 254,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vinayak Maheshwari | CalC",
    description: "Who am i without my silliness? A CalC.",
    images: ["/og.png"],
  },
  authors: [
    {
      name: "Vinayak Maheshwari",
      url: "https://vinm.me",
    },
  ],
  keywords: [
    "Vinayak Maheshwari",
    "CalC",
    "vinm",
    "vinm.me",
    "vinayak maheshwari",
    "vinayak",
    "maheshwari",
    "developer",
    "software engineer",
    "full stack developer",
    "frontend developer",
    "backend developer",
  ],
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
};


import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full ${ibmPlexSans.variable} font-sans`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="starfield">
            <div className="stars-large" />
          </div>
          <div className="bg-blur" />
          <Navbar />
          <div className="flex-1 pt-20">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
