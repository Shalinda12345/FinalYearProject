"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (res.ok) {
      alert("login successful");
      localStorage.setItem("admin_user", data.admin_user);
      router.push("/admin-dashboard");
    } else {
      alert("Access Denied!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="p-10 bg-red shadow-lg rounded-lg flex flex-col gap-4"
      >
        <h1 className="text-xl font-bold text-red-600">Admin Portal</h1>
        <input
          type="text"
          placeholder="Admin Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="border p-2 text-green-600"
        />
        <input
          type="text"
          placeholder="Admin Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2 text-green-600"
        />
        <button type="submit" className="bg-red-600 text-white p-2 font-bold">
          Enter the System
        </button>
      </form>
    </div>
  );
}
