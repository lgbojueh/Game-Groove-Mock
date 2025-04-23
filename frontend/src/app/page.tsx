"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function ClientHome() {
  const { theme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFindGameClick = () => {
    router.push("/search");
  };

  const logoSrc =
    mounted && theme === "dark"
      ? "/game-groove-logo-light.svg"
      : "/game-groove-logo-dark.svg";

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)] px-4">
      {/* Logo */}
      <div className="relative w-full max-w-[350px] h-[250px] sm:max-w-[550px] sm:h-[300px] md:w-[800px] md:h-[473px] mx-auto">
        {mounted && (
          <Image
            src={logoSrc}
            alt="Game Groove Logo"
            fill
            priority
            className="object-contain"
          />
        )}
      </div>

      {/* CTA Button */}
      <button
        onClick={handleFindGameClick}
        className="mt-6 px-6 py-3 text-lg font-semibold rounded-lg transition bg-red-500 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-500 text-white"
      >
        Find My Game
      </button>
    </main>
  );
}
