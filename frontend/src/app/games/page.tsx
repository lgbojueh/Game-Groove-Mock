"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function Games() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", searchQuery);
  };

  return (
    <div>
      <Navbar />
      <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
        <h1 className="text-4xl font-bold mb-4">All Games</h1>
        <form onSubmit={handleSearch} className="mb-4">
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 p-2 mr-2 rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Search
          </button>
        </form>
        <p className="mt-2">
          {/* Placeholder for your game list or search results */}
          List of all games will be displayed here.
        </p>
      </main>
    </div>
  );
}