"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import NavigationBar from "@/components/layout/NavigationBar";
import Pagination from "@/components/admin/Pagination";

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const router = useRouter();
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toString().includes(searchTerm) ||
      order.user_id.toString().includes(searchTerm);

    let matchesDate = true;
    if (order.created_at) {
      const orderDate = new Date(order.created_at);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && orderDate < start) matchesDate = false;
      if (end && orderDate > new Date(end.getTime() + 86400000)) matchesDate = false;
    }

    return matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, startDate, endDate]);

  useEffect(() => {
    const adminUser = localStorage.getItem("admin_user");
    if (!adminUser) {
      router.push("/admin/login");
      return;
    }
    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/orders/", {
        cache: "no-store",
      });
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="ml-10 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
      </div>

      <div className="ml-10 mr-10 mb-6 flex flex-col md:flex-row gap-4 bg-white p-4 rounded shadow">
        <input
          type="text"
          placeholder="Search by Order ID or User ID..."
          className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/3 text-gray-900"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2 w-full md:w-2/3 items-center">
          <label className="text-gray-600 font-medium">From:</label>
          <input
            type="date"
            className="border border-gray-300 rounded px-3 py-2 w-full text-gray-900"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label className="text-gray-600 font-medium whitespace-nowrap">To:</label>
          <input
            type="date"
            className="border border-gray-300 rounded px-3 py-2 w-full text-gray-900"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="ml-10 mr-10">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200">
            <tr className="text-left">
              <th className="px-4 py-2 font-semibold text-gray-700">ID</th>
              <th className="px-4 py-2 font-semibold text-gray-700">User ID</th>
              <th className="px-4 py-2 font-semibold text-gray-700">
                Total Amount
              </th>
              <th className="px-4 py-2 font-semibold text-gray-700">
                Delivery Date
              </th>
              <th className="px-4 py-2 font-semibold text-gray-700">
                Created At
              </th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {order.id}
                </td>
                <td className="px-4 py-3 font-medium text-gray-600">
                  {order.user_id}
                </td>
                <td className="px-4 py-3 font-medium text-gray-600">
                  {order.total_amount}
                </td>
                <td className="px-4 py-3 font-medium text-gray-500">
                  {order.delivery_date}
                </td>
                <td className="px-4 py-3 font-medium text-gray-500">
                  {order.created_at}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
