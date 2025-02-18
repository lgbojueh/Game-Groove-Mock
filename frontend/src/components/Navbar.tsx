"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Update user state on mount and on route change.
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [pathname]);

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

  // Close dropdown if clicking outside
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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full flex justify-between items-center p-5 bg-[var(--background)]">
      {/* Left Side: Logo and App Name */}
      <div className="flex items-center space-x-3">
        <Image 
          src="/game-groove-icon.svg"  
          alt="Small Logo"
          width={30} 
          height={30} 
          priority
        />
        <span className="text-xl font-bold text-[var(--foreground)]">
          Game Groove
        </span>
      </div>

      {/* Center: Navigation Links */}
      <div className="flex justify-center space-x-6">
        <Link href="/" className="text-lg font-semibold text-[var(--foreground)] hover:text-gray-400">
          Home
        </Link>
        <Link href="/games" className="text-lg font-semibold text-[var(--foreground)] hover:text-gray-400">
          Games
        </Link>
        <Link href="/featured" className="text-lg font-semibold text-[var(--foreground)] hover:text-gray-400">
          Featured
        </Link>
        <Link href="/blog" className="text-lg font-semibold text-[var(--foreground)] hover:text-gray-400">
          Blog
        </Link>
        <Link href="/about" className="text-lg font-semibold text-[var(--foreground)] hover:text-gray-400">
          About
        </Link>
      </div>

      {/* Right Side: Theme Toggle and Auth Links */}
      <div className="flex items-center space-x-4 relative">
        <ThemeToggle />
        {user ? (
          <div className="flex items-center space-x-2">
            {/* Account Link - clicking it always navigates to /account */}
            <Link href="/account" className="text-lg font-semibold text-[var(--foreground)] hover:text-gray-400 whitespace-nowrap">
              Account
            </Link>
            {/* Dropdown Toggle Icon */}
            <div
              className="cursor-pointer"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleToggle}
              ref={dropdownRef}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[var(--foreground)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {dropdownOpen && (
              <div
                className="absolute right-0 mt-8 w-48 bg-gray-100 dark:bg-gray-700 rounded shadow-lg z-50"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
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
        ) : (
          <>
            <Link href="/login" className="text-lg font-semibold text-[var(--foreground)] hover:text-gray-400 whitespace-nowrap">
              Login
            </Link>
            <Link href="/signup" className="text-lg font-semibold text-[var(--foreground)] hover:text-gray-400 whitespace-nowrap">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}