"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import styles from "../styles/styles.module.css";

export default function Navbar() {
  interface User {
    id: string;
    name: string;
    email: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Update user state on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full flex flex-wrap justify-between items-center p-5 bg-red-500">
      {/* Left: Logo */}
      <div className="flex items-center space-x-3 mb-2 sm:mb-0">
        <Image
          src="/game-groove-icon.svg"
          alt="Game Groove Logo"
          width={30}
          height={30}
          priority
        />
        <span className="text-base sm:text-xl font-bold text-[var(--foreground)]">
          Game Groove
        </span>
      </div>

      {/* Center: Links */}
      <div className="flex flex-wrap justify-center space-x-4 sm:space-x-6 mb-2 sm:mb-0">
        <Link href="/" className="text-sm sm:text-lg font-semibold text-[var(--foreground)] hover:text-gray-400">
          Home
        </Link>
        <Link href="/games" className="text-sm sm:text-lg font-semibold text-[var(--foreground)] hover:text-gray-400">
          Games
        </Link>
        <Link href="/featured" className="text-sm sm:text-lg font-semibold text-[var(--foreground)] hover:text-gray-400">
          Featured
        </Link>
        <Link href="/blog" className="text-sm sm:text-lg font-semibold text-[var(--foreground)] hover:text-gray-400">
          Blog
        </Link>
        <Link href="/about" className="text-sm sm:text-lg font-semibold text-[var(--foreground)] hover:text-gray-400">
          About
        </Link>
      </div>

      {/* Right: Theme + Auth */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <ThemeToggle />
        {user ? (
          <div className="relative flex items-center space-x-2">
            <Link href="/account" className="text-sm sm:text-lg font-semibold text-[var(--foreground)] hover:text-gray-400 whitespace-nowrap">
              Account
            </Link>
            <div
              className="cursor-pointer"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleToggle}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--foreground)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-full right-0 mt-2 w-48 bg-purple-300 dark:bg-purple-700 rounded shadow-lg z-50"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="py-1">
                  <button onClick={() => router.push("/account")} className={styles.AccountInfo}>
                    My Account
                  </button>
                  <button onClick={() => router.push("/account/favorites")} className={styles.AccountInfo}>
                    Favorite Games
                  </button>
                  <button onClick={() => router.push("/account/saved")} className={styles.AccountInfo}>
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
        ) : (
          <>
            <Link href="/login" className="text-sm sm:text-lg font-semibold text-[var(--foreground)] hover:text-gray-400 whitespace-nowrap">
              Login
            </Link>
            <Link href="/signup" className="text-sm sm:text-lg font-semibold text-[var(--foreground)] hover:text-gray-400 whitespace-nowrap">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
