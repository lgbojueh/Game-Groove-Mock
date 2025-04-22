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
  const [error, setError] = useState<string>("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Fetch the user's saved games when authenticated
  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;

    const fetchSavedGames = async () => {
      setLoading(true);
      setError("");
      try {
        const userId = Number(session.user.id);
        const res = await fetch(`/api/auth/savedGames?userId=${userId}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch");
        }
        const data: SavedGame[] = await res.json();
        setSavedGames(data);
      } catch (err) {
        console.error("Failed to fetch saved games:", err);
        setError(err instanceof Error ? err.message : "Unknown error fetching saved games");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedGames();
  }, [status, session]);

  // Delete (unsave) a game by its ID
  const removeSavedGame = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/auth/savedGames?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to delete saved game");
      }
      setSavedGames((prev) => prev.filter((game) => game.id !== id));
    } catch (err) {
      console.error("Error removing saved game:", err);
      alert(err instanceof Error ? err.message : "Error removing saved game");
    } finally {
      setDeletingId(null);
    }
  };

  if (status === "loading") {
    return <div className="p-6">Loading session…</div>;
  }
  if (status === "unauthenticated") {
    return <p className="p-6">Please log in to view your saved games.</p>;
  }

  return (
    <main className="p-6 min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <h1 className="text-3xl font-bold mb-6">Saved Games</h1>

      {loading ? (
        <p>Loading saved games…</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : savedGames.length === 0 ? (
        <p>You have no saved games.</p>
      ) : (
        <ul className="space-y-4">
          {savedGames.map((game) => (
            <li
              key={game.id}
              className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow flex items-start space-x-4"
            >
              <Image
                src={game.thumbnail ?? "/default-thumbnail.jpg"}
                alt={`${game.title} thumbnail`}
                width={128}
                height={96}
                className="rounded object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{game.title}</h3>
                <button
                  onClick={() => removeSavedGame(game.id)}
                  disabled={deletingId === game.id}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                >
                  {deletingId === game.id ? "Removing…" : "Remove"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
