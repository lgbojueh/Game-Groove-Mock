"use client";

import { useState } from "react";

export default function SearchPage() {
  // State for input search
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)] px-6">
      {/* Title */}
      <h1 className="text-4xl sm:text-6xl font-bold text-center mb-10">
        Start Your Next Adventure Here
      </h1>

      {/* Filters Section */}
      <div className="w-full max-w-3xl bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Number of Players */}
          <div>
            <label className="block font-semibold mb-1">Number of Players</label>
            <select className="w-full p-2 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white">
              <option value="">Any</option>
              <option value="2">2 Players</option>
              <option value="3-4">3-4 Players</option>
              <option value="5+">5+ Players</option>
            </select>
          </div>

          {/* Complexity */}
          <div>
            <label className="block font-semibold mb-1">Complexity</label>
            <select className="w-full p-2 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white">
              <option value="">Any</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Play Time */}
          <div>
            <label className="block font-semibold mb-1">Play Time</label>
            <select className="w-full p-2 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white">
              <option value="">Any</option>
              <option value="short">Short (30 min or less)</option>
              <option value="medium">Medium (30-60 min)</option>
              <option value="long">Long (60+ min)</option>
            </select>
          </div>

          {/* Genre */}
          <div>
            <label className="block font-semibold mb-1">Genre</label>
            <select className="w-full p-2 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white">
              <option value="">Any</option>
              <option value="strategy">Strategy</option>
              <option value="party">Party</option>
              <option value="family">Family</option>
              <option value="adventure">Adventure</option>
            </select>
          </div>

          {/* Age Rating */}
          <div>
            <label className="block font-semibold mb-1">Age Rating</label>
            <select className="w-full p-2 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white">
              <option value="">Any</option>
              <option value="kids">Kids (5+)</option>
              <option value="teen">Teen (13+)</option>
              <option value="adult">Adult (18+)</option>
            </select>
          </div>

          {/* Theme */}
          <div>
            <label className="block font-semibold mb-1">Theme</label>
            <select className="w-full p-2 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white">
              <option value="">Any</option>
              <option value="fantasy">Fantasy</option>
              <option value="sci-fi">Sci-Fi</option>
              <option value="horror">Horror</option>
              <option value="historical">Historical</option>
            </select>
          </div>
        </form>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-md mt-6">
        <input 
          type="text" 
          placeholder="Search for a game..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600"
        />
      </div>

      {/* Search Button */}
      <button 
        className="mt-4 px-6 py-3 text-lg font-semibold rounded-lg transition
                   bg-gray-400 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600
                   text-[var(--foreground)]">
        Search
      </button>

    </main>
  );
}