"use client";
<<<<<<< HEAD

import { useState, useEffect, useActionState } from "react";
=======
import { useState, useEffect } from "react";
>>>>>>> d98153c409b64f8c4432e917daf959f4aa32649c
import { useParams } from "next/navigation";
import { fetchGameDetails } from "@/utils/fetchGameDetails";
import ThemeToggle from "@/components/ThemeToggle";

export default function GameDetailsPage() {
  const { id } = useParams();
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
<<<<<<< HEAD
  const [isSave, setIsSave] = useState(false);
=======
  const [isSaved, setIsSaved] = useState(false);
>>>>>>> d98153c409b64f8c4432e917daf959f4aa32649c

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
      favorites = favorites.filter((fav: any) => fav.id !== game.id);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(false);
      alert("Removed from favorites!");
    } else {
      favorites.push(game);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
      alert("Added to favorites!");
    }
  };

<<<<<<< HEAD
  const toggleShare = () => {
    setIsSave((prev) => !prev);
  };

  if (loading) return <p className="p-6">Loading game details...</p>;
  if (!game) return <p className="p-6">Game details not found.</p>;
=======
  const toggleSaved = () => {
    const storedSaved = localStorage.getItem("savedGames");
    let savedGames = storedSaved ? JSON.parse(storedSaved) : [];
    if (savedGames.some((saved: any) => saved.id === game.id)) {
      savedGames = savedGames.filter((saved: any) => saved.id !== game.id);
      localStorage.setItem("savedGames", JSON.stringify(savedGames));
      setIsSaved(false);
      alert("Game unsaved!");
    } else {
      savedGames.push(game);
      localStorage.setItem("savedGames", JSON.stringify(savedGames));
      setIsSaved(true);
      alert("Game saved!");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6">{error}</p>;
  if (!game) return <p className="p-6">No game found.</p>;
>>>>>>> d98153c409b64f8c4432e917daf959f4aa32649c

  return (
    // Flex container that takes the full height of the viewport
    <div className="flex flex-col h-screen">
      {/* Optional fixed header */}
      <header className="p-4 bg-gray-800 text-white">
        <h2>Game Details</h2>
      </header>
      {/* Scrollable main content */}
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
          <p>{game.description || "No description available."}</p>
        </div>
<<<<<<< HEAD
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

      <button
        onClick= {toggleShare}
        className={`px-4 py-2 squared ${
          isSave
            ? "bg-purple-900 hover:bg-purple-1000"
            : "bg-green-900 hoveer:bg-green-1000"
        } text-white`}
      >
        {isSave ? "Unsave" : "Save Game"}
      </button>
    </main>
=======
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
    </div>
>>>>>>> d98153c409b64f8c4432e917daf959f4aa32649c
  );
}