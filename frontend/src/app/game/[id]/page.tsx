"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function GameDetailsPage() {
  const { id } = useParams();
  const [game, setGame] = useState<any>(null);

  // Simulate fetching game details (replace with your actual fetch logic)
  useEffect(() => {
    async function fetchGame() {
      // For demonstration, we're using a static object.
      // Replace this with an API call to fetch details by id.
      const fetchedGame = {
        id,
        name: "Example Game",
        thumbnail: "/example-game.jpg", // Ensure this image exists in public folder or use a URL.
        summary: "This is an example game. It is fun, challenging, and great for game nights.",
      };
      setGame(fetchedGame);
    }
    fetchGame();
  }, [id]);

  const handleAddFavorite = () => {
    const storedFavorites = localStorage.getItem("favorites");
    let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    // Prevent duplicate favorites.
    if (!favorites.find((fav: any) => fav.id === game.id)) {
      favorites.push(game);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert("Game added to favorites!");
    } else {
      alert("This game is already in your favorites!");
    }
  };

  const handleSaveGame = () => {
    const storedSaved = localStorage.getItem("savedGames");
    let savedGames = storedSaved ? JSON.parse(storedSaved) : [];
    // Prevent duplicate saved games.
    if (!savedGames.find((saved: any) => saved.id === game.id)) {
      savedGames.push(game);
      localStorage.setItem("savedGames", JSON.stringify(savedGames));
      alert("Game saved!");
    } else {
      alert("This game is already saved!");
    }
  };

  if (!game) return <p>Loading...</p>;

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <h1 className="text-4xl font-bold mb-4">{game.name}</h1>
      {game.thumbnail ? (
        <img
          src={game.thumbnail}
          alt={`${game.name} thumbnail`}
          className="w-full max-w-md mb-4 object-cover rounded"
        />
      ) : (
        <div className="w-full max-w-md h-48 bg-gray-300 flex items-center justify-center mb-4 rounded">
          <span>No Image Available</span>
        </div>
      )}
      <p className="mb-4">{game.summary}</p>
      <div className="flex space-x-4">
        <button
          onClick={handleAddFavorite}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Add to Favorites
        </button>
        <button
          onClick={handleSaveGame}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Save Game
        </button>
      </div>
    </main>
  );
}