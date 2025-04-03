"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/styles.module.css";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate that both fields are filled
    if (!formData.identifier.trim()) {
      setError("Please enter your email or username.");
      setLoading(false);
      return;
    }
    if (!formData.password.trim()) {
      setError("Please enter your password.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // For this example we assume identifier is email.
        // If you want to support both email and username,
        // your backend needs to handle that accordingly.
        body: JSON.stringify({ email: formData.identifier, password: formData.password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Optionally store the token in localStorage (or better, use an HTTP-only cookie)
      localStorage.setItem("token", data.token);
      // Optionally store the user data (without sensitive info)
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect the user after a successful login
      router.push("/account");
    } catch (err) {
      console.error("Error in login:", err);
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-400 dark:bg-gray-800 p-6 rounded shadow">
        <h1 className={styles.SignUp}>Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-identifier" className={styles.SigningupandLoggingIn}>
              Email / Username
            </label>
            <input
              id="login-identifier"
              type="text"
              placeholder="Enter your email or username"
              value={formData.identifier}
              onChange={(e) =>
                setFormData({ ...formData, identifier: e.target.value })
              }
              className="border p-2 w-full rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="login-password" className={styles.SigningupandLoggingIn}>
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
            <div className="mt-1 text-right">
              <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
