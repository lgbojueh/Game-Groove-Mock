// src/app/search/SearchClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import GameCamera from "@/components/GameCamera";
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

export default function SearchClient() {
  const router = useRouter();

  // Camera recognition state
  const [showCam, setShowCam] = useState(false);
  const [recognition, setRecognition] = useState<{
    id: string;
    name: string;
    thumbnail: string;
  } | null>(null);

  // Text search & filters
  const [searchQuery, setSearchQuery] = useState("");
  const [players, setPlayers] = useState<string[]>([]);
  const [complexity, setComplexity] = useState<string[]>([]);
  const [playtime, setPlaytime] = useState<string[]>([]);
  const [genre, setGenre] = useState<string[]>([]);
  const [age, setAge] = useState<string[]>([]);
  const [theme, setTheme] = useState<string[]>([]);

  const filters = [
    {
      id: "players" as const,
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
      id: "complexity" as const,
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
      id: "playtime" as const,
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
      id: "genre" as const,
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
      id: "age" as const,
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
      id: "theme" as const,
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

  const toggleValue = (
    arr: string[],
    setArr: (vals: string[]) => void,
    val: string
  ) => {
    if (arr.includes(val)) setArr(arr.filter((x) => x !== val));
    else setArr([...arr, val]);
  };

  // Handle camera capture & recognition
  const handleCapture = async (blob: Blob) => {
    setShowCam(false);
    const form = new FormData();
    form.append("photo", blob, "snap.jpg");
    const res = await fetch("/api/recognize", { method: "POST", body: form });
    if (res.ok) {
      const info = await res.json();
      setRecognition(info);
    } else {
      console.error("Recognition failed");
    }
  };

  // Handle traditional text+filter search
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim() || "board game";

    // 1) fetch summaries + details
    const basic = await fetchGames(q);
    const ids = basic.map((g) => g.id!).filter(Boolean);
    const detailed: BasicGame[] = [];
    for (const chunk of chunkArray(ids, 20)) {
      const dets = await fetchDetailedGames(chunk);
      detailed.push(
        ...dets.map((g) => ({
          ...g,
          description: shortenDescription(cleanDescription(g.description)),
        }))
      );
    }
    localStorage.setItem("searchResults", JSON.stringify(detailed));

    // 2) push into your Results page with filters
    const params = new URLSearchParams();
    params.set("query", q);
    filters.forEach((f) =>
      f.selected.forEach((v) => params.append(f.id, v))
    );
    router.push(`/results?${params.toString()}`);
  };

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      {/* Camera / Recognition UI */}
      <div className="text-center mb-8">
        <button
          onClick={() => setShowCam(true)}
          className="px-6 py-3 bg-[#800020] text-white rounded-lg shadow hover:bg-red-700 transition"
        >
          📷 Use Camera to Identify
        </button>
      </div>

      {recognition && (
        <div className="mb-8 mx-auto max-w-xl p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md flex items-center space-x-4">
          <Image
            src={recognition.thumbnail}
            alt={recognition.name}
            width={96}
            height={96}
            className="object-cover rounded"
            unoptimized
          />
          <div>
            <h2 className="text-2xl font-semibold">{recognition.name}</h2>
            <Link
              href={`/game/${recognition.id}`}
              className="mt-2 inline-block text-blue-600 hover:underline"
            >
              View Details →
            </Link>
          </div>
        </div>
      )}

      {showCam && (
        <GameCamera onCapture={handleCapture} onClose={() => setShowCam(false)} />
      )}

      {/* Traditional Text Search + Filters Form */}
      <form
        onSubmit={handleSubmit}
        className="
          max-w-4xl mx-auto
          bg-gray-50 dark:bg-gray-800
          p-6 rounded-xl shadow-lg
          grid gap-6 md:grid-cols-2
        "
      >
        {filters.map((f) => (
          <fieldset
            key={f.id}
            className="
              bg-gray-100 dark:bg-gray-700
              border border-gray-300 dark:border-gray-600
              rounded p-4
            "
          >
            <legend className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
              {f.label}
            </legend>
            <div className="flex flex-col space-y-2">
              {f.options.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center space-x-2 text-gray-900 dark:text-gray-100"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-red-600 focus:ring-red-500"
                    checked={f.selected.includes(opt.value)}
                    onChange={() =>
                      toggleValue(f.selected, f.setSelected, opt.value)
                    }
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="Search for a game…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              w-full p-3 rounded-lg
              bg-gray-100 dark:bg-gray-900
              text-black dark:text-white
              placeholder-gray-500 dark:placeholder-gray-400
              border border-gray-300 dark:border-gray-600
              focus:outline-none focus:ring-2 focus:ring-red-500
            "
          />
        </div>

        <button
          type="submit"
          className="md:col-span-2 py-3 text-lg font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
        >
          Search
        </button>
      </form>
    </main>
  );
}
