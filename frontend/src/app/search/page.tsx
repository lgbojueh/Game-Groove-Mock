"use client";

import { useState } from "react";
import { fetchGames } from "@/utils/fetchGames";  // ✅ Import API function

export default function SearchPage() {
  // State for search input & game results
  const [searchQuery, setSearchQuery] = useState("");
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Handle game search
  const handleSearch = async () => {
    setLoading(true);
    const results = await fetchGames(searchQuery);
    setGames(results);
    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)] px-6">
      {/* Title */}
      <h1 className="text-4xl sm:text-6xl font-bold text-center mb-10">
        Start Your Next Adventure Here
      </h1>

      {/* Search Bar */}
      <div className="w-full max-w-md mt-6">
        <input 
          type="text" 
          placeholder="Search for a game..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600"
          aria-label="Search Games"
        />
      </div>

      {/* Search Button */}
      <button 
        onClick={handleSearch}
        className="mt-4 px-6 py-3 text-lg font-semibold rounded-lg transition
                   bg-gray-400 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600
                   text-[var(--foreground)]">
        Search
      </button>

      {/* Loading Indicator */}
      {loading && <p className="mt-4 text-gray-500">Loading games...</p>}

      {/* Display Search Results */}
      <div className="w-full max-w-3xl mt-6">
        {games.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {games.map((game, index) => (
              <li key={index} className="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg shadow">
                <h2 className="text-lg font-semibold">{game.name}</h2>
                <p className="text-sm">Game ID: {game.id}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-gray-500">No games found. Try searching for another title.</p>
        )}
      </div>

    </main>
  );
}