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
      <div className="pointer-events-none absolute top-2 left-4 size-14 rotate-12 rounded-[14px] border border-white/20 bg-white/5 backdrop-blur-xs" />
      <div className="pointer-events-none absolute -bottom-4 right-4 size-20 rotate-45 rounded-[16px] border border-white/15 bg-white/5 backdrop-blur-xs" />

      {/* Main Preview Container */}
      <div className="relative z-10 w-full max-w-[420px]">
        {/* Floating Top-Right Brand Badge */}
        <motion.div
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: [0, -4, 0], opacity: 1 }}
          transition={{
            y: { repeat: Infinity, duration: 4.5, ease: "easeInOut" },
            opacity: { duration: 0.25 },
          }}
          className="absolute -top-4 -right-2.5 z-30 flex size-12 items-center justify-center rounded-[12px] border border-white/40 bg-surface shadow-[var(--app-shadow-lg)]"
        >
          <div className="flex size-8.5 items-center justify-center rounded-[7px] bg-primary text-primary-contrast shadow-xs">
            <span className="text-[16px] font-extrabold tracking-tight">Rx</span>
          </div>
        </motion.div>

        {/* ── Main Dashboard Window ─── */}
        <motion.div
          initial={{ opacity: 0, transform: "translateY(12px) scale(0.96)" }}
          animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="relative overflow-hidden rounded-[12px] border border-white/40 bg-surface p-4 sm:p-4.5 text-text shadow-[var(--app-shadow-xl)]"
        >
          {/* Top Bar inside preview */}
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <div className="flex items-center gap-1.5">
              <div className="flex size-6 items-center justify-center rounded-[5px] bg-primary text-primary-contrast">
                <Pill size={12} />
              </div>
              <span className="text-xs font-bold text-text tracking-tight">
                Pharma<span className="text-primary">ERP</span>
              </span>
            </div>

            {/* Mock Search Bar */}
            <div className="hidden sm:flex h-6 w-32 items-center gap-1 rounded-[5px] bg-surface-alt px-2 text-[11px] text-text-muted">
              <Search size={11} className="text-text-muted" />
              <span>Search inventory...</span>
            </div>

            {/* Mock User Avatar */}
            <div className="flex items-center gap-1.5">
              <div className="flex size-7 items-center justify-center rounded-full bg-primary-soft text-[11px] font-bold text-primary">
                AF
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[11px] font-bold text-text leading-tight">
                  Dr. Andrew Fox
                </p>
                <p className="text-[9px] text-text-muted leading-none mt-0.5">Chief Pharmacist</p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                Total Inventory Value
              </p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-lg font-bold tracking-tight text-text tabular-nums">
                  ₹1,23,783.98
                </span>
                <span className="inline-flex items-center text-[11px] font-semibold text-success">
                  <TrendingUp size={11} className="mr-0.5" /> +24.8%
                </span>
              </div>
            </div>

            <span className="rounded-[5px] bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-contrast shadow-xs">
              + Live POS
            </span>
          </div>

          {/* Chart Preview Section */}
          <div className="mt-3 rounded-[7px] bg-surface-alt p-2.5 border border-border">
            <div className="flex items-center justify-between text-[11px] font-medium text-text-muted mb-1">
              <span>Sales & Stock Trend (7 Days)</span>
              <span className="font-bold text-success">Active</span>
            </div>
            
            {/* SVG Wave Graph */}
            <div className="h-12 w-full">
              <svg viewBox="0 0 320 65" className="h-full w-full overflow-visible">
                <defs>
                  <linearGradient id="dashboardChartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--app-color-primary, #00994a)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="var(--app-color-primary, #00994a)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 48 Q 40 14, 80 34 T 160 22 T 240 12 T 320 28"
                  fill="none"
                  stroke="var(--app-color-primary, #00994a)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M0 48 Q 40 14, 80 34 T 160 22 T 240 12 T 320 28 L 320 65 L 0 65 Z"
                  fill="url(#dashboardChartGrad)"
                />
                <circle cx="240" cy="12" r="3.5" fill="var(--app-color-primary, #00994a)" />
                <circle cx="240" cy="12" r="7" fill="var(--app-color-primary, #00994a)" fillOpacity="0.2" />
              </svg>
            </div>
          </div>

          {/* Table List */}
          <div className="mt-2.5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">
              <span>Fast-Moving Drugs</span>
              <span>Stock Status</span>
            </div>

            <div className="flex items-center justify-between rounded-[6px] bg-surface-alt px-2.5 py-1.5 text-xs border border-border">
              <div className="flex items-center gap-1.5">
                <div className="size-1.5 rounded-full bg-success" />
                <span className="font-semibold text-text text-xs">
                  Paracetamol 650mg
                </span>
                <span className="text-[10px] text-text-muted">Batch #P-921</span>
              </div>
              <span className="rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-semibold tracking-wide text-success tabular-nums">
                1,420 in stock
              </span>
            </div>

            <div className="flex items-center justify-between rounded-[6px] bg-surface-alt px-2.5 py-1.5 text-xs border border-border">
              <div className="flex items-center gap-1.5">
                <div className="size-1.5 rounded-full bg-info" />
                <span className="font-semibold text-text text-xs">
                  Amoxicillin 500mg
                </span>
                <span className="text-[10px] text-text-muted">Batch #A-412</span>
              </div>
              <span className="rounded-full bg-info-soft px-2 py-0.5 text-[10px] font-semibold tracking-wide text-info tabular-nums">
                850 in stock
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Floating Mini Widget (Bottom-Left) ───────────────────────── */}
        <motion.div
          initial={{ x: -10, y: 10, opacity: 0 }}
          animate={{ x: [0, -3, 0], y: [0, 3, 0], opacity: 1 }}
          transition={{
            x: { repeat: Infinity, duration: 4.8, ease: "easeInOut" },
            y: { repeat: Infinity, duration: 4.8, ease: "easeInOut" },
            opacity: { duration: 0.25, delay: 0.1 },
          }}
          className="absolute -bottom-4 -left-4 z-30 w-40 rounded-[9px] border border-white/50 bg-surface p-2.5 shadow-[var(--app-shadow-lg)]"
        >
          <div className="flex items-center gap-1.5">
            <div className="flex size-6 items-center justify-center rounded-[5px] bg-primary text-primary-contrast font-bold text-[11px]">
              Rx
            </div>
            <div>
              <p className="text-[11px] font-bold text-text leading-tight">
                Amoxil Pro
              </p>
              <p className="text-[9px] text-text-muted">GSK Healthcare</p>
            </div>
          </div>

          {/* Sparkline */}
          <div className="my-1.5 h-4 w-full">
            <svg viewBox="0 0 100 20" className="h-full w-full">
              <path
                d="M0 16 Q 25 20, 50 8 T 100 4"
                fill="none"
                stroke="var(--app-color-success, #16a34a)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-text tabular-nums">₹450.00</span>
            <span className="font-bold text-success">▲ 33.6%</span>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom Hero Text ─────────────────────────────────────────── */}
      <div className="relative z-10 mt-6 text-center text-white">
        <h2 className="text-xl font-bold tracking-tight text-white leading-[1.3]">
          The easiest way to manage
          <br />
          your pharmacy.
        </h2>
        <p className="mt-1 text-xs text-white/80 font-normal leading-[1.5]">
          Join the PharmaERP community now!
        </p>
      </div>
    </div>
  );
};

export default DashboardPreview;
