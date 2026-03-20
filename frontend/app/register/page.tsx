"use client";
import { useState } from "react";
import NavigationBar from "@/components/layout/NavigationBar";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    alert(data.message || data.detail);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <NavigationBar />
      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute bottom-0 left-[-10%] h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold font-[var(--font-display)]">
                  Create an account
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Start placing orders and track your history in one place.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@email.com"
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
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
                    placeholder="Create a strong password"
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Create account
                </button>
              </form>

              <div className="mt-6 text-sm text-slate-500">
                Already registered?{" "}
                <a href="/login" className="text-teal-700 hover:underline">
                  Sign in
                </a>
              </div>
            </section>

            <section className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
                Wholesale onboarding
              </p>
              <h1 className="text-4xl font-semibold leading-tight font-[var(--font-display)]">
                A single account to manage orders & analytics
              </h1>
              <p className="text-base text-slate-600">
                Register once to place orders, track delivery history, and stay
                updated on product availability.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Instant order placement",
                  "Order history tracking",
                  "Secure account management",
                  "Direct admin support",
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
          </div>
        </div>
      </main>
    </div>
  );
}
