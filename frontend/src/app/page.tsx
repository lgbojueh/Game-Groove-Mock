"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";  // ✅ Import useRouter
import { useTheme } from "next-themes";       // ✅ Import for dark mode

export default function Home() {
  const { theme } = useTheme();  // ✅ Get current theme
  const router = useRouter();    // ✅ Use Next.js router

  // Function to navigate when button is clicked
  const handleFindGameClick = () => {
    console.log("🚀 Navigating to Search Page");  // ✅ Debugging log
    router.push("/search");  // ✅ Redirect to search page
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      
      {/* Dynamic Logo Based on Theme */}
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
        onClick={handleFindGameClick}  // ✅ Attach Click Event
        className="px-6 py-3 text-lg font-semibold rounded-lg transition
                   bg-lightblue-400 hover:bg-lightblue-500 dark:bg-blue-700 dark:hover:bg-blue-600
                   text-[var(--foreground)]">
        Find My Game
      </button>
    </main>
  );
}