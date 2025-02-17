"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchHotGames } from "@/utils/fetchHotGames";

export default function Featured() {
  const [popularGames, setPopularGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getPopularGames = async () => {
    setLoading(true);
    const games = await fetchHotGames();
    setPopularGames(games);
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
          // Scrollable container for popular games
          <div className="overflow-y-auto max-h-[70vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularGames.map((game) => (
                <Link key={game.id} href={`/game/${game.id}`} className="block">
                  <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow hover:shadow-lg transition">
                    <h3 className="font-semibold mb-2">{game.name}</h3>
                    {game.thumbnail ? (
                      <img
                        src={game.thumbnail}
                        alt={`${game.name} thumbnail`}
                        className="w-full h-auto object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-300 flex items-center justify-center">
                        No Image
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Top Rated Games</h2>
        <p>
          BoardGameGeek’s API does not provide a direct top-rated endpoint. To display top rated games, you could:
        </p>
        <ul className="list-disc list-inside">
          <li>Fetch detailed data for a list of games and sort them by rating, or</li>
          <li>Use a curated/static list of top rated games.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Your Favorites</h2>
        <p>Your favorite games will be showcased here.</p>
      </section>
    </main>
  );
}