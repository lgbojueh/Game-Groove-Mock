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

  // Choose logo based on theme. Until mounted, use fallback.
  const logoSrc = mounted
    ? theme === "dark"
      ? "/game-groove-logo-light.svg"
      : "/game-groove-logo-dark.svg"
    : "/game-groove-logo-dark.svg";

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)] px-4">
      {/* Responsive container:
          - On mobile: full width up to a max of 550px.
          - On larger screens: fixed width 560px and fixed height 470px.
      */}
      <div className="relative w-full max-w-[550px] sm:w-[560px] sm:h-[470px]">
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