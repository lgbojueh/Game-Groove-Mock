"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchGames } from "@/utils/fetchGames";
import { fetchDetailedGames } from "@/utils/fetchDetailedGames";
import { cleanDescription, shortenDescription } from "@/utils/cleanup";

// Helper to split an array into chunks
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
  description: string;    // now non-optional
}

export default function GamesClient() {
  const [games, setGames] = useState<BasicGame[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);

  // Fetch & hydrate games
  const getGames = async (query: string) => {
    setLoading(true);
    setError("");

    try {
      const basic: BasicGame[] = (await fetchGames(query))
        .filter((g) => g.id)
        .map((g) => ({
          id: String(g.id),
          name: g.name || "Unknown Game",
          thumbnail: g.thumbnail || "/default-game-thumbnail.jpg",
          description: "",
        }));

      if (!basic.length) {
        setGames([]);
        setLoading(false);
        return;
      }

      const allIds = basic.map((g) => g.id);
      const chunks = chunkArray(allIds, 20);
      let detailsAcc: BasicGame[] = [];

      for (const chunk of chunks) {
        const dets = await fetchDetailedGames(chunk);
        detailsAcc = detailsAcc.concat(
          dets.map((d) => ({
            id: String(d.id),
            name: d.name || "Unknown Game",
            thumbnail: d.thumbnail || "/default-game-thumbnail.jpg",
            description: cleanDescription(d.description),
          }))
        );
      }

      for (const det of detailsAcc) {
        const idx = basic.findIndex((b) => b.id === det.id);
        if (idx > -1) {
          basic[idx].thumbnail = det.thumbnail;
          basic[idx].description = det.description;
        }
      }

      setGames(basic);
    } catch (err) {
      console.error("Error fetching games:", err);
      setError("Failed to load games. Please try again later.");
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    getGames("board game");
    setVisibleCount(9);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim() || "board game";
    await getGames(q);
    setVisibleCount(9);
  };

  const loadMore = () => setVisibleCount((prev) => prev + 9);

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <h1 className="text-4xl font-bold mb-4">All Games</h1>

      <form onSubmit={handleSearch} className="mb-4 flex">
        <input
          type="text"
          placeholder="Search games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow border border-gray-400 p-2 rounded mr-2"
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
                  <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded shadow hover:shadow-lg transition">
                    <Image
                      src={game.thumbnail}
                      alt={`${game.name} thumbnail`}
                      width={200}
                      height={150}
                      className="w-full h-[150px] object-cover rounded mb-2"
                    />
                    <h2 className="font-semibold text-lg mb-1">{game.name}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                      {shortenDescription(game.description) || "No description available."}
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