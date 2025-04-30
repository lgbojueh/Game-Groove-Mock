// src/app/account/AccountClient.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface GameItem {
  id: number;        // primary key in your favorites/savedGames table
  gameId: string;    // the BGG game ID
  title: string;
  thumbnail: string | null;
}

export default function AccountClient() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [savedGames, setSavedGames] = useState<GameItem[]>([]);
  const [favoriteGames, setFavoriteGames] = useState<GameItem[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deactivating, setDeactivating] = useState(false);
  const [deactivateError, setDeactivateError] = useState<string | null>(null);

  // Load favorites & saved
  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;
    const userId = session.user.id;
    (async () => {
      try {
        setLoadingGames(true);
        setError(null);

        const [savedRes, favRes] = await Promise.all([
          fetch(`/api/auth/savedGames?userId=${userId}`),
          fetch(`/api/auth/favoriteService?userId=${userId}`),
        ]);
        if (!savedRes.ok) throw new Error(await savedRes.text());
        if (!favRes.ok) throw new Error(await favRes.text());

        setSavedGames((await savedRes.json()) as GameItem[]);
        setFavoriteGames((await favRes.json()) as GameItem[]);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load games.");
      } finally {
        setLoadingGames(false);
      }
    })();
  }, [status, session]);

  const removeSavedGame = useCallback(async (id: number) => {
    await fetch(`/api/auth/savedGames?id=${id}`, { method: "DELETE" });
    setSavedGames((list) => list.filter((g) => g.id !== id));
  }, []);

  const removeFavoriteGame = useCallback(async (id: number) => {
    await fetch(`/api/auth/favoriteService?id=${id}`, { method: "DELETE" });
    setFavoriteGames((list) => list.filter((g) => g.id !== id));
  }, []);

  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: "/login" });
  }, []);

  const handleDeactivate = useCallback(async () => {
    if (!confirm("Really deactivate your account? This cannot be undone.")) return;
    setDeactivating(true);
    setDeactivateError(null);
    try {
      const res = await fetch("/api/auth/deactivate", { method: "POST" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Deactivation failed");
      await signOut({ callbackUrl: "/" });
    } catch (err: unknown) {
      setDeactivateError(err instanceof Error ? err.message : "Unknown error.");
      setDeactivating(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return <div className="p-6">Loading account…</div>;
  }

  return (
    <main className="p-6 min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {session?.user?.name || session?.user?.email}!
      </h1>

      <div className="space-x-4 mb-6">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
        <button
          onClick={handleDeactivate}
          disabled={deactivating}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-900 disabled:opacity-50"
        >
          {deactivating ? "Deactivating…" : "Deactivate Account"}
        </button>
        {deactivateError && <p className="text-red-500 mt-2">{deactivateError}</p>}
      </div>

      {loadingGames ? (
        <p>Loading your games…</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {/* Favorite Games */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Favorite Games</h2>
            {favoriteGames.length === 0 ? (
              <p>You have no favorite games.</p>
            ) : (
              <ul className="space-y-4">
                {favoriteGames.map((g) => (
                  <li
                    key={`fav-${g.id}`}
                    className="bg-gray-100 dark:bg-gray-400 p-4 rounded shadow flex items-start space-x-4"
                  >
                    <Link href={`/game/${g.gameId}`} className="flex-shrink-0">
                      {g.thumbnail ? (
                        <Image
                          src={g.thumbnail}
                          alt={`${g.title} thumbnail`}
                          width={128}
                          height={96}
                          className="rounded cursor-pointer"
                        />
                      ) : (
                        <div className="w-32 h-24 bg-gray-300 rounded flex items-center justify-center">
                          <span>No Image</span>
                        </div>
                      )}
                    </Link>
                    <div className="flex-1">
                      <Link
                        href={`/game/${g.gameId}`}
                        className="text-xl font-semibold hover:underline block"
                      >
                        {g.title}
                      </Link>
                      <button
                        onClick={() => removeFavoriteGame(g.id)}
                        className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Saved Games */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">Saved Games</h2>
            {savedGames.length === 0 ? (
              <p>You have no saved games.</p>
            ) : (
              <ul className="space-y-4">
                {savedGames.map((g) => (
                  <li
                    key={`saved-${g.id}`}
                    className="bg-gray-100 dark:bg-gray-400 p-4 rounded shadow flex items-start space-x-4"
                  >
                    <Link href={`/game/${g.gameId}`} className="flex-shrink-0">
                      {g.thumbnail ? (
                        <Image
                          src={g.thumbnail}
                          alt={`${g.title} thumbnail`}
                          width={128}
                          height={96}
                          className="rounded cursor-pointer"
                        />
                      ) : (
                        <div className="w-32 h-24 bg-gray-300 rounded flex items-center justify-center">
                          <span>No Image</span>
                        </div>
                      )}
                    </Link>
                    <div className="flex-1">
                      <Link
                        href={`/game/${g.gameId}`}
                        className="text-xl font-semibold hover:underline block"
                      >
                        {g.title}
                      </Link>
                      <button
                        onClick={() => removeSavedGame(g.id)}
                        className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}
