"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchGames } from "@/utils/fetchGames";
import { fetchDetailedGames } from "@/utils/fetchDetailedGames";

// Helper function to chunk an array into smaller arrays of a given size.
function chunkArray<T>(arr: T[], size: number): T[][] {
  const results: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    results.push(arr.slice(i, i + size));
  }
  return results;
}

// Define an interface for our game object.
interface BasicGame {
  id: string;
  name: string;
  thumbnail: string;
  description?: string;
}

// Helper to clean unwanted line break codes and other HTML entities from descriptions.
const cleanDescription = (desc?: string) =>
  desc
    ? desc
        .replace(/&#10;/g, " ") // Remove line breaks
        .replace(/&amp;/g, "&") // Decode ampersands
        .replace(/&quot;/g, '"') // Decode quotes
        .replace(/&#39;/g, "'") // Decode single quotes
    : "";

export default function Games() {
  const [games, setGames] = useState<BasicGame[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);

  // Function to fetch games based on a query.
  const getGames = async (query: string) => {
    setLoading(true);
    setError("");
    try {
      // 1. Fetch basic results.
      const basicResults = (await fetchGames(query)) as any[];
      const basicGames: BasicGame[] = basicResults
        .filter((game) => game.id)
        .map((game) => ({
          id: String(game.id),
          name: game.name || "Unknown Game",
          thumbnail: game.thumbnail || "/default-game-thumbnail.jpg",
        }));

      if (basicGames.length === 0) {
        setGames([]);
        setLoading(false);
        return;
      }

      // 2. Fetch detailed data in chunks.
      const allIds = basicGames.map((game) => game.id);
      const idChunks = chunkArray(allIds, 20);
      let detailedResults: BasicGame[] = [];

      for (const chunk of idChunks) {
        const details = (await fetchDetailedGames(chunk)) as any[];
        const mappedDetails: BasicGame[] = details.map((d) => ({
          id: String(d.id),
          name: d.name || "Unknown Game",
          thumbnail: d.thumbnail || "/default-game-thumbnail.jpg",
          description: cleanDescription(d.description),
        }));
        detailedResults = detailedResults.concat(mappedDetails);
      }

      // 3. Merge detailed data into basic games.
      for (const detail of detailedResults) {
        const idx = basicGames.findIndex((b) => b.id === detail.id);
        if (idx !== -1) {
          basicGames[idx].thumbnail = detail.thumbnail;
          basicGames[idx].description = detail.description;
        }
      }

      setGames(basicGames);
    } catch (error) {
      console.error("Error fetching games:", error);
      setError("Failed to load games. Please try again later.");
      setGames([]);
    }
    setLoading(false);
  };

  // On mount, fetch default games.
  useEffect(() => {
    getGames("board game");
    setVisibleCount(9);
  }, []);

  // Handle search submission.
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await getGames(searchQuery.trim() === "" ? "board game" : searchQuery);
    setVisibleCount(9);
  };

  // Load more games.
  const loadMore = () => {
    setVisibleCount((prev) => prev + 9);
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
          className="border border-gray-400 p-2 rounded flex-grow mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Search
        </button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="overflow-y-auto max-h-[70vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {games.slice(0, visibleCount).map((game) => (
                <Link key={game.id} href={`/game/${game.id}`} className="block">
                  <div className="p-4 bg-gray-400 dark:bg-gray-700 rounded shadow hover:shadow-lg transition">
                    <Image
                      src={game.thumbnail}
                      alt={`${game.name} thumbnail`}
                      width={200}
                      height={150}
                      className="w-full h-[150px] object-cover rounded mb-2"
                    />
                    <h2 className="font-semibold text-lg mb-1">{game.name}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {game.description ||
                        "A fun and engaging game that you'll enjoy with friends and family."}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          {visibleCount < games.length && (
            <div className="mt-4 text-center">
              <button
                onClick={loadMore}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}