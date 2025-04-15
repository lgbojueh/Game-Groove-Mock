"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

interface Game {
  id: number;
  title: string;
  thumbnail?: string;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [savedGames, setSavedGames] = useState<Game[]>([]);
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      async function fetchGames() {
        try {
          setLoading(true);
          setError("");

          const userId = session?.user?.id;
          const [savedRes, favoriteRes] = await Promise.all([
            fetch(`/api/auth/savedGames?userId=${userId}`),
            fetch(`/api/auth/favoriteService?userId=${userId}`),
          ]);

          if (!savedRes.ok) {
            const text = await savedRes.text();
            throw new Error(`Saved games error: ${text}`);
          }

          if (!favoriteRes.ok) {
            const text = await favoriteRes.text();
            throw new Error(`Favorite games error: ${text}`);
          }

          const savedData = await savedRes.json();
          const favoriteData = await favoriteRes.json();

          setSavedGames(savedData);
          setFavoriteGames(favoriteData);
        } catch (err) {
          console.error("Error loading games:", err);
          setError(
            err instanceof Error
              ? err.message
              : "An error occurred while loading games."
          );
        } finally {
          setLoading(false);
        }
      }

      fetchGames();
    }
  }, [status, session]);

  const removeSavedGame = async (id: number) => {
    try {
      const res = await fetch(`/api/auth/savedGames?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete saved game");
      setSavedGames((prev) => prev.filter((game) => game.id !== id));
    } catch (err) {
      console.error("Error removing saved game:", err);
    }
  };

  const removeFavoriteGame = async (id: number) => {
    try {
      const res = await fetch(`/api/auth/favoriteService?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete favorite game");
      setFavoriteGames((prev) => prev.filter((game) => game.id !== id));
    } catch (err) {
      console.error("Error removing favorite game:", err);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  if (status === "loading") return <div>Loading...</div>;

  if (status === "unauthenticated") {
    return <p>You need to log in to view your games.</p>;
  }

  return (
    <main className="p-6 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">
        Welcome, {session?.user?.name || "User"}!
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white p-2 rounded mb-6"
      >
        Logout
      </button>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Favorite Games</h2>
            {favoriteGames.length === 0 ? (
              <p>You have no favorite games.</p>
            ) : (
              <ul className="space-y-4">
                {favoriteGames.map((game) => (
                  <li
                    key={game.id}
                    className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow"
                  >
                    <h3 className="text-xl font-semibold">{game.title}</h3>
                    <Image
                      src={game.thumbnail || "/default-thumbnail.jpg"}
                      alt={`${game.title} thumbnail`}
                      width={128}
                      height={96}
                      className="mt-2 rounded"
                    />
                    <button
                      onClick={() => removeFavoriteGame(game.id)}
                      className="bg-red-500 text-white px-4 py-2 mt-2 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Saved Games</h2>
            {savedGames.length === 0 ? (
              <p>You have no saved games.</p>
            ) : (
              <ul className="space-y-4">
                {savedGames.map((game) => (
                  <li
                    key={game.id}
                    className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow"
                  >
                    <h3 className="text-xl font-semibold">{game.title}</h3>
                    <Image
                      src={game.thumbnail || "/default-thumbnail.jpg"}
                      alt={`${game.title} thumbnail`}
                      width={128}
                      height={96}
                      className="mt-2 rounded"
                    />
                    <button
                      onClick={() => removeSavedGame(game.id)}
                      className="bg-red-500 text-white px-4 py-2 mt-2 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}
