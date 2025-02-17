"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Account() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [savedGames, setSavedGames] = useState<any[]>([]);

  useEffect(() => {
    // Retrieve the logged-in user
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      // Retrieve favorites and saved games (if stored)
      const storedFavorites = localStorage.getItem("favorites");
      const storedSavedGames = localStorage.getItem("savedGames");
      setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
      setSavedGames(storedSavedGames ? JSON.parse(storedSavedGames) : []);
    } else {
      // If no user is found, redirect to login
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Account</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Favorite Games</h2>
        {favorites.length > 0 ? (
          <ul className="list-disc list-inside">
            {favorites.map((game, idx) => (
              <li key={idx} className="mb-1">
                {game.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't added any favorite games yet.</p>
        )}
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Saved Games</h2>
        {savedGames.length > 0 ? (
          <ul className="list-disc list-inside">
            {savedGames.map((game, idx) => (
              <li key={idx} className="mb-1">
                {game.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't saved any games yet.</p>
        )}
      </section>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </main>
  );
}