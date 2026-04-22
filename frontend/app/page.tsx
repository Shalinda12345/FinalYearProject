import NavigationBar from "@/components/layout/NavigationBar";

export default function Home() {
  return (
    <div className="min-h-screen bg-amber-50 text-slate-900 font-[var(--font-body)]">
      <NavigationBar />
      <main className="relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -top-40 left-10 h-[500px] w-[500px] rounded-full bg-orange-400/20 blur-3xl" />
          <div className="absolute top-40 right-[-10%] h-[400px] w-[400px] rounded-full bg-amber-400/20 blur-3xl" />
          <div className="absolute bottom-20 left-1/3 h-[600px] w-[600px] rounded-full bg-emerald-400/10 blur-3xl" />
        </div>

        {/* Hero Section */}
        <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-20 sm:pt-32 lg:pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/70 px-5 py-2 text-sm font-bold uppercase tracking-[0.2em] text-orange-700 shadow-sm backdrop-blur-md">
              Premium Quality • Bulk Supply
            </p>
            <h1 className="text-5xl font-extrabold leading-tight text-slate-900 sm:text-7xl font-[var(--font-display)] tracking-tight">
              Fueling your business with <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">premium products.</span>
            </h1>
            <p className="mt-8 text-xl text-slate-600 leading-relaxed font-medium">
              Heshan Products is a leading manufacturer and wholesale distributor of the finest Watalappan, high-grade Packaged Ice, and premium Disposable Cups. Fresh, fast, and built for scale.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-6">
              <a
                href="/products"
                className="group relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-1 hover:shadow-orange-500/50"
              >
                Start Ordering Now
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="/about"
                className="flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-bold text-slate-800 shadow-md ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:ring-slate-300 hover:shadow-lg"
              >
                Learn About Us
              </a>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="relative z-10 bg-white py-24 shadow-sm border-y border-slate-100">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-display)] text-slate-900">
                Our Signature Products
              </h2>
              <p className="mt-4 text-lg text-slate-600">Manufactured to the highest standards for retail and commercial use.</p>
            </div>
            
            <div className="grid gap-10 md:grid-cols-3">
              {/* Product 1 */}
              <div className="group rounded-3xl bg-slate-50 border border-slate-100 overflow-hidden shadow-sm transition hover:shadow-xl hover:-translate-y-2">
                <div className="h-64 overflow-hidden relative">
                  <img src="/images/watalappan.png" alt="Watalappan Dessert" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                     <h3 className="text-2xl font-bold text-white">Classic Watalappan</h3>
                  </div>
                </div>
                <div className="p-6 flex flex-col h-[calc(100%-16rem)] justify-between">
                  <p className="text-slate-600 mb-6 font-medium">Rich, traditional Sri Lankan dessert made from authentic jaggery and spices. Packaged fresh for retail shelves and catering events.</p>
                  <a href="/products" className="text-amber-600 font-bold hover:text-amber-700 flex flex-row items-center gap-1 group/link w-max">
                    Order Wholesale
                    <svg className="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </div>
              </div>
              
              {/* Product 2 */}
              <div className="group rounded-3xl bg-slate-50 border border-slate-100 overflow-hidden shadow-sm transition hover:shadow-xl hover:-translate-y-2">
                <div className="h-64 overflow-hidden relative">
                  <img src="/images/ice.png" alt="Commercial Packaged Ice" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 to-transparent flex items-end p-6">
                     <h3 className="text-2xl font-bold text-white">Packaged Ice</h3>
                  </div>
                </div>
                <div className="p-6 flex flex-col h-[calc(100%-16rem)] justify-between">
                  <p className="text-slate-600 mb-6 font-medium">Crystal-clear, hygienically purified ice cubes. Delivered frozen solid for events, restaurants, and convenience stores.</p>
                  <a href="/products" className="text-cyan-600 font-bold hover:text-cyan-700 flex items-center gap-1 group/link w-max">
                    Order Wholesale
                    <svg className="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </div>
              </div>
              
              {/* Product 3 */}
              <div className="group rounded-3xl bg-slate-50 border border-slate-100 overflow-hidden shadow-sm transition hover:shadow-xl hover:-translate-y-2">
                <div className="h-64 overflow-hidden relative">
                  <img src="/images/cups.png" alt="Disposable Drink Cups" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent flex items-end p-6">
                     <h3 className="text-2xl font-bold text-white">Drink Cups</h3>
                  </div>
                </div>
                <div className="p-6 flex flex-col h-[calc(100%-16rem)] justify-between">
                  <p className="text-slate-600 mb-6 font-medium">Durable, leak-proof, and premium quality disposable cups. Perfect for hot beverages, smoothies, and takeaway orders.</p>
                  <a href="/products" className="text-emerald-600 font-bold hover:text-emerald-700 flex items-center gap-1 group/link w-max">
                    Order Wholesale
                    <svg className="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-10 bg-slate-900 py-24 text-center border-t border-slate-800">
           <div className="mx-auto max-w-4xl px-6">
             <h2 className="text-4xl font-extrabold text-white font-[var(--font-display)]">Partner with Heshan Products, Today.</h2>
             <p className="mt-6 text-xl text-slate-300 font-medium max-w-2xl mx-auto">
               Join hundreds of retailers, event planners, and suppliers who rely on us for their daily operations.
             </p>
             <div className="mt-10 flex flex-wrap justify-center gap-4">
               <a href="/register" className="rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-orange-500/30">
                 Create Wholesale Account
               </a>
               <a href="/contact" className="rounded-xl bg-slate-800 px-8 py-4 text-lg font-bold text-white border border-slate-700 transition-all hover:bg-slate-700 hover:border-slate-600">
                 Contact Sales Team
               </a>
             </div>
           </div>
        </section>

      </main>
    </div>
  );
}
