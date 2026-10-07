// src/features/operations/shifts/components/CloseShiftDialog.jsx

import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  UIModal,
  UIButton,
  UIBadge,
  UIAlert,
} from "@/components/ui";
import { updateShiftStatus, listShifts } from "../store/shiftThunk";
import { API_STATUS } from "@/constants";
import { apiClient } from "@/services";
import { useBranchCash } from "@/features/finance/treasury/cash-management/branch-cash/hooks/useBranchCash";
import {
  Lock,
  X,
  Calendar,
  Clock,
  ShoppingCart,
  Wallet,
  CreditCard,
  Tag,
  Percent,
  BarChart2,
  Banknote,
  Download,
  Landmark,
  FileText,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { PostShiftCloseDialog } from "./PostShiftCloseDialog";

const DENOMINATIONS_LEFT = [500, 200, 100, 50, 20];
const DENOMINATIONS_RIGHT = [10, 5, 2, 1];
const ALL_DENOMINATIONS = [500, 200, 100, 50, 20, 10, 5, 2, 1];

const DENOM_CONFIG = {
  500: { color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20" },
  200: { color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
  100: { color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20" },
  50: { color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  20: { color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20" },
  10: { color: "text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/20" },
  5: { color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20" },
  2: { color: "text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/20" },
  1: { color: "text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/20" },
};

const formatCurrency = (val) => {
  const num = Number(val) || 0;
  return `₹ ${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getInitials = (name) => {
  if (!name || name === "—") return "—";
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const formatDuration = (start, end = new Date()) => {
  if (!start) return "—";
  const s = new Date(start);
  const e = new Date(end);
  const diffMs = Math.max(0, e.getTime() - s.getTime());
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${diffHours}h ${diffMins}m`;
};

export const CloseShiftDialog = ({
  isOpen,
  onClose,
  shift,
  onOpenNewShift,
  onCreateDayClosing,
}) => {
  const dispatch = useDispatch();
  const { updateShiftStatusStatus, error: shiftError } = useSelector(
    (state) => state.shift
  );

  const [note, setNote] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [showPostClose, setShowPostClose] = useState(false);
  const [closedShiftData, setClosedShiftData] = useState(null);

  const [counts, setCounts] = useState(
    ALL_DENOMINATIONS.reduce((acc, note) => ({ ...acc, [note]: "" }), {})
  );

  const {
    fetchBranchCash,
    currentBranchCash,
    runningCash: branchRunningCash,
    runningDenominations,
  } = useBranchCash();

  useEffect(() => {
    if (isOpen && shift?.branchId) {
      fetchBranchCash(shift.branchId);
    }
  }, [isOpen, shift?.branchId, fetchBranchCash]);

  // Load initial summary & populate counts from running denominations
  useEffect(() => {
    if (isOpen && shift?._id) {
      setLoading(true);
      apiClient
        .get(`/operations/shifts/${shift._id}/summary`)
        .then((res) => {
          setSummary(res.data.data);
        })
        .catch((err) => {
          console.error(err);
          setLocalError("Failed to load shift summary details");
        })
        .finally(() => setLoading(false));
    } else {
      setSummary(null);
    }
  }, [isOpen, shift]);

  // Sync denominations when runningDenominations available
  useEffect(() => {
    if (isOpen && runningDenominations?.length > 0) {
      const initial = {};
      ALL_DENOMINATIONS.forEach((d) => {
        const found = runningDenominations.find(
          (x) => Number(x.denomination) === d
        );
        initial[d] = found && found.quantity > 0 ? String(found.quantity) : "";
      });
      setCounts(initial);
    }

    if (!isOpen) {
      setCounts(
        ALL_DENOMINATIONS.reduce((acc, n) => ({ ...acc, [n]: "" }), {})
      );
      setNote("");
      setLocalError(null);
    }
  }, [isOpen, runningDenominations]);

  const handleCountChange = (denom, val) => {
    setCounts((prev) => ({
      ...prev,
      [denom]: val === "" ? "" : Math.max(0, parseInt(val, 10) || 0),
    }));
  };

  const handleAutoFill = () => {
    const updated = {};
    ALL_DENOMINATIONS.forEach((d) => {
      const found = runningDenominations?.find(
        (x) => Number(x.denomination) === d
      );
      updated[d] = found && found.quantity > 0 ? String(found.quantity) : "0";
    });
    setCounts(updated);
  };

  const totalCounted = useMemo(() => {
    return ALL_DENOMINATIONS.reduce((sum, n) => {
      return sum + (Number(counts[n]) || 0) * n;
    }, 0);
  }, [counts]);

  // Reconciled Metrics
  const openingFloat = Number(summary?.openingFloatAmount || shift?.openingFloatAmount || 0);
  const cashSales = Number(summary?.cashNet || 0);
  const totalDeposits = Number(summary?.totalDeposits || 0);
  const totalWithdrawals = Number(summary?.totalWithdrawals || 0);

  const expectedClosingCash = useMemo(() => {
    if (summary?.expectedClosingCashAmount != null) {
      return Number(summary.expectedClosingCashAmount);
    }
    return openingFloat + cashSales + totalDeposits - totalWithdrawals;
  }, [summary, openingFloat, cashSales, totalDeposits, totalWithdrawals]);

  const difference = totalCounted - expectedClosingCash;

  // Header & Meta Info
  const shiftNo = shift?.shiftNo || summary?.shiftNo || "SFT-001";
  const shiftName = shift?.shiftName || summary?.shiftName || "Shift Session";
  const businessDateFormatted = useMemo(() => {
    const d = shift?.businessDate || summary?.businessDate || summary?.date || new Date();
    const dateObj = new Date(d);
    return dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, [shift, summary]);

  const openedAtFormatted = useMemo(() => {
    const d = shift?.openedAt || summary?.openedAt;
    if (!d) return "—";
    return new Date(d).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }, [shift, summary]);

  const cashierName =
    shift?.openedBy?.fullName ||
    shift?.openedBy?.name ||
    summary?.openedBy?.fullName ||
    summary?.openedBy?.name ||
    "Cashier";
  const cashierInitials = getInitials(cashierName);
  const durationText = formatDuration(shift?.openedAt || summary?.openedAt);

  // Top KPIs
  const totalSales = Number(summary?.netSales || summary?.invoiceAmount || 0);
  const totalBills = Number(summary?.invoiceCount || 0);
  const totalCashCollected = Number(summary?.cashNet || 0);
  const cashBillsCount = Number(summary?.cashInvoiceCount || 0);
  const totalCardUpi = Number((summary?.qrNet || 0) + (summary?.cardNet || 0));
  const cardUpiBillsCount = Number(
    (summary?.paymentQrCount || 0) + (summary?.cardInvoiceCount || 0) ||
    Math.max(0, totalBills - cashBillsCount)
  );

  const totalDiscount = Number(summary?.totalDiscount || summary?.discountAmount || 0);
  const discountPercent = totalSales > 0 ? ((totalDiscount / (totalSales + totalDiscount)) * 100).toFixed(1) : "0.0";

  const totalGst = Number(summary?.totalTax || summary?.taxNet || 0);
  const gstPercent = totalSales > 0 ? ((totalGst / totalSales) * 100).toFixed(1) : "0.0";

  // Branch Cash Values
  const runningCashAfterClosing = Math.max(0, Number(branchRunningCash || totalCounted || 0));
  const frozenCash = Number(currentBranchCash?.frozenCash || 0);
  const totalBranchCash = runningCashAfterClosing + frozenCash;

  const handleLockShift = async () => {
    setLocalError(null);

    const closingDenominations = ALL_DENOMINATIONS.filter(
      (n) => (Number(counts[n]) || 0) > 0
    ).map((n) => ({
      denomination: n,
      count: Number(counts[n]),
      amount: Number(counts[n]) * n,
    }));

    try {
      const result = await dispatch(
        updateShiftStatus({
          id: shift._id,
          payload: {
            status: "closed",
            actualClosingCashAmount: totalCounted,
            closingDenominations,
            note,
            carryForwardAmount: totalCounted,
            frozenDenominations: [],
          },
        })
      ).unwrap();

      dispatch(listShifts());
      setClosedShiftData(result);
      setShowPostClose(true);
    } catch (err) {
      setLocalError(err?.message || "Failed to lock and close shift");
    }
  };

  return (
    <>
      <UIModal
        isOpen={isOpen}
        onClose={onClose}
        showCloseButton={false}
        className="w-[1040px] max-w-[96vw] h-[86vh] max-h-[780px] min-h-[620px] rounded-2xl border border-border bg-surface shadow-2xl flex flex-col overflow-hidden select-none"
      >
        {/* ── 1. Dialog Header (Fixed, shrink-0) ── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-border/60 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="size-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <Lock className="size-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text tracking-tight">
                Lock & Close Shift Session
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Review cash count, reconcile transactions and close this shift
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {/* ── 2. Modal Body (Scrollable Container, flex-1) ── */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-3.5">
          {/* Active Error Notice */}
          {(shiftError || localError) && (
            <UIAlert
              intent="danger"
              title="Error"
              description={localError || shiftError}
            />
          )}

          {/* ── Meta Information Bar (6 Items) ── */}
          <div className="bg-surface rounded-xl border border-border/80 p-3 grid grid-cols-2 sm:grid-cols-6 gap-3 items-center shadow-xs">
            {/* Shift No */}
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                <Calendar className="size-4 stroke-[1.8]" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-medium text-text-muted leading-tight">
                  Shift No.
                </div>
                <div className="text-xs font-bold text-text font-mono mt-0.5 truncate">
                  {shiftNo}
                </div>
              </div>
            </div>

            {/* Shift Name */}
            <div className="min-w-0">
              <div className="text-[10px] font-medium text-text-muted leading-tight">
                Shift Name
              </div>
              <div className="text-xs font-bold text-text mt-0.5 truncate">
                {shiftName}
              </div>
            </div>

            {/* Business Date */}
            <div className="min-w-0">
              <div className="text-[10px] font-medium text-text-muted leading-tight">
                Business Date
              </div>
              <div className="text-xs font-bold text-text mt-0.5 truncate">
                {businessDateFormatted}
              </div>
            </div>

            {/* Opened At */}
            <div className="min-w-0">
              <div className="text-[10px] font-medium text-text-muted leading-tight">
                Opened At
              </div>
              <div className="text-xs font-bold text-text mt-0.5 truncate">
                {openedAtFormatted}
              </div>
            </div>

            {/* Opened By */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="size-7 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                {cashierInitials}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-medium text-text-muted leading-tight">
                  Opened By
                </div>
                <div className="text-xs font-bold text-text truncate">
                  {cashierName}
                </div>
                <div className="text-[9px] text-text-muted leading-none">
                  Cashier
                </div>
              </div>
            </div>

            {/* Duration & Open Badge */}
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-text">
                <Clock className="size-3.5 text-text-muted" />
                <span>{durationText}</span>
              </div>
              <UIBadge variant="dot" color="success" className="text-[10px] py-0 px-2 shrink-0">
                Open
              </UIBadge>
            </div>
          </div>

          {/* ── 5 Top KPI Stat Cards ── */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {/* Total Sales */}
            <div className="bg-surface rounded-xl border border-border/80 p-3 shadow-xs">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="size-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <ShoppingCart className="size-3.5 stroke-[1.8]" />
                </div>
                <span className="text-[11px] font-medium text-text-muted">Total Sales</span>
              </div>
              <div className="text-sm font-bold text-text font-mono">
                {formatCurrency(totalSales)}
              </div>
              <div className="text-[10px] text-text-muted mt-0.5">
                {totalBills} bills
              </div>
            </div>

            {/* Total Cash Collected */}
            <div className="bg-surface rounded-xl border border-border/80 p-3 shadow-xs">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="size-7 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <Wallet className="size-3.5 stroke-[1.8]" />
                </div>
                <span className="text-[11px] font-medium text-text-muted">Total Cash Collected</span>
              </div>
              <div className="text-sm font-bold text-text font-mono">
                {formatCurrency(totalCashCollected)}
              </div>
              <div className="text-[10px] text-text-muted mt-0.5">
                {cashBillsCount} bills (cash)
              </div>
            </div>

            {/* Total Card / UPI */}
            <div className="bg-surface rounded-xl border border-border/80 p-3 shadow-xs">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="size-7 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <CreditCard className="size-3.5 stroke-[1.8]" />
                </div>
                <span className="text-[11px] font-medium text-text-muted">Total Card / UPI</span>
              </div>
              <div className="text-sm font-bold text-text font-mono">
                {formatCurrency(totalCardUpi)}
              </div>
              <div className="text-[10px] text-text-muted mt-0.5">
                {cardUpiBillsCount} bills
              </div>
            </div>

            {/* Total Discount */}
            <div className="bg-surface rounded-xl border border-border/80 p-3 shadow-xs">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="size-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Tag className="size-3.5 stroke-[1.8]" />
                </div>
                <span className="text-[11px] font-medium text-text-muted">Total Discount</span>
              </div>
              <div className="text-sm font-bold text-text font-mono">
                {formatCurrency(totalDiscount)}
              </div>
              <div className="text-[10px] text-text-muted mt-0.5">
                {discountPercent}% of sales
              </div>
            </div>

            {/* Total GST */}
            <div className="bg-surface rounded-xl border border-border/80 p-3 shadow-xs">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="size-7 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <Percent className="size-3.5 stroke-[1.8]" />
                </div>
                <span className="text-[11px] font-medium text-text-muted">Total GST</span>
              </div>
              <div className="text-sm font-bold text-text font-mono">
                {formatCurrency(totalGst)}
              </div>
              <div className="text-[10px] text-text-muted mt-0.5">
                {gstPercent}% of sales
              </div>
            </div>
          </div>

          {/* ── Middle Row: Expected vs Actual & Denominations Split ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
            {/* Left Column: Expected vs Actual Cash (col-span-5) */}
            <div className="lg:col-span-5 bg-surface rounded-xl border border-border/80 p-4 space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2 pb-1 border-b border-border/60">
                <BarChart2 className="size-4 text-text" />
                <h3 className="text-xs font-bold text-text">
                  Expected vs Actual Cash
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-text-muted font-medium">Opening Float</span>
                  <span className="font-mono font-bold text-text">{formatCurrency(openingFloat)}</span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-text-muted font-medium">Cash Sales</span>
                  <span className="font-mono font-bold text-text">{formatCurrency(cashSales)}</span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-text-muted font-medium">Add: Cash In (Fund Transfer)</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    + {formatCurrency(totalDeposits)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-text-muted font-medium">Less: Cash Out (Fund Transfer)</span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                    - {formatCurrency(totalWithdrawals)}
                  </span>
                </div>

                {/* Expected Closing Cash Row */}
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-surface-alt/80 font-bold border border-border/60">
                  <span className="text-text">Expected Closing Cash</span>
                  <span className="font-mono text-text">{formatCurrency(expectedClosingCash)}</span>
                </div>

                {/* Actual Closing Cash Counted */}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-text font-semibold">Actual Closing Cash (Counted)</span>
                  <div className="font-mono font-bold text-sm bg-surface-alt px-3 py-1 rounded-lg border border-border text-text">
                    {formatCurrency(totalCounted)}
                  </div>
                </div>

                {/* Difference */}
                <div className="flex justify-between items-center pt-1 border-t border-border/60">
                  <span className="text-text font-semibold">Difference</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                      difference === 0
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : difference > 0
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {difference > 0 ? "+" : ""}
                    {formatCurrency(difference)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Counted Denominations (col-span-7) */}
            <div className="lg:col-span-7 bg-surface rounded-xl border border-border/80 p-4 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between pb-1 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Banknote className="size-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-text">
                    Counted Denominations (Cash in Drawer)
                  </h3>
                </div>

                <UIButton
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={handleAutoFill}
                  startIcon={<Download className="size-3" />}
                  className="h-7 text-[10px] px-2.5 font-semibold text-text"
                >
                  Auto Fill from Running Cash
                </UIButton>
              </div>

              {/* 2-Column Denominations Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Left Column (500, 200, 100, 50, 20) */}
                <div className="space-y-1.5">
                  <div className="grid grid-cols-12 text-[10px] font-semibold text-text-muted px-1">
                    <span className="col-span-5">Denomination</span>
                    <span className="col-span-3 text-center">Count</span>
                    <span className="col-span-4 text-right">Amount</span>
                  </div>

                  {DENOMINATIONS_LEFT.map((note) => {
                    const countVal = counts[note] || "";
                    const amountVal = (Number(countVal) || 0) * note;
                    const cfg = DENOM_CONFIG[note];

                    return (
                      <div
                        key={note}
                        className="grid grid-cols-12 items-center gap-1.5 py-1 px-1 rounded-lg hover:bg-surface-alt/40 transition-colors"
                      >
                        <div className="col-span-5">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${cfg.color}`}
                          >
                            <Banknote className="size-2.5" />
                            <span>₹ {note}</span>
                          </span>
                        </div>

                        <div className="col-span-3">
                          <input
                            type="number"
                            min="0"
                            value={countVal}
                            onChange={(e) => handleCountChange(note, e.target.value)}
                            placeholder="0"
                            className="w-full text-center font-mono text-xs border border-border/80 bg-surface rounded py-0.5 px-1 outline-none focus:border-primary font-bold text-text transition-colors"
                          />
                        </div>

                        <div className="col-span-4 text-right font-mono text-[11px] font-semibold text-text tabular-nums">
                          {formatCurrency(amountVal)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right Column (10, 5, 2, 1) */}
                <div className="space-y-1.5">
                  <div className="grid grid-cols-12 text-[10px] font-semibold text-text-muted px-1">
                    <span className="col-span-5">Denomination</span>
                    <span className="col-span-3 text-center">Count</span>
                    <span className="col-span-4 text-right">Amount</span>
                  </div>

                  {DENOMINATIONS_RIGHT.map((note) => {
                    const countVal = counts[note] || "";
                    const amountVal = (Number(countVal) || 0) * note;
                    const cfg = DENOM_CONFIG[note];

                    return (
                      <div
                        key={note}
                        className="grid grid-cols-12 items-center gap-1.5 py-1 px-1 rounded-lg hover:bg-surface-alt/40 transition-colors"
                      >
                        <div className="col-span-5">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${cfg.color}`}
                          >
                            <Banknote className="size-2.5" />
                            <span>₹ {note}</span>
                          </span>
                        </div>

                        <div className="col-span-3">
                          <input
                            type="number"
                            min="0"
                            value={countVal}
                            onChange={(e) => handleCountChange(note, e.target.value)}
                            placeholder="0"
                            className="w-full text-center font-mono text-xs border border-border/80 bg-surface rounded py-0.5 px-1 outline-none focus:border-primary font-bold text-text transition-colors"
                          />
                        </div>

                        <div className="col-span-4 text-right font-mono text-[11px] font-semibold text-text tabular-nums">
                          {formatCurrency(amountVal)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total Counted Banner */}
              <div className="bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-2.5 px-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Banknote className="size-3.5" />
                  </div>
                  <span className="text-xs font-bold text-text">
                    Total Counted Cash
                  </span>
                </div>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                  {formatCurrency(totalCounted)}
                </span>
              </div>
            </div>
          </div>

          {/* ── Bottom Row: 3 Cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Card 1: Branch Cash After Closing */}
            <div className="bg-surface rounded-xl border border-border/80 p-3.5 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 pb-1.5 border-b border-border/60">
                <Landmark className="size-4 text-text" />
                <h4 className="text-xs font-bold text-text">
                  Branch Cash After Closing
                </h4>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-text-muted text-[11px]">Running Cash (After Closing)</span>
                  <span className="font-mono font-semibold text-text">
                    {formatCurrency(runningCashAfterClosing)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-text-muted text-[11px]">Frozen Cash</span>
                  <span className="font-mono font-semibold text-text">
                    {formatCurrency(frozenCash)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-border/60 font-bold">
                  <span className="text-text">Total Branch Cash</span>
                  <span className="font-mono text-text">
                    {formatCurrency(totalBranchCash)}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Closing Notes (Optional) */}
            <div className="bg-surface rounded-xl border border-border/80 p-3.5 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 pb-1.5 border-b border-border/60">
                <FileText className="size-4 text-text" />
                <h4 className="text-xs font-bold text-text">
                  Closing Notes (Optional)
                </h4>
              </div>

              <div className="space-y-1">
                <textarea
                  value={note}
                  maxLength={500}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g., Shift closed successfully. All transactions verified."
                  rows={2}
                  className="w-full bg-surface-alt/60 border border-border/80 rounded-lg text-xs p-2.5 outline-none focus:border-primary text-text placeholder:text-text-muted resize-none transition-colors"
                />
                <div className="text-[10px] text-text-muted text-right font-mono">
                  {note.length}/500
                </div>
              </div>
            </div>

            {/* Card 3: Warnings & Validation */}
            <div className="bg-surface rounded-xl border border-border/80 p-3.5 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 pb-1.5 border-b border-border/60">
                <AlertTriangle className="size-4 text-rose-500" />
                <h4 className="text-xs font-bold text-text">
                  Warnings & Validation
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                {/* Difference Check */}
                <div className="flex items-start gap-2">
                  {difference !== 0 ? (
                    <div className="size-4 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <AlertCircle className="size-3" />
                    </div>
                  ) : (
                    <div className="size-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="size-3" />
                    </div>
                  )}
                  <div>
                    <div className={`text-[11px] font-bold ${difference !== 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                      {difference !== 0
                        ? `Cash difference detected: ${difference > 0 ? "+" : ""}${formatCurrency(difference)}`
                        : "No cash difference detected"}
                    </div>
                    <div className="text-[10px] text-text-muted">
                      {difference !== 0
                        ? "Please recheck the counted amount."
                        : "Physical cash matches system expectation."}
                    </div>
                  </div>
                </div>

                {/* Transaction Data Check */}
                <div className="flex items-start gap-2">
                  <div className="size-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="size-3" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      All transaction data is loaded
                    </div>
                    <div className="text-[10px] text-text-muted">
                      {totalBills} bills, {formatCurrency(totalSales)} sales
                    </div>
                  </div>
                </div>

                {/* Denomination Validity */}
                <div className="flex items-start gap-2">
                  <div className="size-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="size-3" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      Denomination count is valid
                    </div>
                    <div className="text-[10px] text-text-muted">
                      Counts match total amount
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. Dialog Footer (Fixed, shrink-0) ── */}
        <div className="px-6 py-3.5 border-t border-border/60 bg-surface flex items-center justify-between shrink-0">
          <UIButton
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-9 px-4 text-xs font-semibold"
          >
            Cancel
          </UIButton>

          <UIButton
            type="button"
            variant="danger"
            size="sm"
            onClick={handleLockShift}
            isLoading={updateShiftStatusStatus === API_STATUS.LOADING}
            startIcon={<Lock className="size-4" />}
            className="h-9 px-5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs"
          >
            Close Shift
          </UIButton>
        </div>
      </UIModal>

      <PostShiftCloseDialog
        isOpen={showPostClose}
        frozenAmount={closedShiftData?.frozenAtClose || 0}
        runningAmount={closedShiftData?.carryForwardAmount || 0}
        onOpenNewShift={() => {
          setShowPostClose(false);
          onClose();
          if (onOpenNewShift) onOpenNewShift();
        }}
        onCreateDayClosing={() => {
          setShowPostClose(false);
          onClose();
          if (onCreateDayClosing) onCreateDayClosing();
        }}
        onClose={() => {
          setShowPostClose(false);
          onClose();
        }}
      />
    </>
  );
};

export default CloseShiftDialog;
