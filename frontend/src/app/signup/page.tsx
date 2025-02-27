"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  username: string;
  email: string;
  password: string;
}

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState<User>({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  // Validate password: at least 8 characters, one uppercase, one lowercase, one digit.
  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  // Helper to retrieve users array from localStorage.
  const getUsers = (): User[] => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("users");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  };

  // Helper to save users array to localStorage.
  const saveUsers = (users: User[]) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePassword(formData.password)) {
      setError(
        "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one number."
      );
      return;
    }

    // Retrieve registered users from localStorage.
    const users = getUsers();

    // Check if username is already taken (case-insensitive).
    const usernameTaken = users.find(
      (user) => user.username.toLowerCase() === formData.username.toLowerCase()
    );
    if (usernameTaken) {
      setError("Username is already taken. Please choose a different username.");
      return;
    }

    // Check if email is already registered (case-insensitive).
    const emailTaken = users.find(
      (user) => user.email.toLowerCase() === formData.email.toLowerCase()
    );
    if (emailTaken) {
      setError("This email is already registered. Please log in or deactivate your account to reuse it.");
      return;
    }

    // If no conflicts, add the new user.
    users.push(formData);
    saveUsers(users);

    // Optionally, mark the user as logged in.
    localStorage.setItem("user", JSON.stringify(formData));

    // Redirect to the account page.
    router.push("/account");
  };

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-200 dark:bg-gray-800 p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="signup-username" className="block mb-1">
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
              className="border p-2 w-full rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="signup-email" className="block mb-1">
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
              className="border p-2 w-full rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="signup-password" className="block mb-1">
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
              className="border p-2 w-full rounded"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one number.
            </p>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </main>
  );
}