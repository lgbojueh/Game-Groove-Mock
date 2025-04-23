// src/app/account/page.tsx
"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Game {
  id: number;
  title: string;
  thumbnail?: string;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [savedGames, setSavedGames] = useState<Game[]>([]);
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deactivating, setDeactivating] = useState(false);
  const [deactivateError, setDeactivateError] = useState<string | null>(null);

  // Fetch saved & favorite games
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

        setSavedGames(await savedRes.json());
        setFavoriteGames(await favRes.json());
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Failed to load games.");
        } else {
          setError("Failed to load games.");
        }
      } finally {
        setLoadingGames(false);
      }
    })();
  }, [status, session]);

  // Remove handlers
  const removeSavedGame = async (id: number) => {
    await fetch(`/api/auth/savedGames?id=${id}`, { method: "DELETE" });
    setSavedGames((g) => g.filter((x) => x.id !== id));
  };
  const removeFavoriteGame = async (id: number) => {
    await fetch(`/api/auth/favoriteService?id=${id}`, { method: "DELETE" });
    setFavoriteGames((g) => g.filter((x) => x.id !== id));
  };

  // Logout
  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: "/login" });
  }, []);

  // Deactivate account
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
      if (err instanceof Error) {
        setDeactivateError(err.message || "Error deactivating");
      } else {
        setDeactivateError("An unknown error occurred.");
      }
      setDeactivating(false);
    }
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") return <div className="p-6">Loading account…</div>;

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
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 disabled:opacity-50"
        >
          {deactivating ? "Deactivating…" : "Deactivate Account"}
        </button>
        {deactivateError && (
          <p className="text-red-500 mt-2">{deactivateError}</p>
        )}
      </div>

      {loadingGames ? (
        <p>Loading your games…</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Favorite Games</h2>
            {favoriteGames.length === 0 ? (
              <p>You have no favorite games.</p>
            ) : (
              <ul className="space-y-4">
                {favoriteGames.map((g) => (
                  <li
                    key={g.id}
                    className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow"
                  >
                    <h3 className="text-xl font-semibold">{g.title}</h3>
                    {g.thumbnail ? (
                      <Image
                        src={g.thumbnail}
                        alt={g.title || "Favorite game thumbnail"}
                        width={128}
                        height={96}
                        className="mt-2 rounded"
                      />
                    ) : (
                      <div className="w-32 h-20 bg-gray-300 flex items-center justify-center mt-2 rounded">
                        <span>No Image</span>
                      </div>
                    )}
                    <button
                      onClick={() => removeFavoriteGame(g.id)}
                      className="bg-red-500 text-white px-3 py-1 mt-2 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">Saved Games</h2>
            {savedGames.length === 0 ? (
              <p>You have no saved games.</p>
            ) : (
              <ul className="space-y-4">
                {savedGames.map((g) => (
                  <li
                    key={g.id}
                    className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow"
                  >
                    <h3 className="text-xl font-semibold">{g.title}</h3>
                    {g.thumbnail ? (
                      <Image
                        src={g.thumbnail}
                        alt={g.title || "Saved game thumbnail"}
                        width={128}
                        height={96}
                        className="mt-2 rounded"
                      />
                    ) : (
                      <div className="w-32 h-20 bg-gray-300 flex items-center justify-center mt-2 rounded">
                        <span>No Image</span>
                      </div>
                    )}
                    <button
                      onClick={() => removeSavedGame(g.id)}
                      className="bg-red-500 text-white px-3 py-1 mt-2 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
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
