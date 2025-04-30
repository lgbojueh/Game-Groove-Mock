"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface FavoriteGame {
  id: number;
  name: string;
  thumbnail: string | null;  // low-res placeholder
}

export default function FavoritesClient() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<FavoriteGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const userId = session.user.id;

      async function fetchFavorites() {
        setLoading(true);
        setError("");
        try {
          const res = await fetch(
            `/api/auth/favoriteService?userId=${userId}`
          );
          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Favorite games error: ${text}`);
          }
          const data: FavoriteGame[] = await res.json();
          setFavorites(data);
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error("Error fetching favorites:", err);
            setError(err.message || "Error fetching favorites.");
          } else {
            console.error("Unknown error fetching favorites:", err);
            setError("An unknown error occurred.");
          }
        } finally {
          setLoading(false);
        }
      }

      fetchFavorites();
    }
  }, [status, session]);

  const handleRemove = async (id: number) => {
    try {
      const res = await fetch(`/api/auth/favoriteService?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove favorite");
      setFavorites((prev) => prev.filter((fav) => fav.id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error removing favorite:", err);
        setError(err.message || "Error removing favorite.");
      } else {
        console.error("Unknown error removing favorite:", err);
        setError("An unknown error occurred.");
      }
    }
  };

  if (status === "loading") {
    return <div className="p-6">Loading...</div>;
  }
  if (status === "unauthenticated") {
    return <p className="p-6">You must be logged in to view favorites.</p>;
  }

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
        <ul className="space-y-4">
          {favorites.map((fav) => (
            <li
              key={fav.id}
              className="bg-gray-100 dark:bg-gray-400 p-4 rounded shadow"
            >
              <h3 className="text-xl font-semibold">{fav.name}</h3>
              {fav.thumbnail ? (
                <Image
                  src={fav.thumbnail}
                  alt={`${fav.name} thumbnail`}
                  width={128}
                  height={80}
                  quality={80}                   // higher JPEG/WebP quality
                  placeholder="blur"             // blur-up placeholder
                  blurDataURL={fav.thumbnail}    // low-res source
                  className="rounded mt-2 object-contain"
                />
              ) : (
                <div className="w-32 h-20 bg-gray-300 flex items-center justify-center mt-2 rounded">
                  <span>No Image</span>
                </div>
              )}
              <button
                onClick={() => handleRemove(fav.id)}
                className="bg-red-500 text-white px-4 py-2 mt-2 rounded hover:bg-red-600"
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
