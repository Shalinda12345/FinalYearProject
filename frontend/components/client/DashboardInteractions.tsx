// app/dashboard/DashboardInteractions.tsx
"use client"; // Required for onClick and useState

import { useEffect, useState } from "react";
import { 
  RefreshCw, 
  ShoppingBag, 
  CreditCard, 
  TrendingUp, 
  Package, 
  Clock, 
  ChevronRight 
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Filler,
  Legend
);

export default function DashboardInteractions() {
  const [activeView, setActiveView] = useState<"stats" | "orders">("stats");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    handleLoadOrders();
    setActiveView("stats");
  }, []);

  const handleLoadOrders = async () => {
    const storedUserId = localStorage.getItem("user_id");
    if (!storedUserId) {
      alert("User ID not found. Please Log Out and Log In again.");
      return;
    }

    if (orders.length === 0) {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/orders?user_id=${storedUserId}`);
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const totalCost = orders.reduce((sum, order) => sum + order.total_amount, 0);

  // Parse Orders into Chart Data
  const chartDataMap = new Map();
  // Sort oldest to newest to build a timeline
  [...orders].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).forEach(o => {
    const date = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(o.created_at));
    chartDataMap.set(date, (chartDataMap.get(date) || 0) + o.total_amount);
  });
  const chartData = Array.from(chartDataMap, ([date, amount]) => ({ date, amount }));

  return (
    <div className="animate-in fade-in duration-500 fill-mode-forwards">
      {/* Navigation Tabs */}
      <div className="flex space-x-2 mb-8 bg-white/50 p-1.5 rounded-2xl w-fit border border-slate-200 shadow-sm backdrop-blur-md">
        <button
          onClick={() => setActiveView("stats")}
          className={`px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all duration-300 ${
            activeView === "stats"
              ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
              : "text-slate-500 hover:bg-white hover:text-slate-900"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Overview
        </button>
        <button
          onClick={() => {
            setActiveView("orders");
            handleLoadOrders();
          }}
          className={`px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all duration-300 ${
            activeView === "orders"
              ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
              : "text-slate-500 hover:bg-white hover:text-slate-900"
          }`}
        >
          <Package className="w-4 h-4" />
          Order History
        </button>
      </div>

      {/* Conditional Rendering Area */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white/40 rounded-3xl border border-white/60 shadow-xl backdrop-blur-xl">
            <RefreshCw className="animate-spin text-orange-500 w-8 h-8" />
          </div>
        ) : (
          <>
            {/* VIEW 1: Overview Stats */}
            {activeView === "stats" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
                
                {/* Orders Card */}
                <div className="group relative overflow-hidden bg-white/70 p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-white backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="absolute top-0 right-0 p-4 opacity-10 transition group-hover:opacity-20 translate-x-4 -translate-y-4">
                    <ShoppingBag className="w-24 h-24 text-orange-600" />
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-orange-100 rounded-xl">
                      <ShoppingBag className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Total Orders</h3>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-slate-800 font-[var(--font-display)]">
                    {orders.length}
                  </p>
                </div>

                {/* Lifetime Value Card */}
                <div className="group relative overflow-hidden bg-white/70 p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-white backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="absolute top-0 right-0 p-4 opacity-10 transition group-hover:opacity-20 translate-x-4 -translate-y-4">
                    <CreditCard className="w-24 h-24 text-indigo-600" />
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-indigo-100 rounded-xl">
                      <CreditCard className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Lifetime Value</h3>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-slate-800 font-[var(--font-display)]">
                    <span className="text-2xl text-slate-400 font-normal mr-1">Rs.</span>
                    {totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>

                {/* Average Order Value Card */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-indigo-600 p-6 rounded-3xl shadow-lg shadow-orange-500/20 border border-white/10 transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="absolute top-0 right-0 p-4 opacity-20 transition group-hover:opacity-30 translate-x-4 -translate-y-4">
                    <TrendingUp className="w-24 h-24 text-white" />
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-orange-50 uppercase tracking-widest">Avg Order</h3>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-white font-[var(--font-display)]">
                    <span className="text-2xl text-white/70 font-normal mr-1">Rs.</span>
                    {orders.length > 0 
                      ? (totalCost / orders.length).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : "0.00"}
                  </p>
                </div>

                {/* Spending Trend Area Chart */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-white/70 p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-white backdrop-blur-xl mt-2 fade-in animate-in slide-in-from-bottom-6 duration-700">
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-slate-800 font-[var(--font-display)]">Order Trend</h2>
                    <p className="text-sm text-slate-500">Your total Orders over the recent period</p>
                  </div>
                  {chartData.length > 0 ? (
                    <div className="h-[300px] w-full">
                      <Line
                        data={{
                          labels: chartData.map(d => d.date),
                          datasets: [{
                            fill: true,
                            label: 'Spent',
                            data: chartData.map(d => d.amount),
                            borderColor: '#14b8a6',
                            backgroundColor: 'rgba(20, 184, 166, 0.2)',
                            tension: 0.4,
                            pointBackgroundColor: '#14b8a6',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: '#14b8a6',
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              callbacks: {
                                label: (context) => `Rs. ${context.parsed.y?.toLocaleString() || 0}`
                              }
                            }
                          },
                          scales: {
                            x: {
                              grid: { display: false },
                              border: { display: false },
                              ticks: { color: '#64748b', font: { size: 13 } }
                            },
                            y: {
                              border: { display: false },
                              ticks: { 
                                color: '#64748b', 
                                font: { size: 13 },
                                callback: (value) => `Rs ${value}`
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-[300px] w-full flex items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                      <div className="text-center">
                        <TrendingUp className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm font-medium text-slate-500">Not enough data to map trends</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 2: Order History */}
            {activeView === "orders" && (
              <div className="bg-white/70 rounded-3xl shadow-xl shadow-slate-200/50 border border-white backdrop-blur-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500 fade-in">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white/50">
                  <h2 className="text-lg font-semibold text-slate-800 font-[var(--font-display)]">Recent Transactions</h2>
                  <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
                    {orders.length} Records
                  </span>
                </div>
                
                {orders.length === 0 ? (
                  <div className="p-16 flex flex-col items-center justify-center text-center">
                    <Package className="w-16 h-16 text-slate-300 mb-4" />
                    <p className="text-lg font-medium text-slate-600">No orders found.</p>
                    <p className="text-sm text-slate-400 mt-1">When you make a purchase, it will appear here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-100">
                          <th className="px-6 py-4">Order ID</th>
                          <th className="px-6 py-4">Date & Time</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Amount</th>
                          <th className="px-6 py-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...orders]
                          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                          .map((order, index) => (
                            <tr 
                              key={order.id} 
                              className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group"
                            >
                              <td className="px-6 py-4">
                                <span className="font-mono text-xs font-semibold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">
                                  #{order.id.toString().padStart(5, '0')}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-500">
                                    <Clock className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                      {new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(new Date(order.created_at))}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {new Date(order.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200/50">
                                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                  Completed
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <p className="text-sm font-bold text-slate-800">
                                  Rs. {order.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                  <ChevronRight className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
