// src/components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center p-5 bg-white shadow-md">
      <div className="flex space-x-6">
        <Link href="/" className="text-lg font-semibold text-gray-700">Home</Link>
        <Link href="/games" className="text-lg font-semibold text-gray-700">Games</Link>
        <Link href="/featured" className="text-lg font-semibold text-gray-700">Featured</Link>
        <Link href="/blog" className="text-lg font-semibold text-gray-700">Blog</Link>
        <Link href="/about" className="text-lg font-semibold text-gray-700">About</Link>
      </div>
      <Link href="/signup" className="text-lg font-semibold text-blue-600">Sign Up</Link>
    </nav>
  );
}
