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

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);
  }, []);

  const openDropdown = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDropdownOpen(true);
  };
  const closeDropdown = () => {
    timerRef.current = setTimeout(() => setDropdownOpen(false), 200);
  };
  const toggleDropdown = () => setDropdownOpen((v) => !v);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  // Click outside to close
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <nav className="w-full flex flex-wrap justify-between items-center p-5 bg-red-500">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <Image
          src="/game-groove-icon.svg"
          alt="Game Groove Logo"
          width={30}
          height={30}
          priority
        />
        <span className="text-xl font-bold text-[var(--foreground)]">
          Game Groove
        </span>
      </div>

      {/* Nav Links */}
      <div className="flex space-x-6">
        <Link href="/" className="font-semibold hover:text-gray-400">
          Home
        </Link>
        <Link href="/games" className="font-semibold hover:text-gray-400">
          Games
        </Link>
        <Link href="/featured" className="font-semibold hover:text-gray-400">
          Featured
        </Link>
        <Link href="/blog" className="font-semibold hover:text-gray-400">
          Blog
        </Link>
        <Link href="/about" className="font-semibold hover:text-gray-400">
          About
        </Link>
      </div>

      {/* Theme + Auth */}
      <div className="flex items-center space-x-4 relative">
        <ThemeToggle />

        {user ? (
          <div className="flex items-center space-x-2">
            <Link
              href="/account"
              className="font-semibold hover:text-gray-400 whitespace-nowrap"
            >
              Account
            </Link>

            <button
              type="button"
              aria-haspopup="true"
              aria-controls="account-dropdown"
              aria-expanded={dropdownOpen ? "true" : "false"}
              aria-label="Toggle account menu"
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
              onClick={toggleDropdown}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[var(--foreground)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <div
                id="account-dropdown"
                ref={dropdownRef}
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
                className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded shadow-lg z-50"
              >
                <div className="py-1 flex flex-col">
                  <button
                    onClick={() => router.push("/account")}
                    className={styles.AccountInfo}
                  >
                    My Account
                  </button>
                  <button
                    onClick={() => router.push("/account/favorites")}
                    className={styles.AccountInfo}
                  >
                    Favorite Games
                  </button>
                  <button
                    onClick={() => router.push("/account/saved")}
                    className={styles.AccountInfo}
                  >
                    Saved Games
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm text-red-600 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login" className="font-semibold hover:text-gray-400">
              Login
            </Link>
            <Link href="/signup" className="font-semibold hover:text-gray-400">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
