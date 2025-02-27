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
          - On mobile: w-full with max width 350px.
          - On sm: max width increases to 550px.
          - On md and above: fixed dimensions 560px x 470px.
      */}
      <div className="relative w-full max-w-[350px] sm:max-w-[550px] md:w-[560px] md:h-[470px] mx-auto">
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