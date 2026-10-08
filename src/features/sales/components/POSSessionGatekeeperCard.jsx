// src/features/sales/components/POSSessionGatekeeperCard.jsx

import React from "react";
import { Calendar, Play, X } from "lucide-react";

const formatDayDate = (d) => {
  if (!d) return "—";
  const dateObj = new Date(d);
  if (Number.isNaN(dateObj.getTime())) return String(d);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString("en-GB", { month: "long" });
  const year = dateObj.getFullYear();
  return `${day} ${month} ${year}`;
};

/**
 * POSSessionGatekeeperCard
 * Displays the required pre-requisite gate card on POS Billing:
 * - Screen 1: "Business Day is Not Open" when no business day is active
 * - Screen 2: "No Active Shift" when business day is active but cashier shift is closed
 */
export const POSSessionGatekeeperCard = ({
  isDayOpen = false,
  openBusinessDay = null,
  currentBranch = null,
  onOpenBusinessDay,
  onStartShift,
}) => {
  const branchName =
    currentBranch?.name ||
    openBusinessDay?.branch?.name ||
    openBusinessDay?.branchName ||
    "Main Branch";

  const businessDateFormatted = formatDayDate(
    openBusinessDay?.businessDate || new Date()
  );

  return (
    <div className="w-full max-w-[430px] bg-white dark:bg-neutral-900 rounded-[28px] border border-slate-200/90 dark:border-neutral-800 shadow-2xl p-7 sm:p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200 select-none">
      {!isDayOpen ? (
        /* ══════════ SCREEN 1: WHEN BUSINESS DAY IS CLOSED ══════════ */
        <>
          {/* Top Illustration: Pastel Pink Cloud + Calendar + Red X Badge */}
          <div className="relative w-36 h-28 mx-auto flex items-center justify-center">
            {/* Soft Pink Cloud Background */}
            <svg
              viewBox="0 0 150 100"
              className="absolute inset-0 w-full h-full text-rose-100/90 dark:text-rose-950/40"
              fill="currentColor"
            >
              <path d="M 35 70 C 18 70 12 56 18 44 C 24 32 36 30 44 34 C 50 18 68 12 84 18 C 100 24 104 38 102 48 C 114 46 128 54 130 66 C 132 78 122 86 110 86 L 40 86 C 26 86 24 70 35 70 Z" />
            </svg>

            {/* Calendar with Red Rings & Dots */}
            <div className="relative z-10">
              <div className="w-16 h-14 rounded-xl border-2 border-rose-400 bg-white dark:bg-neutral-900 shadow-xs overflow-hidden flex flex-col">
                {/* Red Top Bar with Loop Binders */}
                <div className="bg-rose-500 h-4 w-full flex items-center justify-around px-2.5 relative shrink-0">
                  <div className="w-1.5 h-2 bg-white rounded-full -mt-1 shadow-2xs" />
                  <div className="w-1.5 h-2 bg-white rounded-full -mt-1 shadow-2xs" />
                </div>
                {/* Calendar 6 dot squares */}
                <div className="flex-1 p-1.5 grid grid-cols-3 gap-1.5 items-center justify-center">
                  <div className="size-2 rounded-xs bg-rose-200 dark:bg-rose-800" />
                  <div className="size-2 rounded-xs bg-rose-200 dark:bg-rose-800" />
                  <div className="size-2 rounded-xs bg-rose-200 dark:bg-rose-800" />
                  <div className="size-2 rounded-xs bg-rose-200 dark:bg-rose-800" />
                  <div className="size-2 rounded-xs bg-rose-200 dark:bg-rose-800" />
                  <div className="size-2 rounded-xs bg-rose-200 dark:bg-rose-800" />
                </div>
              </div>

              {/* Overlapping Red Badge with White X */}
              <div className="absolute -bottom-1.5 -right-1.5 size-6 rounded-full bg-rose-500 text-white flex items-center justify-center ring-2 ring-white dark:ring-neutral-900 shadow-xs">
                <X className="size-3.5 stroke-[3]" />
              </div>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1.5">
            <h2 className="text-[21px] font-bold text-slate-900 dark:text-white tracking-tight">
              Business Day is Not Open
            </h2>
            <p className="text-[13px] text-slate-500 dark:text-neutral-400 leading-relaxed max-w-[280px] mx-auto">
              You need to open a business day before you can start making sales.
            </p>
          </div>

          {/* Info Callout Box */}
          <div className="bg-[#f0f7ff] dark:bg-sky-950/30 border border-[#e0edfd] dark:border-sky-900/40 rounded-2xl p-3.5 flex items-start gap-3 text-left">
            <div className="size-8 rounded-xl bg-white dark:bg-sky-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-2xs border border-sky-100 dark:border-sky-800/40 mt-0.5">
              <Calendar className="size-4 stroke-[2]" />
            </div>
            <p className="text-[12.5px] text-slate-700 dark:text-slate-200 leading-snug">
              A business day must be opened first to record all transactions, deposits, and withdrawals for the day.
            </p>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={onOpenBusinessDay}
            className="w-full py-3.5 px-4 rounded-xl bg-[#1d61f2] hover:bg-[#1853d1] active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Calendar className="size-4 stroke-[2]" />
            <span>Open Business Day</span>
          </button>
        </>
      ) : (
        /* ══════════ SCREEN 2: WHEN DAY IS OPEN BUT SHIFT IS CLOSED ══════════ */
        <>
          {/* Top Illustration: Pastel Amber Cloud + Clock + Orange ! Badge */}
          <div className="relative w-36 h-28 mx-auto flex items-center justify-center">
            {/* Soft Amber Cloud Background */}
            <svg
              viewBox="0 0 150 100"
              className="absolute inset-0 w-full h-full text-amber-100/90 dark:text-amber-950/40"
              fill="currentColor"
            >
              <path d="M 35 70 C 18 70 12 56 18 44 C 24 32 36 30 44 34 C 50 18 68 12 84 18 C 100 24 104 38 102 48 C 114 46 128 54 130 66 C 132 78 122 86 110 86 L 40 86 C 26 86 24 70 35 70 Z" />
            </svg>

            {/* Amber Clock Circle */}
            <div className="relative z-10">
              <div className="size-14 rounded-full border-3 border-amber-400 bg-white dark:bg-neutral-900 shadow-xs flex items-center justify-center relative">
                {/* Clock Hands pointing at ~10:10 */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-0.5 h-3.5 bg-amber-500 rounded-full origin-bottom" />
                <div className="absolute top-1/2 left-1/2 w-2.5 h-0.5 bg-amber-500 rounded-full origin-left rotate-45" />
                <div className="size-1.5 rounded-full bg-amber-500 z-10" />
              </div>

              {/* Overlapping Amber Badge with ! Exclamation */}
              <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-amber-500 text-white flex items-center justify-center ring-2 ring-white dark:ring-neutral-900 shadow-xs font-bold text-xs leading-none">
                !
              </div>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1.5">
            <h2 className="text-[21px] font-bold text-slate-900 dark:text-white tracking-tight">
              No Active Shift
            </h2>
            <p className="text-[13px] text-slate-500 dark:text-neutral-400 leading-relaxed max-w-[310px] mx-auto">
              Business day is open, but no cashier shift is active. Please start a new shift to begin making sales.
            </p>
          </div>

          {/* Info Callout Box */}
          <div className="bg-[#f0f7ff] dark:bg-sky-950/30 border border-[#e0edfd] dark:border-sky-900/40 rounded-2xl p-3.5 flex items-start gap-3 text-left">
            <div className="size-8 rounded-xl bg-white dark:bg-sky-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-2xs border border-sky-100 dark:border-sky-800/40 mt-0.5">
              <Calendar className="size-4 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[12.5px] text-slate-900 dark:text-white">
                  Business Day: {businessDateFormatted}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                  Open
                </span>
              </div>
              <div className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                Branch: {branchName}
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={onStartShift}
            className="w-full py-3.5 px-4 rounded-xl bg-[#1d61f2] hover:bg-[#1853d1] active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Play className="size-4 fill-white stroke-none" />
            <span>Start New Shift</span>
          </button>
        </>
      )}
    </div>
  );
};

export default POSSessionGatekeeperCard;

