// src/app/search/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchGames } from "@/utils/fetchGames";
import { fetchDetailedGames } from "@/utils/fetchDetailedGames";
import { cleanDescription, shortenDescription } from "@/utils/cleanup";

function chunkArray<T>(arr: T[], size: number): T[][] {
  const results: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    results.push(arr.slice(i, i + size));
  }
  return results;
}

interface BasicGame {
  id: string;
  name: string;
  thumbnail: string;
  players: string;
  complexity: string;
  playtime: string;
  genre: string;
  age: string;
  theme: string;
  description?: string;
}

export default function SearchForm() {
  const router = useRouter();

  const [players, setPlayers] = useState("any");
  const [complexity, setComplexity] = useState("any");
  const [playtime, setPlaytime] = useState("any");
  const [genre, setGenre] = useState("any");
  const [age, setAge] = useState("any");
  const [theme, setTheme] = useState("any");

  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const effectiveQuery = searchQuery.trim() ? searchQuery.trim() : "board game";
    const params = new URLSearchParams();
    params.set("query", effectiveQuery);
    params.set("players", players);
    params.set("complexity", complexity);
    params.set("playtime", playtime);
    params.set("genre", genre);
    params.set("age", age);
    params.set("theme", theme);

    const basicResults = await fetchGames(effectiveQuery);
    const allIds: string[] = basicResults
      .map((game) => game.id)
      .filter((id): id is string => id !== null);
    const idChunks = chunkArray<string>(allIds, 20);

    let detailedResults: BasicGame[] = [];
    for (const chunk of idChunks) {
      const details = await fetchDetailedGames(chunk);
      const cleaned = details.map((game) => ({
        ...game,
        description: shortenDescription(cleanDescription(game.description)),
      }));
      detailedResults = detailedResults.concat(cleaned);
    }

    localStorage.setItem("searchResults", JSON.stringify(detailedResults));
    router.push(`/results?${params.toString()}`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)] px-4">
      <h1 className="text-4xl sm:text-6xl font-bold text-center mb-8">
        Find Your Next Board Game
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-red-600 dark:bg-red-400 p-4 rounded-lg shadow-md mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Number of Players */}
          <div>
            <label htmlFor="players" className="block font-semibold mb-1">
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
              <option value="3-4">3–4 Players</option>
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
              <option value="short">Short (≤30 min)</option>
              <option value="medium">Medium (30–60 min)</option>
              <option value="long">Long (≥60 min)</option>
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

        <div className="mt-4">
          <input
            type="text"
            placeholder="Search for a game..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600"
            aria-label="Search Games"
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full px-6 py-2 text-lg font-semibold rounded-lg transition bg-blue-400 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
        >
          Search
        </button>
      </form>
    </main>
  );
}
