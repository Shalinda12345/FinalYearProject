"use client";
import { useEffect, useState, useMemo } from "react";
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

  type MonthlyTotal = {
    month: string; // YYYY-MM
    label: string;
    amount: number;
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

  // Aggregate orders into monthly totals (x axis = month, y axis = amount)
  const monthlyTotals: MonthlyTotal[] = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach((order) => {
      if (!order?.created_at) return;
      const d = new Date(order.created_at);
      if (isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; // e.g. 2026-02
      const prev = map.get(key) || 0;
      map.set(key, prev + (order.total_amount || 0));
    });

    const arr: MonthlyTotal[] = Array.from(map.entries()).map(
      ([key, amount]) => {
        const [year, month] = key.split("-").map(Number);
        const date = new Date(year, month - 1, 1);
        const label = date.toLocaleString(undefined, {
          month: "short",
          year: "numeric",
        });
        return { month: key, label, amount };
      },
    );

    arr.sort((a, b) => {
      const ad = new Date(a.month + "-01");
      const bd = new Date(b.month + "-01");
      return ad.getTime() - bd.getTime();
    });

    return arr;
  }, [orders]);

  function MonthlyRevenueChart({ data }: { data: MonthlyTotal[] }) {
    if (!data || data.length === 0) {
      return <p className="text-gray-600">No monthly data available.</p>;
    }

    const height = 260;
    const width = Math.max(600, data.length * 80);
    const padding = { top: 20, right: 20, bottom: 60, left: 60 };
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;
    const max = Math.max(...data.map((d) => d.amount), 1);

    const band = innerWidth / data.length;
    const getX = (i: number) => padding.left + i * band + band / 2;
    const getY = (value: number) =>
      padding.top + innerHeight - (value / max) * innerHeight;

    const yTicks = [0, Math.round(max / 2), Math.round(max)];

    const pathD = data
      .map((d, i) => `${i === 0 ? "M" : "L"}${getX(i)},${getY(d.amount)}`)
      .join(" ");

    return (
      <div className="overflow-x-auto">
        <svg width={width} height={height}>
          {/* grid + y labels */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={getY(tick)}
                y2={getY(tick)}
                stroke="#E5E7EB"
              />
              <text
                x={padding.left - 8}
                y={getY(tick) + 4}
                fontSize={12}
                textAnchor="end"
                fill="#6B7280"
              >
                {String(tick)}
              </text>
            </g>
          ))}

          {/* line path */}
          <path
            d={pathD}
            fill="none"
            stroke="#3B82F6"
            strokeWidth={3}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* area under line (subtle) */}
          <path
            d={`${pathD} L ${padding.left + innerWidth},${padding.top + innerHeight} L ${padding.left},${padding.top + innerHeight} Z`}
            fill="#3B82F6"
            opacity={0.08}
          />

          {/* points and labels */}
          {data.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d.amount);
            return (
              <g key={d.month}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill="#3B82F6"
                  stroke="#fff"
                  strokeWidth={1}
                />
                <text
                  x={cx}
                  y={cy - 10}
                  fontSize={11}
                  textAnchor="middle"
                  fill="#374151"
                >
                  {d.amount.toFixed(2)}
                </text>
                <text
                  x={cx}
                  y={height - 18}
                  fontSize={12}
                  textAnchor="middle"
                  fill="#6B7280"
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

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

      {/* Monthly Revenue Chart */}
      <div className="ml-10 mr-10 mb-8 bg-white rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Monthly Revenue
        </h2>
        <MonthlyRevenueChart data={monthlyTotals} />
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
