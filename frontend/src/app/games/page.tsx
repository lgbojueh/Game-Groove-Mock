"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchGames } from "@/utils/fetchGames";
import { fetchGameDetails } from "@/utils/fetchGameDetails";
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
  id: string; // We assume a valid game always has an id (converted to string)
  name: string;
  thumbnail: string;
  description?: string;
  complexity?: string;
  players?: string;
  theme?: string;
}

// Helper to clean unwanted line break codes from descriptions.
const cleanDescription = (desc?: string) =>
  desc ? desc.replace(/&#10;/g, " ") : "";

export default function Games() {
  const [games, setGames] = useState<BasicGame[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);

  // Function to fetch games based on a query.
  const getGames = async (query: string) => {
    setLoading(true);
    try {
      // 1. Fetch basic results.
      let basicResults = (await fetchGames(query)) as any[];
      console.log("Basic results:", basicResults);

      // Filter out games without a valid ID and force the id to be a string.
      const basicGames: BasicGame[] = basicResults
        .filter((game) => game.id)
        .map((game) => ({
          id: String(game.id),
          name: game.name,
          thumbnail: game.thumbnail,
        }));
      console.log("Mapped basic games:", basicGames);

      if (basicGames.length === 0) {
        setGames([]);
        setLoading(false);
        return;
      }

      // 2. Extract all IDs.
      const allIds = basicGames.map((game) => game.id);
      // 3. Chunk IDs into groups of 20.
      const idChunks = chunkArray(allIds, 20);
      let detailedResults: BasicGame[] = [];

      // 4. For each chunk, fetch detailed data.
      for (const chunk of idChunks) {
        const details = (await fetchDetailedGames(chunk)) as any[];
        // Map details to our BasicGame interface.
        const mappedDetails: BasicGame[] = details.map((d) => ({
          id: String(d.id),
          name: d.name,
          thumbnail: d.thumbnail,
          description: d.description,
        }));
        detailedResults = detailedResults.concat(mappedDetails);
      }
      console.log("Detailed results:", detailedResults);

      // 5. Merge detailed data into basic games.
      for (const detail of detailedResults) {
        const idx = basicGames.findIndex((b) => b.id === detail.id);
        if (idx !== -1) {
          basicGames[idx].thumbnail = detail.thumbnail;
          basicGames[idx].description = detail.description;
        }
      }
      console.log("Merged games:", basicGames);
      setGames(basicGames);
    } catch (error) {
      console.error("Error fetching games:", error);
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
          className="border border-gray-300 p-2 rounded flex-grow mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Search
        </button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Scrollable container with a maximum height */}
          <div className="overflow-y-auto max-h-[70vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {games.slice(0, visibleCount).map((game) => (
                <Link key={game.id} href={`/game/${game.id}`} className="block">
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