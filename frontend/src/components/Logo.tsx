"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Logo() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid rendering theme-dependent content until mounted
  if (!mounted) return null;

  // Determine the current theme: use the resolvedTheme if available.
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const logoSrc =
    currentTheme === "dark"
      ? "/game-groove-logo-dark.svg"
      : "/game-groove-logo-light.svg";

  return (
    <Image
      src={logoSrc}
      alt="Game Groove Logo"
      width={30}
      height={30}
      priority
    />
  );
}