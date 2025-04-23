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

type FilterOption = { value: string; label: string };

export default function SearchForm() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // each filter is an array of selected values
  const [players, setPlayers] = useState<string[]>([]);
  const [complexity, setComplexity] = useState<string[]>([]);
  const [playtime, setPlaytime] = useState<string[]>([]);
  const [genre, setGenre] = useState<string[]>([]);
  const [age, setAge] = useState<string[]>([]);
  const [theme, setTheme] = useState<string[]>([]);

  const filters: {
    id: string;
    label: string;
    options: FilterOption[];
    selected: string[];
    setSelected: (vals: string[]) => void;
  }[] = [
    {
      id: "players",
      label: "Number of Players",
      options: [
        { value: "2", label: "2 Players" },
        { value: "3-4", label: "3–4 Players" },
        { value: "5+", label: "5+ Players" },
      ],
      selected: players,
      setSelected: setPlayers,
    },
    {
      id: "complexity",
      label: "Complexity",
      options: [
        { value: "easy", label: "Easy" },
        { value: "medium", label: "Medium" },
        { value: "hard", label: "Hard" },
      ],
      selected: complexity,
      setSelected: setComplexity,
    },
    {
      id: "playtime",
      label: "Play Time",
      options: [
        { value: "short", label: "Short (≤30 min)" },
        { value: "medium", label: "Medium (30–60 min)" },
        { value: "long", label: "Long (60+ min)" },
      ],
      selected: playtime,
      setSelected: setPlaytime,
    },
    {
      id: "genre",
      label: "Genre",
      options: [
        { value: "strategy", label: "Strategy" },
        { value: "party", label: "Party" },
        { value: "family", label: "Family" },
        { value: "adventure", label: "Adventure" },
      ],
      selected: genre,
      setSelected: setGenre,
    },
    {
      id: "age",
      label: "Age Rating",
      options: [
        { value: "kids", label: "Kids (5+)" },
        { value: "teen", label: "Teen (13+)" },
        { value: "adult", label: "Adult (18+)" },
      ],
      selected: age,
      setSelected: setAge,
    },
    {
      id: "theme",
      label: "Theme",
      options: [
        { value: "fantasy", label: "Fantasy" },
        { value: "sci-fi", label: "Sci-Fi" },
        { value: "horror", label: "Horror" },
        { value: "historical", label: "Historical" },
      ],
      selected: theme,
      setSelected: setTheme,
    },
  ];

  const toggleValue = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    if (arr.includes(val)) setArr(arr.filter((x) => x !== val));
    else setArr([...arr, val]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim() || "board game";

    // fetch basic → detailed, store for results page
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

    // build query params (multiple values allowed)
    const params = new URLSearchParams();
    params.set("query", q);
    filters.forEach((f) =>
      f.selected.forEach((v) => params.append(f.id, v))
    );

    router.push(`/results?${params.toString()}`);
  };

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <h1 className="text-4xl sm:text-6xl font-bold text-center mb-8">
        Find Your Next Board Game
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg grid gap-6 md:grid-cols-2"
      >
        {/* Render each filter as a checkbox group */}
        {filters.map((f) => (
          <fieldset key={f.id} className="border border-gray-300 dark:border-gray-600 rounded p-4">
            <legend className="font-semibold mb-2">{f.label}</legend>
            <div className="flex flex-col space-y-2">
              {f.options.map((opt) => (
                <label key={opt.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={f.selected.includes(opt.value)}
                    onChange={() => toggleValue(f.selected, f.setSelected, opt.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        {/* Search bar spans full width */}
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
          className="md:col-span-2 py-3 text-lg font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
        >
          Search
        </button>
      </form>
    </main>
  );
}
