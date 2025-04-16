
"use client";
import { useState, useEffect } from "react";
import { fetchHotGames } from "@/utils/fetchHotGames";
import { fetchDetailedGames } from "@/utils/fetchDetailedGames";
import Link from "next/link";
import Image from "next/image";

// Helper to chunk an array into groups of a given size.
function chunkArray<T>(arr: T[], size: number): T[][] {
  const results: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    results.push(arr.slice(i, i + size));
  }
  return results;
}

// Interface for a basic game object.
interface BasicGame {
  id: string | null;
  name: string;
  thumbnail: string;
  description?: string;
  complexity?: string;
  players?: string;
  theme?: string;
}

// Helper to clean unwanted line break codes from descriptions.
const cleanDescription = (desc?: string) =>
  desc ? desc.replace(/&#10;/g, " ") : "";

export default function Featured() {
  const [popularGames, setPopularGames] = useState<BasicGame[]>([]);
  const [loading, setLoading] = useState(false);

  const getPopularGames = async () => {
    setLoading(true);
    // 1. Fetch the basic list of hot games.
    const basicGames = (await fetchHotGames()) as BasicGame[];
    const basicGamesTyped = basicGames.filter((game) => game.id !== null);

    // 2. Extract IDs and chunk them.
    const allIds = basicGamesTyped.map((game) => game.id!);
    const idChunks = chunkArray(allIds, 20);

    let detailedResults: BasicGame[] = [];
    // 3. For each chunk, fetch detailed data.
    for (const chunk of idChunks) {
      const details = await fetchDetailedGames(chunk);
      detailedResults = detailedResults.concat(details);
    }

    // 4. Merge detailed data into basic game objects.
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
                <Link key={game.id ?? ""} href={`/game/${game.id}`} className="block p-4 bg-gray-400 dark:bg-gray-700 rounded shadow hover:shadow-xl transition">
                  <h3 className="font-semibold mb-2">{game.name}</h3>
                  {game.thumbnail ? (
                    <Image
                      src={game.thumbnail}
                      alt={`${game.name} thumbnail`}
                      width={200}
                      height={150}
                      className="w-full h-[150px] object-cover rounded mb-2"
                      unoptimized={!!game.thumbnail?.startsWith("http")}
                    />
                  ) : (
                    <div className="w-full h-[150px] bg-gray-300 flex items-center justify-center rounded mb-2">
                      <span>No Image Available</span>
                    </div>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {cleanDescription(game.description) || "A brief description of the game."}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
