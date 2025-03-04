"use client";


import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import styles from "../styles/styles.module.css";



export default function Navbar() {
 const [user, setUser] = useState<any>(null);
 const [dropdownOpen, setDropdownOpen] = useState(false);
 const router = useRouter();
 const pathname = usePathname();
 const dropdownRef = useRef<HTMLDivElement>(null);
 const timerRef = useRef<NodeJS.Timeout | null>(null);


 // Update user state on mount and when route changes.
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

<<<<<<< HEAD
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
        <span className="text-xl font-bold text-[var(--foreground)] bg-purple-500 p-4">
          Game Groove
        </span>
      </div>

      {/* Center: Navigation Links */}
      <div className="flex justify-center space-x-6 bg-purple-500 p-4">
        <Link href="/" className="text-lg font-fanklin gothic medium text-[var(--foreground)] hover:text-gray-400">
          Home
        </Link>
        <Link href="/games" className="text-lg font-franklin gothic medium text-[var(--foreground)] hover:text-gray-400">
          Games
        </Link>
        <Link href="/featured" className="text-lg font-franklin gothic medium text-[var(--foreground)] hover:text-gray-400">
          Featured
        </Link>
        <Link href="/blog" className="text-lg font-franklin gothic medium text-[var(--foreground)] hover:text-gray-400">
          Blog
        </Link>
        <Link href="/about" className="text-lg font-franklin gothic medium text-[var(--foreground)] hover:text-gray-400">
          About
        </Link>
      </div>

      {/* Right Side: Theme Toggle and Auth Links/Account Dropdown */}
      <div className="flex items-center space-x-4 relative">
        <ThemeToggle />
        {user ? (
          // Container for Account link and dropdown toggle icon.
          <div className="relative flex items-center space-x-2">
            {/* Account link always navigates to /account when clicked */}
            <Link href="/account" className={styles.AccountInfo}>
              Account
            </Link>
            {/* Dropdown Toggle Icon */}
            <div
              className="cursor-pointer"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleToggle}
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
                ref={dropdownRef}
                className="absolute top-full right-0 mt-2 w-48 bg-blue-100 dark:bg-blue-700 rounded shadow-lg z-50"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="py-1">
                  {/* New "My Account" option */}
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
                    className="block px-4 py-2 text-sm text-red-600 w-full text-left hover:bg-blue-200 dark:hover:bg-blue-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
          {/* Additional ThemeToggle for when signed out */}
            <Link href = "/account" className={styles.AccountInfo}>
              Authentication
            </Link>
            <div
            className="cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleToggle}
            >
              <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 text-[var(--foreground)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              >
                <path strokeLinecap= "butt" strokeLinejoin= "miter" strokeWidth={3} d = "M17 9l-7 7-7-7" />
              </svg>
            </div>
            {dropdownOpen && (
              <div
              ref = {dropdownRef}
              className="absolute top-full right-0 mt-2 w-48 bg-blue-100 dark:bg-blue-700 rounded shadow-lg z-50"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              >
                <div className="py-1">
                  {/* Authentication Options */}
                 <Link href = "/login" className= {styles.AuthenticationCommands}>
                    Login                 
                 </Link>
                 <Link href = "/signup" className={styles.AuthenticationCommands}>
                    Sign Up
                 </Link>
                </div>
              </div>
            )}
            </>
        )}
      </div>
    </nav>
  );
}
   
  
=======

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
         alt="Game Groove Logo"
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


     {/* Right Side: Theme Toggle and Auth Links/Account Dropdown */}
     <div className="flex items-center space-x-4 relative">
       <ThemeToggle />
       {user ? (
         <div className="relative flex items-center space-x-2">
           <Link href="/account" className="text-lg font-semibold text-[var(--foreground)] hover:text-gray-400 whitespace-nowrap">
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
               ref={dropdownRef}
               className="absolute top-full right-0 mt-2 w-48 bg-gray-100 dark:bg-gray-700 rounded shadow-lg z-50"
               onMouseEnter={handleMouseEnter}
               onMouseLeave={handleMouseLeave}
             >
               <div className="py-1">
                 <button
                   onClick={() => router.push("/account")}
                   className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 w-full text-left hover:bg-gray-200 dark:hover:bg-gray-600"
                 >
                   My Account
                 </button>
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
>>>>>>> 350fb1de936dd83a0b12511b0f3e0ad093417d47
