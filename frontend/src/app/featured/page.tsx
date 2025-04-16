"use client";

import { useState, useEffect } from "react";
import { fetchHotGames } from "@/utils/fetchHotGames";
import { fetchDetailedGames } from "@/utils/fetchDetailedGames";
import Link from "next/link";
import Image from "next/image";
import he from "he";

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
  id: string;
  name: string;
  thumbnail: string;
  description?: string;
  complexity?: string;
  players?: string;
  theme?: string;
}

// Clean up encoded characters and line breaks.
const cleanDescription = (desc?: string) => {
  return desc ? he.decode(desc.replace(/&#10;/g, " ")) : "";
};

// Shorten to 250 characters
const shortenDescription = (desc?: string) => {
  if (!desc) return "";
  return desc.length > 250 ? desc.substring(0, 250) + "..." : desc;
};

export default function Featured() {
  const [popularGames, setPopularGames] = useState<BasicGame[]>([]);
  const [loading, setLoading] = useState(false);

  const getPopularGames = async () => {
    setLoading(true);
    const basicGames = await fetchHotGames();
    const filteredGames = basicGames.filter((game): game is BasicGame => !!game.id);
    const allIds = filteredGames.map((game) => game.id);
    const idChunks = chunkArray(allIds, 20);

    let detailedResults: BasicGame[] = [];
    for (const chunk of idChunks) {
      const details = await fetchDetailedGames(chunk);
      detailedResults = detailedResults.concat(details);
    }

    for (const detail of detailedResults) {
      const index = filteredGames.findIndex((g) => g.id === detail.id);
      if (index !== -1) {
        filteredGames[index] = {
          ...filteredGames[index],
          thumbnail: detail.thumbnail,
          description: detail.description,
        };
      }
    }

    setPopularGames(filteredGames);
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
                <Link
                  key={game.id}
                  href={`/game/${game.id}`}
                  className="block p-4 bg-gray-400 dark:bg-gray-700 rounded shadow hover:shadow-xl transition"
                >
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
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {shortenDescription(cleanDescription(game.description)) ||
                      "A brief description of the game."}
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
