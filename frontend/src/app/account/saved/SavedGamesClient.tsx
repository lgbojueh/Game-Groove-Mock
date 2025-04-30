// src/app/saved/SavedGamesClient.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

interface SavedGame {
  id: number;
  gameId: string;
  title: string;
  thumbnail: string | null;
}

export default function SavedGamesClient() {
  const { data: session, status } = useSession();
  const [savedGames, setSavedGames] = useState<SavedGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const userId = session.user.id;
      setLoading(true);
      setError("");

      fetch(`/api/auth/savedGames?userId=${userId}`)
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json() as Promise<SavedGame[]>;
        })
        .then(setSavedGames)
        .catch((err) => {
          console.error("Error fetching saved games:", err);
          setError(err.message || "Error fetching saved games.");
        })
        .finally(() => setLoading(false));
    }
  }, [status, session]);

  const removeSavedGame = async (id: number) => {
    try {
      const res = await fetch(`/api/auth/savedGames?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete saved game");
      setSavedGames((prev) => prev.filter((g) => g.id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error removing saved game:", err);
        setError(err.message || "Error removing saved game.");
      } else {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred.");
      }
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
        <ul className="space-y-6">
          {savedGames.map((game) => (
            <li
              key={game.id}
              className="bg-gray-100 dark:bg-gray-400 p-4 rounded shadow grid grid-cols-[auto_1fr] gap-4 items-start"
            >
              <Link href={`/game/${game.gameId}`}>
                {game.thumbnail ? (
                  <Image
                    src={game.thumbnail}
                    alt={`${game.title} thumbnail`}
                    width={128}
                    height={96}
                    className="rounded cursor-pointer"
                  />
                ) : (
                  <div className="w-32 h-24 bg-gray-300 rounded flex items-center justify-center">
                    <span>No Image</span>
                  </div>
                )}
              </Link>

              <div>
                <Link
                  href={`/game/${game.gameId}`}
                  className="text-xl font-semibold hover:underline"
                >
                  {game.title}
                </Link>
                <button
                  onClick={() => removeSavedGame(game.id)}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
