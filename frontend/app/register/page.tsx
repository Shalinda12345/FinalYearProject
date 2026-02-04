"use client";
import { useState } from "react";
import NavigationBar from "../navigation-bar/page";

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
    <>
      <NavigationBar />
      <form onSubmit={handleSubmit} className="p-10 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="border p-2"
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Register
        </button>
        <a href="login">Already Registered? Login........</a>
      </form>
    </>
  );
}
