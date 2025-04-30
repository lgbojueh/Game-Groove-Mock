// src/app/favorites/FavoritesClient.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

interface FavoriteGame {
  id: number;
  gameId: string;
  title: string;
  thumbnail: string | null;
}

export default function FavoritesClient() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<FavoriteGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const userId = session.user.id;
      setLoading(true);
      setError("");

      fetch(`/api/auth/favoriteService?userId=${userId}`)
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json() as Promise<FavoriteGame[]>;
        })
        .then(setFavorites)
        .catch((err) => {
          console.error("Error fetching favorites:", err);
          setError(err.message || "Error fetching favorites.");
        })
        .finally(() => setLoading(false));
    }
  }, [status, session]);

  const handleRemove = async (id: number) => {
    try {
      const res = await fetch(`/api/auth/favoriteService?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove favorite");
      setFavorites((prev) => prev.filter((f) => f.id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error removing favorite:", err);
        setError(err.message || "Error removing favorite.");
      } else {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred.");
      }
    }
  };

  if (status === "loading") return <div className="p-6">Loading...</div>;
  if (status === "unauthenticated")
    return <p className="p-6">You must be logged in to view favorites.</p>;

  return (
    <main className="p-6 min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <h1 className="text-4xl font-bold mb-6">Favorite Games</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : favorites.length === 0 ? (
        <p>You have no favorite games.</p>
      ) : (
        <ul className="space-y-6">
          {favorites.map((fav) => (
            <li
              key={fav.id}
              className="bg-gray-100 dark:bg-gray-400 p-4 rounded shadow grid grid-cols-[auto_1fr] gap-4 items-start"
            >
              <Link href={`/game/${fav.gameId}`}>
                {fav.thumbnail ? (
                  <Image
                    src={fav.thumbnail}
                    alt={`${fav.title} thumbnail`}
                    width={128}
                    height={80}
                    className="rounded cursor-pointer"
                  />
                ) : (
                  <div className="w-32 h-20 bg-gray-300 rounded flex items-center justify-center">
                    <span>No Image</span>
                  </div>
                )}
              </Link>

              <div>
                <Link
                  href={`/game/${fav.gameId}`}
                  className="text-xl font-semibold hover:underline"
                >
                  {fav.title}
                </Link>
                <button
                  onClick={() => handleRemove(fav.id)}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
