"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/styles.module.css";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Validate password: at least 8 characters, one uppercase, one lowercase, one digit.
  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Check password strength before proceeding.
    if (!validatePassword(formData.password)) {
      setError(
        "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one number."
      );
      return;
    }

    try {
      // Send the form data to the signup API route.
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      // On success, display a confirmation message and redirect the user.
      setSuccess("Signup successful! Redirecting...");
      setTimeout(() => {
        router.push("/account");
      }, 2000);
    } catch (err) {
      console.error("Error in signup:", err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen flex items-center justify-center">
      <section className="max-w-md w-full bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <header className="mb-6 text-center">
          <h1 className={`${styles.SignUp} text-3xl font-bold`}>Sign Up</h1>
        </header>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="signup-username" 
              className={`${styles.SigningupandLoggingIn} block mb-1`}
            >
              Username
            </label>
            <input
              id="signup-username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label 
              htmlFor="signup-email" 
              className={`${styles.SigningupandLoggingIn} block mb-1`}
            >
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label 
              htmlFor="signup-password" 
              className={`${styles.SigningupandLoggingIn} block mb-1`}
            >
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one number.
            </p>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>
      </section>
    </main>
  );
}
