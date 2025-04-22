"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../styles/styles.module.css";

interface FormData {
  identifier: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword((v) => !v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.identifier.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.identifier)) {
      setError("Please enter a valid email.");
      return;
    }
    if (!formData.password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      identifier: formData.identifier,
      password: formData.password,
    });
    setLoading(false);

    if (res?.error) {
      // Map the default error code to something user‑friendly
      if (res.error === "CredentialsSignin") {
        setError("Incorrect email or password.");
      } else {
        setError(res.error);
      }
    } else {
      router.push("/account");
    }
  };

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className={`${styles.SignUp} text-3xl font-bold text-center mb-6`}>
          Login
        </h1>

        {error && (
          <p
            role="alert"
            className="text-red-500 mb-4 text-center"
            aria-live="assertive"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="login-identifier"
              className={`${styles.SigningupandLoggingIn} block mb-1`}
            >
              Email
            </label>
            <input
              id="login-identifier"
              type="email"
              placeholder="Enter your email"
              value={formData.identifier}
              onChange={(e) =>
                setFormData({ ...formData, identifier: e.target.value })
              }
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password w/ Show/Hide */}
          <div className="relative">
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
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="border border-gray-300 p-2 w-full rounded pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600 hover:text-gray-800"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
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
