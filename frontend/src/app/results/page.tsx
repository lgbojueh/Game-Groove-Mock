"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Helper to clean unwanted line break codes from descriptions.
const cleanDescription = (desc?: string) =>
  desc ? desc.replace(/&#10;/g, " ") : "";

// Interface for game objects
interface BasicGame {
  id: string | null;
  name: string;
  thumbnail: string;
  description?: string;
  complexity?: string;
  players?: string;
  playtime?: string;
  genre?: string;
  age?: string;
  theme?: string;
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read filter query parameters (defaults to "any")
  const query = searchParams.get("query") || "";
  const playersFilter = searchParams.get("players") || "any";
  const complexityFilter = searchParams.get("complexity") || "any";
  const playtimeFilter = searchParams.get("playtime") || "any";
  const genreFilter = searchParams.get("genre") || "any";
  const ageFilter = searchParams.get("age") || "any";
  const themeFilter = searchParams.get("theme") || "any";

  const [games, setGames] = useState<BasicGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read the detailed results from localStorage.
    const stored = localStorage.getItem("searchResults");
    if (stored) {
      let results = JSON.parse(stored) as BasicGame[];

      // Apply each filter if the filter value is not "any"
      if (playersFilter !== "any") {
        results = results.filter((game) => game.players === playersFilter);
      }
      if (complexityFilter !== "any") {
        results = results.filter((game) => game.complexity === complexityFilter);
      }
      if (playtimeFilter !== "any") {
        results = results.filter((game) => game.playtime === playtimeFilter);
      }
      if (genreFilter !== "any") {
        results = results.filter((game) => game.genre === genreFilter);
      }
      if (ageFilter !== "any") {
        results = results.filter((game) => game.age === ageFilter);
      }
      if (themeFilter !== "any") {
        results = results.filter((game) => game.theme === themeFilter);
      }
      setGames(Array.isArray(results) ? results : []);
    } else {
      console.log("No searchResults in localStorage. Possibly user visited /results directly.");
      setGames([]);
    }
    setLoading(false);
  }, [playersFilter, complexityFilter, playtimeFilter, genreFilter, ageFilter, themeFilter]);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Fixed Header with Back Button */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-300 dark:border-gray-600">
        <h1 className="text-4xl sm:text-6xl font-bold">Search Results</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          Back
        </button>
      </header>

      {/* Results Section */}
      <section className="px-6 py-4">
        {loading && <p>Loading...</p>}
        {!loading && games.length > 0 ? (
          <div className="mt-6 overflow-y-auto max-h-[70vh]">
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {games.map((game) => (
                <li
                  key={game.id!}
                  className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow hover:shadow-lg transition"
                >
                  <Link href={`/game/${game.id}`} className="block">
                    <h3 className="font-semibold mb-2">{game.name}</h3>
                    {game.thumbnail ? (
                      <Image
                        src={game.thumbnail}
                        alt={`${game.name} thumbnail`}
                        width={200}
                        height={150}
                        className="w-full h-[150px] object-cover rounded mb-2"
                      />
                    ) : (
                      <div className="w-full h-[150px] bg-gray-300 flex items-center justify-center rounded mb-2">
                        <span>No Image Available</span>
                      </div>
                    )}
                    {game.description && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                        {cleanDescription(game.description)}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          !loading && <p>No games found. Try a different search or adjust your filters.</p>
        )}
      </section>
    </main>
  );
}
