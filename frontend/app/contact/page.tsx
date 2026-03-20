"use client";

import { useState } from "react";
import NavigationBar from "@/components/layout/NavigationBar";

export default function ContactPage() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const target = event.target as any;
    const data = {
      name: target[0].value,
      email: target[1].value,
      message: target[2].value
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setStatus("Thanks! We will contact you within one business day.");
        target.reset();
      } else {
        setStatus("Failed to send message. Please try again later.");
      }
    } catch {
      setStatus("Network error.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <NavigationBar />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">
              Contact Us
            </p>
            <h1 className="mt-4 text-4xl font-semibold font-[var(--font-display)]">
              Talk to the Heshan Products team
            </h1>
            <p className="mt-4 text-sm text-slate-600">
              Reach out for product inquiries, wholesale orders. We are here to
              help you plan your Ice packets, Watalappan, and Drink Cup orders
              confidently.
            </p>
            <div className="mt-8 space-y-3 text-sm text-slate-600">
              <p>Phone: +94 71 898 1801</p>
              <p>Email: heshanproducts@gmail.com</p>
              <p>Location: Wennappuwa, Sri Lanka</p>
              <p>Business Hours: 24 Hours x 365</p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
          >
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Full name
                </label>
                <input
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Email address
                </label>
                <input
                  type="email"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm"
                  placeholder="you@email.com"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Message
                </label>
                <textarea
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm"
                  rows={5}
                  placeholder="Tell us about your order or forecasting needs"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Send message
              </button>
              {status && (
                <p className="text-sm text-teal-700" role="status">
                  {status}
                </p>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
