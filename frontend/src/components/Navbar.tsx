"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check for user data in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <nav className="w-full flex justify-between items-center p-5 bg-[var(--background)]">
      
      {/* Left Side - Small Logo + Game Groove */}
      <div className="flex items-center space-x-3">
        <Image 
          src="/game-groove-icon.svg"  
          alt="Small Logo"
          width={30} 
          height={30} 
          priority
        />
        <span className="text-xl font-bold text-[var(--foreground)]">Game Groove</span>
      </div>

      {/* Center - Navigation Links */}
      <div className="flex justify-center space-x-6">
        <Link href="/" className="text-lg font-semibold text-[var(--foreground)] hover:text-gray-400">Home</Link>
        <Link href="/games" className="text-lg font-semibold text-[var(--foreground)] hover:text-gray-400">Games</Link>
        <Link href="/featured" className="text-lg font-semibold text-[var(--foreground)] hover:text-gray-400">Featured</Link>
        <Link href="/blog" className="text-lg font-semibold text-[var(--foreground)] hover:text-gray-400">Blog</Link>
        <Link href="/about" className="text-lg font-semibold text-[var(--foreground)] hover:text-gray-400">About</Link>
      </div>

      {/* Right Side - Theme Toggle + Login/Sign Up OR Account */}
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        {user ? (
          <Link href="/account" className="text-lg font-semibold text-[var(--foreground)] hover:text-gray-400 whitespace-nowrap">
            Account
          </Link>
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