"use client";
import { useState, useEffect } from "react";
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
          <div className="overflow-y-auto max-h-[70vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularGames.map((game) => (
                <div
                  key={game.id}
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
                    {game.summary || "A brief description of the game."}
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