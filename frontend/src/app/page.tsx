import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Main Logo Centered */}
      <Image 
        src="/game-groove-logo.svg"  // ✅ Make sure this matches your logo filename
        alt="Game Groove Logo"
        width={250} 
        height={250}
        priority 
        className="mb-6"
      />

      {/* "Find My Game" Button */}
      <Link href="/search">
        <button className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
          Find My Game
        </button>
      </Link>
    </main>
  );
}