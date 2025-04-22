"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../styles/styles.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleShowPassword = () => setShowPassword((v) => !v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 1️⃣ Basic validation
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    // 2️⃣ Call NextAuth with `email` (not `identifier`)
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    // 3️⃣ Map the default NextAuth error code to a friendly message
    if (res?.error) {
      setError(
        res.error === "CredentialsSignin"
          ? "Incorrect email or password."
          : res.error
      );
      return;
    }

    // 4️⃣ Success → go to account
    router.push("/account");
  };

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1
          className={`${styles.SignUp} text-3xl font-bold text-center mb-6`}
        >
          Login
        </h1>

        {error && (
          <p
            role="alert"
            aria-live="assertive"
            className="text-red-500 mb-4 text-center"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="login-email"
              className={`${styles.SigningupandLoggingIn} block mb-1`}
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="login-password"
              className={`${styles.SigningupandLoggingIn} block mb-1`}
            >
              Password
            </label>
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="mt-2 text-sm text-blue-500 hover:underline"
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </button>
            <div className="mt-1 text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? <span className="animate-spin">🔄</span> : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
