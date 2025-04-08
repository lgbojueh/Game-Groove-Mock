"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 


export default function wishlistPage() {
    const router = useRouter();
    const [wishlistGames, setWishlistGames] = useState<any[]>([]);
    const [purchase, setPurchase] = useState<any[]>([]);

    useEffect(() => {
        const storedWishlistGames = localStorage.getItem("wishlistGames");
        setWishlistGames(storedWishlistGames ? JSON.parse(storedWishlistGames) : []);
    }, []);

    const removeGamefromWishlist = (id: string) => {
        const updated = wishlistGames.filter((game) => game.id !== id);
        localStorage.setItem("wishlistGames", JSON.stringify(updated));
       setWishlistGames(updated); 
    };

    const purchaseGame = (id: string) => {
        const shop = purchase.filter((game) => game.id === id);
        localStorage.setItem("purchase", JSON.stringify(shop));
        setPurchase(shop);
    };


    return (
        <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen overflow-y-auto">
            <h1 className="text-4xl font-bold mb-6">My Wishlist</h1>
            {wishlistGames.length === 0 ? (
                <p>You have no games in your wishlist.</p>
            ) : (
                <ul className="space-y-4">
                    {wishlistGames.map((game, idx) => (
                        <li key = {idx} className="flex justify-between items-center bg:gray:400 dark:bg-gray-300 p-4 rounded shadow">
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
                              onClick={() => removeGamefromWishlist(game.id)}
                              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                              >
                              Remove
                            </button>
                            <button
                            onClick={() => purchaseGame}
                            className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600"
                            >
                              Purchase Game
                            </button>
                        </li>
            ))}
                </ul>
            )}
        </main>
    );
}