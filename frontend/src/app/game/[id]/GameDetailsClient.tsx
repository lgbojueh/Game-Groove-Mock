// src/app/game/[id]/GameDetailsClient.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
  const { status } = useSession();

  const [game, setGame] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [favoriteId, setFavoriteId] = useState<number | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);

  // 1) Load the game details
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchGameDetails(id as string);
        if (data && data.id) {
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

  // 2) Load user's existing favorite & saved entries
  useEffect(() => {
    if (status !== "authenticated" || !game) return;

    fetch("/api/auth/favoriteService")
      .then((res) => res.json() as Promise<FavoriteRecord[]>)
      .then((list) => {
        const found = list.find((f) => f.name === game.name);
        setFavoriteId(found ? found.id : null);
      })
      .catch(console.error);

    fetch("/api/auth/savedGames")
      .then((res) => res.json() as Promise<SavedRecord[]>)
      .then((list) => {
        const found = list.find((s) => s.title === game.name);
        setSavedId(found ? found.id : null);
      })
      .catch(console.error);
  }, [status, game]);

  // Toggle favorite
  const toggleFavorite = async () => {
    if (!game) return;
    if (favoriteId) {
      await fetch(`/api/auth/favoriteService?id=${favoriteId}`, { method: "DELETE" });
      setFavoriteId(null);
    } else {
      const res = await fetch("/api/auth/favoriteService", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: game.name, thumbnail: game.thumbnail }),
      });
      if (res.ok) {
        const created = (await res.json()) as FavoriteRecord;
        setFavoriteId(created.id);
      }
    }
  };

  // Toggle saved
  const toggleSaved = async () => {
    if (!game) return;
    if (savedId) {
      await fetch(`/api/auth/savedGames?id=${savedId}`, { method: "DELETE" });
      setSavedId(null);
    } else {
      const res = await fetch("/api/auth/savedGames", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: game.name, thumbnail: game.thumbnail }),
      });
      if (res.ok) {
        const created = (await res.json()) as SavedRecord;
        setSavedId(created.id);
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
        {/* Title */}
        <h1 className="text-4xl font-bold mb-4 text-[var(--foreground)]">
          {game.name}
        </h1>

        {/* Image */}
        {game.image || game.thumbnail ? (
          <Image
            src={game.image || game.thumbnail}
            alt={`${game.name} cover art`}
            width={400}
            height={300}
            quality={80}
            placeholder="blur"
            blurDataURL={game.thumbnail || undefined}
            className="w-full max-w-md mb-4 object-cover rounded max-h-96"
          />
        ) : (
          <div className="w-full max-w-md h-48 bg-gray-300 flex items-center justify-center mb-4 rounded">
            <span>No Image Available</span>
          </div>
        )}

        {/* Description */}
        <div className="mb-4 whitespace-pre-line">
          <p className="text-[var(--foreground)]">
            {cleanDescription(game.description)}
          </p>
        </div>

        {/* Actions */}
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

          <a
            href={`https://www.google.com/search?tbm=shop&q=buy+${encodeURIComponent(
              game.name
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
