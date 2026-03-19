"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavigationBar from "../../navigation-bar/page";
import { PackagePlus, Boxes, ClipboardList, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [user, setUser] = useState("");
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyTotal[]>([]);
  const [monthlyForecast, setMonthlyForecast] = useState<MonthlyTotal[]>([]);

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

  type Summary = {
    total_products: number;
    total_orders: number;
    total_users: number;
    total_revenue: number;
    avg_order_value: number;
  };

  type MonthlyTotal = {
    month: string;
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
    fetchSummary();
    fetchMonthlyRevenue();
    fetchMonthlyForecast();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/products/", {
        cache: "no-store",
      });
      const data = await res.json();
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
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/analytics/summary", {
        cache: "no-store",
      });
      const data = await res.json();
      setSummary(data);
    } catch (error) {
      console.error("Failed to fetch summary", error);
    }
  };

  const fetchMonthlyRevenue = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/analytics/monthly-revenue",
        {
          cache: "no-store",
        },
      );
      const data = await res.json();
      setMonthlyRevenue(data);
    } catch (error) {
      console.error("Failed to fetch monthly revenue", error);
    }
  };

  const fetchMonthlyForecast = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/analytics/forecast-monthly?months=6",
        {
          cache: "no-store",
        },
      );
      const data = await res.json();
      setMonthlyForecast(data);
    } catch (error) {
      console.error("Failed to fetch monthly forecast", error);
    }
  };

  function MonthlyLineChart({
    data,
    stroke,
    fill,
    dashed = false,
  }: {
    data: MonthlyTotal[];
    stroke: string;
    fill: string;
    dashed?: boolean;
  }) {
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

          <path
            d={pathD}
            fill="none"
            stroke={stroke}
            strokeWidth={3}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={dashed ? "6 4" : undefined}
          />

          <path
            d={`${pathD} L ${padding.left + innerWidth},${padding.top + innerHeight} L ${padding.left},${padding.top + innerHeight} Z`}
            fill={fill}
            opacity={0.08}
          />

          {data.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d.amount);
            return (
              <g key={d.month}>
                <circle cx={cx} cy={cy} r={4} fill={stroke} stroke="#fff" strokeWidth={1} />
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

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="ml-10 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back {user}! Here is your business overview.
        </p>
      </div>

      <div className="ml-10 mr-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Total Products</p>
          <p className="text-gray-500 text-2xl font-bold">
            {summary?.total_products ?? products.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Total Orders</p>
          <p className="text-gray-500 text-2xl font-bold">
            {summary?.total_orders ?? orders.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Total Users</p>
          <p className="text-gray-500 text-2xl font-bold">
            {summary?.total_users ?? 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Total Revenue</p>
          <p className="text-gray-500 text-2xl font-bold">
            {summary?.total_revenue ?? 0}
          </p>
        </div>
      </div>

      <div className="ml-10 mr-10 mb-8 bg-white rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Monthly Revenue
        </h2>
        <MonthlyLineChart
          data={monthlyRevenue}
          stroke="#0EA5A4"
          fill="#0EA5A4"
        />
      </div>

      <div className="ml-10 mr-10 mb-8 bg-white rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          6-Month Sales Forecast
        </h2>
        <MonthlyLineChart
          data={monthlyForecast}
          stroke="#F59E0B"
          fill="#F59E0B"
          dashed
        />
      </div>

      <div className="ml-10 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-gray-900">Recent Products</h1>

            <button
              onClick={() => router.push("/admin/add-products")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Add Products
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
              <PackagePlus className="h-4 w-4" /> Add Product
            </button>
            <button
              onClick={() => router.push("/admin/products")}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              <Boxes className="h-4 w-4" /> View All Products
            </button>
            <button
              onClick={() => router.push("/admin/orders")}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              <ClipboardList className="h-4 w-4" /> View Orders
            </button>
            <button
              onClick={() => router.push("/admin/analytics")}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              <TrendingUp className="h-4 w-4" /> Sales Analytics
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
                        {new Date(order.created_at).toLocaleString()}
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
