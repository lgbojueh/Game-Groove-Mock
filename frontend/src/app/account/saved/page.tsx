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
  const [error, setError] = useState<string>("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    const fetchSaved = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/savedGames");
        if (!res.ok) {
          throw new Error(await res.text());
        }
        setSavedGames(await res.json());
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, [status]);

  const removeSavedGame = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/auth/savedGames?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setSavedGames((g) => g.filter((x) => x.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to remove");
    } finally {
      setDeletingId(null);
    }
  };

  if (status === "loading") return <p className="p-6">Checking session…</p>;
  if (status === "unauthenticated") return <p className="p-6">Please sign in to view saved games.</p>;

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Saved Games</h1>

      {loading ? (
        <p>Loading…</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : savedGames.length === 0 ? (
        <p>You haven’t saved any games yet.</p>
      ) : (
        <ul className="space-y-4">
          {savedGames.map((g) => (
            <li key={g.id} className="flex items-start bg-gray-100 dark:bg-gray-700 p-4 rounded shadow">
              <Image
                src={g.thumbnail ?? "/default-thumbnail.jpg"}
                alt={g.title}
                width={128}
                height={96}
                className="rounded object-cover"
              />
              <div className="ml-4 flex-1">
                <h2 className="text-xl font-semibold">{g.title}</h2>
                <button
                  onClick={() => removeSavedGame(g.id)}
                  disabled={deletingId === g.id}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                >
                  {deletingId === g.id ? "Removing…" : "Remove"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
