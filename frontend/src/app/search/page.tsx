"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchGames } from "@/utils/fetchGames";
import { fetchDetailedGames } from "@/utils/fetchDetailedGames";

function chunkArray(arr: any[], size: number) {
  const results = [];
  for (let i = 0; i < arr.length; i += size) {
    results.push(arr.slice(i, i + size));
  }
  return results;
}

export default function SearchForm() {
  const router = useRouter();

  // Filters state
  const [players, setPlayers] = useState("any");
  const [complexity, setComplexity] = useState("any");
  const [playtime, setPlaytime] = useState("any");
  const [genre, setGenre] = useState("any");
  const [age, setAge] = useState("any");
  const [theme, setTheme] = useState("any");

  // Search query state
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build URL query parameters for filters.
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("query", searchQuery);
    }
    params.set("players", players);
    params.set("complexity", complexity);
    params.set("playtime", playtime);
    params.set("genre", genre);
    params.set("age", age);
    params.set("theme", theme);

    // 1. Fetch basic results (IDs and minimal info)
    const basicResults = await fetchGames(searchQuery);
    console.log("Basic search results:", basicResults);

    // Extract IDs from basic results
    const allIds = basicResults.map((game) => game.id);

    // 2. Chunk IDs into groups of 20
    const idChunks = chunkArray(allIds, 20);

    let detailedResults: any[] = [];
    // 3. For each chunk, fetch detailed game info
    for (const chunk of idChunks) {
      const details = await fetchDetailedGames(chunk);
      detailedResults = detailedResults.concat(details);
    }

    // Store detailed results in localStorage
    localStorage.setItem("searchResults", JSON.stringify(detailedResults));

    // Navigate to the results page with query parameters.
    router.push(`/results?${params.toString()}`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)] px-6">
      <h1 className="text-4xl sm:text-6xl font-bold text-center mb-10">
        Find Your Next Board Game
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-red-200 dark:bg-red-800 p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-rows-1 md:grid-rows-2 gap-4">
          {/* Number of Players */}
          <div>
            <label htmlFor="players" className="block mb-1">
              Number of Players
            </label>
            <select
              id="players"
              value={players}
              onChange={(e) => setPlayers(e.target.value)}
              className="w-full p-2 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              <option value="any">Any</option>
              <option value="2">2 Players</option>
              <option value="3-4">3-4 Players</option>
              <option value="5+">5+ Players</option>
            </select>
          </div>

          {/* Complexity */}
          <div>
            <label htmlFor="complexity" className="block font-semibold mb-1">
              Complexity
            </label>
            <select
              id="complexity"
              value={complexity}
              onChange={(e) => setComplexity(e.target.value)}
              className="w-full p-2 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              <option value="any">Any</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Play Time */}
          <div>
            <label htmlFor="playtime" className="block font-semibold mb-1">
              Play Time
            </label>
            <select
              id="playtime"
              value={playtime}
              onChange={(e) => setPlaytime(e.target.value)}
              className="w-full p-2 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              <option value="any">Any</option>
              <option value="short">Short (30 min or less)</option>
              <option value="medium">Medium (30-60 min)</option>
              <option value="long">Long (60+ min)</option>
            </select>
          </div>

          {/* Genre */}
          <div>
            <label htmlFor="genre" className="block font-semibold mb-1">
              Genre
            </label>
            <select
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full p-2 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              <option value="any">Any</option>
              <option value="strategy">Strategy</option>
              <option value="party">Party</option>
              <option value="family">Family</option>
              <option value="adventure">Adventure</option>
            </select>
          </div>

          {/* Age Rating */}
          <div>
            <label htmlFor="age" className="block font-semibold mb-1">
              Age Rating
            </label>
            <select
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full p-2 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              <option value="any">Any</option>
              <option value="kids">Kids (5+)</option>
              <option value="teen">Teen (13+)</option>
              <option value="adult">Adult (18+)</option>
            </select>
          </div>

          {/* Theme */}
          <div>
            <label htmlFor="theme" className="block font-semibold mb-1">
              Theme
            </label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full p-2 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              <option value="any">Any</option>
              <option value="fantasy">Fantasy</option>
              <option value="sci-fi">Sci-Fi</option>
              <option value="horror">Horror</option>
              <option value="historical">Historical</option>
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
          type="submit"
          className="mt-4 px-6 py-3 text-lg font-semibold rounded-lg transition bg-gray-400 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 text-[var(--foreground)]"
        >
          Search
        </button>
      </form>
    </main>
  );
}