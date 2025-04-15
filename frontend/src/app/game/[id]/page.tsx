"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { fetchGameDetails } from "@/utils/fetchGameDetails";

const cleanDescription = (desc?: string) =>
  desc ? desc.replace(/&#10;&#10;/g, " ") : "";

export default function GameDetailsPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function getGameDetails() {
      try {
        const data = await fetchGameDetails(id as string);
        setGame(data);
      } catch (err) {
        console.error("Error fetching game details:", err);
        setError("Failed to load game details.");
      } finally {
        setLoading(false);
      }
    }
    getGameDetails();
  }, [id]);

  const userId = session?.user?.id;

  const toggleFavorite = async () => {
    if (!userId || !game) return alert("You must be logged in.");

    try {
      const res = await fetch(`/api/auth/favoriteService`, {
        method: isFavorite ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isFavorite
            ? { id: game.id }
            : {
                userId,
                name: game.name,
                thumbnail: game.thumbnail,
              }
        ),
      });

      if (!res.ok) throw new Error("Favorite request failed");
      setIsFavorite(!isFavorite);
      alert(isFavorite ? "Removed from favorites!" : "Added to favorites!");
    } catch (err) {
      console.error(err);
      alert("Error updating favorites.");
    }
  };

  const toggleSaved = async () => {
    if (!userId || !game) return alert("You must be logged in.");

    try {
      const res = await fetch(`/api/auth/savedGames`, {
        method: isSaved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isSaved
            ? { id: game.id }
            : {
                userId,
                title: game.name,
                thumbnail: game.thumbnail,
              }
        ),
      });

      if (!res.ok) throw new Error("Save request failed");
      setIsSaved(!isSaved);
      alert(isSaved ? "Game unsaved!" : "Game saved!");
    } catch (err) {
      console.error(err);
      alert("Error updating saved games.");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6">{error}</p>;
  if (!game) return <p className="p-6">No game found.</p>;

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 bg-gray-500 text-white">
        <h2>Game Details</h2>
      </header>
      <main className="p-6 bg-[var(--background)] text-[var(--foreground)] flex-1 overflow-y-auto">
        <h1 className="text-4xl font-bold mb-4">{game.name}</h1>
        {game.thumbnail ? (
          <img
            src={game.thumbnail}
            alt={`${game.name} thumbnail`}
            className="w-full max-w-md mb-4 object-cover rounded max-h-96"
          />
        ) : (
          <div className="w-full max-w-md h-48 bg-gray-300 flex items-center justify-center mb-4 rounded">
            <span>No Image Available</span>
          </div>
        )}
        <div className="mb-4">
          <p>{cleanDescription(game.description) || "No description available."}</p>
        </div>
        <div className="flex space-x-4 mb-8">
          <button
            onClick={toggleFavorite}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
          <button
            onClick={toggleSaved}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
          >
            {isSaved ? "Unsave Game" : "Save Game"}
          </button>
        </div>
      </main>
    </div>
  );
}
