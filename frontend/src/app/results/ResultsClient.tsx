// src/app/results/ResultsClient.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cleanDescription, shortenDescription } from "@/utils/cleanup";

interface BasicGame {
  id: string;
  name: string;
  thumbnail: string;
  description?: string;
  players?: string;
  complexity?: string;
  playtime?: string;
  genre?: string;
  age?: string;
  theme?: string;
}

export default function ResultsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [games, setGames] = useState<BasicGame[]>([]);
  const [loading, setLoading] = useState(true);

  // Use the stringified query so useEffect only fires when the actual params change
  const queryString = searchParams.toString();

  useEffect(() => {
    // pull out all selected filters
    const players    = searchParams.getAll("players");
    const complexity = searchParams.getAll("complexity");
    const playtime   = searchParams.getAll("playtime");
    const genre      = searchParams.getAll("genre");
    const age        = searchParams.getAll("age");
    const theme      = searchParams.getAll("theme");

    // grab cached results
    const stored = localStorage.getItem("searchResults");
    let results: BasicGame[] = stored ? JSON.parse(stored) : [];

    // filter helper
    const applyFilter = (
      selected: string[],
      prop: keyof BasicGame,
      list: BasicGame[]
    ) =>
      selected.length === 0
        ? list
        : list.filter((g) => g[prop] != null && selected.includes(g[prop]!));

    // run through each filter
    results = applyFilter(players,    "players",    results);
    results = applyFilter(complexity, "complexity", results);
    results = applyFilter(playtime,   "playtime",   results);
    results = applyFilter(genre,      "genre",      results);
    results = applyFilter(age,        "age",        results);
    results = applyFilter(theme,      "theme",      results);

    // clean & shorten descriptions
    const cleaned = results.map((g) => ({
      ...g,
      description: shortenDescription(cleanDescription(g.description)),
    }));

    setGames(cleaned);
    setLoading(false);
  }, [queryString, searchParams]);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-4xl font-bold">Search Results</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500"
        >
          Back
        </button>
      </header>

      <section className="px-6 py-4">
        {loading && <p>Loading…</p>}

        {!loading && games.length > 0 && (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => (
              <li
                key={game.id}
                className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow"
              >
                <Link href={`/game/${game.id}`}>
                  <h3 className="font-semibold mb-2">{game.name}</h3>
                  {game.thumbnail ? (
                    <Image
                      src={game.thumbnail}
                      alt={`${game.name} thumbnail`}
                      width={200}
                      height={150}
                      className="w-full h-36 object-cover rounded mb-2"
                    />
                  ) : (
                    <div className="w-full h-36 bg-gray-300 flex items-center justify-center rounded mb-2">
                      <span>No Image</span>
                    </div>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {game.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {!loading && games.length === 0 && (
          <p>No games found matching your filters. Try broadening your search.</p>
        )}
      </section>
    </main>
  );
}
