"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Account() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [savedGames, setSavedGames] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      const storedFavorites = localStorage.getItem("favorites");
      const storedSavedGames = localStorage.getItem("savedGames");
      setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
      setSavedGames(storedSavedGames ? JSON.parse(storedSavedGames) : []);
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  const handleDeactivateAccount = () => {
    const confirmDeactivate = confirm(
      "Are you sure you want to deactivate your account? This action cannot be undone."
    );
    if (confirmDeactivate) {
      localStorage.removeItem("user");
      localStorage.removeItem("favorites");
      localStorage.removeItem("savedGames");
      setUser(null);
      alert("Your account has been deactivated.");
      router.push("/signup");
    }
  };

  const removeFavorite = (id: string) => {
    const updated = favorites.filter((game) => game.id !== id);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);
  };

  const removeSavedGame = (id: string) => {
    const updated = savedGames.filter((game) => game.id !== id);
    localStorage.setItem("savedGames", JSON.stringify(updated));
    setSavedGames(updated);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen overflow-y-auto pb-10">
      <h1 className="text-4xl font-bold mb-6">Account</h1>

      {/* Favorite Games Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Favorite Games</h2>
        {favorites.length === 0 ? (
          <p>You have no favorite games.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((game, idx) => (
              <div
                key={idx}
                className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow flex flex-col items-center"
              >
                {game.thumbnail && (
                  <img
                    src={game.thumbnail}
                    alt={`${game.name} thumbnail`}
                    className="w-32 h-auto rounded mb-2"
                  />
                )}
                <h3 className="text-xl font-semibold mb-2">{game.name}</h3>
                <button
                  onClick={() => removeFavorite(game.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Saved Games Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Saved Games</h2>
        {savedGames.length === 0 ? (
          <p>You have no saved games.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedGames.map((game, idx) => (
              <div
                key={idx}
                className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow flex flex-col items-center"
              >
                {game.thumbnail && (
                  <img
                    src={game.thumbnail}
                    alt={`${game.name} thumbnail`}
                    className="w-32 h-auto rounded mb-2"
                  />
                )}
                <h3 className="text-xl font-semibold mb-2">{game.name}</h3>
                <button
                  onClick={() => removeSavedGame(game.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Logout and Deactivate Buttons */}
      <div className="flex flex-col space-y-4 mt-8">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
        <button
          onClick={handleDeactivateAccount}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          Deactivate Account
        </button>
      </div>
    </main>
  );
}