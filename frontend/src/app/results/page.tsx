"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import he from "he"; // ✅ Import HTML entities decoder

// Helper to clean unwanted line break codes from descriptions.
const cleanDescription = (desc?: string) => {
  return desc ? he.decode(desc.replace(/&#10;/g, " ")) : "";
}; 

// Define an interface for your detailed game objects.
interface BasicGame {
  id: string | null;
  name: string;
  thumbnail: string;
  description?: string;
  yearpublished?: string;
  minage?: string;
  minplayers?: string;
  maxplayers?: string;
  playingtime?: string;
  averageRating?: string;
  averageWeight?: string;
  players?: string;
  complexity?: string;
  playtime?: string;
  genre?: string;
  age?: string;
  theme?: string;
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read filter query parameters.
  const query = searchParams.get("query") || "";
  const players = searchParams.get("players") || "any";
  const complexity = searchParams.get("complexity") || "any";
  const playtime = searchParams.get("playtime") || "any";
  const genre = searchParams.get("genre") || "any";
  const age = searchParams.get("age") || "any";
  const theme = searchParams.get("theme") || "any";

  // Additional filters (if you add these in your UI)
  const yearMin = searchParams.get("yearMin");
  const yearMax = searchParams.get("yearMax");
  const minAge = searchParams.get("minAge");
  const ratingMin = searchParams.get("ratingMin");
  const ratingMax = searchParams.get("ratingMax");
  const weightMin = searchParams.get("weightMin");
  const weightMax = searchParams.get("weightMax");

  const [games, setGames] = useState<BasicGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve detailed game objects from localStorage.
    const stored = localStorage.getItem("searchResults");
    let results: BasicGame[] = stored ? JSON.parse(stored) : [];

    console.log("Stored searchResults:", results);
    console.log("Current filters:", {
      players,
      complexity,
      playtime,
      genre,
      age,
      theme,
      yearMin,
      yearMax,
      minAge,
      ratingMin,
      ratingMax,
      weightMin,
      weightMax,
    });

    // Apply additional filters if provided.
    if (yearMin) {
      results = results.filter(
        (game) =>
          game.yearpublished &&
          parseInt(game.yearpublished, 10) >= parseInt(yearMin, 10)
      );
    }
    if (yearMax) {
      results = results.filter(
        (game) =>
          game.yearpublished &&
          parseInt(game.yearpublished, 10) <= parseInt(yearMax, 10)
      );
    }
    if (minAge) {
      results = results.filter(
        (game) =>
          game.minage && parseInt(game.minage, 10) >= parseInt(minAge, 10)
      );
    }
    if (ratingMin) {
      results = results.filter(
        (game) =>
          game.averageRating &&
          parseFloat(game.averageRating) >= parseFloat(ratingMin)
      );
    }
    if (ratingMax) {
      results = results.filter(
        (game) =>
          game.averageRating &&
          parseFloat(game.averageRating) <= parseFloat(ratingMax)
      );
    }
    if (weightMin) {
      results = results.filter(
        (game) =>
          game.averageWeight &&
          parseFloat(game.averageWeight) >= parseFloat(weightMin)
      );
    }
    if (weightMax) {
      results = results.filter(
        (game) =>
          game.averageWeight &&
          parseFloat(game.averageWeight) <= parseFloat(weightMax)
      );
    }

    // Apply the original filters.
    if (players !== "any") {
      results = results.filter((game) => game.players === players);
    }
    if (complexity !== "any") {
      results = results.filter((game) => game.complexity === complexity);
    }
    if (playtime !== "any") {
      results = results.filter((game) => game.playtime === playtime);
    }
    if (genre !== "any") {
      results = results.filter((game) => game.genre === genre);
    }
    if (age !== "any") {
      results = results.filter((game) => game.age === age);
    }
    if (theme !== "any") {
      results = results.filter((game) => game.theme === theme);
    }

    console.log("Filtered results:", results);
    setGames(Array.isArray(results) ? results : []);
    setLoading(false);
  }, [
    players,
    complexity,
    playtime,
    genre,
    age,
    theme,
    yearMin,
    yearMax,
    minAge,
    ratingMin,
    ratingMax,
    weightMin,
    weightMax,
  ]);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-300 dark:border-gray-600">
        <h1 className="text-4xl sm:text-6xl font-bold">Search Results</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          Back
        </button>
      </header>
      <section className="px-6 py-4">
        {loading && <p>Loading...</p>}
        {!loading && games.length > 0 && (
          <div className="mt-6 overflow-y-auto max-h-[70vh]">
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {games.map((game) => (
                <li
                  key={game.id!}
                  className="p-4 bg-gray-400 dark:bg-gray-700 rounded shadow hover:shadow-lg transition"
                >
                  <Link href={`/game/${game.id}`} className="block">
                    <h3 className="font-semibold mb-2">{game.name}</h3>
                    {game.thumbnail ? (
                    <img
                      src={game.thumbnail}
                      alt={`${game.name} thumbnail`}
                      width={200}
                      height={150}
                      className="w-full h-[150px] object-cover rounded mb-2"
                    />
                  ) : (
                    <div className="w-full h-[150px] bg-gray-300 flex items-center justify-center rounded mb-2">
                      <span>No Image Available</span>
                    </div>
                  )}
                    {game.description && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                        {cleanDescription(game.description)}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {!loading && games.length === 0 && (
          <p>No games found. Try a different search or adjust your filters.</p>
        )}
      </section>
    </main>
  );
}