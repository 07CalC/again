"use client";

import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="flex items-center justify-between py-8">
      <Link href="/" className="text-xl font-medium tracking-tighter text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors">
        <Image
          src={"/capy.png"}
          alt="Vinayak Maheshwari"
          width={32}
          height={32}
          className="rounded-full"
        />
      </Link>
      <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors relative">
          home
          <span className="block w-1 h-1 bg-blue-500 rounded-full mx-auto mt-1 absolute -bottom-2 left-1/2 transform -translate-x-1/2"></span>
        </Link>
        <Link href="/projects" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">projects</Link>
        <Link href="/writing" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">writing</Link>
        <Link href="/shelf" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">shelf</Link>
        <Link href="/now" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">now</Link>
        <Link href="/about" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">about</Link>
        <button
          aria-label="Toggle theme"
          className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors ml-4"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {mounted && theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </nav>
  );
}
