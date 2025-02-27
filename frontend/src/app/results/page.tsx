"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read query parameters
  const query = searchParams.get("query") || "";
  const players = searchParams.get("players") || "any";
  const complexity = searchParams.get("complexity") || "any";
  const playtime = searchParams.get("playtime") || "any";
  const genre = searchParams.get("genre") || "any";
  const age = searchParams.get("age") || "any";
  const theme = searchParams.get("theme") || "any";

  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Read the final detailed results (with thumbnails) from localStorage
    const stored = localStorage.getItem("searchResults");
    if (stored) {
      let results = JSON.parse(stored);

      // 2. Apply client-side filtering if needed
      // If the user typed a query, you can optionally check it, but typically
      // you’ve already used the query in your chunk-based approach. 
      // However, if you want to further filter by "players", "complexity", etc., do it here:

      if (players !== "any") {
        results = results.filter((game: any) => game.players === players);
      }
      if (complexity !== "any") {
        results = results.filter((game: any) => game.complexity === complexity);
      }
      if (theme !== "any") {
        results = results.filter((game: any) => game.theme === theme);
      }
      // etc., if you want to filter on playtime, genre, age, etc.

      setGames(Array.isArray(results) ? results : []);
    } else {
      // If there's no localStorage data, you could optionally redirect back to search
      console.log("No searchResults in localStorage. Possibly user visited /results directly.");
      setGames([]);
    }
    setLoading(false);
  }, [players, complexity, playtime, genre, age, theme]);

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
        {!loading && games.length > 0 && (
          <div className="mt-6 overflow-y-auto max-h-[70vh]">
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {games.map((game) => (
                <li
                  key={game.id}
                  className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow hover:shadow-lg transition"
                >
                  <a href={`/game/${game.id}`} className="block">
                    <h3 className="font-semibold mb-2">{game.name}</h3>
                    {game.thumbnail ? (
                      <img
                        src={game.thumbnail}
                        alt={`${game.name} thumbnail`}
                        className="w-full h-auto object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-300 flex items-center justify-center">
                        <span>No Image</span>
                      </div>
                    )}
                    {/* If you have more details like description or stats, you can show them here */}
                    {/* Example: */}
                    {game.description && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                        {game.description}
                      </p>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {!loading && games.length === 0 && (
          <p>No games found. Try a different search or adjust your filters.</p>
        )}
      </section>
    </main>
  );
}