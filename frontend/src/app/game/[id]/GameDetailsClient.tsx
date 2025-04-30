// src/app/game/[id]/GameDetailsClient.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { fetchGameDetails, GameDetails } from "@/utils/fetchGameDetails";
import { cleanDescription } from "@/utils/cleanup";
import Image from "next/image";
import RatingAndComments from "@/components/RatingAndComments";

interface FavoriteRecord {
  id: number;
  name: string;
  thumbnail: string | null;
}

interface SavedRecord {
  id: number;
  title: string;
  thumbnail: string | null;
}

export default function GameDetailsClient() {
  const { id } = useParams();
  const router = useRouter();
  const { status } = useSession();

  const [game, setGame] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [favoriteId, setFavoriteId] = useState<number | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);

  // 1) Load game details
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchGameDetails(id as string);
        if (data?.id) {
          setGame(data);
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

  // 2) Load existing favorite & saved if authenticated
  useEffect(() => {
    if (status !== "authenticated" || !game) return;

    fetch("/api/auth/favoriteService")
      .then((res) => res.json() as Promise<FavoriteRecord[]>)
      .then((list) => {
        const found = list.find((f) => f.name === game.name);
        setFavoriteId(found?.id ?? null);
      })
      .catch(console.error);

    fetch("/api/auth/savedGames")
      .then((res) => res.json() as Promise<SavedRecord[]>)
      .then((list) => {
        const found = list.find((s) => s.title === game.name);
        setSavedId(found?.id ?? null);
      })
      .catch(console.error);
  }, [status, game]);

  // Toggle favorite
  const toggleFavorite = useCallback(async () => {
    if (status !== "authenticated") {
      alert("Please sign up or log in to add favorites.");
      return;
    }
    if (!game) return;

    if (favoriteId) {
      const res = await fetch(`/api/auth/favoriteService?id=${favoriteId}`, { method: "DELETE" });
      if (res.ok) {
        setFavoriteId(null);
        alert("Removed from favorites");
      } else {
        alert("Failed to remove favorite");
      }
    } else {
      const res = await fetch("/api/auth/favoriteService", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: game.name, thumbnail: game.thumbnail }),
      });
      if (res.ok) {
        const created = (await res.json()) as FavoriteRecord;
        setFavoriteId(created.id);
        alert("Added to favorites");
      } else {
        alert("Failed to add favorite");
      }
    }
  }, [status, favoriteId, game]);

  // Toggle saved
  const toggleSaved = useCallback(async () => {
    if (status !== "authenticated") {
      alert("Please sign up or log in to save games.");
      return;
    }
    if (!game) return;

    if (savedId) {
      const res = await fetch(`/api/auth/savedGames?id=${savedId}`, { method: "DELETE" });
      if (res.ok) {
        setSavedId(null);
        alert("Removed from saved games");
      } else {
        alert("Failed to remove saved game");
      }
    } else {
      const res = await fetch("/api/auth/savedGames", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: game.name, thumbnail: game.thumbnail }),
      });
      if (res.ok) {
        const created = (await res.json()) as SavedRecord;
        setSavedId(created.id);
        alert("Game saved");
      } else {
        alert("Failed to save game");
      }
    }
  }, [status, savedId, game]);

  if (loading) return <p className="p-6">Loading…</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!game) return <p className="p-6">No game found.</p>;

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 bg-gray-500 text-white flex items-center justify-between">
        <h2>Game Details</h2>
        <button onClick={() => router.back()} className="underline">
          Back
        </button>
      </header>

      <main className="p-6 bg-[var(--background)] text-[var(--foreground)] flex-1 overflow-y-auto">
        {/* Title */}
        <h1 className="text-4xl font-bold mb-4">{game.name}</h1>

        {/* Image */}
        {game.image || game.thumbnail ? (
          <Image
            src={game.image || game.thumbnail}
            alt={`${game.name} cover art`}
            width={400}
            height={300}
            className="w-full max-w-md mb-4 object-cover rounded"
          />
        ) : (
          <div className="w-full max-w-md h-48 bg-gray-300 flex items-center justify-center mb-4 rounded">
            <span>No Image Available</span>
          </div>
        )}

        {/* Description */}
        <div className="mb-8 whitespace-pre-line">
          <p>{cleanDescription(game.description)}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={toggleFavorite}
            className={`px-4 py-2 rounded ${
              favoriteId ? "bg-red-600 text-white" : "bg-gray-200 text-black"
            } hover:opacity-90`}
          >
            {favoriteId ? "Remove Favorite" : "Add to Favorites"}
          </button>

          <button
            onClick={toggleSaved}
            className={`px-4 py-2 rounded ${
              savedId ? "bg-purple-600 text-white" : "bg-gray-200 text-black"
            } hover:opacity-90`}
          >
            {savedId ? "Unsave Game" : "Save Game"}
          </button>

          <a
            href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(
              game.name + " board game"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
          >
            Buy on Google
          </a>
        </div>

        {/* Rating & Comments */}
        <RatingAndComments gameId={game.id as string} />
      </main>
    </div>
  );
}
