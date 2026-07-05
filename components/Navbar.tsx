"use client";

import { Moon, Sun, Menu, X } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "home" },
  { href: "/projects", label: "projects" },
  { href: "/writing", label: "writing" },
  { href: "/shelf", label: "shelf" },
  { href: "/now", label: "now" },
  { href: "/about", label: "about" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 20) {
        setHidden(false);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
        setHidden(true);
      } else if (currentScrollY < lastScrollY.current) {
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-4 left-0 right-0 z-50 mx-auto w-full max-w-[1200px] px-4 transition-all duration-300 ${
          hidden ? "-translate-y-[calc(100%+2rem)] opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="flex items-center justify-between rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white/50 dark:bg-black/30 px-4 sm:px-6 py-3 backdrop-blur-xl shadow-lg">
          <Link href="/" className="shrink-0">
            <Image
              src={"/capy.png"}
              alt="Vinayak Maheshwari"
              width={32}
              height={32}
              className="rounded-full"
            />
          </Link>

          <div className="hidden md:flex items-center gap-5 text-sm text-gray-500 dark:text-gray-400">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors relative ${
                    isActive
                      ? "text-blue-500 dark:text-blue-400"
                      : "hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="block w-1 h-1 bg-blue-500 rounded-full mx-auto mt-1 absolute -bottom-2 left-1/2 -translate-x-1/2" />
                  )}
                </Link>
              );
            })}
            <button
              aria-label="Toggle theme"
              className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors ml-2"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun size={16} className="hidden dark:block" />
              <Moon size={16} className="dark:hidden" />
            </button>
          </div>

          <button
            aria-label="Open menu"
            className="md:hidden hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Side drawer overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          <div
            className="absolute top-0 right-0 h-full w-64 overflow-y-auto border-l border-gray-200/60 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-2xl translate-x-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-end p-4">
              <button
                aria-label="Close menu"
                className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-2 px-4 text-sm text-gray-500 dark:text-gray-400">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`transition-colors rounded-lg px-3 py-2 ${
                      isActive
                        ? "text-blue-500 dark:text-blue-400 font-medium bg-blue-500/10"
                        : "hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <hr className="my-2 border-gray-200 dark:border-white/10" />

              <button
                aria-label="Toggle theme"
                className="flex items-center gap-3 rounded-lg px-3 py-2 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-white/5 transition-colors"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Sun size={16} className="hidden dark:block" />
                <Moon size={16} className="dark:hidden" />
                <span className="capitalize">{theme === "dark" ? "light" : "dark"} mode</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
