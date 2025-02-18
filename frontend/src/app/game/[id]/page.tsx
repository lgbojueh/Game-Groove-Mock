"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchGameDetails } from "@/utils/fetchGameDetails";

export default function GameDetailsPage() {
  const { id } = useParams();
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6">{error}</p>;
  if (!game) return <p className="p-6">No game found.</p>;

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen overflow-y-auto">
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
        <p>{game.summary}</p>
      </div>
      <div className="flex space-x-4 mb-8">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
          Add to Favorites
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
          Save Game
        </button>
      </div>
    </main>
  );
}