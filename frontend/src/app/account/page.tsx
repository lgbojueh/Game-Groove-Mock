"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Account() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // If no user is found, redirect to login.
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Account</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Favorites</h2>
        <p>Your favorite games will be displayed here.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Saved Games</h2>
        <p>Your saved games will be displayed here.</p>
      </section>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </main>
  );
}