"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import NavigationBar from "@/app/navigation-bar/page";
import Pagination from "../components/pagination/page";

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/orders/", {
        cache: "no-store",
      });
      const data = await res.json();
      console.log("Fetched Orders:", data);
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
