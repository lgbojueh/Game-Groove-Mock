"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchGames } from "@/utils/fetchGames";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filters: Get values from URL or set defaults
  const [players, setPlayers] = useState(searchParams.get("players") || "any");
  const [complexity, setComplexity] = useState(searchParams.get("complexity") || "any");
  const [playtime, setPlaytime] = useState(searchParams.get("playtime") || "any");
  const [genre, setGenre] = useState(searchParams.get("genre") || "any");
  const [age, setAge] = useState(searchParams.get("age") || "any");
  const [theme, setTheme] = useState(searchParams.get("theme") || "any");

  // Search input & results
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch results when page loads (if URL has query/filters)
  useEffect(() => {
    handleSearch();
  }, []);

  // Function to handle search
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // ✅ Prevents form reload

    setLoading(true);
    let results = [];

    if (searchQuery.trim()) {
      console.log("🔎 Searching for:", searchQuery);
      results = await fetchGames(searchQuery); // 🔹 Fetch specific game
    } else {
      const filterParams = `${players}-${complexity}-${playtime}-${genre}-${age}-${theme}`;
      console.log("🎯 Fetching recommended games with filters:", filterParams);
      results = await fetchGames(filterParams); // 🔹 Fetch recommended games
    }

    console.log("🛠 Results received:", results);
    setGames(Array.isArray(results) ? results : []);
    setLoading(false);

    // ✅ Update URL with query parameters
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    if (players !== "any") params.set("players", players);
    if (complexity !== "any") params.set("complexity", complexity);
    if (playtime !== "any") params.set("playtime", playtime);
    if (genre !== "any") params.set("genre", genre);
    if (age !== "any") params.set("age", age);
    if (theme !== "any") params.set("theme", theme);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)] px-6">
      <h1 className="text-4xl sm:text-6xl font-bold text-center mb-10">
        Start Your Next Adventure Here
      </h1>

      {/* Filters & Search Form */}
      <form onSubmit={handleSearch} className="w-full max-w-3xl bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Number of Players */}
          <div>
            <label htmlFor="players" className="block font-semibold mb-1">Number of Players</label>
            <select id="players" value={players} onChange={(e) => setPlayers(e.target.value)}
              className="w-full p-2 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white">
              <option value="any">Any</option>
              <option value="2">2 Players</option>
              <option value="3-4">3-4 Players</option>
              <option value="5+">5+ Players</option>
            </select>
          </div>

          {/* Complexity */}
          <div>
            <label htmlFor="complexity" className="block font-semibold mb-1">Complexity</label>
            <select id="complexity" value={complexity} onChange={(e) => setComplexity(e.target.value)}
              className="w-full p-2 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white">
              <option value="any">Any</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

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
          type="submit" // ✅ Ensures button submits the form
          className="mt-4 px-6 py-3 text-lg font-semibold rounded-lg transition
                     bg-gray-400 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600
                     text-[var(--foreground)]">
          Search
        </button>
      </form>

      {/* Loading Indicator */}
      {loading && <p className="mt-4 text-gray-500">Loading games...</p>}

      {/* Display Search Results */}
      <div className="w-full max-w-3xl mt-6">
        {games.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {games.map((game: any, index: number) => (
              <li key={index} className="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg shadow flex flex-col items-center">
                <img 
                  src={game.thumbnail || "/placeholder.jpg"} 
                  alt={game.name?.value || "Game"} 
                  className="w-32 h-32 rounded-lg mb-3" 
                />
                <h2 className="text-lg font-semibold">{game.name?.value || "Unknown Game"}</h2>
                <p className="text-sm">🎲 Game ID: {game.id}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-gray-500">❌ No games found. Try adjusting filters or searching again.</p>
        )}
      </div>
    </main>
  );
}