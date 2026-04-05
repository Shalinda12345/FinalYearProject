"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ShoppingCart, UserRound, Menu, X } from "lucide-react";

const STORAGE_KEY = "session_token";

export default function NavigationBar() {
  const [user, setUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <nav className="w-full border-b border-slate-200 bg-white/95 backdrop-blur z-50 sticky top-0 relative shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-sm font-medium sm:px-8">
        <a
          href="/"
          className="text-xl font-semibold text-slate-900 tracking-tight font-[var(--font-display)] flex-shrink-0"
        >
          Heshan Products
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="/"
            className="text-slate-700 transition hover:text-teal-700"
          >
            Home
          </a>
          <a
            href="/products"
            className="text-slate-700 transition hover:text-teal-700"
          >
            Our Products
          </a>
          <a
            href="/about"
            className="text-slate-700 transition hover:text-teal-700"
          >
            About Us
          </a>
          <a
            href="/contact"
            className="text-slate-700 transition hover:text-teal-700"
          >
            Contact
          </a>
        </div>

        {/* Desktop User Actions */}
        <div className="hidden md:flex items-center">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              {!isAdmin ? (
                <a
                  href="/cart"
                  className="flex items-center gap-2 rounded-lg border border-teal-200 px-4 py-2 text-slate-700 transition hover:border-teal-400 hover:bg-teal-50"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Cart</span>
                </a>
              ) : null}

              <button
                type="button"
                onClick={clickUser}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 transition hover:border-teal-400 hover:text-teal-700"
              >
                <UserRound className="h-4 w-4" />
                <span className="max-w-[100px] truncate">{user}</span>
              </button>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <a
                href="/login"
                className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 transition hover:border-teal-400 hover:text-teal-700"
              >
                Login
              </a>
              <a
                href="/register"
                className="rounded-lg bg-teal-600 px-4 py-2 text-white transition hover:bg-teal-700"
              >
                Register
              </a>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-700 focus:outline-none p-2"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl flex flex-col py-4 px-4 space-y-4">
          <a
            href="/"
            className="block text-slate-700 font-medium hover:text-teal-700"
          >
            Home
          </a>
          <a
            href="/products"
            className="block text-slate-700 font-medium hover:text-teal-700"
          >
            Our Products
          </a>
          <a
            href="/about"
            className="block text-slate-700 font-medium hover:text-teal-700"
          >
            About Us
          </a>
          <a
            href="/contact"
            className="block text-slate-700 font-medium hover:text-teal-700"
          >
            Contact
          </a>
          
          <div className="border-t border-slate-100 pt-4 flex flex-col space-y-3">
            {isLoggedIn ? (
              <>
                {!isAdmin ? (
                  <a
                    href="/cart"
                    className="flex items-center gap-2 text-slate-700 font-medium hover:text-teal-700"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Cart</span>
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={clickUser}
                  className="flex items-center gap-2 text-slate-700 font-medium hover:text-teal-700 w-full text-left"
                >
                  <UserRound className="h-5 w-5" />
                  <span>{user}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white font-medium text-center hover:bg-slate-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 mt-2">
                <a
                  href="/login"
                  className="rounded-lg border border-slate-200 py-2 text-center text-slate-700 font-medium hover:text-teal-700"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="rounded-lg bg-teal-600 py-2 text-center text-white font-medium hover:bg-teal-700"
                >
                  Register
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
