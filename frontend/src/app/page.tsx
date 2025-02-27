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

  // Determine which logo to use (using fallback until mounted)
  const logoSrc = mounted
    ? (theme === "dark" ? "/game-groove-logo-light.svg" : "/game-groove-logo-dark.svg")
    : "/game-groove-logo-dark.svg";

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)] px-4">
      {/* Logo Container constraining the logo size */}
      <div className="w-full max-w-xs mx-auto">
        <Image 
          src={logoSrc}
          alt="Game Groove Logo"
          width={550}
          height={550}
          priority
          className="w-full h-auto object-contain"
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