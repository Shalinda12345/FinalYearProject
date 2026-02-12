// app/checkout/page.js (or any component)
"use client";

import { useState } from "react";

export default function Checkout() {
  const [loading, setLoading] = useState(false);

  // Example Cart Data (Usually comes from Context or Redux)
  const cart = [
    { productId: 1, name: "Laptop", quantity: 2, price: 1000.0 },
    { productId: 2, name: "Mouse", quantity: 5, price: 50.0 },
  ];

  const handlePurchase = async () => {
    setLoading(true);

    // 1. Format data for the backend
    const payload = {
      user_id: 123, // Currently logged in user
      items: cart.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      // 2. Send one request
      const response = await fetch("http://localhost:8000/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Order Placed! ID: ${data.order_id}`);
        // Clear cart here
      } else {
        alert("Purchase failed");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {/* List items for user to see */}
      <ul className="mb-4">
        {cart.map((item) => (
          <li key={item.productId} className="border-b py-2">
            {item.name} - Qty: {item.quantity} - ${item.price}
          </li>
        ))}
      </ul>

      <button
        onClick={handlePurchase}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}
