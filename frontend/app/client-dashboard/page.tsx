// frontend/app/client-dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="p-10">
      <h1 className="text-2xl font-bold">Welcome, {user}!</h1>
      <button
        onClick={() => {
          localStorage.removeItem("username");
          router.push("/login");
        }}
        className="mt-4 bg-red-500 text-white p-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
