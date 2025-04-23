"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface SavedGame {
  id: number;
  title: string;
  thumbnail?: string;
}

export default function SavedGamesPage() {
  const { data: session, status } = useSession();
  const [savedGames, setSavedGames] = useState<SavedGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const fetchSavedGames = async () => {
        try {
          setLoading(true);
          const userId = session.user.id;

          // ← Note the correct URL here
          const res = await fetch(`/api/auth/savedGames?userId=${userId}`);
          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Error fetching saved games: ${text}`);
          }

          const data: SavedGame[] = await res.json();
          setSavedGames(data);
        } catch (err) {
          console.error("Failed to fetch saved games:", err);
          setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
          setLoading(false);
        }
      };

      fetchSavedGames();
    }
  }, [status, session]);

  const removeSavedGame = async (id: number) => {
    try {
      const res = await fetch(`/api/auth/savedGames?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete saved game");
      setSavedGames((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error("Error removing saved game:", err);
    }
  };

  if (status === "loading") return <div className="p-6">Loading...</div>;
  if (status === "unauthenticated")
    return <p className="p-6">Please log in to view saved games.</p>;

  return (
    <main className="p-6 min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <h1 className="text-3xl font-bold mb-6">Saved Games</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : savedGames.length === 0 ? (
        <p>You have no saved games.</p>
      ) : (
        <ul className="space-y-4">
          {savedGames.map((game) => (
            <li
              key={game.id}
              className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow"
            >
              <h3 className="text-xl font-semibold">{game.title}</h3>
              <Image
                src={game.thumbnail || "/default-thumbnail.jpg"}
                alt={`${game.title} thumbnail`}
                width={128}
                height={96}
                className="mt-2 rounded"
              />
              <button
                onClick={() => removeSavedGame(game.id)}
                className="bg-red-500 text-white px-4 py-2 mt-2 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
