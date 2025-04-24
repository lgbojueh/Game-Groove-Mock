"use client";

import { useState, useEffect } from "react";
import { fetchHotGames } from "@/utils/fetchHotGames";
import { fetchDetailedGames } from "@/utils/fetchDetailedGames";
import { cleanDescription, shortenDescription } from "@/utils/cleanup";
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
  id: string;
  name: string;
  thumbnail: string;
  description?: string;
  complexity?: string;
  players?: string;
  theme?: string;
}

export default function FeaturedClient() {
  const [popularGames, setPopularGames] = useState<BasicGame[]>([]);
  const [loading, setLoading] = useState(false);

  const getPopularGames = async () => {
    setLoading(true);
    try {
      const basicGames = (await fetchHotGames()) as BasicGame[];
      const validGames = basicGames.filter((game) => game.id !== null) as BasicGame[];

      const idChunks = chunkArray(validGames.map((g) => g.id), 20);
      let detailedResults: BasicGame[] = [];

      for (const chunk of idChunks) {
        const details = await fetchDetailedGames(chunk);
        detailedResults = detailedResults.concat(details as BasicGame[]);
      }

      // merge details into validGames
      validGames.forEach((game) => {
        const det = detailedResults.find((d) => d.id === game.id);
        if (det) {
          game.thumbnail = det.thumbnail;
          game.description = det.description;
        }
      });

      setPopularGames(validGames);
    } catch (err) {
      console.error("Error fetching featured games:", err);
      setPopularGames([]);
    } finally {
      setLoading(false);
    }
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
                  key={game.id}
                  className="p-4 bg-gray-400 dark:bg-gray-700 rounded shadow hover:shadow-xl transition flex flex-col"
                >
                  <Link href={`/game/${game.id}`} className="block">
                    <h3 className="font-semibold mb-2 text-lg">{game.name}</h3>
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
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-300 flex-1">
                    {shortenDescription(cleanDescription(game.description ?? "")) ||
                      "A brief description of the game."}
                  </p>
                  <a
                    href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(
                      game.name + " board game"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-center"
                  >
                    Buy on Google
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}