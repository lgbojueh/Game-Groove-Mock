// src/app/game/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { fetchGameDetails } from "@/utils/fetchGameDetails";
import { cleanDescription } from "@/utils/cleanup";
import Image from "next/image";

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

// shape returned by your favoriteService
interface FavoriteRecord {
  id: number;
  name: string;
  thumbnail: string | null;
}

// (If you implement a savedService, it could be identical)
interface SavedRecord {
  id: number;
  title: string;
  thumbnail: string | null;
}

export default function GameDetailsPage() {
  const { id } = useParams();
  const { status } = useSession();

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // track the record-IDs so we can DELETE later
  const [favoriteId, setFavoriteId] = useState<number | null>(null);
  const [savedId, setSavedId]       = useState<number | null>(null);

  // 1) load the game itself
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchGameDetails(id as string);
        if (data && data.id) {
          setGame({ ...data, id: data.id as string });
        } else {
          setError("Invalid game data.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load game details.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // 2) once we know the user is authenticated *and* the game is loaded,
  //    fetch their existing favorites & savedGames to seed the button state
  useEffect(() => {
    if (status !== "authenticated" || !game) return;

    // favorites
    fetch("/api/auth/favoriteService")
      .then((res) => res.json() as Promise<FavoriteRecord[]>)
      .then((list) => {
        const found = list.find((f) => f.name === game.name);
        setFavoriteId(found ? found.id : null);
      })
      .catch(console.error);

    // saved games (you’ll need to create savedService similarly)
    fetch("/api/auth/savedService")
      .then((res) => res.json() as Promise<SavedRecord[]>)
      .then((list) => {
        const found = list.find((s) => s.title === game.name);
        setSavedId(found ? found.id : null);
      })
      .catch(console.error);
  }, [status, game]);

  const toggleFavorite = async () => {
    if (status !== "authenticated") {
      alert("You must be logged in to favorite a game");
      return;
    }
    if (!game) return;

    if (favoriteId) {
      // DELETE
      const res = await fetch(`/api/auth/favoriteService?id=${favoriteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFavoriteId(null);
        alert("Removed from favorites");
      } else {
        alert("Failed to remove favorite");
      }
    } else {
      // POST
      const res = await fetch("/api/auth/favoriteService", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: game.name,
          thumbnail: game.thumbnail,
        }),
      });
      if (res.ok) {
        const created = (await res.json()) as FavoriteRecord;
        setFavoriteId(created.id);
        alert("Added to favorites");
      } else {
        alert("Failed to add favorite");
      }
    }
  };

  const toggleSaved = async () => {
    if (status !== "authenticated") {
      alert("You must be logged in to save a game");
      return;
    }
    if (!game) return;

    if (savedId) {
      // DELETE
      const res = await fetch(`/api/auth/savedService?id=${savedId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSavedId(null);
        alert("Removed from saved games");
      } else {
        alert("Failed to remove saved game");
      }
    } else {
      // POST
      const res = await fetch("/api/auth/savedService", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: game.name,
          thumbnail: game.thumbnail,
        }),
      });
      if (res.ok) {
        const created = (await res.json()) as SavedRecord;
        setSavedId(created.id);
        alert("Added to saved games");
      } else {
        alert("Failed to save game");
      }
    }
  };

  if (loading) return <p className="p-6">Loading…</p>;
  if (error)   return <p className="p-6 text-red-500">{error}</p>;
  if (!game)   return <p className="p-6">No game found.</p>;

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
        <div className="mb-4 whitespace-pre-line">
          <p>{cleanDescription(game.description)}</p>
        </div>
        <div className="flex space-x-4 mb-8">
          <button
            onClick={toggleFavorite}
            className={`px-4 py-2 rounded ${
              favoriteId
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            {favoriteId ? "Remove from Favorites" : "Add to Favorites"}
          </button>

          <button
            onClick={toggleSaved}
            className={`px-4 py-2 rounded ${
              savedId
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            {savedId ? "Unsave Game" : "Save Game"}
          </button>
        </div>
      </main>
    </div>
  );
}
