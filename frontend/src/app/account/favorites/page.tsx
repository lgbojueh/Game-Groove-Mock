"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Favorite {
  id: number;
  name: string;
  thumbnail?: string; // optional, if your favorites have a thumbnail image
}

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      async function fetchFavorites() {
        try {
          setLoading(true);
          setError("");
          const userId = session?.user?.id;
          // Fetch the user's favorites using the provided userId.
          // Adjust the URL below if your backend endpoint differs.
          const res = await fetch(`/api/auth/favoriteService?userId=${userId}`);
          if (!res.ok) {
            throw new Error("Failed to fetch favorites");
          }
          const data = await res.json();
          setFavorites(data);
        } catch (error: any) {
          console.error("Error fetching favorites:", error);
          setError(error.message || "An error occurred while fetching favorites.");
        } finally {
          setLoading(false);
        }
      }
      fetchFavorites();
    }
  }, [status, session]);

  const removeFavorite = async (id: number) => {
    try {
      // Ensure that the endpoint URL below matches your backend route configuration.
      const res = await fetch(`/api/auth/favoriteService/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete favorite");
      }
      setFavorites((prev) => prev.filter((fav) => fav.id !== id));
    } catch (error) {
      console.error("Error deleting favorite:", error);
      // Optionally, update the error state or show a notification
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated")
    return <p>You need to log in to view your favorite games.</p>;

  return (
    <main className="p-6 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Favorite Games</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : favorites.length === 0 ? (
        <p>You have no favorite games.</p>
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
