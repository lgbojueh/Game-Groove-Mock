// src/app/featured/FeaturedClient.tsx
"use client";

import { useState, useEffect } from "react";
import { fetchHotGames } from "@/utils/fetchHotGames";
import { fetchDetailedGames, DetailedGame } from "@/utils/fetchDetailedGames";
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

// Unified interface for featured games with high-res & low-res images
interface FeaturedGame {
  id: string;
  name: string;
  thumbnail: string; // low-res placeholder
  image: string;     // high-res cover art
  description: string;
  complexity?: string;
  players?: string;
  theme?: string;
}

export default function FeaturedClient() {
  const [popularGames, setPopularGames] = useState<FeaturedGame[]>([]);
  const [loading, setLoading] = useState(false);

  const getPopularGames = async () => {
    setLoading(true);
    try {
      // 1️⃣ Fetch the “hot” list (low-res + high-res)
      const hotGames = await fetchHotGames(); // returns HotGame[]
      // Extract IDs
      const allIds = hotGames.map((g) => g.id);
      const idChunks = chunkArray(allIds, 20);

      // 2️⃣ Fetch details in batches (includes image, thumbnail, description)
      const detailed: DetailedGame[] = [];
      for (const chunk of idChunks) {
        const batch = await fetchDetailedGames(chunk);
        detailed.push(...batch);
      }

      // 3️⃣ Merge basic + detailed into FeaturedGame[]
      const merged: FeaturedGame[] = hotGames.map((basic) => {
        const det = detailed.find((d) => d.id === basic.id);
        return {
          id: basic.id,
          name: basic.name,
          thumbnail: det?.thumbnail ?? basic.thumbnail,
          image: det?.image ?? basic.image ?? basic.thumbnail,
          description: det
            ? shortenDescription(cleanDescription(det.description))
            : "No description available.",
          complexity: det?.complexity,
          players: det?.players,
          theme: det?.theme,
        };
      });

      setPopularGames(merged);
    } catch (err) {
      console.error("❌ Error fetching featured games:", err);
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

      {loading ? (
        <p>Loading popular games...</p>
      ) : (
        <div className="overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularGames.map((game) => (
              <Link
                key={game.id}
                href={`/game/${game.id}`}
                className="block p-4 bg-gray-100 dark:bg-gray-700 rounded shadow hover:shadow-xl transition"
              >
                <h3 className="font-semibold mb-2 text-lg">{game.name}</h3>

                {game.image || game.thumbnail ? (
                  <Image
                    src={game.image || game.thumbnail}
                    alt={`${game.name} cover art`}
                    width={200}
                    height={150}
                    quality={80}
                    placeholder="blur"
                    blurDataURL={game.thumbnail}
                    className="w-full h-[150px] object-cover rounded mb-2"
                  />
                ) : (
                  <div className="w-full h-[150px] bg-gray-300 flex items-center justify-center rounded mb-2">
                    <span>No Image Available</span>
                  </div>
                )}

                <p className="text-sm text-gray-600 dark:text-gray-300 flex-1">
                  {game.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
