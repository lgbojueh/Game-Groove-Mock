// src/components/Navbar.tsx
"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search as SearchIcon,
  ChevronDown,
  Menu as MenuIcon,
  X as XIcon,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import styles from "../styles/styles.module.css";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close account dropdown if clicking outside
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () =>
      document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(
        `/results?query=${encodeURIComponent(searchTerm.trim())}`
      );
      setSearchTerm("");
      setSearchOpen(false);
      setMobileOpen(false);
    }
  };

  return (
    <nav className="w-full bg-red-500">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
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
            Game Groove
          </Link>
        </div>

        {/* Center (desktop only): Nav Links + Search Icon */}
        <div className="hidden lg:flex items-center space-x-6 relative">
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
          <Link href="/about" className="text-white hover:text-gray-200">
            About
          </Link>

          {/* Search icon */}
          {!searchOpen ? (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              aria-expanded="false"
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
              <Link
                href="/login"
                className="text-white hover:text-gray-200"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-white hover:text-gray-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center space-x-2">
          <ThemeToggle />

          {/* Mobile Search icon */}
          {!searchOpen ? (
            <button
              type="button"
              onClick={() => {
                setSearchOpen(true);
                setMobileOpen(false);
              }}
              aria-label="Open search"
              aria-expanded="false"
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
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

          {/* Hamburger toggle */}
          {!mobileOpen ? (
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              aria-expanded="false"
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <MenuIcon className="text-white" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              aria-expanded="true"
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
          <Link href="/" className="block text-white hover:text-gray-200" onClick={() => setMobileOpen(false)}>
            Home
          </Link>
          <Link href="/games" className="block text-white hover:text-gray-200" onClick={() => setMobileOpen(false)}>
            All Games
          </Link>
          <Link href="/featured" className="block text-white hover:text-gray-200" onClick={() => setMobileOpen(false)}>
            Featured
          </Link>
          <Link href="/blog" className="block text-white hover:text-gray-200" onClick={() => setMobileOpen(false)}>
            Blog
          </Link>
          <Link href="/about" className="block text-white hover:text-gray-200" onClick={() => setMobileOpen(false)}>
            About
          </Link>

          {user ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="block w-full text-left text-red-200 hover:text-red-100"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="block text-white hover:text-gray-200" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
              <Link href="/signup" className="block text-white hover:text-gray-200" onClick={() => setMobileOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
