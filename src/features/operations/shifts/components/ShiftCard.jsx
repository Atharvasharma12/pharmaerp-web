// src/features/operations/shifts/components/ShiftCard.jsx

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Sun,
  Sunset,
  Moon,
  Info,
  LockKeyhole,
  User,
  AlertTriangle,
  TrendingUp,
  Banknote,
  Calendar,
} from "lucide-react";
import {
  UIBadge,
  UIIconButton,
  UIButton,
} from "@/components/ui";

const SHIFT_PALETTES = [
  {
    bg: "from-amber-500 to-orange-600",
    shadow: "shadow-orange-500/20",
    icon: Sun,
    label: "Morning Shift",
  },
  {
    bg: "from-blue-600 to-indigo-600",
    shadow: "shadow-blue-500/20",
    icon: Clock,
    label: "Afternoon Shift",
  },
  {
    bg: "from-purple-600 to-violet-700",
    shadow: "shadow-purple-500/20",
    icon: Sunset,
    label: "Evening Shift",
  },
  {
    bg: "from-slate-800 to-zinc-900",
    shadow: "shadow-slate-500/20",
    icon: Moon,
    label: "Night Shift",
  },
];

const getShiftPalette = (shiftName = "", openedAt) => {
  const name = String(shiftName || "").toLowerCase();
  if (name.includes("morning") || name.includes("am")) return SHIFT_PALETTES[0];
  if (name.includes("afternoon") || name.includes("noon")) return SHIFT_PALETTES[1];
  if (name.includes("evening") || name.includes("pm")) return SHIFT_PALETTES[2];
  if (name.includes("night")) return SHIFT_PALETTES[3];

  if (openedAt) {
    const hour = new Date(openedAt).getHours();
    if (hour >= 6 && hour < 12) return SHIFT_PALETTES[0];
    if (hour >= 12 && hour < 17) return SHIFT_PALETTES[1];
    if (hour >= 17 && hour < 21) return SHIFT_PALETTES[2];
    return SHIFT_PALETTES[3];
  }
  return SHIFT_PALETTES[1];
};

const getFallbackShiftName = (s) => {
  if (s?.shiftName) return s.shiftName;
  const hour = new Date(s?.openedAt || s?.createdAt || new Date()).getHours();
  if (hour < 12) return "Morning Shift";
  if (hour < 17) return "Afternoon Shift";
  if (hour < 20) return "Evening Shift";
  return "Night Shift";
};

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "₹0";
  return `₹${Number(amount).toLocaleString("en-IN")}`;
};

