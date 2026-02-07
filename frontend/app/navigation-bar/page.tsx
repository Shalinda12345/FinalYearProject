"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NavigationBar() {
  const [user, setUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUser(storedUser);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUser("");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <nav className="w-full border-b border-zinc-200 bg-linear-to-r from-white to-zinc-50 dark:from-zinc-900 dark:to-black dark:border-zinc-800 shadow-sm">
      <ul className="mx-auto flex max-w-7xl items-center gap-8 px-4 py-5 text-sm font-medium sm:px-8">
        <li>
          <a
            href="/"
            className="relative text-zinc-700 transition-all duration-300 hover:text-blue-600 dark:text-zinc-200 dark:hover:text-blue-400 hover:font-semibold"
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="/products"
            className="relative text-zinc-700 transition-all duration-300 hover:text-blue-600 dark:text-zinc-200 dark:hover:text-blue-400 hover:font-semibold"
          >
            Our Products
          </a>
        </li>
        <li>
          <a
            href="/about"
            className="relative text-zinc-700 transition-all duration-300 hover:text-blue-600 dark:text-zinc-200 dark:hover:text-blue-400 hover:font-semibold"
          >
            About Us
          </a>
        </li>
        <li>
          <a
            href="/contact"
            className="relative text-zinc-700 transition-all duration-300 hover:text-blue-600 dark:text-zinc-200 dark:hover:text-blue-400 hover:font-semibold"
          >
            Contact Us
          </a>
        </li>
        <li className="ml-auto">
          {isLoggedIn ? (
            <div className="flex items-center gap-6">
              <a
                href="/cart"
                className="px-6 py-2 rounded-lg text-zinc-700 dark:text-zinc-200 border-2 border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300 font-semibold hover:border-blue-600"
              >
                🛒
              </a>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                <span className="text-sm text-blue-900 dark:text-blue-200">
                  👤
                </span>
                <span className="text-zinc-800 dark:text-zinc-100 font-semibold">
                  {user}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <a
                href="/login"
                className="px-6 py-2 rounded-lg text-zinc-700 dark:text-zinc-200 border-2 border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300 font-semibold hover:border-blue-600"
              >
                Login
              </a>
              <a
                href="/register"
                className="px-6 py-2 rounded-lg bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                Register
              </a>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}
