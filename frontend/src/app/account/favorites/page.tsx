"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Favorite {
  id: number;
  name: string;
  thumbnail?: string;
}

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const fetchFavorites = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/favoriteService?userId=${session.user.id}`);
          if (!res.ok) throw new Error("Failed to fetch favorites");
          const data = await res.json();
          setFavorites(data);
        } catch (err: any) {
          console.error("Error fetching favorites:", err);
          setError(err.message || "An error occurred.");
        } finally {
          setLoading(false);
        }
      };
      fetchFavorites();
    }
  }, [status, session]);

  const removeFavorite = async (id: number) => {
    try {
      const res = await fetch(`/api/favoriteService/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete favorite");
      setFavorites((prev) => prev.filter((fav) => fav.id !== id));
    } catch (err) {
      console.error("Error deleting favorite:", err);
      setError("Failed to remove favorite.");
    }
  };

  if (status === "loading") return <p>Loading session...</p>;
  if (status === "unauthenticated") return <p>You must log in to view favorites.</p>;

  return (
    <main className="p-6 min-h-screen mt-4">
      <h1 className="text-4xl font-bold mb-6">Favorite Games</h1>
      {loading ? (
        <p>Loading favorites...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : favorites.length === 0 ? (
        <p>You have no favorite games yet.</p>
      ) : (
        <ul className="space-y-4">
          {favorites.map((fav) => (
            <li
              key={fav.id}
              className="flex justify-between items-center p-4 rounded shadow bg-gray-100 dark:bg-gray-700"
            >
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
                aria-label={`Remove ${fav.name}`}
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
