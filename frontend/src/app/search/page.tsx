"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchGames } from "@/utils/fetchGames";
import { fetchDetailedGames } from "@/utils/fetchDetailedGames";

// Helper to split an array into chunks
function chunkArray(arr: any[], size: number) {
  const results = [];
  for (let i = 0; i < arr.length; i += size) {
    results.push(arr.slice(i, i + size));
  }
  return results;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveQuery = searchQuery.trim() || "board game";

    const params = new URLSearchParams();
    params.set("query", effectiveQuery);
    params.set("players", players);
    params.set("complexity", complexity);
    params.set("playtime", playtime);
    params.set("genre", genre);
    params.set("age", age);
    params.set("theme", theme);

    try {
      const basicResults = await fetchGames(effectiveQuery);
      const allIds = basicResults.map((game: any) => game.id).filter(Boolean);
      const idChunks = chunkArray(allIds, 20);

      let detailedResults: any[] = [];
      for (const chunk of idChunks) {
        const details = await fetchDetailedGames(chunk);
        detailedResults = detailedResults.concat(details);
      }

      // Optional: clean up data or apply transformations here

      localStorage.setItem("searchResults", JSON.stringify(detailedResults));
      router.push(`/results?${params.toString()}`);
    } catch (err) {
      console.error("Search error:", err);
      alert("Failed to perform search. Please try again.");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)] px-6">
      <h1 className="text-4xl sm:text-6xl font-bold text-center mb-10">
        Find Your Next Board Game
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-red-600 dark:bg-red-400 p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-rows-1 md:grid-rows-2 gap-4">
          <SelectField id="players" label="Number of Players" value={players} setValue={setPlayers} options={["any", "2", "3-4", "5+"]} />
          <SelectField id="complexity" label="Complexity" value={complexity} setValue={setComplexity} options={["any", "easy", "medium", "hard"]} />
          <SelectField id="playtime" label="Play Time" value={playtime} setValue={setPlaytime} options={["any", "short", "medium", "long"]} />
          <SelectField id="genre" label="Genre" value={genre} setValue={setGenre} options={["any", "strategy", "party", "family", "adventure"]} />
          <SelectField id="age" label="Age Rating" value={age} setValue={setAge} options={["any", "kids", "teen", "adult"]} />
          <SelectField id="theme" label="Theme" value={theme} setValue={setTheme} options={["any", "fantasy", "sci-fi", "horror", "historical"]} />
        </div>

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

        <button
          type="submit"
          className="mt-4 px-6 py-3 text-lg font-semibold rounded-lg transition bg-blue-400 hover:bg-gray-500 dark:bg-blue-700 dark:hover:bg-blue-600 text-[var(--foreground)]"
        >
          Search
        </button>
      </form>
    </main>
  );
}

function SelectField({
  id,
  label,
  value,
  setValue,
  options,
}: {
  id: string;
  label: string;
  value: string;
  setValue: (val: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label htmlFor={id} className="block font-semibold mb-1">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-2 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt[0].toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
