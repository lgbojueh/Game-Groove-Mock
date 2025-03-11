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

  // Until mounted, use fallback logo.
  const logoSrc =
    mounted && theme === "dark"
      ? "/game-groove-logo-light.svg"
      : "/game-groove-logo-dark.svg";

  return (
    <main className="flex flex-col items-center justify-center h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)] px-4">
      {/* Responsive container for logo */}
      <div className="relative w-full max-w-[350px] sm:max-w-[550px] md:w-[800px] md:h-[473px] mx-auto">
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
        className="mt-6 px-6 py-3 text-lg font-semibold rounded-lg transition bg-red-500 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-500 text-[var(--foreground)]"
      >
        Find My Game
      </button>
    </main>
  );
}
