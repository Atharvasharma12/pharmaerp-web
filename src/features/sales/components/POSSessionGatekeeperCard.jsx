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
    <div className="w-full max-w-[430px] bg-surface rounded-[28px] border border-border shadow-[var(--app-shadow-xl)] p-7 sm:p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200 select-none">
      {!isDayOpen ? (
        /* ══════════ SCREEN 1: WHEN BUSINESS DAY IS CLOSED ══════════ */
        <>
          {/* Top Illustration: Soft Pink Cloud + Calendar + Red X Badge */}
          <div className="relative w-36 h-28 mx-auto flex items-center justify-center">
            {/* Soft Pink Cloud Background */}
            <svg
              viewBox="0 0 150 100"
              className="absolute inset-0 w-full h-full text-rose-500/10 dark:text-rose-400/15"
              fill="currentColor"
            >
              <path d="M 35 70 C 18 70 12 56 18 44 C 24 32 36 30 44 34 C 50 18 68 12 84 18 C 100 24 104 38 102 48 C 114 46 128 54 130 66 C 132 78 122 86 110 86 L 40 86 C 26 86 24 70 35 70 Z" />
            </svg>

            {/* Calendar with Red Rings & Dots */}
            <div className="relative z-10">
              <div className="w-16 h-14 rounded-xl border-2 border-rose-500/40 dark:border-rose-400/50 bg-surface shadow-xs overflow-hidden flex flex-col">
                {/* Red Top Bar with Loop Binders */}
                <div className="bg-rose-500 h-4 w-full flex items-center justify-around px-2.5 relative shrink-0">
                  <div className="w-1.5 h-2 bg-surface rounded-full -mt-1 shadow-2xs" />
                  <div className="w-1.5 h-2 bg-surface rounded-full -mt-1 shadow-2xs" />
                </div>
                {/* Calendar 6 dot squares */}
                <div className="flex-1 p-1.5 grid grid-cols-3 gap-1.5 items-center justify-center">
                  <div className="size-2 rounded-xs bg-rose-500/25 dark:bg-rose-400/30" />
                  <div className="size-2 rounded-xs bg-rose-500/25 dark:bg-rose-400/30" />
                  <div className="size-2 rounded-xs bg-rose-500/25 dark:bg-rose-400/30" />
                  <div className="size-2 rounded-xs bg-rose-500/25 dark:bg-rose-400/30" />
                  <div className="size-2 rounded-xs bg-rose-500/25 dark:bg-rose-400/30" />
                  <div className="size-2 rounded-xs bg-rose-500/25 dark:bg-rose-400/30" />
                </div>
              </div>

              {/* Overlapping Red Badge with White X */}
              <div className="absolute -bottom-1.5 -right-1.5 size-6 rounded-full bg-rose-500 text-white flex items-center justify-center ring-2 ring-surface shadow-xs">
                <X className="size-3.5 stroke-[3]" />
              </div>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1.5">
            <h2 className="text-[21px] font-bold text-text tracking-tight">
              Business Day is Not Open
            </h2>
            <p className="text-[13px] text-text-muted leading-relaxed max-w-[280px] mx-auto">
              You need to open a business day before you can start making sales.
            </p>
          </div>

          {/* Info Callout Box */}
          <div className="bg-surface-alt border border-border rounded-2xl p-3.5 flex items-start gap-3 text-left">
            <div className="size-8 rounded-xl bg-surface text-primary flex items-center justify-center shrink-0 shadow-2xs border border-border mt-0.5">
              <Calendar className="size-4 stroke-[2]" />
            </div>
            <p className="text-[12.5px] text-text leading-snug">
              A business day must be opened first to record all transactions, deposits, and withdrawals for the day.
            </p>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={onOpenBusinessDay}
            className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.99] text-primary-contrast font-bold text-sm shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
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
              className="absolute inset-0 w-full h-full text-amber-500/10 dark:text-amber-400/15"
              fill="currentColor"
            >
              <path d="M 35 70 C 18 70 12 56 18 44 C 24 32 36 30 44 34 C 50 18 68 12 84 18 C 100 24 104 38 102 48 C 114 46 128 54 130 66 C 132 78 122 86 110 86 L 40 86 C 26 86 24 70 35 70 Z" />
            </svg>

            {/* Amber Clock Circle */}
            <div className="relative z-10">
              <div className="size-14 rounded-full border-3 border-amber-500/50 dark:border-amber-400/60 bg-surface shadow-xs flex items-center justify-center relative">
                {/* Clock Hands pointing at ~10:10 */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-0.5 h-3.5 bg-amber-500 rounded-full origin-bottom" />
                <div className="absolute top-1/2 left-1/2 w-2.5 h-0.5 bg-amber-500 rounded-full origin-left rotate-45" />
                <div className="size-1.5 rounded-full bg-amber-500 z-10" />
              </div>

              {/* Overlapping Amber Badge with ! Exclamation */}
              <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-amber-500 text-white flex items-center justify-center ring-2 ring-surface shadow-xs font-bold text-xs leading-none">
                !
              </div>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1.5">
            <h2 className="text-[21px] font-bold text-text tracking-tight">
              No Active Shift
            </h2>
            <p className="text-[13px] text-text-muted leading-relaxed max-w-[310px] mx-auto">
              Business day is open, but no cashier shift is active. Please start a new shift to begin making sales.
            </p>
          </div>

          {/* Info Callout Box */}
          <div className="bg-surface-alt border border-border rounded-2xl p-3.5 flex items-start gap-3 text-left">
            <div className="size-8 rounded-xl bg-surface text-primary flex items-center justify-center shrink-0 shadow-2xs border border-border mt-0.5">
              <Calendar className="size-4 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[12.5px] text-text">
                  Business Day: {businessDateFormatted}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-success-soft text-success border border-success/30">
                  Open
                </span>
              </div>
              <div className="text-[11.5px] text-text-muted mt-0.5 truncate">
                Branch: {branchName}
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={onStartShift}
            className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.99] text-primary-contrast font-bold text-sm shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Play className="size-4 fill-primary-contrast stroke-none" />
            <span>Start New Shift</span>
          </button>
        </>
      )}
    </div>
  );
};

export default POSSessionGatekeeperCard;

