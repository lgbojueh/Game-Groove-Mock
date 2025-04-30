"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import styles from "../../styles/styles.module.css";

export default function SignUpClient() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (pw: string) =>
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(pw);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      if (!validateEmail(formData.email)) {
        setError("Please enter a valid email address.");
        return;
      }
      if (!validatePassword(formData.password)) {
        setError(
          "Password must be at least 8 characters, include uppercase, lowercase and a number."
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
        const body = await res.json();

        if (!res.ok) {
          setError(body.error || "Signup failed");
          setLoading(false);
          return;
        }

        const signin = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (signin?.error) {
          setError(
            signin.error || "Auto‑login failed. Please log in manually."
          );
          setLoading(false);
          return;
        }

        router.push("/account");
      } catch (err) {
        console.error("Signup error:", err);
        setError("An unexpected error occurred.");
        setLoading(false);
      }
    },
    [formData, confirmPassword, router]
  );

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen flex items-center justify-center">
      <section className="max-w-md w-full bg-gray-100 dark:bg-gray-500 p-8 rounded-lg shadow-lg">
        <h1 className={`${styles.SignUp} text-3xl font-bold text-center mb-6`}>Sign Up</h1>

        {error && (
          <p className="text-red-500 mb-4 text-center" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="signup-username" className={`${styles.SigningupandLoggingIn} block mb-1`}>
              Username
            </label>
            <input
              id="signup-username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="signup-email" className={`${styles.SigningupandLoggingIn} block mb-1`}>
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="signup-password" className={`${styles.SigningupandLoggingIn} block mb-1`}>
              Password
            </label>
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              At least 8 characters, one uppercase, one lowercase, and one number.
            </p>
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="mt-1 text-sm text-blue-800 hover:underline"
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </button>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="signup-confirm-password" className={`${styles.SigningupandLoggingIn} block mb-1`}>
              Confirm Password
            </label>
            <input
              id="signup-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="mt-1 text-sm text-blue-800 hover:underline"
            >
              {showConfirmPassword ? "Hide Password" : "Show Password"}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Signing up…" : "Sign Up"}
          </button>
        </form>
      </section>
    </main>
  );
}