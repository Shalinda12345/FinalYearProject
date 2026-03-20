// frontend/app/client-dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavigationBar from "@/components/layout/NavigationBar";
import DashboardInteractions from "@/components/client/DashboardInteractions";

export default function Dashboard() {
  const [user, setUser] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("username");
    if (!storedUser) {
      // If not logged in, kick them back to login page
      router.push("/login");
    } else {
      setUser(storedUser);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <NavigationBar />
      
      <main className="relative mx-auto max-w-6xl px-6 py-12">
        {/* Background decorative elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />
          <div className="absolute top-32 right-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        <div className="relative z-10">
          <header className="mb-10">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
              Welcome back, <span className="text-teal-600 capitalize">{user}</span>
            </h1>
            <p className="mt-2 text-slate-500">
              Manage your orders, track activity, and overview your account.
            </p>
          </header>

          <DashboardInteractions />
        </div>
      </main>
    </div>
  );
}
