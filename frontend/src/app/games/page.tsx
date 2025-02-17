"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchGames } from "@/utils/fetchGames";

export default function Games() {
  const [games, setGames] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch default games (using "board game" as a generic query)
  const getDefaultGames = async () => {
    setLoading(true);
    const results = await fetchGames("board game");
    setGames(results);
    setLoading(false);
  };

  useEffect(() => {
    getDefaultGames();
  }, []);

  // Handle search submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      getDefaultGames();
    } else {
      setLoading(true);
      const results = await fetchGames(searchQuery);
      setGames(results);
      setLoading(false);
    }
  };

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <h1 className="text-4xl font-bold mb-4">All Games</h1>
      <form onSubmit={handleSearch} className="mb-4 flex">
        <input
          type="text"
          placeholder="Search games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 p-2 rounded flex-grow mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Search
        </button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : (
        // Scrollable container with a maximum height set
        <div className="overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => (
              <Link key={game.id} href={`/game/${game.id}`} className="block">
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow hover:shadow-lg transition">
                  {/* Display game image if available; otherwise show a default image */}
                  {game.thumbnail ? (
                    <Image
                      src={game.thumbnail}
                      alt={`${game.name} thumbnail`}
                      width={400}
                      height={160}
                      className="w-full h-40 object-cover rounded mb-2"
                    />
                  ) : (
                    <Image
                      src="/default-game-thumbnail.jpg"
                      alt="Default game thumbnail"
                      width={400}
                      height={160}
                      className="w-full h-40 object-cover rounded mb-2"
                    />
                  )}
                  <h2 className="font-semibold text-lg mb-1">{game.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {game.summary ||
                      "A fun and engaging game that you'll enjoy with friends and family."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}