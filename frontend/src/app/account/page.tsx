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

  const removeFavorite = (id: string) => {
    let updated = favorites.filter((game) => game.id !== id);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);
  };

  const removeSavedGame = (id: string) => {
    let updated = savedGames.filter((game) => game.id !== id);
    localStorage.setItem("savedGames", JSON.stringify(updated));
    setSavedGames(updated);
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

  if (!user) return <p>Loading...</p>;

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Account</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Favorite Games</h2>
        {favorites.length > 0 ? (
          <ul className="list-disc list-inside">
            {favorites.map((game, idx) => (
              <li key={idx} className="flex justify-between items-center mb-1">
                <span>{game.name}</span>
                <button
                  onClick={() => removeFavorite(game.id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
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
              <li key={idx} className="flex justify-between items-center mb-1">
                <span>{game.name}</span>
                <button
                  onClick={() => removeSavedGame(game.id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't saved any games yet.</p>
        )}
      </section>

      <div className="flex flex-col space-y-4">
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