"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import styles from "../styles/styles.module.css";

export default function Navbar() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown when navigating
  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  const openDropdown = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDropdownOpen(true);
  };
  const closeDropdown = () => {
    timerRef.current = setTimeout(() => setDropdownOpen(false), 300);
  };
  const toggleDropdown = () => setDropdownOpen((v) => !v);

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <nav className="w-full flex justify-between items-center p-5 bg-red-500">
      {/* Left Side: Logo */}
      <div className="flex items-center space-x-3">
        <Image src="/game-groove-icon.svg" alt="Game Groove Logo" width={30} height={30} priority />
        <span className="text-xl font-bold text-white">Game Groove</span>
      </div>

      {/* Center: Links */}
      <div className="flex space-x-6">
        <Link href="/" className="text-lg text-white hover:text-gray-200">Home</Link>
        <Link href="/games" className="text-lg text-white hover:text-gray-200">All Games</Link>
        <Link href="/featured" className="text-lg text-white hover:text-gray-200">Featured</Link>
        <Link href="/search" className="text-lg text-white hover:text-gray-200">Search</Link>
      </div>

      {/* Right Side: Theme + Auth */}
      <div className="flex items-center space-x-4 relative">
        <ThemeToggle />

        {session?.user ? (
          <div className="relative flex items-center space-x-2">
            <Link href="/account" className="text-lg text-white hover:text-gray-200 whitespace-nowrap">
              Account
            </Link>

            {/*
              We now render _two_ buttons, one with aria-expanded="true"
              and one with aria-expanded="false", so that in our TSX source
              we never write `{dropdownOpen}` inside the attribute.
            */}
            {dropdownOpen ? (
              <button
                type="button"
                aria-haspopup="true"
                aria-controls="account-dropdown"
                aria-expanded="true"
                aria-label="Toggle account menu"
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
                onClick={toggleDropdown}
                className="p-2 rounded hover:bg-gray-600 text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                aria-haspopup="true"
                aria-controls="account-dropdown"
                aria-expanded="false"
                aria-label="Toggle account menu"
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
                onClick={toggleDropdown}
                className="p-2 rounded hover:bg-gray-600 text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}

            {dropdownOpen && (
              <div
                id="account-dropdown"
                ref={dropdownRef}
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
                className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg"
              >
                <button
                  onClick={() => router.push("/account")}
                  className={`${styles.AccountInfo} block w-full text-left px-4 py-2`}
                >
                  My Account
                </button>
                <button
                  onClick={() => router.push("/account/favorites")}
                  className={`${styles.AccountInfo} block w-full text-left px-4 py-2`}
                >
                  Favorite Games
                </button>
                <button
                  onClick={() => router.push("/account/saved")}
                  className={`${styles.AccountInfo} block w-full text-left px-4 py-2`}
                >
                  Saved Games
                </button>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login" className="text-lg text-white hover:text-gray-200 whitespace-nowrap">
              Login
            </Link>
            <Link href="/signup" className="text-lg text-white hover:text-gray-200 whitespace-nowrap">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
