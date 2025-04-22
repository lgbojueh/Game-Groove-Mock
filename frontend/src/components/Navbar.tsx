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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // close account dropdown when clicking outside
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/results?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setSearchOpen(false);
    }
  };

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
            priority
          />
        </Link>
        <Link href="/" className="text-xl font-bold text-white">
          Game Groove
        </Link>
      </div>

      {/* Center: Nav Links + Search */}
      <div className="flex items-center space-x-6 relative">
        <Link href="/" className="text-white hover:text-gray-200">
          Home
        </Link>
        <Link href="/games" className="text-white hover:text-gray-200">
          All Games
        </Link>
        <Link href="/featured" className="text-white hover:text-gray-200">
          Featured
        </Link>
        <Link href="/blog" className="text-white hover:text-gray-200">
          Blog
        </Link>

        {/* Search icon / form */}
        {!searchOpen ? (
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Open search"
          >
            <SearchIcon className="text-white" />
          </button>
        ) : (
          <form
            onSubmit={handleSearch}
            className="absolute top-full right-0 mt-2 flex bg-white dark:bg-gray-800 rounded shadow"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1 w-48 rounded-l bg-gray-100 dark:bg-gray-700 focus:outline-none"
              placeholder="Search games…"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1 bg-red-500 text-white rounded-r hover:bg-red-600"
            >
              Go
            </button>
          </form>
        )}
      </div>

      {/* Right: Theme + Auth */}
      <div className="flex items-center space-x-4 relative">
        <ThemeToggle />

        {user ? (
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-controls="account-menu"
              aria-expanded="false"
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
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
