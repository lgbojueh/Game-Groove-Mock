"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface SavedGame {
  id: number;
  title: string;
  thumbnail?: string; // Optional thumbnail field
}

export default function SavedGamesPage() {
  const { data: session, status } = useSession();
  const [savedGames, setSavedGames] = useState<SavedGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch saved games when the session is authenticated.
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      async function fetchSavedGames() {
        try {
          setLoading(true);
          setError("");

          const userId = session?.user?.id;
          const res = await fetch(`/api/auth/savedGames?userId=${userId}`);
          if (!res.ok) {
            throw new Error("Failed to fetch saved games");
          }
          const data = await res.json();
          setSavedGames(data);
        } catch (error: any) {
          console.error("Error fetching saved games:", error);
          setError(
            error.message || "An error occurred while fetching saved games."
          );
        } finally {
          setLoading(false);
        }
      }
      fetchSavedGames();
    }
  }, [status, session]);

  // Function to remove a saved game by sending a DELETE request.
  const removeSavedGame = async (id: number) => {
    try {
      const res = await fetch(`/api/auth/savedGames/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete saved game");
      }
      // Update the savedGames state by removing the deleted game.
      setSavedGames((prev) => prev.filter((game) => game.id !== id));
    } catch (error) {
      console.error("Error deleting saved game:", error);
      // Optionally, you could display an error message to the user here.
    }
  };

  // Display loading or unauthenticated state.
  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated")
    return <p>You need to log in to view your saved games.</p>;

  return (
    <main className="p-6 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Saved Games</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : savedGames.length === 0 ? (
        <p>You have no saved games.</p>
      ) : (
        <ul className="space-y-4">
          {savedGames.map((game) => (
            <li
              key={game.id}
              className="flex justify-between items-center p-4 rounded shadow bg-gray-100 dark:bg-gray-700"
            >
              <div>
                <h2 className="text-xl font-semibold">{game.title}</h2>
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
    </main>
  );
}
