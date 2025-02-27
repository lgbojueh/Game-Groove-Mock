"use client";
import { useState, useEffect } from "react";
import { fetchHotGames } from "@/utils/fetchHotGames";
import { fetchDetailedGames } from "@/utils/fetchDetailedGames";

// Define a game interface with an optional description.
interface BasicGame {
  id: string | null;
  name: string;
  thumbnail: string;
  description?: string;
}

function chunkArray(arr: any[], size: number): any[] {
  const results = [];
  for (let i = 0; i < arr.length; i += size) {
    results.push(arr.slice(i, i + size));
  }
  return results;
}

export default function Featured() {
  const [popularGames, setPopularGames] = useState<BasicGame[]>([]);
  const [loading, setLoading] = useState(false);

  const getPopularGames = async () => {
    setLoading(true);

    // 1. Fetch the basic list using fetchHotGames (which returns basic data)
    const basicGames = await fetchHotGames();
    // Cast the basic results to our BasicGame type.
    const basicGamesTyped = basicGames as BasicGame[];

    // 2. Extract IDs from the basic results.
    const allIds = basicGamesTyped.map((game) => game.id);
    // 3. Chunk the IDs into groups of 20.
    const idChunks = chunkArray(allIds, 20);

    let detailedResults: BasicGame[] = [];
    // 4. For each chunk, fetch detailed game info
    for (const chunk of idChunks) {
      const details = await fetchDetailedGames(chunk); // should return array with description
      detailedResults = detailedResults.concat(details);
    }

    // 5. Merge detailed info (like description) into basic games
    for (const detail of detailedResults) {
      const idx = basicGamesTyped.findIndex((b) => b.id === detail.id);
      if (idx !== -1) {
        basicGamesTyped[idx].thumbnail = detail.thumbnail;
        basicGamesTyped[idx].description = detail.description;
      }
    }

    setPopularGames(basicGamesTyped);
    setLoading(false);
  };

  useEffect(() => {
    getPopularGames();
  }, []);

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Featured Games</h1>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Popular Games</h2>
        {loading ? (
          <p>Loading popular games...</p>
        ) : (
          <div className="overflow-y-auto max-h-[70vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularGames.map((game) => (
                <div
                  key={game.id ?? ""}
                  className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow hover:shadow-xl transition"
                >
                  <h3 className="font-semibold mb-2">{game.name}</h3>
                  {game.thumbnail ? (
                    <img
                      src={game.thumbnail}
                      alt={`${game.name} thumbnail`}
                      className="w-full h-48 object-cover rounded mb-2"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-300 flex items-center justify-center rounded mb-2">
                      <span>No Image Available</span>
                    </div>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {game.description || "A brief description of the game."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}