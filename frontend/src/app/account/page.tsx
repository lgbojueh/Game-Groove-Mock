// app/savedGames/page.tsx
"use client";
import { useState, useEffect } from "react";

export default function SavedGamesPage() {
  const userId = 1; // Replace with the current user's ID (when available)
  const [savedGames, setSavedGames] = useState<any[]>([]);

  useEffect(() => {
    async function fetchSavedGames() {
      try {
        const res = await fetch(`/api/auth/savedGames/?userId=${userId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch saved games");
        }
        const data = await res.json();
        setSavedGames(data);
      } catch (error) {
        console.error("Error loading saved games:", error);
      }
    }
    fetchSavedGames();
  }, [userId]);

  const removeSavedGame = async (id: number) => {
    try {
      // Call an API endpoint to remove the saved game
      const res = await fetch(`/api/auth/savedGames/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete saved game");
      }
      // Update the local state after deletion:
      setSavedGames((prev) => prev.filter((game) => game.id !== id));
    } catch (error) {
      console.error("Error removing saved game:", error);
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
