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

  // now arrays instead of single values
  const [players, setPlayers] = useState<string[]>([]);
  const [complexity, setComplexity] = useState<string[]>([]);
  const [playtime, setPlaytime] = useState<string[]>([]);
  const [genre, setGenre] = useState<string[]>([]);
  const [age, setAge] = useState<string[]>([]);
  const [theme, setTheme] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const q = searchQuery.trim() || "board game";

    // fetch & store detailed results
    const basic = await fetchGames(q);
    const ids = basic.map((g) => g.id!).filter(Boolean);
    const chunks = chunkArray(ids, 20);
    const detailed: BasicGame[] = [];
    for (const c of chunks) {
      const dets = await fetchDetailedGames(c);
      detailed.push(
        ...dets.map((g) => ({
          ...g,
          description: shortenDescription(cleanDescription(g.description)),
        }))
      );
    }
    localStorage.setItem("searchResults", JSON.stringify(detailed));

    // build params with multiple values
    const params = new URLSearchParams();
    params.set("query", q);
    players.forEach((v) => params.append("players", v));
    complexity.forEach((v) => params.append("complexity", v));
    playtime.forEach((v) => params.append("playtime", v));
    genre.forEach((v) => params.append("genre", v));
    age.forEach((v) => params.append("age", v));
    theme.forEach((v) => params.append("theme", v));

    router.push(`/results?${params.toString()}`);
  };

  const mkMulti = (
    id: string,
    label: string,
    opts: { value: string; label: string }[],
    sel: string[],
    onChange: (arr: string[]) => void
  ) => (
    <div>
      <label htmlFor={id} className="block font-semibold mb-1">
        {label}
      </label>
      <select
        id={id}
        multiple
        value={sel}
        onChange={(e) =>
          onChange(Array.from(e.target.selectedOptions, (o) => o.value))
        }
        className="w-full p-2 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
      >
        {opts.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Find Your Next Board Game
      </h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-red-600 dark:bg-red-400 p-6 rounded-lg shadow-md grid gap-4 md:grid-cols-2"
      >
        {mkMulti(
          "players",
          "Number of Players",
          [
            { value: "2", label: "2 Players" },
            { value: "3-4", label: "3–4 Players" },
            { value: "5+", label: "5+ Players" },
          ],
          players,
          setPlayers
        )}

        {mkMulti(
          "complexity",
          "Complexity",
          [
            { value: "easy", label: "Easy" },
            { value: "medium", label: "Medium" },
            { value: "hard", label: "Hard" },
          ],
          complexity,
          setComplexity
        )}

        {mkMulti(
          "playtime",
          "Play Time",
          [
            { value: "short", label: "Short (≤30m)" },
            { value: "medium", label: "Medium (30–60m)" },
            { value: "long", label: "Long (60m+)" },
          ],
          playtime,
          setPlaytime
        )}

        {mkMulti(
          "genre",
          "Genre",
          [
            { value: "strategy", label: "Strategy" },
            { value: "party", label: "Party" },
            { value: "family", label: "Family" },
            { value: "adventure", label: "Adventure" },
          ],
          genre,
          setGenre
        )}

        {mkMulti(
          "age",
          "Age Rating",
          [
            { value: "kids", label: "Kids (5+)" },
            { value: "teen", label: "Teen (13+)" },
            { value: "adult", label: "Adult (18+)" },
          ],
          age,
          setAge
        )}

        {mkMulti(
          "theme",
          "Theme",
          [
            { value: "fantasy", label: "Fantasy" },
            { value: "sci-fi", label: "Sci-Fi" },
            { value: "horror", label: "Horror" },
            { value: "historical", label: "Historical" },
          ],
          theme,
          setTheme
        )}

        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="Search for a game…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600"
            aria-label="Search Games"
          />
        </div>

        <button
          type="submit"
          className="md:col-span-2 mt-2 w-full px-6 py-3 text-lg font-semibold rounded-lg bg-blue-400 hover:bg-blue-500 transition text-white"
        >
          Search
        </button>
      </form>
    </main>
  );
}
