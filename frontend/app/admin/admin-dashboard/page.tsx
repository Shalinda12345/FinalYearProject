"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavigationBar from "../../navigation-bar/page";

export default function AdminDashboard() {
  const [user, setUser] = useState("");
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState([]);
  const [revenue, setRevenue] = useState(0);

  type Product = {
    id: number;
    name: string;
    price: number;
    description: string;
  };

  type Order = {
    id: number;
    user_id: number;
    total_amount: number;
    created_at: string;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("admin_user");
    if (!storedUser) {
      router.push("/admin/login");
    } else {
      setUser(storedUser);
    }
    fetchProducts();
    fetchOrders();
    fetchUsers();
    fetchRevenue();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/products/", {
        cache: "no-store",
      });
      const data = await res.json();
      console.log("Fetched Products:", data);
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

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

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/users/", {
        cache: "no-store",
      });
      const data = await res.json();
      console.log("Fetched Users:", data);
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const fetchRevenue = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/orders/", {
        cache: "no-store",
      });
      // const data = await res.json();
      // console.log("Fetched Revenue:", data);

      const allData: Order[] = await res.json();

      // 3. THE CRITICAL STEP: Extract the column
      // This creates a new array containing ONLY the emails
      const totalAmount = allData.map((order) => order.total_amount);
      console.log("Extracted Total Amounts:", totalAmount);

      const totalRevenue = totalAmount.reduce((sum, amount) => sum + amount, 0);
      setRevenue(totalRevenue);
    } catch (error) {
      console.error("Failed to fetch revenue", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="ml-10 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back {user}! Here is your Business Overview
        </p>
      </div>

      {/* Stat Cards */}
      <div className="ml-10 mr-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Total Products</p>
          <p className="text-gray-500 text-2xl font-bold">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Total Orders</p>
          <p className="text-gray-500 text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Total Users</p>
          <p className="text-gray-500 text-2xl font-bold">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Total Revenue</p>
          <p className="text-gray-500 text-2xl font-bold">{revenue}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-10 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-gray-900">Recent Products</h1>

            <button
              onClick={() => router.push("/admin/add-products")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              + Add Products
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr className="text-left">
                  <th className="px-4 py-2 font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-2 font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-4 py-2 font-semibold text-gray-700">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {products
                  .slice(-3)
                  .reverse()
                  .map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-600">
                        {product.price}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-500">
                        {product.description}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/admin/add-products")}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              <span>➕</span> Add Product
            </button>
            <button
              onClick={() => router.push("/admin/products")}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              <span>📋</span> View All Products
            </button>
            <button
              onClick={() => router.push("/admin/orders")}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              <span>👥</span> View Orders
            </button>
          </div>
        </div>
      </div>

      <div className="ml-10 grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-4">
            Recent Orders
          </h1>
          <div className="mr-10 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr className="text-left">
                  <th className="px-4 py-2 font-semibold text-gray-700">
                    Order ID
                  </th>
                  <th className="px-4 py-2 font-semibold text-gray-700">
                    User ID
                  </th>
                  <th className="px-4 py-2 font-semibold text-gray-700">
                    Total Amount
                  </th>
                  <th className="px-4 py-2 font-semibold text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .slice(-4)
                  .reverse()
                  .map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
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
          </div>
        </div>
      </div>
    </div>
  );
}
