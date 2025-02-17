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
        // Exact search: user provided a game name.
        console.log("🔎 Searching for exact game:", query);
        results = await fetchGames(query);
      } else {
        // Filter-based search: no exact query provided.
        const filterParams = `${players}-${complexity}-${playtime}-${genre}-${age}-${theme}`;
        console.log("🎯 Fetching recommended games with filters:", filterParams);
        results = await fetchGames(filterParams);
      }
      setGames(Array.isArray(results) ? results : []);
      setLoading(false);
      if (results.length === 0) {
        console.log("❌ No games found!");
      }
    };

    getResults();
  }, [query, players, complexity, playtime, genre, age, theme]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)] px-6">
      <h1 className="text-4xl sm:text-6xl font-bold text-center mb-10">
        Search Results
      </h1>

      {loading && <p>Loading...</p>}
      {!loading && games.length > 0 && (
        <div className="w-full max-w-3xl mt-6">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {games.map((game) => (
              <li
                key={game.id}
                className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow"
              >
                <h3 className="font-semibold">{game.name}</h3>
                {game.thumbnail && (
                  <img
                    src={game.thumbnail}
                    alt={`${game.name} thumbnail`}
                    className="mt-2 w-full object-cover"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!loading && games.length === 0 && (
        <p>No games found. Try a different search.</p>
      )}

      <button
        onClick={() => router.back()}
        className="mt-6 px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        Back
      </button>
    </main>
  );
}