// frontend/app/client-dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavigationBar from "../navigation-bar/page";
import DashboardInteractions from "./components/page";

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
    <>
      <NavigationBar />
      <DashboardInteractions
        initialStats={{ total_clients: "", revenue: "" }}
      />
    </>
  );
}
