// app/dashboard/DashboardInteractions.tsx
"use client"; // Required for onClick and useState

import { useEffect, useState } from "react";
import { Users, Activity as ActivityIcon, RefreshCw } from "lucide-react";

export default function DashboardInteractions({
  initialStats,
}: {
  initialStats: any;
}) {
  // State to track which view is active: 'stats' or 'activity'
  const [activeView, setActiveView] = useState<"stats" | "activity" | "orders">(
    "stats",
  );

  // State to store the new data we fetch
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [user, setUser] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("username");

    if (storedUser) {
      setUser(storedUser);
    } else {
      setUser("");
    }

    handleLoadOrders();
    setActiveView("stats");
  }, []);

  const handleLoadOrders = async () => {
    setActiveView("orders");

    const storedUserId = localStorage.getItem("user_id");

    // 2. Safety check
    if (!storedUserId) {
      alert("User ID not found. Please Log Out and Log In again.");
      return;
    }

    if (orders.length === 0) {
      setLoading(true);
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/orders?user_id=${storedUserId}`,
        );
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200 pb-4">
        <button
          onClick={() => setActiveView("stats")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeView === "stats"
              ? "bg-blue-100 text-blue-700"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          Overview
        </button>
        <button
          onClick={handleLoadOrders}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeView === "orders"
              ? "bg-blue-100 text-blue-700"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          Order History
        </button>
      </div>

      {/* Conditional Rendering Area */}
      <div className="min-h-300px">
        {/* VIEW 1: The Original Stats (Default) */}
        {activeView === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {loading ? (
              <div className="p-12 flex justify-center text-blue-500">
                <RefreshCw className="animate-spin w-8 h-8" />
              </div>
            ) : (
              <>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-gray-500">Cost</p>
                  <p className="text-2xl font-bold">
                    Rs.{" "}
                    {orders.reduce(
                      (sum, orders) => sum + orders.total_amount,
                      0,
                    )}
                  </p>
                </div>
              </>
            )}
            {/* Add more stat cards here */}
          </div>
        )}

        {/* VIEW 2: The Order History */}
        {activeView === "orders" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
            {loading ? (
              <div className="p-12 flex justify-center text-blue-500">
                <RefreshCw className="animate-spin w-8 h-8" />
              </div>
            ) : (
              // <p className="p-12 text-center text-gray-500">
              //   No order history available.
              // </p>
              <ul>
                {/* 1. Create a sorted copy of the orders first */}
                {[...orders]
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime(),
                  )
                  .map((order, index) => (
                    <li
                      key={order.id}
                      className="p-4 border-b border-gray-100 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        {/* Row Number */}
                        <p className="font-medium text-gray-900 w-8">
                          {index + 1}
                        </p>

                        {/* Date Display */}
                        <p className="font-medium text-gray-900">
                          {(function formatDate(dateString: string) {
                            const date = new Date(dateString); // Use the ORDER date

                            const formatter = new Intl.DateTimeFormat("si-LK", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              timeZone: "Asia/Colombo",
                            });

                            // FIX: Use 'date' here, not 'new Date()'
                            const formattedDate = formatter.format(date);

                            return (
                              formattedDate +
                              " " +
                              date.toLocaleTimeString("si-LK", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            );
                          })(order.created_at)}
                        </p>

                        <p className="text-sm text-gray-500">
                          Rs. {order.total_amount}
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
