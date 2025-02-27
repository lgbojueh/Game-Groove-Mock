"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchGames } from "@/utils/fetchGames";
import { fetchDetailedGames } from "@/utils/fetchDetailedGames";

function chunkArray(arr: any[], size: number) {
  const results = [];
  for (let i = 0; i < arr.length; i += size) {
    results.push(arr.slice(i, i + size));
  }
  return results;
}

// Define an interface for our game object (with optional description)
interface BasicGame {
  id: string | null;
  name: string;
  thumbnail: string;
  description?: string;
  // other dummy filter attributes (if needed)
  summary?: string;
  complexity?: string;
  players?: string;
  theme?: string;
}

export default function Games() {
  const [games, setGames] = useState<BasicGame[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch default games (using "board game" as a generic query)
  const getDefaultGames = async () => {
    setLoading(true);
    // 1. Fetch basic results
    const basicResults = (await fetchGames("board game")) as BasicGame[];
    // 2. Extract all IDs
    const allIds = basicResults.map((game) => game.id);
    // 3. Chunk IDs into groups of 20
    const idChunks = chunkArray(allIds, 20);
    let detailedResults: BasicGame[] = [];
    // 4. For each chunk, fetch detailed data
    for (const chunk of idChunks) {
      const details = await fetchDetailedGames(chunk);
      detailedResults = detailedResults.concat(details);
    }
    // 5. Merge detailed data (description and updated thumbnail) into basic results
    for (const detail of detailedResults) {
      const idx = basicResults.findIndex((b) => b.id === detail.id);
      if (idx !== -1) {
        basicResults[idx].thumbnail = detail.thumbnail;
        basicResults[idx].description = detail.description;
      }
    }
    setGames(basicResults);
    setLoading(false);
  };

  // Handle search submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let basicResults: BasicGame[] = [];
    if (searchQuery.trim() === "") {
      basicResults = (await fetchGames("board game")) as BasicGame[];
    } else {
      basicResults = (await fetchGames(searchQuery)) as BasicGame[];
    }
    // Extract IDs and perform chunking as before
    const allIds = basicResults.map((game) => game.id);
    const idChunks = chunkArray(allIds, 20);
    let detailedResults: BasicGame[] = [];
    for (const chunk of idChunks) {
      const details = await fetchDetailedGames(chunk);
      detailedResults = detailedResults.concat(details);
    }
    // Merge detailed data into basic results
    for (const detail of detailedResults) {
      const idx = basicResults.findIndex((b) => b.id === detail.id);
      if (idx !== -1) {
        basicResults[idx].thumbnail = detail.thumbnail;
        basicResults[idx].description = detail.description;
      }
    }
    setGames(basicResults);
    setLoading(false);
  };

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <h1 className="text-4xl font-bold mb-4">All Games</h1>
      <form onSubmit={handleSearch} className="mb-4 flex">
        <input
          type="text"
          placeholder="Search games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 p-2 rounded flex-grow mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Search
        </button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : (
        // Scrollable container with a maximum height set
        <div className="overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => (
              <Link key={game.id ?? ""} href={`/game/${game.id}`} className="block">
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow hover:shadow-lg transition">
                  {game.thumbnail ? (
                    <Image
                      src={game.thumbnail}
                      alt={`${game.name} thumbnail`}
                      width={400}
                      height={160}
                      className="w-full h-40 object-cover rounded mb-2"
                    />
                  ) : (
                    <Image
                      src="/default-game-thumbnail.jpg"
                      alt="Default game thumbnail"
                      width={400}
                      height={160}
                      className="w-full h-40 object-cover rounded mb-2"
                    />
                  )}
                  <h2 className="font-semibold text-lg mb-1">{game.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {game.description ||
                      game.summary ||
                      "A fun and engaging game that you'll enjoy with friends and family."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}