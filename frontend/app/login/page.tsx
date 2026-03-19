"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NavigationBar from "../navigation-bar/page";

const STORAGE_KEY = "session_token";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const sessionDuration = 2 * 60 * 1000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    try {
      if (res.ok) {
        const expirationTime = new Date().getTime() + sessionDuration;
        localStorage.setItem(STORAGE_KEY, expirationTime.toString());
        alert(
          "Session token stored with expiration time: " +
            new Date(expirationTime).toLocaleTimeString(),
        );
        alert("login successful");

        localStorage.setItem("username", data.username);
        localStorage.setItem("user_id", data.id);
        router.push("/client-dashboard");
      } else {
        alert(data.detail || "Login failed!");
      }
    } catch (error) {
      alert("Connection error. Is the backend running?");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <NavigationBar />
      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-teal-200/40 blur-3xl" />
          <div className="absolute top-24 right-[-10%] h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <section className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">
                Secure access
              </p>
              <h1 className="text-4xl font-semibold leading-tight font-[var(--font-display)]">
                Welcome back to your business intelligence hub
              </h1>
              <p className="text-base text-slate-600">
                Sign in to monitor orders, view analytics, and keep production
                aligned with demand. Your data stays protected with role-based
                access controls.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Live order visibility",
                  "Forecast-ready insights",
                  "Secure role access",
                  "Modern admin workflows",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold font-[var(--font-display)]">
                  Sign in
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Use your registered email address.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@email.com"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
                >
                  Continue
                </button>
              </form>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
                <a href="/register" className="text-teal-700 hover:underline">
                  Not registered? Create an account
                </a>
                <a href="/admin/login" className="text-slate-500 hover:underline">
                  Admin portal
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
