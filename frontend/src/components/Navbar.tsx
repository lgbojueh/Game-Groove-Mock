// src/components/Navbar.tsx
"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  Search as SearchIcon,
  ChevronDown,
  Menu as MenuIcon,
  X as XIcon,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { fetchGames } from "@/utils/fetchGames";
import { fetchDetailedGames } from "@/utils/fetchDetailedGames";
import { cleanDescription, shortenDescription } from "@/utils/cleanup";

function chunkArray<T>(arr: T[], size: number): T[][] {
  const results: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    results.push(arr.slice(i, i + size));
  }
  return results;
}

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const {} = useTheme();

  // Only render logo after hydration
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // **New**: run exactly the same pipeline as SearchClient
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchTerm.trim() || "board game";

    // 1) fetch basic summaries
    const basic = await fetchGames(q);
    const ids = basic.map((g) => g.id!).filter(Boolean);

    // 2) fetch detailed in chunks of 20
    interface GameDetails {
      id: string;
      name: string;
      description: string;
      // Add other relevant fields based on the structure of the fetched data
    }

    const detailed: GameDetails[] = [];
    for (const chunk of chunkArray(ids, 20)) {
      const dets = await fetchDetailedGames(chunk);
      detailed.push(
        ...dets.map((g) => ({
          ...g,
          description: shortenDescription(cleanDescription(g.description)),
        }))
      );
    }

    // 3) store to localStorage for Results page
    localStorage.setItem("searchResults", JSON.stringify(detailed));

    // 4) navigate
    router.push(`/results?query=${encodeURIComponent(q)}`);
    setSearchTerm("");
    setSearchOpen(false);
    setMobileOpen(false);
  };

  return (
    <nav className="w-full bg-red-500">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Left: Logo */}
        <div className="flex items-center space-x-3">
          <Link href="/">
            {mounted && (
              <Image
                src="/game-groove-icon.svg"
                alt="Game Groove Logo"
                width={80}
                height={80}
                priority
              />
            )}
          </Link>
          <Link href="/" className="text-xl font-bold text-white">
            Game Groove
          </Link>
        </div>

        {/* Center (desktop only): Nav Links + Search Icon */}
        <div className="hidden lg:flex items-center space-x-6 relative">
          <Link href="/" className="text-white hover:text-gray-200">Home</Link>
          <Link href="/games" className="text-white hover:text-gray-200">All Games</Link>
          <Link href="/featured" className="text-white hover:text-gray-200">Featured</Link>
          <Link href="/blog" className="text-white hover:text-gray-200">Blog</Link>
          <Link href="/about" className="text-white hover:text-gray-200">About</Link>

          {!searchOpen ? (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
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
                className="px-3 py-1 w-48 rounded-l bg-gray-100 dark:bg-gray-500 focus:outline-none"
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

        {/* Right (desktop only): Theme + Auth */}
        <div className="hidden lg:flex items-center space-x-4 relative">
          <ThemeToggle />

          {user ? (
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                aria-controls="account-menu"
                aria-expanded="false"
                aria-label="Account menu"
                className="flex items-center p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <span className="text-white mr-1">{user.name}</span>
                <ChevronDown className="text-white" />
              </button>
              {dropdownOpen && (
                <div
                  id="account-menu"
                  className="absolute right-0 mt-2 bg-white dark:bg-gray-500 rounded shadow w-48"
                >
                  <button
                    onClick={() => router.push("/account")}
                    className="block w-full text-left px-4 py-2"
                  >
                    My Account
                  </button>
                  <button
                    onClick={() => router.push("/account/favorites")}
                    className="block w-full text-left px-4 py-2"
                  >
                    Favorite Games
                  </button>
                  <button
                    onClick={() => router.push("/account/saved")}
                    className="block w-full text-left px-4 py-2"
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
              <Link href="/login" className="text-white hover:text-gray-200">Login</Link>
              <Link href="/signup" className="text-white hover:text-gray-200">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center space-x-2">
          <ThemeToggle />

          {!searchOpen ? (
            <button
              type="button"
              onClick={() => {
                setSearchOpen(true);
                setMobileOpen(false);
              }}
              aria-label="Open search"
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-500"
            >
              <SearchIcon className="text-white" />
            </button>
          ) : (
            <form
              onSubmit={handleSearch}
              className="absolute top-full right-0 mt-2 flex w-full bg-white dark:bg-gray-800 rounded shadow px-2"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow px-3 py-1 rounded-l bg-gray-100 dark:bg-gray-700 focus:outline-none"
                placeholder="Search…"
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

          {!mobileOpen ? (
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <MenuIcon className="text-white" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <XIcon className="text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-red-500 px-4 pb-4 space-y-2">
          <Link href="/" className="block text-white hover:text-gray-200" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link href="/games" className="block text-white hover:text-gray-200" onClick={() => setMobileOpen(false)}>All Games</Link>
          <Link href="/featured" className="block text-white hover:text-gray-200" onClick={() => setMobileOpen(false)}>Featured</Link>
          <Link href="/blog" className="block text-white hover:text-gray-200" onClick={() => setMobileOpen(false)}>Blog</Link>
          <Link href="/about" className="block text-white hover:text-gray-200" onClick={() => setMobileOpen(false)}>About</Link>
          {user ? (
            <button onClick={() => signOut({ callbackUrl: "/" })} className="block w-full text-left text-red-200 hover:text-red-100">Logout</button>
          ) : (
            <>
              <Link href="/login" className="block text-white hover:text-gray-200" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link href="/signup" className="block text-white hover:text-gray-200" onClick={() => setMobileOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
