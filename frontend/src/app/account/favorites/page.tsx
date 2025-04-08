// app/favorites/page.tsx
"use client";
import { useState, useEffect } from "react";

export default function FavoritesPage() {
  const defaultUserId = 1; // For now we use a hard-coded user id.
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await fetch(`/api/favoriteService?userId=${defaultUserId}`);
        const data = await res.json();
        setFavorites(data);
      } catch (error) {
        console.error("Error fetching favorites: ", error);
      }
    }
    fetchFavorites();
  }, []);

  const removeFavorite = async (id: number) => {
    // Optionally, you can call an API route to delete the favorite.
    // For now, just filter locally:
    const updated = favorites.filter((fav) => fav.id !== id);
    setFavorites(updated);
  };

  return (
    <main className="p-6 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Favorite Games</h1>
      {favorites.length === 0 ? (
        <p>You have no favorite games.</p>
      ) : (
        <ul className="space-y-4">
          {favorites.map((fav) => (
            <li key={fav.id} className="flex justify-between items-center p-4 rounded shadow">
              <div>
                <h2 className="text-xl font-semibold">{fav.name}</h2>
                {/* Render other fields, e.g. thumbnail */}
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
