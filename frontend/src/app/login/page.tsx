"use client";
import { useState } from "react";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation: Check that both email and password are provided.
    if (!formData.email || !formData.password) {
      setError("Please fill in both email and password.");
      return;
    }

    // Here, you would typically call an API to log the user in.
    console.log("Login Data:", formData);
    alert("Login successful!");
  };

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-200 dark:bg-gray-800 p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-4">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block mb-1">
              Email
            </label>
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
            <label htmlFor="login-password" className="block mb-1">
              Password
            </label>
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
  );
}