const formatTimeRange = (openedAt, closedAt) => {
  const openStr = openedAt
    ? new Date(openedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "-";
  if (!closedAt) return `${openStr} → Open`;
  const closeStr = new Date(closedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${openStr} → ${closeStr}`;
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const ShiftCard = ({
  shift,
  onView,
  onCloseShift,
}) => {
  const palette = useMemo(
    () => getShiftPalette(shift?.shiftName, shift?.openedAt),
    [shift?.shiftName, shift?.openedAt]
  );

  const ShiftIcon = palette.icon || Clock;
  const shiftTitle = getFallbackShiftName(shift);
  const isOpen = shift?.status === "open";
  const isClosed = shift?.status === "closed";

  const openedByStaff =
    shift?.openedBy?.fullName ||
    shift?.openedBy?.name ||
    shift?.openedBy?.email ||
    "System User";

  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
      onClick={() => onView?.(shift)}
      className={`group relative flex flex-col justify-between rounded-[16px] p-5 shadow-sm transition-all duration-200 cursor-pointer select-none ${
        isOpen
          ? "border-2 border-emerald-500/80 dark:border-emerald-500/70 shadow-lg shadow-emerald-500/15 ring-2 ring-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.07] via-surface to-surface hover:border-emerald-500 hover:shadow-emerald-500/20"
          : "border border-border bg-surface hover:border-border-strong hover:shadow-md"
      }`}
    >
      {/* ── Active Session Highlight Banner ── */}
      {isOpen && (
        <div className="flex items-center justify-between gap-2 mb-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-2.5 py-1 text-emerald-600 dark:text-emerald-400">
          <span className="flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            Active Register Shift
          </span>
          <span className="text-[10px] font-bold font-mono">LIVE SESSION</span>
        </div>
      )}

      {/* ── Header Row: Icon, Title, Shift No, Badge & Direct "i" Button ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br ${palette.bg} text-white shadow-md ${palette.shadow} transition-transform duration-200 group-hover:scale-105 ${
              isOpen ? "ring-4 ring-emerald-500/30 shadow-emerald-500/30" : ""
            }`}
          >
            <ShiftIcon className="h-5 w-5 stroke-[2.2]" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-bold text-text truncate tracking-tight group-hover:text-primary transition-colors">
                {shiftTitle}
              </h3>
              {shift?.isAdjusted && isClosed && (
                <span
                  title="Shift Adjusted: Physical cash counted or denominations didn't match expected system cash"
                  className="text-warning flex items-center justify-center bg-warning-soft rounded-full p-1 border border-warning/30 shrink-0"
                >
                  <AlertTriangle className="size-3" />
                </span>
              )}
            </div>
            <p className="text-[12px] font-mono text-text-muted truncate mt-0.5">
              {shift?.shiftNo || "N/A"}
            </p>
          </div>
        </div>

        {/* Status Badge & Direct "i" Info Button & Lock Icon Button */}
        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          <UIBadge
            variant="soft"
            color={isOpen ? "success" : isClosed ? "neutral" : "error"}
            className={`text-xs uppercase font-bold tracking-wider ${
              isOpen ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30" : ""
            }`}
          >
            {shift?.status || "open"}
          </UIBadge>

          <UIIconButton
            variant="ghost"
            size="sm"
            aria-label={`View details for ${shiftTitle}`}
            title="View Shift Details"
            onClick={() => onView?.(shift)}
            className="text-text-muted hover:text-primary hover:bg-primary/10 h-8 w-8 rounded-lg transition-colors"
          >
            <Info className="h-4 w-4" />
          </UIIconButton>

          {isOpen && (
            <UIIconButton
              variant="ghost"
              size="sm"
              aria-label={`Lock Shift ${shiftTitle}`}
              title="Lock Shift"
              onClick={() => onCloseShift?.(shift)}
              className="text-amber-600 hover:text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 border border-amber-500/30 h-8 w-8 rounded-lg transition-colors"
            >
              <LockKeyhole className="h-4 w-4" />
            </UIIconButton>
          )}
        </div>
      </div>

      {/* ── Middle Divider ── */}
      <div className="my-3.5 h-[1px] w-full bg-border/60" />

      {/* ── 2x2 Metadata Grid ── */}
      <div className="grid grid-cols-2 gap-y-3.5 gap-x-4">
        {/* Date & Time Range */}
        <div className="min-w-0">
          <p className="text-[11.5px] font-medium text-text-muted flex items-center gap-1">
            <Calendar className="size-3 shrink-0 text-primary" />
            Date & Session
          </p>
          <p className="text-[13px] font-bold text-text truncate mt-0.5">
            {formatDate(shift?.date || shift?.openedAt)}
          </p>
          <p className="text-[11.5px] text-text-muted font-mono truncate">
            {formatTimeRange(shift?.openedAt, shift?.closedAt)}
          </p>
        </div>

        {/* Opened By */}
        <div className="min-w-0">
          <p className="text-[11.5px] font-medium text-text-muted flex items-center gap-1">
            <User className="size-3 shrink-0 text-primary" />
            Opened By
          </p>
          <p className="text-[13px] font-semibold text-text truncate mt-0.5" title={openedByStaff}>
            {openedByStaff}
          </p>
        </div>

        {/* Opening Float */}
        <div className="min-w-0">
          <p className="text-[11.5px] font-medium text-text-muted flex items-center gap-1">
            <Banknote className="size-3 shrink-0 text-emerald-600" />
            Opening Float
          </p>
          <p className="text-[13.5px] font-bold text-text font-mono tabular-nums mt-0.5">
            {formatCurrency(shift?.openingFloatAmount)}
          </p>
        </div>

        {/* Closing Amount */}
        <div className="min-w-0">
          <p className="text-[11.5px] font-medium text-text-muted flex items-center gap-1">
            <TrendingUp className="size-3 shrink-0 text-primary" />
            Closing Cash
          </p>
          {isClosed ? (
            <p className="text-[13.5px] font-bold text-primary font-mono tabular-nums mt-0.5">
              {formatCurrency(shift?.actualClosingCashAmount)}
            </p>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              In Progress
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ShiftCard;
