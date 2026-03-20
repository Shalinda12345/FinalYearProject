import NavigationBar from "@/components/layout/NavigationBar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <NavigationBar />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">
            About Heshan Products
          </p>
          <h1 className="mt-4 text-4xl font-semibold font-[var(--font-display)]">
            A Moderized Cooled Food Production Business
          </h1>
          <p className="mt-6 text-sm leading-7 text-slate-600">
            Heshan Products is a food production Business that manufactures Ice
            packets, Watalappan, and Drink Cups with an industry experience of
            20 years. Now digitizes operations with online ordering, centralized
            management, and a forecasting model that supports smarter decisions.
          </p>
        </div>

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Mission",
              desc: "Produce high-quality cooled food products while empowering wholesalers and retailers with the lowest cost possible.",
            },
            {
              title: "Vision",
              desc: "Empower the individuals who wants their own business in the cooled food industry.",
            },
            {
              title: "Who uses it",
              desc: "Admins and owners review analytics and forecasts, while customers place orders through the website.",
            },
            {
              title: "Key products",
              desc: "Ice packets, Watalappan, and Drink Cups are tracked with orders, sales, and performance insights.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold font-[var(--font-display)]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
