"use client";
import { useState } from "react";

export default function NavigationBar() {
  return (
    <nav className="w-full border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <ul className="mx-auto flex max-w-10xl items-center gap-8 px-4 py-4 text-sm font-medium sm:px-8">
        <li>
          <a
            href="/"
            className="text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-400"
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="/"
            className="text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-400"
          >
            Our Products
          </a>
        </li>
        <li>
          <a
            href="/about"
            className="text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-400"
          >
            About Us
          </a>
        </li>
        <li>
          <a
            href="/contact"
            className="text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-400"
          >
            Contact Us
          </a>
        </li>
        <li className="ml-auto">
          <a
            href="/login"
            className="text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-400"
          >
            Login
          </a>
        </li>
        <li>
          <a
            href="/register"
            className="text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-400"
          >
            Register
          </a>
        </li>
      </ul>
    </nav>
  );
}
