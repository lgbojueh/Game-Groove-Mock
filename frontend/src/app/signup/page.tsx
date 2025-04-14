"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/styles.module.css";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect already logged-in users
  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/account");
    }
  }, [router]);

  // Validate password: at least 8 chars, one uppercase, one lowercase, one digit.
  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError(
        "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one number."
      );
      return;
    }

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      setSuccess("Signup successful! Redirecting...");
      setTimeout(() => {
        // Reset form data after successful signup
        setFormData({ username: "", email: "", password: "" });
        setConfirmPassword("");
        router.push("/account");
      }, 2000);
    } catch (err) {
      console.error("Error in signup:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [formData, confirmPassword, router]);

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
              autoFocus
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
              aria-label="Email Address"
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
              aria-label="Password"
            />
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one number.
            </p>
          </div>

          <div>
            <label
              htmlFor="signup-confirm-password"
              className={`${styles.SigningupandLoggingIn} block mb-1`}
            >
              Confirm Password
            </label>
            <input
              id="signup-confirm-password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              aria-label="Confirm Password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </section>
    </main>
  );
}
