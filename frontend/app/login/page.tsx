"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // 1. Import useRouter
import NavigationBar from "../navigation-bar/page";

export default function login() {
  const router = useRouter(); // 2. Initialize the router
  const [form, setForm] = useState({ email: "", password: "" });

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
        // 3. Success! Store user data and Redirect
        alert("login successful");

        // Optional: Save the username/token to localStorage so the Dashboard knows who it is
        localStorage.setItem("username", data.username);

        // Redirect to the dashboard
        router.push("/client-dashboard");
      } else {
        // Handle errors (e.g., Wrong password)
        alert(data.detail || "Login failed!");
      }
    } catch (error) {
      alert("Connection error. Is the backend running?");
    }
  };

  return (
    <>
      <NavigationBar />
      <form onSubmit={handleSubmit} className="p-10 flex flex-col gap-4">
        {/* 4. Changed Input type from Username to Email */}
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Login
        </button>
        <a href="/register">Not Registered Yet? Register.......</a>

        <a href="/admin/login">An Admin? Click Here......</a>
      </form>
    </>
  );
}
