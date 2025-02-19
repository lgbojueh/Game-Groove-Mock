"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
  }, []);

  const removeFavorite = (id: string) => {
    const updated = favorites.filter((game) => game.id !== id);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);
  };

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen overflow-y-auto">
      <h1 className="text-4xl font-bold mb-6">Favorite Games</h1>
      {favorites.length === 0 ? (
        <p>You have no favorite games.</p>
      ) : (
        <ul className="space-y-4">
          {favorites.map((game, idx) => (
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
                onClick={() => removeFavorite(game.id)}
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