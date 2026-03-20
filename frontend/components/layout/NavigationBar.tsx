"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ShoppingCart, UserRound } from "lucide-react";

const STORAGE_KEY = "session_token";

export default function NavigationBar() {
  const [user, setUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("username");
    const adminUser = localStorage.getItem("admin_user");
    if (storedUser) {
      setUser(storedUser);
      setIsLoggedIn(true);
      setIsAdmin(false);
    } else if (adminUser) {
      setUser(adminUser);
      setIsLoggedIn(true);
      setIsAdmin(true);
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    const sessionToken = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (!sessionToken) {
      setIsSessionExpired(true);
      if (
        localStorage.getItem("username") ||
        localStorage.getItem("admin_user")
      ) {
        handleLogout();
      } else {
        console.log("No session token found. Please log in.");
      }
    } else {
      try {
        const payloadBase64 = sessionToken.split('.')[1];
        if (payloadBase64) {
          const payload = JSON.parse(atob(payloadBase64));
          const exp = payload.exp * 1000;
          if (now > exp) {
            console.log("JWT Session expired!");
            handleLogout();
          } else {
            console.log("Session remains valid for", Math.floor((exp - now)/60000), "minutes");
          }
        }
      } catch (e) {
        // Fallback for old tokens
        if (!isNaN(Number(sessionToken)) && now > Number(sessionToken)) {
          handleLogout();
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("admin_user");
    localStorage.removeItem(STORAGE_KEY);
    setUser("");
    setIsLoggedIn(false);
    router.push("/login");
  };

  const clickUser = () => {
    if (isAdmin) {
      router.push("/admin/admin-dashboard");
    } else {
      router.push("/client-dashboard");
    }
  };

  return (
    <nav className="w-full border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-8 px-4 py-5 text-sm font-medium sm:px-8">
        <a
          href="/"
          className="text-xl font-semibold text-slate-900 tracking-tight font-[var(--font-display)]"
        >
          Heshan Products
        </a>
        <a
          href="/"
          className="relative text-slate-700 transition-all duration-300 hover:text-teal-700 hover:font-semibold"
        >
          Home
        </a>
        <a
          href="/products"
          className="relative text-slate-700 transition-all duration-300 hover:text-teal-700 hover:font-semibold"
        >
          Our Products
        </a>
        <a
          href="/about"
          className="relative text-slate-700 transition-all duration-300 hover:text-teal-700 hover:font-semibold"
        >
          About Us
        </a>
        <a
          href="/contact"
          className="relative text-slate-700 transition-all duration-300 hover:text-teal-700 hover:font-semibold"
        >
          Contact Us
        </a>
        <div className="ml-auto">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <a
                href="/cart"
                className="flex items-center gap-2 rounded-lg border border-teal-200 px-4 py-2 text-slate-700 transition-all duration-300 hover:border-teal-400 hover:bg-teal-50"
              >
                <ShoppingCart className="h-4 w-4" />
                Cart
              </a>
              <button
                type="button"
                onClick={clickUser}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 transition-all duration-300 hover:border-teal-400 hover:text-teal-700"
              >
                <UserRound className="h-4 w-4" />
                {user}
              </button>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-slate-900 px-4 py-2 text-white transition-all duration-300 hover:bg-slate-800"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <a
                href="/login"
                className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 transition-all duration-300 hover:border-teal-400 hover:text-teal-700"
              >
                Login
              </a>
              <a
                href="/register"
                className="rounded-lg bg-teal-600 px-4 py-2 text-white transition-all duration-300 hover:bg-teal-700"
              >
                Register
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
