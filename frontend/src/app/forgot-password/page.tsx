"use client";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (!email.trim()) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset link. Please try again.");
      }

      setMessage("A password reset link has been sent to your email.");
    } catch (err: any) {
      console.error("Error sending reset link:", err);
      setError("Error sending reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-200 dark:bg-gray-800 p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-4">Forgot Password</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {message ? (
          <p className="text-green-600 mb-4">{message}</p>
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
              disabled={loading}
              className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
