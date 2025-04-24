// src/components/Logo.tsx
"use client";
export const dynamic = 'force-dynamic';

import Image from "next/image";

/**
 * Logo switches icons purely via CSS. 
 * Dark-mode logo is shown when .dark class is absent.
 * Light-mode logo is shown when .dark class is present.
 * No JS gating needed, eliminating flicker.
 */
export default function Logo() {
  return (
    <div className="relative w-8 h-8">
      {/* Dark-mode logo: visible in light theme (no .dark) */}
      <Image
        src="/game-groove-logo-dark.svg"
        alt="Game Grove Logo"
        fill
        className="block dark:hidden object-contain"
      />
      {/* Light-mode logo: visible in dark theme (.dark class) */}
      <Image
        src="/game-groove-logo-light.svg"
        alt="Game Grove Logo"
        fill
        className="hidden dark:block object-contain"
      />
    </div>
  );
}
