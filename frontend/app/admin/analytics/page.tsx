"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavigationBar from "@/components/layout/NavigationBar";

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

  const height = 220;
  const width = Math.max(560, data.length * 60);
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const max = Math.max(...data.map((d) => Number(d[valueKey]) || 0), 1);

  const band = innerWidth / data.length;
  const getX = (i: number) => padding.left + i * band + band / 2;
  const getY = (value: number) =>
    padding.top + innerHeight - (value / max) * innerHeight;

  const pathD = data
    .map((d, i) => `${i === 0 ? "M" : "L"}${getX(i)},${getY(d[valueKey])}`)
    .join(" ");

  return (
    <div className="overflow-x-auto">
      <svg width={width} height={height}>
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function BarChart({ data }: { data: TopProduct[] }) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-slate-500">No data available.</p>;
  }

  const max = Math.max(...data.map((d) => d.revenue), 1);
  const widthClasses = [
    "w-[0%]",
    "w-[5%]",
    "w-[10%]",
    "w-[15%]",
    "w-[20%]",
    "w-[25%]",
    "w-[30%]",
    "w-[35%]",
    "w-[40%]",
    "w-[45%]",
    "w-[50%]",
    "w-[55%]",
    "w-[60%]",
    "w-[65%]",
    "w-[70%]",
    "w-[75%]",
    "w-[80%]",
    "w-[85%]",
    "w-[90%]",
    "w-[95%]",
    "w-[100%]",
  ];

  return (
    <div className="space-y-3">
      {data.map((item) => {
        const percent = Math.max(0, Math.min(100, (item.revenue / max) * 100));
        const idx = Math.min(
          widthClasses.length - 1,
          Math.round(percent / 5),
        );
        return (
        <div key={item.product_id} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-slate-700">{item.name}</span>
            <span className="text-slate-500">{item.revenue.toFixed(2)}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100">
            <div
              className={`h-2 rounded-full bg-teal-500 ${widthClasses[idx]}`}
            />
          </div>
        </div>
      )})}
    </div>
  );
}

function ForecastChart({ history, forecast }: ForecastResponse) {
  if (!history || history.length === 0) {
    return <p className="text-sm text-slate-500">No forecast data yet.</p>;
  }

  const recentHistory = history.slice(-14);
  const combined = [...recentHistory, ...forecast];
  const height = 240;
  const width = Math.max(560, combined.length * 60);
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const max = Math.max(
    ...combined.map((d) =>
      "predicted" in d ? Number(d.predicted) : Number(d.total),
    ),
    1,
  );

  const band = innerWidth / combined.length;
  const getX = (i: number) => padding.left + i * band + band / 2;
  const getY = (value: number) =>
    padding.top + innerHeight - (value / max) * innerHeight;

  const historyPath = recentHistory
    .map((d, i) => `${i === 0 ? "M" : "L"}${getX(i)},${getY(d.total)}`)
    .join(" ");

  const forecastPath = forecast
    .map((d, i) => {
      const idx = recentHistory.length + i;
      return `${i === 0 ? "M" : "L"}${getX(idx)},${getY(d.predicted)}`;
    })
    .join(" ");

  return (
    <div className="overflow-x-auto">
      <svg width={width} height={height}>
        <path
          d={historyPath}
          fill="none"
          stroke="#0EA5A4"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <path
          d={forecastPath}
          fill="none"
          stroke="#F59E0B"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray="6 4"
        />
      </svg>
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
