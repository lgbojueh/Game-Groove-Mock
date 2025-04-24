// src/components/Logo.tsx
"use client";
export const dynamic = 'force-dynamic';

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Logo() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render on the client to avoid SSR/theme mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const logoSrc =
    currentTheme === "dark"
      ? "/game-groove-logo-light.svg"   // light logo for dark theme
      : "/game-groove-logo-dark.svg";    // dark logo for light theme

  return (
    <Image
      src={logoSrc}
      alt="Game Grove Logo"
      width={30}
      height={30}
      priority
      className="object-contain"
    />
  );
}
