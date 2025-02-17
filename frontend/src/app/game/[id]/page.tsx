"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchGameDetails } from "@/utils/fetchGameDetails";

export default function GameDetailsPage() {
  const params = useParams();
  const gameId = params.id as string;

  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const getDetails = async () => {
      setLoading(true);
      const data = await fetchGameDetails(gameId);
      setGame(data);
      setLoading(false);
    };

    getDetails();
  }, [gameId]);

  const handleRating = (newRating: number) => {
    setRating(newRating);
    // Optionally persist the rating here.
  };

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
    // Optionally persist the favorite state here.
  };

  if (loading) return <p className="p-6">Loading game details...</p>;
  if (!game) return <p className="p-6">Game details not found.</p>;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-6">
      <h1 className="text-4xl font-bold mb-4">{game.name}</h1>
      {game.thumbnail && (
        <img
          src={game.thumbnail}
          alt={`${game.name} thumbnail`}
          className="w-full max-w-md max-h-64 object-contain mb-4 mx-auto"
        />
      )}
      <p className="mb-6">{game.description}</p>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Rate this game</h2>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              className={`text-2xl ${
                star <= rating ? "text-yellow-400" : "text-gray-400"
              }`}
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={toggleFavorite}
        className={`px-4 py-2 rounded ${
          isFavorite
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white`}
      >
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </button>
    </main>
  );
}