"use client";
import { useState } from "react";
import NavigationBar from "../../navigation-bar/page";

export default function AddProductsPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/products", {
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
      <div>
        <h1 className="text-2xl font-bold text-center mt-10">Add Products</h1>
        <form
          onSubmit={handleSubmit}
          className="text-green-600 flex flex-col gap-4 mt-6 w-1/2 mx-auto"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Product Name"
              inputMode="text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Description
            </label>
            <input
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Product Description"
              inputMode="text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="LKR 0.00"
              inputMode="decimal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Image URL
            </label>
            <input
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
              inputMode="url"
            />
          </div>
          <button type="submit" className="bg-red-600 text-white p-2 font-bold">
            Add Product
          </button>
        </form>
      </div>
    </>
  );
}
