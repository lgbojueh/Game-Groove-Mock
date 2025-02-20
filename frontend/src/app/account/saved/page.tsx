"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SavedGamesPage() {
  const router = useRouter();
  const [savedGames, setSavedGames] = useState<any[]>([]);

  useEffect(() => {
    const storedSaved = localStorage.getItem("savedGames");
    setSavedGames(storedSaved ? JSON.parse(storedSaved) : []);
  }, []);

  const removeSavedGame = (id: string) => {
    const updated = savedGames.filter((game) => game.id !== id);
    localStorage.setItem("savedGames", JSON.stringify(updated));
    setSavedGames(updated);
  };

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen overflow-y-auto">
      <h1 className="text-4xl font-bold mb-6">Saved Games</h1>
      {savedGames.length === 0 ? (
        <p>You have no saved games.</p>
      ) : (
        <ul className="space-y-4">
          {savedGames.map((game, idx) => (
            <li key={idx} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-4 rounded shadow">
              <div>
                <h2 className="text-xl font-semibold">{game.name}</h2>
                {game.thumbnail && (
                  <img
                    src={game.thumbnail}
                    alt={`${game.name} thumbnail`}
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