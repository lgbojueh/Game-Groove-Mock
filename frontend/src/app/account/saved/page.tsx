// src/app/account/saved/page.tsx
"use client";

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
  const [error, setError] = useState("");

  // fetch this user's saved games when authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      async function fetchSaved() {
        try {
          setLoading(true);
          const res = await fetch("/api/auth/savedGames");
          if (!res.ok) {
            const msg = await res.text();
            throw new Error(`Error fetching saved games: ${msg}`);
          }
          const data: SavedGame[] = await res.json();
          setSavedGames(data);
        } catch (err: unknown) {
          setError(
            err instanceof Error
              ? err.message
              : "An unknown error occurred."
          );
        } finally {
          setLoading(false);
        }
      }
      fetchSaved();
    }
  }, [status, session]);

  // remove one saved game
  const handleRemove = async (id: number) => {
    try {
      const res = await fetch(`/api/auth/savedGames?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove saved game");
      setSavedGames((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error("Error removing saved game:", err);
    }
  };

  if (status === "loading") {
    return <div className="p-6">Loading...</div>;
  }
  if (status === "unauthenticated") {
    return <p className="p-6">You must be logged in to view saved games.</p>;
  }

  return (
    <main className="p-6 min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <h1 className="text-4xl font-bold mb-6">Saved Games</h1>
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
              {game.thumbnail ? (
                <Image
                  src={game.thumbnail}
                  alt={`${game.title} thumbnail`}
                  width={128}
                  height={80}
                  className="mt-2 rounded object-contain"
                />
              ) : (
                <div className="w-32 h-20 bg-gray-300 flex items-center justify-center mt-2 rounded">
                  <span>No Image</span>
                </div>
              )}
              <button
                onClick={() => handleRemove(game.id)}
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
