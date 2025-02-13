import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Main Logo Centered */}
      <Image 
        src="/game-groove-logo.svg"  
        alt="Game Groove Logo"
        width={250} 
        height={250}
        priority 
        className="mb-6"
      />

      {/* "Find My Game" Button */}
      <Link href="/search">
        <button className="px-6 py-3 text-lg font-semibold rounded-lg transition
                          bg-gray-400 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600
                          text-[var(--foreground)]">
          Find My Game
        </button>
      </Link>
    </main>
  );
}