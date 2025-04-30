// src/app/game/[id]/GameDetailsClient.tsx
"use client";

import { useState, useEffect }                      from "react";
import { useParams }                                from "next/navigation";
import { useSession }                               from "next-auth/react";
import { fetchGameDetails, GameDetails }            from "@/utils/fetchGameDetails";
import { cleanDescription }                         from "@/utils/cleanup";
import Image                                        from "next/image";
import RatingAndComments                            from "@/components/RatingAndComments";

interface FavoriteRecord {
  id:        number;
  gameId:    string;
  title:     string;
  thumbnail: string | null;
}

interface SavedRecord {
  id:        number;
  gameId:    string;
  title:     string;
  thumbnail: string | null;
}

export default function GameDetailsClient() {
  const { id }     = useParams();
  const { status } = useSession();

  const [game,       setGame]       = useState<GameDetails | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");

  const [favoriteId, setFavoriteId] = useState<number | null>(null);
  const [savedId,    setSavedId]    = useState<number | null>(null);

  // 1. Load game details
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

  // 2. Load existing favorite & saved IDs
  useEffect(() => {
    if (status !== "authenticated" || !game) return;

    // -- favorites
    fetch("/api/auth/favoriteService")
      .then((r) => r.json())
      .then((list: FavoriteRecord[]) => {
        // Compare against the `title` field, not `name`
        const found = list.find((f) => f.title === game.name);
        setFavoriteId(found?.id ?? null);
      })
      .catch(console.error);

    // -- saved
    fetch("/api/auth/savedGames")
      .then((r) => r.json())
      .then((list: SavedRecord[]) => {
        const found = list.find((s) => s.title === game.name);
        setSavedId(found?.id ?? null);
      })
      .catch(console.error);
  }, [status, game]);

  // Toggle favorite
  const toggleFavorite = async () => {
    if (status !== "authenticated") {
      alert("You must be logged in to favorite a game.");
      return;
    }
    if (!game) return;

    // Remove if already favorited
    if (favoriteId) {
      const res = await fetch(`/api/auth/favoriteService?id=${favoriteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFavoriteId(null);
        alert("Removed from favorites.");
      } else {
        const err = await res.json();
        alert("Error removing favorite: " + err.error);
      }
      return;
    }

    // Otherwise create favorite
    const res = await fetch("/api/auth/favoriteService", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId:    game.id,
        name:      game.name,      // the API expects `name` for title
        thumbnail: game.thumbnail,
      }),
    });

    if (res.ok) {
      const created = (await res.json()) as FavoriteRecord;
      setFavoriteId(created.id);
      alert("Added to favorites!");
    } else {
      const err = await res.json();
      alert("Error adding favorite: " + err.error);
    }
  };

  // Toggle saved
  const toggleSaved = async () => {
    if (status !== "authenticated") {
      alert("You must be logged in to save a game.");
      return;
    }
    if (!game) return;

    // Remove if already saved
    if (savedId) {
      const res = await fetch(`/api/auth/savedGames?id=${savedId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSavedId(null);
        alert("Removed from saved games.");
      } else {
        const err = await res.json();
        alert("Error removing saved game: " + err.error);
      }
      return;
    }

    // Otherwise create saved game
    const res = await fetch("/api/auth/savedGames", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId:    game.id,
        title:     game.name,
        thumbnail: game.thumbnail,
      }),
    });

    if (res.ok) {
      const created = (await res.json()) as SavedRecord;
      setSavedId(created.id);
      alert("Saved game!");
    } else {
      const err = await res.json();
      alert("Error saving game: " + err.error);
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
        <h1 className="text-4xl font-bold mb-4">{game.name}</h1>

        {/* Image */}
        {game.image || game.thumbnail ? (
          <Image
            src={game.image || game.thumbnail!}
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
        <div className="mb-4 whitespace-pre-line">
          <p>{cleanDescription(game.description)}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex mb-8">
          <button
            onClick={toggleFavorite}
            className={`mr-4 px-4 py-2 rounded ${
              favoriteId
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            {favoriteId ? "Remove Favorite" : "Add to Favorites"}
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
            href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(
              game.name + " board game"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Buy on Google
          </a>
        </div>

        {/* Ratings & Comments */}
        {game.id && <RatingAndComments gameId={game.id} />}
      </main>
    </div>
  );
}
