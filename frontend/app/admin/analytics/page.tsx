"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavigationBar from "@/components/layout/NavigationBar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

type Summary = {
  total_products: number;
  total_orders: number;
  total_users: number;
  total_revenue: number;
  avg_order_value: number;
};

type DailyStat = {
  date: string;
  total: number;
  orders: number;
};

type MonthlyStat = {
  month: string;
  label: string;
  amount: number;
};

type TopProduct = {
  product_id: number;
  name: string;
  quantity: number;
  revenue: number;
};

type ForecastPoint = {
  date: string;
  predicted: number;
  lower: number;
  upper: number;
};

type ForecastResponse = {
  history: DailyStat[];
  forecast: ForecastPoint[];
};

const API_BASE = "http://127.0.0.1:8000";

function LineChart({
  data,
  valueKey,
  color,
}: {
  data: any[];
  valueKey: string;
  color: string;
}) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-slate-500">No data available.</p>;
  }

  const labels = data.map((d) => d.label || d.date || d.month || "Unknown");
  const values = data.map((d) => Number(d[valueKey]) || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: valueKey === "amount" ? "Revenue" : "Sales",
        data: values,
        borderColor: color,
        backgroundColor: `${color}33`,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: color,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => `Rs. ${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b", maxRotation: 45, minRotation: 0 },
      },
      y: {
        border: { display: false },
        ticks: { color: "#64748b" },
      },
    },
  };

  return (
    <div className="h-[300px] w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}

function BarChart({ data }: { data: TopProduct[] }) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-slate-500">No data available.</p>;
  }

  const labels = data.map((d) => d.name);
  const values = data.map((d) => d.revenue);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: values,
        backgroundColor: "#14b8a6",
        borderRadius: 4,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => `Rs. ${context.parsed.x.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "#f1f5f9" },
        border: { display: false },
        ticks: { color: "#64748b" },
      },
      y: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#334155", font: { weight: 500 } },
      },
    },
  };

  return (
    <div className="h-[300px] w-full">
      <Bar data={chartData} options={options as any} />
    </div>
  );
}

function ForecastChart({ history, forecast }: ForecastResponse) {
  if (!history || history.length === 0) {
    return <p className="text-sm text-slate-500">No forecast data yet.</p>;
  }

  const recentHistory = history.slice(-14);
  const labels = [
    ...recentHistory.map((d) => d.date),
    ...forecast.map((d) => d.date),
  ];

  const historyData = [
    ...recentHistory.map((d) => d.total),
    ...forecast.map(() => null),
  ];

  const lastHistoryValue = recentHistory[recentHistory.length - 1]?.total || 0;

  const forecastData = [
    ...recentHistory.map((_, i) =>
      i === recentHistory.length - 1 ? lastHistoryValue : null
    ),
    ...forecast.map((d) => d.predicted),
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Historical Sales",
        data: historyData,
        borderColor: "#0ea5a4",
        backgroundColor: "transparent",
        tension: 0.4,
        pointBackgroundColor: "#0ea5a4",
      },
      {
        label: "Forecast",
        data: forecastData,
        borderColor: "#f59e0b",
        backgroundColor: "transparent",
        borderDash: [6, 4],
        tension: 0.4,
        pointBackgroundColor: "#f59e0b",
        pointStyle: "rectRot",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: (context: any) =>
            `${context.dataset.label}: Rs. ${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b", maxRotation: 45, minRotation: 0 },
      },
      y: {
        border: { display: false },
        ticks: { color: "#64748b" },
      },
    },
  };

  return (
    <div className="h-[300px] w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [dailySales, setDailySales] = useState<DailyStat[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyStat[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [forecast, setForecast] = useState<ForecastResponse>({
    history: [],
    forecast: [],
  });
  const router = useRouter();

  useEffect(() => {
    const adminUser = localStorage.getItem("admin_user");
    if (!adminUser) {
      router.push("/admin/login");
      return;
    }

    const load = async () => {
      const [summaryRes, dailyRes, monthlyRes, topRes, forecastRes] =
        await Promise.all([
          fetch(`${API_BASE}/analytics/summary`),
          fetch(`${API_BASE}/analytics/daily-sales?days=30`),
          fetch(`${API_BASE}/analytics/monthly-revenue`),
          fetch(`${API_BASE}/analytics/top-products?limit=5`),
          fetch(`${API_BASE}/analytics/forecast?days=14`),
        ]);

      const summaryData = await summaryRes.json();
      const dailyData = await dailyRes.json();
      const monthlyData = await monthlyRes.json();
      const topData = await topRes.json();
      const forecastData = await forecastRes.json();

      setSummary(summaryData);
      setDailySales(dailyData);
      setMonthlyRevenue(monthlyData);
      setTopProducts(topData);
      setForecast(forecastData);
    };

    load().catch((error) => {
      console.error("Failed to load analytics", error);
    });
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <NavigationBar />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">
            Sales Analytics
          </p>
          <h1 className="mt-2 text-3xl font-semibold font-[var(--font-display)]">
            Forecasts, trends, and performance in one view
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Use this dashboard to monitor sales trends, order frequency, and
            product performance. Forecast data updates based on order history.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          {[
            {
              label: "Revenue",
              value: summary?.total_revenue ?? 0,
            },
            {
              label: "Orders",
              value: summary?.total_orders ?? 0,
            },
            {
              label: "Avg order",
              value: summary?.avg_order_value ?? 0,
            },
            {
              label: "Products",
              value: summary?.total_products ?? 0,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {item.label}
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">
                {item.value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold font-[var(--font-display)]">
              Monthly revenue trend
            </h2>
            <div className="mt-4">
              <LineChart data={monthlyRevenue} valueKey="amount" color="#0EA5A4" />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold font-[var(--font-display)]">
              Top products
            </h2>
            <div className="mt-4">
              <BarChart data={topProducts} />
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold font-[var(--font-display)]">
              Daily sales (last 30 days)
            </h2>
            <div className="mt-4">
              <LineChart data={dailySales} valueKey="total" color="#1D4ED8" />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold font-[var(--font-display)]">
              Forecast (next 14 days)
            </h2>
            <div className="mt-4">
              <ForecastChart history={forecast.history} forecast={forecast.forecast} />
            </div>
            {forecast.forecast.length > 0 && (
              <div className="mt-4 text-xs text-slate-500">
                Latest prediction: {forecast.forecast[0].predicted} for {forecast.forecast[0].date}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
