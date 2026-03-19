"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NavigationBar from "../../navigation-bar/page";

const STORAGE_KEY = "session_token";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const sessionDuration = 2 * 60 * 1000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (res.ok) {
      const expirationTime = new Date().getTime() + sessionDuration;
      localStorage.setItem(STORAGE_KEY, expirationTime.toString());
      alert(
        "Session token stored with expiration time: " +
          new Date(expirationTime).toLocaleTimeString(),
      );
      alert("login successful");
      localStorage.setItem("admin_user", data.admin_user);
      router.push("/admin/admin-dashboard");
    } else {
      alert("Access Denied!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <NavigationBar />
      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-teal-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-[-10%] h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <section>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                Admin only
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight font-[var(--font-display)]">
                Secure access to the control center
              </h1>
              <p className="mt-4 text-base text-white/70">
                Manage products, monitor sales, and oversee forecasting models
                from the administrative dashboard.
              </p>
              <div className="mt-8 grid gap-3">
                {[
                  "Manage products and pricing",
                  "Review orders and activity",
                  "Monitor forecasting insights",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold font-[var(--font-display)]">
                  Admin login
                </h2>
                <p className="mt-2 text-sm text-white/60">
                  Authorized users only.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="Admin username"
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Admin password"
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-teal-500 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-teal-400"
                >
                  Enter dashboard
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
