"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Game {
  id: number;
  title: string;
  thumbnail?: string; // Optional thumbnail field
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [savedGames, setSavedGames] = useState<Game[]>([]);
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      async function fetchGames() {
        try {
          setLoading(true);
          setError("");

          const userId = session?.user?.id;
          if (!userId) {
            throw new Error("User ID is not available");
          }

          // Fetch saved games – adjust endpoint if needed
          const savedRes = await fetch(`/api/auth/savedGames?userId=${userId}`);
          if (!savedRes.ok) {
            throw new Error("Failed to fetch saved games");
          }
          const savedData = await savedRes.json();
          setSavedGames(savedData);

          // Fetch favorite games – adjust endpoint if needed
          const favoriteRes = await fetch(`/api/auth/favoritesService?userId=${userId}`);
          if (!favoriteRes.ok) {
            throw new Error("Failed to fetch favorite games");
          }
          const favoriteData = await favoriteRes.json();
          setFavoriteGames(favoriteData);
        } catch (error: any) {
          console.error("Error loading games:", error);
          setError(error.message || "An error occurred while loading games.");
        } finally {
          setLoading(false);
        }
      }

      fetchGames();
    }
  }, [status, session]);

  const removeSavedGame = async (id: number) => {
    try {
      const res = await fetch(`/api/auth/savedGames/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete saved game");
      }
      setSavedGames((prev) => prev.filter((game) => game.id !== id));
    } catch (error) {
      console.error("Error removing saved game:", error);
    }
  };

  const removeFavoriteGame = async (id: number) => {
    try {
      const res = await fetch(`/api/auth/favoritesService/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete favorite game");
      }
      setFavoriteGames((prev) => prev.filter((game) => game.id !== id));
    } catch (error) {
      console.error("Error removing favorite game:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center">
        <span>Loading...</span>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <p>You need to log in to view your games.</p>;
  }

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen overflow-y-auto">
      <h1 className="text-4xl font-bold mb-6">My Games</h1>
      {loading ? (
        <div className="flex justify-center items-center">
          <span>Loading...</span>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Favorite Games</h2>
            {favoriteGames.length === 0 ? (
              <p>You have no favorite games.</p>
            ) : (
              <ul className="space-y-4">
                {favoriteGames.map((game) => (
                  <li
                    key={game.id}
                    className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-4 rounded shadow"
                  >
                    <div>
                      <h3 className="text-xl font-semibold">{game.title}</h3>
                      <img
                        src={game.thumbnail || "/default-game-thumbnail.jpg"}
                        alt={`${game.title} thumbnail`}
                        className="w-32 h-auto rounded mt-2"
                      />
                    </div>
                    <button
                      onClick={() => removeFavoriteGame(game.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Saved Games</h2>
            {savedGames.length === 0 ? (
              <p>You have no saved games.</p>
            ) : (
              <ul className="space-y-4">
                {savedGames.map((game) => (
                  <li
                    key={game.id}
                    className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-4 rounded shadow"
                  >
                    <div>
                      <h3 className="text-xl font-semibold">{game.title}</h3>
                      <img
                        src={game.thumbnail || "/default-game-thumbnail.jpg"}
                        alt={`${game.title} thumbnail`}
                        className="w-32 h-auto rounded mt-2"
                      />
                    </div>
                    <button
                      onClick={() => removeSavedGame(game.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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
