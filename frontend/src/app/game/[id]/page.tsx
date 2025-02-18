"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchGameDetails } from "@/utils/fetchGameDetails";

export default function GameDetailsPage() {
  const { id } = useParams();
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

  // Update local state when game is fetched
  useEffect(() => {
    if (game) {
      const storedFavorites = localStorage.getItem("favorites");
      let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
      setIsFavorite(favorites.some((fav: any) => fav.id === game.id));

      const storedSaved = localStorage.getItem("savedGames");
      let savedGames = storedSaved ? JSON.parse(storedSaved) : [];
      setIsSaved(savedGames.some((saved: any) => saved.id === game.id));
    }
  }, [game]);

  const toggleFavorite = () => {
    const storedFavorites = localStorage.getItem("favorites");
    let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    if (favorites.some((fav: any) => fav.id === game.id)) {
      // Remove from favorites
      favorites = favorites.filter((fav: any) => fav.id !== game.id);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(false);
      alert("Removed from favorites!");
    } else {
      // Add to favorites
      favorites.push(game);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
      alert("Added to favorites!");
    }
  };

  const toggleSaved = () => {
    const storedSaved = localStorage.getItem("savedGames");
    let savedGames = storedSaved ? JSON.parse(storedSaved) : [];
    if (savedGames.some((saved: any) => saved.id === game.id)) {
      // Remove from saved
      savedGames = savedGames.filter((saved: any) => saved.id !== game.id);
      localStorage.setItem("savedGames", JSON.stringify(savedGames));
      setIsSaved(false);
      alert("Game unsaved!");
    } else {
      // Add to saved
      savedGames.push(game);
      localStorage.setItem("savedGames", JSON.stringify(savedGames));
      setIsSaved(true);
      alert("Game saved!");
    }
  };

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
        <p>{game.description || "No description available."}</p>
      </div>
      <div className="flex space-x-4 mb-8">
        <button
          onClick={toggleFavorite}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </button>
        <button
          onClick={toggleSaved}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          {isSaved ? "Unsave Game" : "Save Game"}
        </button>
      </div>
    </main>
  );
}