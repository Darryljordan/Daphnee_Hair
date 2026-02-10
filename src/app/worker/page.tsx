"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hairdressing-backend.vercel.app/api";

export default function WorkerLoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(`${API_URL}/workers/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: credentials.username,
          password: credentials.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("workerToken", data.token);
      router.push("/worker-bookings");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Login failed";
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-gradient-to-br from-purple-100 to-white py-16 min-h-[70vh]">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-extrabold text-purple-700 mb-6 text-center">
            Worker Login
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-purple-700 focus:ring-2 focus:ring-purple-200 outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-purple-700 focus:ring-2 focus:ring-purple-200 outline-none transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-400 to-purple-700 text-white py-3 rounded-full font-bold shadow hover:from-purple-700 hover:to-purple-400 hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-200 border-none cursor-pointer disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <Link
              href="/worker-signup"
              className="block w-full text-center bg-white text-purple-700 py-3 rounded-full font-semibold border-2 border-purple-300 hover:bg-purple-50 transition-all duration-200 no-underline"
            >
              Sign Up
            </Link>
            <div className="text-center mt-2">
              <Link
                href="/worker-password-reset"
                className="text-purple-700 hover:text-purple-900 text-sm underline"
              >
                Forgotten password?
              </Link>
            </div>
            {errorMessage && (
              <p className="text-red-600 text-center font-medium mt-2">{errorMessage}</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
