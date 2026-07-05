import type { Metadata } from "next";
import "./globals.css";
import { IBM_Plex_Sans } from "next/font/google"
import Navbar from "@/components/Navbar";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
});

export const metadata: Metadata = {
  title: "Vinayak Maheshwari | CalC",
  description: "Who am i without my silliness? A CalC.",
  icons: {
    icon: '/capy.png',
    shortcut: '/capy.png',
    apple: '/capy.png',
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
