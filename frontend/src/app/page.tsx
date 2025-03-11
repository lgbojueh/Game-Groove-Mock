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

  // Until the component mounts, use a fallback for the logo source.
  const logoSrc =
    mounted && theme === "dark"
      ? "/game-groove-logo-light.svg"
      : "/game-groove-logo-dark.svg";

  return (
    // Use h-screen so the whole viewport is taken, but then ensure that internal content does not force scrolling.
    <main className="flex flex-col items-center justify-center h-screen bg-[var(--background)] text-[var(--foreground)] px-4">
      {/* 
        The container uses responsive max-width and height:
         - On phones: max-width is 300px (and height auto via aspect ratio or intrinsic image)
         - On small devices (sm): max-width increases to 550px (height adjusts accordingly)
         - On medium and above: fixed dimensions 560px (width) x 470px (height)
      */}
      <div className="relative w-full max-w-[300px] sm:max-w-[550px] md:w-[560px] md:h-[470px] mx-auto">
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
