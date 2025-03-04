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
    <main className="flex flex-col items-center justify-center h-screen bg-[var(--background)] text-[var(--foreground)]">
      
      <div className="flex flex-col items-center justify-center w-full max-w-3xl space-y-4 px-4 sm:px-6 lg:px-8">
      
      {/* Dynamic Logo Based on Theme */}
      <Image 
        src={theme === "dark" ? "/game-groove-logo-light.svg" : "/game-groove-logo-dark.svg"}  
        alt="Game Groove Logo"
        width={550}   
        height={550}  
        priority 
        className="max-w-[100%] sm:max-w-[80%] md:max-w-[60%] h-auto"
      />

      {/* "Find My Game" Button and Adjusted for all screens*/ }
      <button 
        onClick={handleFindGameClick}  // ✅ Attach Click Event
        className="px-6 py-3 text-lg font-semibold rounded-lg transition
                   bg-gray-400 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600
                   text-[var(--foreground)] -mt-4">
        Find My Game
      </button>
      </div>
    </main>
  );
}