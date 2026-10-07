// src/features/operations/shifts/components/ShiftCard.jsx

import React from "react";
import { Eye, LockKeyhole, Calendar, Clock } from "lucide-react";
import { UIBadge, UIButton } from "@/components/ui";

const formatDate = (val) => {
  if (!val) return "-";
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (val) => {
  if (!val) return "-";
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatCurrency = (val) => {
  if (val === undefined || val === null || isNaN(Number(val))) return "₹ 0.00";
  return `₹ ${Number(val).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getInitials = (name) => {
  if (!name) return "US";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getAvatarColorClass = (name = "") => {
  const colors = [
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 border-sky-200 dark:border-sky-800",
    "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200 dark:border-teal-800",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getShiftTitle = (shift) => {
  if (shift?.shiftName) return shift.shiftName;
  const hour = new Date(shift?.openedAt || shift?.createdAt || Date.now()).getHours();
  if (hour >= 5 && hour < 12) return "Morning Shift";
  if (hour >= 12 && hour < 17) return "Afternoon Shift";
  if (hour >= 17 && hour < 21) return "Evening Shift";
  return "Night Shift";
};

export const ShiftCard = ({ shift, onView, onCloseShift }) => {
  const shiftTitle = getShiftTitle(shift);
  const isShiftOpen = shift.status === "open";
  const isCancelled = shift.status === "cancelled";

  const cashierName =
    shift.openedBy?.fullName ||
    shift.openedBy?.name ||
    shift.openedBy?.email ||
    "Cashier";
  const cashierInitials = getInitials(cashierName);
  const avatarColor = getAvatarColorClass(cashierName);

  const businessDateStr = formatDate(
    shift.businessDate || shift.date || shift.openedAt
  );
  const openTime = formatTime(shift.openedAt || shift.createdAt);
  const closeTime = isShiftOpen ? "Open" : formatTime(shift.closedAt);

  const openingFloat = formatCurrency(shift.openingFloatAmount);
  const cashSalesAmount =
    shift.cashSalesTotal ??
    shift.summary?.cashNet ??
    shift.cashSales ??
    shift.actualClosingCashAmount ??
    0;
  const cashSales = formatCurrency(cashSalesAmount);

  const depositsAmount =
    Array.isArray(shift.manualDeposits) && shift.manualDeposits.length > 0
      ? shift.manualDeposits.reduce((acc, d) => acc + (Number(d.amount) || 0), 0)
      : shift.totalFundDeposits ?? 0;
  const deposits = formatCurrency(depositsAmount);

  const withdrawalsAmount =
    Array.isArray(shift.manualWithdrawals) && shift.manualWithdrawals.length > 0
      ? shift.manualWithdrawals.reduce((acc, w) => acc + (Number(w.amount) || 0), 0)
      : shift.totalFundWithdrawals ?? 0;
  const withdrawals = formatCurrency(withdrawalsAmount);

  return (
    <div
      onClick={() => onView?.(shift)}
      className="bg-surface rounded-xl border border-border p-5 shadow-xs hover:border-border-strong hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between space-y-4"
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-text truncate">
              {shiftTitle}
            </h3>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-alt text-text-muted border border-border">
              {shift.shiftNo || "SFT-000"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              {businessDateStr}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {openTime} – {closeTime}
            </span>
          </div>
        </div>

        <div>
          {isShiftOpen ? (
            <UIBadge variant="dot" color="success">
              Open
            </UIBadge>
          ) : isCancelled ? (
            <UIBadge variant="dot" color="error">
              Cancelled
            </UIBadge>
          ) : (
            <UIBadge variant="dot" color="neutral">
              Closed
            </UIBadge>
          )}
        </div>
      </div>

      {/* Cashier Info */}
      <div className="flex items-center gap-2.5 pt-1">
        <div
          className={`size-8 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 ${avatarColor}`}
        >
          {cashierInitials}
        </div>
        <div className="min-w-0">
          <div className="text-xs text-text-muted">Assigned Cashier</div>
          <div className="text-sm font-medium text-text truncate">
            {cashierName}
          </div>
        </div>
      </div>

      {/* 4-Metric Grid */}
      <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-border/60">
        <div className="bg-surface-alt/50 p-2.5 rounded-lg border border-border/40">
          <div className="text-[11px] text-text-muted">Opening Float</div>
          <div className="text-sm font-semibold text-text tabular-nums mt-0.5">
            {openingFloat}
          </div>
        </div>

        <div className="bg-surface-alt/50 p-2.5 rounded-lg border border-border/40">
          <div className="text-[11px] text-text-muted">Cash Sales</div>
          <div className="text-sm font-semibold text-text tabular-nums mt-0.5">
            {cashSales}
          </div>
        </div>

        <div className="bg-surface-alt/50 p-2.5 rounded-lg border border-border/40">
          <div className="text-[11px] text-text-muted">Deposits</div>
          <div className="text-sm font-semibold text-text tabular-nums mt-0.5">
            {deposits}
          </div>
        </div>

        <div className="bg-surface-alt/50 p-2.5 rounded-lg border border-border/40">
          <div className="text-[11px] text-text-muted">Withdrawals</div>
          <div className="text-sm font-semibold text-text tabular-nums mt-0.5">
            {withdrawals}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div
        className="flex items-center justify-end gap-2 pt-2 border-t border-border/60"
        onClick={(e) => e.stopPropagation()}
      >
        <UIButton
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onView?.(shift)}
          startIcon={<Eye className="size-3.5" />}
          className="h-8 text-xs"
        >
          View Details
        </UIButton>

        {isShiftOpen && (
          <UIButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onCloseShift?.(shift)}
            startIcon={<LockKeyhole className="size-3.5 text-warning" />}
            className="h-8 text-xs text-warning hover:bg-warning-soft"
          >
            Close Shift
          </UIButton>
        )}
      </div>
    </div>
  );
};

export default ShiftCard;
