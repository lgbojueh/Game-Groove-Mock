
"use client";


import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import styles from "../styles/styles.module.css"


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
   <nav className="w-full flex justify-between items-center p-5 bg-[var(--background)] bg-red-500">
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
         All Games
       </Link>
       <Link href="/featured" className="text-lg font-semibold text-[var(--foreground)] hover:text-gray-400">
         Featured
       </Link>
       {/* <Link href="/blog" className="text-lg font-semibold text-[var(--foreground)] hover:text-gray-400">
         Blog
       </Link>
       <Link href="/about" className="text-lg font-semibold text-[var(--foreground)] hover:text-gray-400">
         About
       </Link> */}
       <Link href="/search" className="text-lg font-semibold text-[var(--foreground)] hover:text-gray-400">
       {/* <input
            type="text"
            placeholder="Search for a game..."
            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600"
            aria-label="Search Games"
          /> */}
         {
          <><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=search" /><span className="material-symbols-outlined">
             search
           </span></>
         }
         
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
               className="absolute top-full right-0 mt-2 w-48 bg-purple-300 dark:bg-purple-700 rounded shadow-lg z-50"
               onMouseEnter={handleMouseEnter}
               onMouseLeave={handleMouseLeave}
             >
               <div className="py-1">
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
