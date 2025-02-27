"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    // Here you would call your backend to send a reset link.
    // For simulation, we display a success message.
    setMessage("A password reset link has been sent to your email address.");
  };

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-200 dark:bg-gray-800 p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-4">Forgot Password</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {message ? (
          <div className="mb-4">
            <p className="text-green-600 mb-2">{message}</p>
            {/* For demonstration, provide a link to the reset password page */}
            <Link
              href="/reset-password"
              className="text-blue-500 hover:underline"
            >
              Click here to reset your password.
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="forgot-email" className="block mb-1">
                Email Address
              </label>
              <input
                id="forgot-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 w-full rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </main>
  );
}