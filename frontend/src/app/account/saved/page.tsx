// app/saved/page.tsx
"use client";
import { useState, useEffect } from "react";

export default function SavedGamesPage() {
  const defaultUserId = 1; // For demo purposes.
  const [savedGames, setSavedGames] = useState<any[]>([]);

  useEffect(() => {
    async function fetchSavedGames() {
      try {
        const res = await fetch(`/api/savedGames?userId=${defaultUserId}`);
        const data = await res.json();
        setSavedGames(data);
      } catch (error) {
        console.error("Error fetching saved games: ", error);
      }
    }
    fetchSavedGames();
  }, []);

  const removeSavedGame = async (id: number) => {
    // Optionally call a DELETE API route.
    const updated = savedGames.filter((game) => game.id !== id);
    setSavedGames(updated);
  };

  return (
    <main className="p-6 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Saved Games</h1>
      {savedGames.length === 0 ? (
        <p>You have no saved games.</p>
      ) : (
        <ul className="space-y-4">
          {savedGames.map((game) => (
            <li key={game.id} className="flex justify-between items-center p-4 rounded shadow">
              <div>
                <h2 className="text-xl font-semibold">{game.title}</h2>
                {/* Render other fields as needed */}
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
