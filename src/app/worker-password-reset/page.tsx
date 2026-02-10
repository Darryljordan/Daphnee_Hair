"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hairdressing-backend.vercel.app/api";

export default function WorkerPasswordResetPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
      setMode("reset");
    }
  }, []);

  async function handleRequestReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch(`${API_URL}/workers/password-reset-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Request failed");
      }

      setSuccessMessage("If this email exists, a reset link will be sent.");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Request failed";
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch(`${API_URL}/workers/password-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Reset failed");
      }

      setSuccessMessage("Password updated successfully! Redirecting...");
      setTimeout(() => router.push("/worker"), 1500);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Reset failed";
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
            {mode === "request" ? "Reset Password" : "Set New Password"}
          </h2>

          {mode === "request" ? (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter your email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-purple-700 focus:ring-2 focus:ring-purple-200 outline-none transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-400 to-purple-700 text-white py-3 rounded-full font-bold shadow hover:from-purple-700 hover:to-purple-400 hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-200 border-none cursor-pointer disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-purple-700 focus:ring-2 focus:ring-purple-200 outline-none transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-400 to-purple-700 text-white py-3 rounded-full font-bold shadow hover:from-purple-700 hover:to-purple-400 hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-200 border-none cursor-pointer disabled:opacity-60"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          {successMessage && (
            <p className="text-green-600 text-center font-medium mt-4">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="text-red-600 text-center font-medium mt-4">{errorMessage}</p>
          )}

          <div className="text-center mt-4">
            <Link
              href="/worker"
              className="text-purple-700 hover:text-purple-900 text-sm underline"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
