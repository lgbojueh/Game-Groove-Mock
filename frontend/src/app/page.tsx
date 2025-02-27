"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function Home() {
  const { theme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFindGameClick = () => {
    router.push("/search");
  };

  // Use the appropriate logo based on the current theme
  const logoSrc = mounted
    ? theme === "dark"
      ? "/game-groove-logo-light.svg"
      : "/game-groove-logo-dark.svg"
    : "/game-groove-logo-dark.svg";

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)] px-4">
      {/* Logo container with responsive dimensions:
          - On mobile (base): width 550px (height auto).
          - On larger screens (sm and up): width 560px and height 470px */}
      <div className="relative mx-auto w-[550px] sm:w-[560px] sm:h-[470px]">
        <Image
          src={logoSrc}
          alt="Game Groove Logo"
          fill
          priority
          className="object-contain"
        />
      </div>
      <button
        onClick={handleFindGameClick}
        className="mt-6 px-6 py-3 text-lg font-semibold rounded-lg transition bg-gray-400 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 text-[var(--foreground)]"
      >
        Find My Game
      </button>
    </main>
  );
}