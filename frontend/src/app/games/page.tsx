"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchGames } from "@/utils/fetchGames";
import { fetchDetailedGames } from "@/utils/fetchDetailedGames";

// Helper function to chunk an array.
function chunkArray<T>(arr: T[], size: number): T[][] {
  const results: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    results.push(arr.slice(i, i + size));
  }
  return results;
}

interface BasicGame {
  id: string | null;
  name: string;
  thumbnail: string;
  description?: string;
  complexity?: string;
  players?: string;
  theme?: string;
}

// Helper to remove unwanted line breaks.
const cleanDescription = (desc?: string) =>
  desc ? desc.replace(/&#10;/g, " ") : "";

export default function Games() {
  const [games, setGames] = useState<BasicGame[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to fetch default games (generic query "board game")
  const getDefaultGames = async () => {
    setLoading(true);
    let basicResults = (await fetchGames("board game")) as BasicGame[];
    basicResults = basicResults.filter((game) => game.id !== null);
    const allIds = basicResults.map((game) => game.id!);
    const idChunks = chunkArray(allIds, 20);
    let detailedResults: BasicGame[] = [];
    for (const chunk of idChunks) {
      const details = await fetchDetailedGames(chunk);
      detailedResults = detailedResults.concat(details);
    }
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

  // Handle search submission.
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let basicResults: BasicGame[] = [];
    if (searchQuery.trim() === "") {
      basicResults = (await fetchGames("board game")) as BasicGame[];
    } else {
      basicResults = (await fetchGames(searchQuery)) as BasicGame[];
    }
    basicResults = basicResults.filter((game) => game.id !== null);
    const allIds = basicResults.map((game) => game.id!);
    const idChunks = chunkArray(allIds, 20);
    let detailedResults: BasicGame[] = [];
    for (const chunk of idChunks) {
      const details = await fetchDetailedGames(chunk);
      detailedResults = detailedResults.concat(details);
    }
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

  useEffect(() => {
    getDefaultGames();
  }, []);

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
        <div className="overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => (
              <Link key={game.id!} href={`/game/${game.id}`} className="block">
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow hover:shadow-lg transition">
                  {game.thumbnail ? (
                    <Image
                      src={game.thumbnail}
                      alt={`${game.name} thumbnail`}
                      width={200}
                      height={150}
                      className="w-full h-[150px] object-cover rounded mb-2"
                    />
                  ) : (
                    <Image
                      src="/default-game-thumbnail.jpg"
                      alt="Default game thumbnail"
                      width={200}
                      height={150}
                      className="w-full h-[150px] object-cover rounded mb-2"
                    />
                  )}
                  <h2 className="font-semibold text-lg mb-1">{game.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {cleanDescription(game.description) ||
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