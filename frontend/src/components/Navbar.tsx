// src/components/Navbar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search as SearchIcon, ChevronDown } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import styles from "../styles/styles.module.css";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Toggle account dropdown
  const toggleDropdown = () => setDropdownOpen((o) => !o);

  // Toggle search bar
  const toggleSearch = () => setShowSearch((s) => !s);

  // Submit search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim() || "";
    router.push(`/search?query=${encodeURIComponent(q)}`);
    setShowSearch(false);
  };

  // Close dropdown or search if clicked outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full flex justify-between items-center p-5 bg-red-500">
      {/* Left: Logo */}
      <div className="flex items-center space-x-3">
        <Link href="/">
          <Image
            src="/game-groove-icon.svg"
            alt="Game Groove Logo"
            width={30}
            height={30}
          />
        </Link>
        <Link href="/" className="text-xl font-bold text-white">
          Game Groove
        </Link>
      </div>

      {/* Center: Nav Links */}
      <div className="flex space-x-6">
        <Link href="/" className="text-white hover:text-gray-200">
          Home
        </Link>
        <Link href="/games" className="text-white hover:text-gray-200">
          All Games
        </Link>
        <Link href="/featured" className="text-white hover:text-gray-200">
          Featured
        </Link>
        <Link href="/blog" className="text-white hover:text-gray-200">
          Blog
        </Link>
      </div>

      {/* Right: Theme, Search, Auth */}
      <div className="flex items-center space-x-4 relative">
        <ThemeToggle />

        {/* Search Icon + Pop‑out */}
        <div ref={searchRef} className="relative">
          <button
            type="button"
            onClick={toggleSearch}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-expanded="false"
            aria-controls="navbar-search"
            aria-label="Search games"
          >
            <SearchIcon className="text-white" />
          </button>
          {showSearch && (
            <form
              id="navbar-search"
              onSubmit={handleSearchSubmit}
              className="absolute right-0 mt-2 bg-white dark:bg-gray-800 p-2 rounded shadow"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games…"
                className="px-2 py-1 rounded w-48 focus:outline-none"
                autoFocus
              />
            </form>
          )}
        </div>

        {/* User menu */}
        {user ? (
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={toggleDropdown}
              className="flex items-center p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-expanded="false"
              aria-controls="account-menu"
              aria-label="Account menu"
            >
              <span className="text-white mr-1">{user.name}</span>
              <ChevronDown className="text-white" />
            </button>
            {dropdownOpen && (
              <div
                id="account-menu"
                className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded shadow w-48"
              >
                <button
                  onClick={() => router.push("/account")}
                  className={`${styles.accountInfo} block w-full text-left px-4 py-2`}
                >
                  My Account
                </button>
                <button
                  onClick={() => router.push("/account/favorites")}
                  className={`${styles.accountInfo} block w-full text-left px-4 py-2`}
                >
                  Favorite Games
                </button>
                <button
                  onClick={() => router.push("/account/saved")}
                  className={`${styles.accountInfo} block w-full text-left px-4 py-2`}
                >
                  Saved Games
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block w-full text-left px-4 py-2 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login" className="text-white hover:text-gray-200">
              Login
            </Link>
            <Link href="/signup" className="text-white hover:text-gray-200">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
