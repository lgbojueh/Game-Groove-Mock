"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function SavedGamesPage() {
  const router = useRouter();
  const [savedGames, setSavedGames] = useState<any[]>([]);
  const [purchase, setPurchase] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedSaved = localStorage.getItem("savedGames");
    setSavedGames(storedSaved ? JSON.parse(storedSaved) : []);
  }, []);

  // Opening and closing the dropdown function
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [pathname]);

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 300);
  };

  const handleToggle = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Closing the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => 
      document.addEventListener("mousedown", handleClickOutside);
  }, []);

  const removeSavedGame = (id: string) => {
    const updated = savedGames.filter((game) => game.id !== id);
    localStorage.setItem("savedGames", JSON.stringify(updated));
    setSavedGames(updated);
  };

  const purchaseGame = (id: string) => {
    const shop = purchase.filter((game) => game.id === id);
    localStorage.setItem("purchase", JSON.stringify(shop));
    setPurchase(shop);
  };

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen overflow-y-auto">
      <h1 className="text-4xl font-bold mb-6">Saved Games</h1>
      {savedGames.length === 0 ? (
        <p>You have no saved games.</p>
      ) : (
        <ul className="space-y-4">
          {savedGames.map((game, idx) => (
            <li key={idx} className="flex justify-between items-center bg-gray-400 dark:bg-gray-300 p-4 rounded shadow">
              <div>
                <h2 className="text-xl font-semibold">{game.name}</h2>
                {game.thumbnail && (
                  <img
                    src={game.thumbnail}
                    alt={`${game.name} thumbnail`}
                    className="w-32 h-auto rounded mt-2"
                  />
                )}
              </div>
              <button
                onClick={() => removeSavedGame(game.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Remove
              </button>
              <div className="relative flex items-center space-x-2">
              <div
                className="flex items-center bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleToggle}
              >
                Purchase Game
                <svg
                  xmlns = "http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[var(--foreground)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
              {
                dropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-full right-0 mt-2 w-48 bg-gray-300 dark:bg-gray-200 rounded shadow-lg z-50"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    >
                      <div className="py-1">
                        <button
                          onClick={() => router.push("https://www.amazon.com/")}
                          className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-500"
                        >
                          Shop on Amazon
                        </button>
                        <button
                          onClick={() => router.push("https://www.ebay.com/")}
                          className="bg-blue-400 text-white px-5 py-2 rounded hover:bg-blue-500"
                        >
                          Shop on Ebay  
                        </button>
                        <button
                          onClick={() => router.push("https://boardgamegeek.com/")}
                          className="bg-purple-400 text-white px-6 py-2 rounded hover:bg-purple-500"
                        >
                          Shop on BoardGameGeek
                        </button>
                      </div>
                  </div>
                )
              }
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}