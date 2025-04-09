"use client";
import { useState, useEffect } from "react";

interface Favorite {
  id: number;
  name: string;
  thumbnail?: string; // Optional thumbnail field
}

export default function FavoritesPage() {
  const defaultUserId = 1; // For now we use a hard-coded user id.
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await fetch(`/api/auth/favoriteService?userId=${defaultUserId}`);
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
      const res = await fetch(`/api/auth/favoriteService?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete favorite");
      }
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
                <img
                  src={fav.thumbnail || '/default-game-thumbnail.jpg'}
                  alt={`${fav.name} thumbnail`}
                  className="w-32 h-auto rounded mt-2"
                />
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