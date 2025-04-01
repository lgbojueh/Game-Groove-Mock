"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/styles.module.css";
import Link from "next/link";
import {doSignInWithEmailAndPassword} from "../firebase/auth";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.identifier.trim()) {
      setError("Please enter your email or username.");
      return;
    }
    if (!formData.password.trim()) {
      setError("Please enter your password.");
      return;
    }
    
  
      doSignInWithEmailAndPassword(formData.identifier, formData.password).then(()=>{
        localStorage.setItem("user", JSON.stringify({ identifier: formData.identifier }))
        router.push("/account")
      }).catch(()=>{
          setError("Incorrect Email or Password.");
        });
    
    // Simulate login by storing user info to localStorage.
    // In a real app, you'd verify credentials before setting the user.
    
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
            className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}