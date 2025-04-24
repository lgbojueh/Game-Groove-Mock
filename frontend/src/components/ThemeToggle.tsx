// src/components/ThemeToggle.tsx
"use client";
export const dynamic = 'force-dynamic';

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent SSR mismatch by waiting for client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const isDark = resolvedTheme === "dark";

  // Split into two separate buttons to avoid aria-pressed
  if (isDark) {
    return (
      <button
        onClick={() => setTheme("light")}
        className="p-2 rounded-lg text-sm font-medium bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition"
        aria-label="Switch to Light Mode"
      >
        ☀️ Light Mode
      </button>
    );
  } else {
    return (
      <button
        onClick={() => setTheme("dark")}
        className="p-2 rounded-lg text-sm font-medium bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition"
        aria-label="Switch to Dark Mode"
      >
        🌙 Dark Mode
      </button>
    );
  }
}