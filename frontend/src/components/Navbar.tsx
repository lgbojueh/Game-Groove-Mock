import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center p-5 bg-[var(--background)]">
      <div className="w-full flex justify-center space-x-6">
        <Link href="/" className="text-lg font-semibold text-[var(--foreground)] hover:text-gray-400">Home</Link>
        <Link href="/games" className="text-lg font-semibold text-[var(--foreground)] hover:text-gray-400">Games</Link>
        <Link href="/featured" className="text-lg font-semibold text-[var(--foreground)] hover:text-gray-400">Featured</Link>
        <Link href="/blog" className="text-lg font-semibold text-[var(--foreground)] hover:text-gray-400">Blog</Link>
        <Link href="/about" className="text-lg font-semibold text-[var(--foreground)] hover:text-gray-400">About</Link>
      </div>

      <Link href="/signup" className="text-lg font-semibold text-[var(--foreground)] hover:text-gray-400">Sign Up</Link>
    </nav>
  );
}