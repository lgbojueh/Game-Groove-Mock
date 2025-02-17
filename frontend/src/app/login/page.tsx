"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement login logic here
    console.log("Login Data:", formData);
  };

  return (
    <div>
      <Navbar />
      <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-gray-200 dark:bg-gray-800 p-6 rounded shadow">
          <h1 className="text-3xl font-bold mb-4">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block mb-1">Email</label>
              <input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="border p-2 w-full rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block mb-1">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="border p-2 w-full rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition"
            >
              Login
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}