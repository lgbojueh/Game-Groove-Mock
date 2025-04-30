// src/app/account/AccountClient.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface GameItem {
  id: number;
  gameId: string;
  title: string;          // now non‐empty
  thumbnail: string | null;
}

export default function AccountClient() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [favoriteGames, setFavoriteGames] = useState<GameItem[]>([]);
  const [savedGames, setSavedGames]       = useState<GameItem[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string>();

  // fetch both lists
  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;
    const uid = session.user.id;
    (async () => {
      try {
        setLoading(true);
        const [favRes, saveRes] = await Promise.all([
          fetch(`/api/auth/favoriteService?userId=${uid}`),
          fetch(`/api/auth/savedGames?userId=${uid}`),
        ]);
        if (!favRes.ok) throw new Error(await favRes.text());
        if (!saveRes.ok) throw new Error(await saveRes.text());
        setFavoriteGames(await favRes.json());
        setSavedGames(await saveRes.json());
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [status, session]);

  const removeFavoriteGame = useCallback(async (id: number) => {
    await fetch(`/api/auth/favoriteService?id=${id}`, { method: "DELETE" });
    setFavoriteGames((l) => l.filter((g) => g.id !== id));
  }, []);

  const removeSavedGame = useCallback(async (id: number) => {
    await fetch(`/api/auth/savedGames?id=${id}`, { method: "DELETE" });
    setSavedGames((l) => l.filter((g) => g.id !== id));
  }, []);

  // redirect if logged out
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading" || loading) return <p className="p-6">Loading…</p>;
  if (error)                          return <p className="p-6 text-red-500">{error}</p>;

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Welcome, {session?.user?.name}</h1>

      {/* Favorite Games */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Favorite Games</h2>
        {favoriteGames.length === 0 ? (
          <p>You have no favorites yet.</p>
        ) : (
          <ul className="space-y-4">
            {favoriteGames.map((g) => (
              <li 
                key={`fav-${g.id}`} 
                className="flex items-start space-x-4 bg-gray-100 dark:bg-gray-400 p-4 rounded shadow"
              >
                {/* thumbnail */}
                <Link 
                  href={`/game/${g.gameId}`} 
                  className="flex-shrink-0 rounded overflow-hidden"
                >
                  {g.thumbnail ? (
                    <Image
                      src={g.thumbnail}
                      alt={`${g.title} cover`}
                      width={128}
                      height={96}
                      className="rounded"
                    />
                  ) : (
                    <div className="w-32 h-24 bg-gray-300 flex items-center justify-center rounded">
                      <span>No Image</span>
                    </div>
                  )}
                </Link>

                {/* title & action */}
                <div className="flex-1">
                  <Link
                    href={`/game/${g.gameId}`}
                    className="block text-xl font-semibold hover:underline mb-2"
                  >
                    {g.title}
                  </Link>
                  <button
                    onClick={() => removeFavoriteGame(g.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Saved Games (layout matches exactly) */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Saved Games</h2>
        {savedGames.length === 0 ? (
          <p>You have no saved games.</p>
        ) : (
          <ul className="space-y-4">
            {savedGames.map((g) => (
              <li 
                key={`saved-${g.id}`} 
                className="flex items-start space-x-4 bg-gray-100 dark:bg-gray-400 p-4 rounded shadow"
              >
                <Link 
                  href={`/game/${g.gameId}`} 
                  className="flex-shrink-0 rounded overflow-hidden"
                >
                  {g.thumbnail ? (
                    <Image
                      src={g.thumbnail}
                      alt={`${g.title} cover`}
                      width={128}
                      height={96}
                      className="rounded"
                    />
                  ) : (
                    <div className="w-32 h-24 bg-gray-300 flex items-center justify-center rounded">
                      <span>No Image</span>
                    </div>
                  )}
                </Link>

                <div className="flex-1">
                  <Link
                    href={`/game/${g.gameId}`}
                    className="block text-xl font-semibold hover:underline mb-2"
                  >
                    {g.title}
                  </Link>
                  <button
                    onClick={() => removeSavedGame(g.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
