"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AccountDropdown() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    // Optionally remove favorites/saved games if stored
    router.push("/login");
  };

  // Close the dropdown if the user clicks outside of it.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Account Options
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-100 dark:bg-gray-700 rounded shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={() => router.push("/account/favorites")}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 w-full text-left hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Favorite Games
            </button>
            <button
              onClick={() => router.push("/account/saved")}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 w-full text-left hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Saved Games
            </button>
            <button
              onClick={handleLogout}
              className="block px-4 py-2 text-sm text-red-600 w-full text-left hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}