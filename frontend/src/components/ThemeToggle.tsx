"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch error

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition"
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
    >
      {currentTheme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
}