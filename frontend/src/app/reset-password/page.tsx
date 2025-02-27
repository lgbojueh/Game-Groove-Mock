"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // Here you would update the password via your backend.
    // For simulation, we set a success message and redirect.
    setSuccess("Your password has been reset successfully!");
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-200 dark:bg-gray-800 p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-4">Reset Password</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success ? (
          <p className="text-green-600 mb-4">{success}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block mb-1">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 w-full rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block mb-1">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border p-2 w-full rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </main>
  );
}