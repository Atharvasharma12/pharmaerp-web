import { motion } from "framer-motion";
import {
  TrendingUp,
  Search,
  Pill,
} from "lucide-react";

const DashboardPreview = () => {
  return (
    <div className="relative flex w-full flex-col items-center justify-center select-none">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute -top-10 -left-10 size-40 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 -right-12 size-48 rounded-full bg-white/15 blur-3xl" />

      {/* Decorative geometric accent badges */}
      <div className="pointer-events-none absolute top-2 left-4 size-16 rotate-12 rounded-[14px] border border-white/20 bg-white/5 backdrop-blur-xs" />
      <div className="pointer-events-none absolute -bottom-4 right-4 size-24 rotate-45 rounded-[16px] border border-white/15 bg-white/5 backdrop-blur-xs" />

      {/* Main Preview Container */}
      <div className="relative z-10 w-full max-w-[460px]">
        {/* Floating Top-Right Brand Badge */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: [0, -6, 0], opacity: 1 }}
          transition={{
            y: { repeat: Infinity, duration: 4.5, ease: "easeInOut" },
            opacity: { duration: 0.25 },
          }}
          className="absolute -top-5 -right-3 z-30 flex size-14 items-center justify-center rounded-[14px] border border-white/40 bg-white shadow-[var(--app-shadow-xl)]"
        >
          <div className="flex size-10 items-center justify-center rounded-[8px] bg-primary text-primary-contrast shadow-xs">
            <span className="text-[18px] font-extrabold tracking-tight">Rx</span>
          </div>
        </motion.div>

        {/* ── Main Dashboard Window (rounded-[10px] per DESIGN_STANDARDS §4) ─── */}
        <motion.div
          initial={{ opacity: 0, transform: "translateY(12px) scale(0.96)" }}
          animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="relative overflow-hidden rounded-[10px] border border-white/40 bg-white p-6 text-slate-800 shadow-[var(--app-shadow-xl)]"
        >
          {/* Top Bar inside preview */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-[6px] bg-primary text-white">
                <Pill size={14} />
              </div>
              <span className="text-sm font-bold text-slate-900 tracking-tight">
                Pharma<span className="text-primary">ERP</span>
              </span>
            </div>

            {/* Mock Search Bar */}
            <div className="hidden sm:flex h-7 w-36 items-center gap-1.5 rounded-[6px] bg-slate-100 px-2.5 text-xs text-slate-400">
              <Search size={12} className="text-slate-400" />
              <span>Search inventory...</span>
            </div>

            {/* Mock User Avatar */}
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                AF
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  Dr. Andrew Fox
                </p>
                <p className="text-[10px] text-slate-400 leading-none mt-0.5">Chief Pharmacist</p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Total Inventory Value
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold tracking-tight text-slate-900 tabular-nums">
                  ₹1,23,783.98
                </span>
                <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
                  <TrendingUp size={12} className="mr-0.5" /> +24.8%
                </span>
              </div>
            </div>

            <span className="rounded-[6px] bg-primary px-2.5 py-1 text-xs font-bold text-white shadow-xs">
              + Live POS
            </span>
          </div>

          {/* Chart Preview Section */}
          <div className="mt-4 rounded-[8px] bg-slate-50 p-3 border border-slate-100">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1.5">
              <span>Sales & Stock Trend (7 Days)</span>
              <span className="font-bold text-emerald-600">Active</span>
            </div>
            
            {/* SVG Wave Graph */}
            <div className="h-16 w-full">
              <svg viewBox="0 0 320 65" className="h-full w-full overflow-visible">
                <defs>
                  <linearGradient id="dashboardChartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00994a" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#00994a" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 48 Q 40 14, 80 34 T 160 22 T 240 12 T 320 28"
                  fill="none"
                  stroke="#00994a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M0 48 Q 40 14, 80 34 T 160 22 T 240 12 T 320 28 L 320 65 L 0 65 Z"
                  fill="url(#dashboardChartGrad)"
                />
                <circle cx="240" cy="12" r="3.5" fill="#00994a" />
                <circle cx="240" cy="12" r="8" fill="#00994a" fillOpacity="0.2" />
              </svg>
            </div>
          </div>

          {/* Table List per DESIGN_STANDARDS §1.2 & §8.3 */}
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400 px-1">
              <span>Fast-Moving Drugs</span>
              <span>Stock Status</span>
            </div>

            <div className="flex items-center justify-between rounded-[8px] bg-slate-50 px-3 py-2 text-sm border border-slate-100">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-900 text-sm">
                  Paracetamol 650mg
                </span>
                <span className="text-xs text-slate-400">Batch #P-921</span>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-emerald-800 tabular-nums">
                1,420 in stock
              </span>
            </div>

            <div className="flex items-center justify-between rounded-[8px] bg-slate-50 px-3 py-2 text-sm border border-slate-100">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-blue-500" />
                <span className="font-semibold text-slate-900 text-sm">
                  Amoxicillin 500mg
                </span>
                <span className="text-xs text-slate-400">Batch #A-412</span>
              </div>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-blue-800 tabular-nums">
                850 in stock
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Floating Mini Widget (Bottom-Left) ───────────────────────── */}
        <motion.div
          initial={{ x: -12, y: 12, opacity: 0 }}
          animate={{ x: [0, -4, 0], y: [0, 4, 0], opacity: 1 }}
          transition={{
            x: { repeat: Infinity, duration: 4.8, ease: "easeInOut" },
            y: { repeat: Infinity, duration: 4.8, ease: "easeInOut" },
            opacity: { duration: 0.25, delay: 0.1 },
          }}
          className="absolute -bottom-6 -left-5 z-30 w-44 rounded-[10px] border border-white/50 bg-white p-3.5 shadow-[var(--app-shadow-lg)]"
        >
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-[6px] bg-blue-600 text-white font-bold text-xs">
              Rx
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">
                Amoxil Pro
              </p>
              <p className="text-[10px] text-slate-400">GSK Healthcare</p>
            </div>
          </div>

          {/* Sparkline */}
          <div className="my-2 h-5 w-full">
            <svg viewBox="0 0 100 20" className="h-full w-full">
              <path
                d="M0 16 Q 25 20, 50 8 T 100 4"
                fill="none"
                stroke="#16a34a"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 tabular-nums">₹450.00</span>
            <span className="font-bold text-emerald-600">▲ 33.6%</span>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom Hero Text ─────────────────────────────────────────── */}
      <div className="relative z-10 mt-12 text-center text-white">
        <h2 className="text-2xl font-bold tracking-tight text-white leading-[1.3]">
          The easiest way to manage
          <br />
          your pharmacy.
        </h2>
        <p className="mt-2 text-sm text-white/80 font-normal leading-[1.6]">
          Join the PharmaERP community now!
        </p>
      </div>
    </div>
  );
};

export default DashboardPreview;
