"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchGames } from "@/utils/fetchGames";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filters: Get values from URL or set defaults
  const [players, setPlayers] = useState(searchParams.get("players") || "any");
  const [complexity, setComplexity] = useState(searchParams.get("complexity") || "any");
  const [playtime, setPlaytime] = useState(searchParams.get("playtime") || "any");
  const [genre, setGenre] = useState(searchParams.get("genre") || "any");
  const [age, setAge] = useState(searchParams.get("age") || "any");
  const [theme, setTheme] = useState(searchParams.get("theme") || "any");

  // Search input & results
  const [searchQuery, setSearchQuery] = useState("");
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("players", players);
    params.set("complexity", complexity);
    params.set("playtime", playtime);
    params.set("genre", genre);
    params.set("age", age);
    params.set("theme", theme);
    router.push(`/search?${params.toString()}`);
  }, [players, complexity, playtime, genre, age, theme]);

  // Handle game search
  const handleSearch = async () => {
    setLoading(true);

    let results = [];
    if (searchQuery) {
      // 🔹 Fetch a specific game if the user enters a search query
      results = await fetchGames(searchQuery);
    } else {
      // 🔹 Fetch recommended games based on filters
      const filterParams = `${players}-${complexity}-${playtime}-${genre}-${age}-${theme}`;
      results = await fetchGames(filterParams);
    }

    setGames(Array.isArray(results) ? results : []);
    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)] px-6">
      <h1 className="text-4xl sm:text-6xl font-bold text-center mb-10">
        Start Your Next Adventure Here
      </h1>

      {/* Filters Section */}
      <div className="w-full max-w-3xl bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Filters Dropdowns */}
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
          
          <div>
            <label htmlFor="playtime" className="block font-semibold mb-1">Play Time</label>
            <select id="playtime" value={playtime} onChange={(e) => setPlaytime(e.target.value)}
              className="w-full p-2 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white">
              <option value="any">Any</option>
              <option value="short">Short (30 min or less)</option>
              <option value="medium">Medium (30-60 min)</option>
              <option value="long">Long (60+ min)</option>
            </select>
          </div>

          <div>
            <label htmlFor="genre" className="block font-semibold mb-1">Genre</label>
            <select id="genre" value={genre} onChange={(e) => setGenre(e.target.value)}
              className="w-full p-2 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white">
              <option value="any">Any</option>
              <option value="strategy">Strategy</option>
              <option value="party">Party</option>
              <option value="family">Family</option>
              <option value="adventure">Adventure</option>
            </select>
          </div>
        </form>
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
            {games.map((game: any, index: number) => (
              <li key={index} className="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg shadow flex flex-col items-center">
                <img src={game.image || "/placeholder.jpg"} alt={game.name} className="w-32 h-32 rounded-lg mb-3" />
                <h2 className="text-lg font-semibold">{game.name}</h2>
                <p className="text-sm">⭐ Rating: {game.rating || "N/A"}</p>
                <p className="text-sm">🔥 Popularity: {game.popularity || "N/A"}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-gray-500">No games found. Try adjusting filters or searching for a game title.</p>
        )}
      </div>

    </main>
  );
}