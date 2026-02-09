"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavigationBar from "../../navigation-bar/page";

export default function AdminDashboard() {
  const [user, setUser] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("admin_user");
    if (!storedUser) {
      router.push("/admin/login");
    } else {
      setUser(storedUser);
    }
  }, [router]);

  return (
    <>
      <NavigationBar />
      <h1 className="text-2xl font-bold text-center mt-10">Admin Dashboard</h1>
      <p className="text-center mt-4">
        Welcome to the Admin Dashboard! Here you can manage products, view
        orders, and perform administrative tasks.
      </p>
      <button
        onClick={() => router.push("/admin/add-products")}
        className="mt-6 bg-blue-500 text-white p-2 rounded mx-auto block"
      >
        Add Prducts
      </button>
      <button
        onClick={() => {
          localStorage.removeItem("admin_user");
          router.push("/admin/login");
        }}
        className="mt-4 bg-red-500 text-white p-2 rounded mx-auto block"
      >
        Logout
      </button>
    </>
  );
}
