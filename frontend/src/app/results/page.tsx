"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchGames } from "@/utils/fetchGames";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getResults = async () => {
      setLoading(true);
      let results = [];
      if (query.trim()) {
        // Exact search: use the provided query.
        console.log("🔎 Searching for exact game:", query);
        results = await fetchGames(query);
      } else {
        // No query provided – use a generic term to fetch a broad list.
        console.log("🎯 No exact query provided. Fetching recommended games.");
        results = await fetchGames("board game");
        // Apply client-side filtering based on selected filters.
        if (players !== "any") {
          results = results.filter((game) => game.players === players);
        }
        if (complexity !== "any") {
          results = results.filter((game) => game.complexity === complexity);
        }
        if (theme !== "any") {
          results = results.filter((game) => game.theme === theme);
        }
      }
      setGames(Array.isArray(results) ? results : []);
      setLoading(false);
      if (results.length === 0) {
        console.log("❌ No games found after filtering!");
      }
    };

    getResults();
  }, [query, players, complexity, playtime, genre, age, theme]);

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
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      <p>
                        <strong>Players:</strong> {game.players}
                      </p>
                      <p>
                        <strong>Complexity:</strong> {game.complexity}
                      </p>
                      <p>
                        <strong>Theme:</strong> {game.theme}
                      </p>
                    </div>
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