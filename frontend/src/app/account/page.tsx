"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AccountDropdown from "@/components/AccountDropdown";

export default function Account() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/login");
    }
  }, [router]);

  if (!user) return <p>Loading...</p>;

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Account</h1>
      {/* Render the dropdown menu */}
      <AccountDropdown />
      {/* Optionally, you can add additional account content here */}
    </main>
  );
}