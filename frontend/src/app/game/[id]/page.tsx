"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function GameDetailsPage() {
  const { id } = useParams();
  const [game, setGame] = useState<any>(null);

  useEffect(() => {
    async function fetchGame() {
      // Simulated API call—replace with your real API call to fetch game details
      const fetchedGame = {
        id,
        name: "Example Game",
        thumbnail: "/example-game.jpg", // Ensure this image exists or use an external URL
        summary:
          "This is an example game. It is fun, challenging, and great for game nights. " +
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(5),
      };
      setGame(fetchedGame);
    }
    fetchGame();
  }, [id]);

  const handleAddFavorite = () => {
    const storedFavorites = localStorage.getItem("favorites");
    let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
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