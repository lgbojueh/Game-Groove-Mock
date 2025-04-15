"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

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
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const fetchSavedGames = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/auth/savedGames?userId=${session.user.id}`);
          if (!res.ok) throw new Error("Failed to fetch saved games");
          const data = await res.json();
          setSavedGames(data);
        } catch (err: any) {
          console.error("Error fetching saved games:", err);
          setError(err.message || "An error occurred.");
        } finally {
          setLoading(false);
        }
      };
      fetchSavedGames();
    }
  }, [status, session]);

  const removeSavedGame = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/auth/savedGames/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete saved game");
      setSavedGames((prev) => prev.filter((game) => game.id !== id));
    } catch (err) {
      console.error("Error deleting saved game:", err);
      setError("Failed to remove saved game.");
    } finally {
      setDeletingId(null);
    }
  };

  if (status === "loading") return <p>Loading session...</p>;
  if (status === "unauthenticated") return <p>You must log in to view saved games.</p>;

  return (
    <main className="p-6 min-h-screen mt-4">
      <h1 className="text-4xl font-bold mb-6">Saved Games</h1>
      {loading ? (
        <p>Loading saved games...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : savedGames.length === 0 ? (
        <p>You haven’t saved any games yet.</p>
      ) : (
        <ul className="space-y-4">
          {savedGames.map((game) => (
            <li
              key={game.id}
              className="flex justify-between items-center p-4 rounded shadow bg-gray-100 dark:bg-gray-700"
            >
              <div>
                <h2 className="text-xl font-semibold">{game.title}</h2>
                <img
                  src={game.thumbnail || "/default-game-thumbnail.jpg"}
                  alt={`${game.title} thumbnail`}
                  className="w-32 h-auto rounded mt-2"
                />
              </div>
              <button
                onClick={() => removeSavedGame(game.id)}
                disabled={deletingId === game.id}
                className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ${
                  deletingId === game.id ? "opacity-50 cursor-not-allowed" : ""
                }`}
                aria-label={`Remove ${game.title}`}
              >
                {deletingId === game.id ? "Removing..." : "Remove"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
