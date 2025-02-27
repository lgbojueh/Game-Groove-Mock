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

  // While mounting, render a fallback logo so that server and client match.
  if (!mounted) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <Image 
          src="/game-groove-logo-dark.svg"
          alt="Game Groove Logo"
          width={550}
          height={550}
          priority
          className="mb-6 mx-auto block"
        />
        <button 
          onClick={handleFindGameClick}
          className="px-6 py-3 text-lg font-semibold rounded-lg transition bg-gray-400 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 text-[var(--foreground)]"
        >
          Find My Game
        </button>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Image 
        src={theme === "dark" ? "/game-groove-logo-light.svg" : "/game-groove-logo-dark.svg"}
        alt="Game Groove Logo"
        width={550}
        height={550}
        priority
        className="mb-6 mx-auto block"
      />
      <button 
        onClick={handleFindGameClick}
        className="px-6 py-3 text-lg font-semibold rounded-lg transition bg-gray-400 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 text-[var(--foreground)]"
      >
        Find My Game
      </button>
    </main>
  );
}