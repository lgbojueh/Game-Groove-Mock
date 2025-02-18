"use client";
import { useState, useEffect } from "react";
import { fetchHotGames } from "@/utils/fetchHotGames";

export default function Featured() {
  const [popularGames, setPopularGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Dummy arrays for demonstration.
  // Replace these with real data as needed.
  const topRatedGames: any[] = [
    // Example:
    // { id: '1', name: 'Top Game 1', thumbnail: 'url', summary: '...' },
  ];
  const favoriteGames: any[] = [
    // Example:
    // { id: '2', name: 'Favorite Game 1', thumbnail: 'url', summary: '...' },
  ];

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

      {/* Popular Games Section */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Popular Games</h2>
        {loading ? (
          <p>Loading popular games...</p>
        ) : (
          <div className="overflow-y-auto max-h-[70vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularGames.map((game) => (
                <div key={game.id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow hover:shadow-xl transition">
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

      {/* Top Rated Games Section */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Top Rated Games</h2>
        {topRatedGames.length > 0 ? (
          <div className="overflow-y-auto max-h-[70vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topRatedGames.map((game) => (
                <div key={game.id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow hover:shadow-xl transition">
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
        ) : (
          <p>No top rated games available.</p>
        )}
      </section>

      {/* Your Favorites Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Your Favorites</h2>
        {favoriteGames.length > 0 ? (
          <div className="overflow-y-auto max-h-[70vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteGames.map((game) => (
                <div key={game.id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow hover:shadow-xl transition">
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
        ) : (
          <p>You haven't favorited any games yet.</p>
        )}
      </section>
    </main>
  );
}