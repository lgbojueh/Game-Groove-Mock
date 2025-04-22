// src/app/account/saved/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface SavedGame {
  id: number;
  title: string;
  thumbnail?: string;
}

export default function SavedGamesPage() {
  const { status } = useSession();
  const [savedGames, setSavedGames] = useState<SavedGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      (async () => {
        try {
          setLoading(true);
          const res = await fetch("/api/auth/savedGames");
          if (!res.ok) throw new Error(await res.text());
          setSavedGames(await res.json());
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Unknown error");
          }
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [status]);

  const removeSaved = async (id: number) => {
    await fetch(`/api/auth/savedGames?id=${id}`, { method: "DELETE" });
    setSavedGames((g) => g.filter((x) => x.id !== id));
  };

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>Please log in to view saved games.</p>;

  return (
    <main className="p-6">
      <h1 className="text-3xl mb-4">Saved Games</h1>
      {loading ? (
        <p>Loading…</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : savedGames.length === 0 ? (
        <p>No saved games.</p>
      ) : (
        <ul className="space-y-4">
          {savedGames.map((g) => (
            <li key={g.id} className="p-4 bg-gray-100 rounded">
              <h2 className="text-xl">{g.title}</h2>
              {g.thumbnail && (
                <Image src={g.thumbnail} alt="" width={128} height={80} className="mt-2" />
              )}
              <button
                onClick={() => removeSaved(g.id)}
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
