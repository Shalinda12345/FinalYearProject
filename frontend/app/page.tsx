import NavigationBar from "@/components/layout/NavigationBar";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <NavigationBar />
      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-teal-200/40 blur-3xl" />
          <div className="absolute top-24 right-[-10%] h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
        </div>

        <section className="relative mx-auto max-w-6xl px-6 pb-16 pt-16 sm:pt-24">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">
                Smart Production Intelligence
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl font-[var(--font-display)]">
                Forecast demand. Produce with confidence. Serve every order on time.
              </h1>
              <p className="mt-6 text-lg text-slate-600">
                Heshan Products manufactures Ice packets, Watalappan, and Drink
                Cups. This platform brings sales forecasting, order management,
                and analytics together so owners can plan production, reduce
                waste, and take better business decisions.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/products"
                  className="rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
                >
                  View Catalogue
                </a>
                <a
                  href="/contact"
                  className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-400 hover:text-teal-700"
                >
                  Request a Demo
                </a>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {[
                  { label: "Products", value: "Ice, Watalappan, Cups" },
                  { label: "Orders", value: "Online + dashboard" },
                  { label: "Forecasting", value: "Sales trends" },
                  { label: "Analytics", value: "Admin insights" },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-white/80 p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-xl">
              <h2 className="text-2xl font-semibold text-slate-900 font-[var(--font-display)]">
                Business Overview
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                Admins can track sales, view order trends, and monitor profit
                over time from a single dashboard.
              </p>
              <div className="mt-6 space-y-4">
                {[
                  {
                    title: "Sales Forecast",
                    desc: "Predict upcoming demand for Ice packets, Watalappan, and Drink Cups.",
                  },
                  {
                    title: "Order Placement",
                    desc: "Wholesalers place orders online through the products page and cart.",
                  },
                  {
                    title: "Admin Analytics",
                    desc: "Interactive charts for revenue, orders, and top products.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-slate-800">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-lg bg-teal-50 px-4 py-3 text-xs text-teal-700">
                Forecast-ready dashboards for food production SMEs.
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Predictive Sales Engine",
                desc: "Forecast sales volumes so production stays aligned with demand.",
              },
              {
                title: "Unified Admin Control",
                desc: "Manage users, products, orders, reports, and insights in one place.",
              },
              {
                title: "Customer Ordering",
                desc: "Users can order online, track carts, and view order history in their dashboard.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold font-[var(--font-display)]">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm text-slate-600">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="grid gap-10 rounded-3xl border border-slate-200 bg-white p-10 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-semibold font-[var(--font-display)]">
                From customer order to production planning
              </h2>
              <p className="mt-4 text-sm text-slate-600">
                Customers browse the Our Products page, add items to cart, and
                place orders online. The system updates analytics instantly, and
                the forecasting model helps admins decide the next production
                batch.
              </p>
            </div>
            <div className="space-y-4">
              {[
                "Customers place orders online.",
                "Admins review orders and sales dashboards.",
                "Forecasts guide production decisions.",
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="h-8 w-8 rounded-full bg-teal-600 text-center text-sm font-semibold leading-8 text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm text-slate-700">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="rounded-3xl bg-slate-900 px-10 py-12 text-white">
            <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div>
                <h2 className="text-3xl font-semibold font-[var(--font-display)]">
                  Ready to modernize production and sales?
                </h2>
                <p className="mt-4 text-sm text-slate-200">
                  Keep your team aligned with real-time orders, clear analytics,
                  and accurate forecasts designed for SMEs.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 md:justify-end">
                <a
                  href="/register"
                  className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900"
                >
                  Create an account
                </a>
                <a
                  href="/contact"
                  className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white"
                >
                  Talk to us
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
