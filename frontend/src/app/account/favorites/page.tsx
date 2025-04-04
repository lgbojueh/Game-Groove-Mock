"use client";
import { useState, useEffect } from "react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    // Fetch the favorites from your API
    const fetchFavorites = async () => {
      try {
        const res = await fetch("/api/favorites");
        if (!res.ok) throw new Error("Failed to fetch favorites");
        const data = await res.json();
        setFavorites(data);
      } catch (error) {
        console.error("Error fetching favorites: ", error);
      }
    };

    fetchFavorites();
  }, []);

  const removeFavorite = async (id: number) => {
    try {
      const res = await fetch(`/api/favorites/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete favorite");
      // Update the local state after deletion
      setFavorites((prev) => prev.filter((fav) => fav.id !== id));
    } catch (error) {
      console.error("Error deleting favorite: ", error);
    }
  };

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen overflow-y-auto">
      <h1 className="text-4xl font-bold mb-6">Favorite Games</h1>
      {favorites.length === 0 ? (
        <p>You have no favorite games.</p>
      ) : (
        <ul className="space-y-4">
          {favorites.map((fav) => (
            <li key={fav.id} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-4 rounded shadow">
              <div>
                <h2 className="text-xl font-semibold">{fav.name}</h2>
                {fav.thumbnail && (
                  <img
                    src={fav.thumbnail}
                    alt={`${fav.name} thumbnail`}
                    className="w-32 h-auto rounded mt-2"
                  />
                )}
              </div>
              <button
                onClick={() => removeFavorite(fav.id)}
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
