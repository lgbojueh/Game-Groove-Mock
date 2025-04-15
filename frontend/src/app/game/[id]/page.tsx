"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchGameDetails } from "@/utils/fetchGameDetails";
import Image from "next/image";

// Game type interface
interface Game {
  id: string;
  name: string;
  thumbnail?: string;
  description?: string;
  complexity: string;
  players: string;
  playtime: string;
  genre: string;
  age: string;
  theme: string;
}

// Helper to clean unwanted line-break entities from a description.
const cleanDescription = (desc?: string) =>
  desc ? desc.replace(/&#10;&#10;/g, " ") : "";

export default function GameDetailsPage() {
  const { id } = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function getGameDetails() {
      try {
        const data = await fetchGameDetails(id as string);
        if (data && data.id) {
          setGame({ ...data, id: data.id as string });
        } else {
          setError("Invalid game data.");
        }
      } catch (err) {
        console.error("Error fetching game details:", err);
        setError("Failed to load game details.");
      } finally {
        setLoading(false);
      }
    }
    getGameDetails();
  }, [id]);

  useEffect(() => {
    if (game) {
      const storedFavorites = localStorage.getItem("favorites");
      const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
      setIsFavorite(favorites.some((fav: Game) => fav.id === game.id));

      const storedSaved = localStorage.getItem("savedGames");
      const savedGames = storedSaved ? JSON.parse(storedSaved) : [];
      setIsSaved(savedGames.some((saved: Game) => saved.id === game.id));
    }
  }, [game]);

  const toggleFavorite = () => {
    if (!game) return;
    const storedFavorites = localStorage.getItem("favorites");
    let favorites: Game[] = storedFavorites ? JSON.parse(storedFavorites) : [];

    if (favorites.some((fav) => fav.id === game.id)) {
      favorites = favorites.filter((fav) => fav.id !== game.id);
      setIsFavorite(false);
      alert("Removed from favorites!");
    } else {
      favorites.push(game);
      setIsFavorite(true);
      alert("Added to favorites!");
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  const toggleSaved = () => {
    if (!game) return;
    const storedSaved = localStorage.getItem("savedGames");
    let savedGames: Game[] = storedSaved ? JSON.parse(storedSaved) : [];

    if (savedGames.some((saved) => saved.id === game.id)) {
      savedGames = savedGames.filter((saved) => saved.id !== game.id);
      setIsSaved(false);
      alert("Game unsaved!");
    } else {
      savedGames.push(game);
      setIsSaved(true);
      alert("Game saved!");
    }

    localStorage.setItem("savedGames", JSON.stringify(savedGames));
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
          <Image
            src={game.thumbnail}
            alt={`${game.name} thumbnail`}
            width={400}
            height={300}
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
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
          <button
            onClick={toggleSaved}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            {isSaved ? "Unsave Game" : "Save Game"}
          </button>
        </div>
      </main>
    </div>
  );
}
