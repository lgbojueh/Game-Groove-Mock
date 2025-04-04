"use client";

import { useState, useEffect } from "react";

export default function SavedGamesPage() {
  const [savedGames, setSavedGames] = useState<any[]>([]);

  useEffect(() => {
    // Fetch the saved games from your API on mount
    const fetchSavedGames = async () => {
      try {
        const res = await fetch("/api/saved-games");
        if (!res.ok) {
          throw new Error("Failed to fetch saved games");
        }
        const data = await res.json();
        setSavedGames(data);
      } catch (error) {
        console.error("Error fetching saved games:", error);
      }
    };

    fetchSavedGames();
  }, []);

  // Remove a saved game by its id
  const removeSavedGame = async (id: number) => {
    try {
      const res = await fetch(`/api/saved-games/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete saved game");
      }
      setSavedGames((prev) => prev.filter((game) => game.id !== id));
    } catch (error) {
      console.error("Error deleting saved game:", error);
    }
  };

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen overflow-y-auto">
      <h1 className="text-4xl font-bold mb-6">Saved Games</h1>
      {savedGames.length === 0 ? (
        <p>You have no saved games.</p>
      ) : (
        <ul className="space-y-4">
          {savedGames.map((game) => (
            <li
              key={game.id}
              className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-4 rounded shadow"
            >
              <div>
                <h2 className="text-xl font-semibold">{game.title}</h2>
                {game.thumbnail && (
                  <img
                    src={game.thumbnail}
                    alt={`${game.title} thumbnail`}
                    className="w-32 h-auto rounded mt-2"
                  />
                )}
              </div>
              <button
                onClick={() => removeSavedGame(game.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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
