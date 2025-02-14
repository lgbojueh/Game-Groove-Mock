"use client";

import Image from "next/image";
import { useTheme } from "next-themes";  // ✅ Import useTheme for dark mode detection

export default function Home() {
  const { theme } = useTheme();  // ✅ Get current theme

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      
      {/* Logo that changes based on theme */}
      <Image 
        src={theme === "dark" ? "/game-groove-logo-light.svg" : "/game-groove-logo-dark.svg"}  
        alt="Game Groove Logo"
        width={550}   
        height={550}  
        priority 
        className="mb-6 mx-auto block"
      />

      {/* "Find My Game" Button */}
      <button 
        className="px-6 py-3 text-lg font-semibold rounded-lg transition
                   bg-gray-400 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600
                   text-[var(--foreground)]">
        Find My Game
      </button>
    </main>
  );
}