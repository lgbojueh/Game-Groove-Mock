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
        if (!res.ok) {
          throw new Error("Failed to fetch favorites");
        }
        const data = await res.json();
        setFavorites(data);
      } catch (error) {
        console.error("Error fetching favorites: ", error);
      }
    }
    fetchFavorites();
  }, []);

  const removeFavorite = async (id: number) => {
    try {
      // Call a DELETE endpoint (this route must be implemented on the server side)
      const res = await fetch(`/api/favoriteService/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete favorite");
      }
      // If successful, update the local state:
      setFavorites((prev) => prev.filter((fav) => fav.id !== id));
    } catch (error) {
      console.error("Error deleting favorite: ", error);
    }
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
                {/* Add thumbnail or additional details if available */}
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
