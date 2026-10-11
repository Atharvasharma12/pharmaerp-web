// src/features/operations/shifts/components/ViewShiftDialog.jsx

import React, { useEffect, useState, useMemo } from "react";
import {
  UIModal,
  UIButton,
  UIBadge,
  UIEmptyState,
} from "@/components/ui";
import {
  Eye,
  X,
  Calendar,
  Clock,
  Banknote,
  ShoppingCart,
  Inbox,
  Upload,
  FileText,
  CreditCard,
  Tag,
  Percent,
  QrCode,
  Wallet,
  ArrowLeftRight,
  Calculator,
  TrendingUp,
  TrendingDown,
  User,
  ListFilter,
  CheckCircle2,
  AlertCircle,
  Landmark,
  XCircle,
  Ban,
  Copy,
  Check,
} from "lucide-react";
import { apiClient } from "@/services";

const DENOMINATIONS = [500, 200, 100, 50, 20, 10, 5, 2, 1];

const TABS = [
  { id: "cash", label: "Cash Summary" },
  { id: "bills", label: "Bills & Payments" },
  { id: "drawer", label: "Cash Drawer" },
  { id: "funds", label: "Fund Movements" },
];

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

const formatShortDate = (d) => {
  if (!d) return "—";
  const dateObj = new Date(d);
  if (Number.isNaN(dateObj.getTime())) return "—";
  return dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTimeOnly = (d) => {
  if (!d) return "—";
  const dateObj = new Date(d);
  if (Number.isNaN(dateObj.getTime())) return "—";
  return dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const ViewShiftDialog = ({ isOpen, onClose, shift }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("cash");
  const [fundFilter, setFundFilter] = useState("all");
  const [viewingQrItem, setViewingQrItem] = useState(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  useEffect(() => {
    if (isOpen && shift?._id) {
      setLoading(true);
      setActiveTab("cash");
      setFundFilter("all");
      apiClient
        .get(`/operations/shifts/${shift._id}/summary`)
        .then((res) => setSummary(res.data.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setSummary(null);
    }
  }, [isOpen, shift]);

  // Derived Meta Values
  const shiftNo = shift?.shiftNo || summary?.shiftNo || "SFT-001";
  const shiftName = shift?.shiftName || summary?.shiftName || "Shift Session";
  const isClosed = (shift?.status || summary?.status) === "closed";

  const businessDateFormatted = useMemo(() => {
    const d = shift?.businessDate || summary?.businessDate || summary?.date || new Date();
    return formatShortDate(d);
  }, [shift, summary]);

  const timeRangeFormatted = useMemo(() => {
    const start = shift?.openedAt || summary?.openedAt;
    const end = shift?.closedAt || summary?.closedAt;
    if (!start) return "—";
    const startStr = formatTimeOnly(start);
    if (isClosed && end) {
      const endStr = formatTimeOnly(end);
      return `${startStr} - ${endStr}`;
    }
    return `${startStr} → Open`;
  }, [shift, summary, isClosed]);

  // Key Financial Figures
  const openingFloat = Number(summary?.openingFloatAmount || shift?.openingFloatAmount || 0);
  const cashSales = Number(summary?.cashNet || 0);
  const totalDeposits = Number(summary?.totalDeposits || 0);
  const totalWithdrawals = Number(summary?.totalWithdrawals || 0);
  const expectedClosingCash = Number(summary?.expectedClosingCashAmount || (openingFloat + cashSales + totalDeposits - totalWithdrawals));
  const actualClosingCash = Number(summary?.actualClosingCashAmount || 0);
  const difference = isClosed ? actualClosingCash - expectedClosingCash : 0;
  const closedAtTime = summary?.closedAt ? formatTimeOnly(summary.closedAt) : "08:00 PM";

  const closedByName =
    summary?.closedBy?.fullName ||
    summary?.closedBy?.name ||
    shift?.closedBy?.fullName ||
    shift?.closedBy?.name ||
    "Cashier";
  const closedByInitials = getInitials(closedByName);

  // Bills & Sales Metrics
  const totalBills = Number(summary?.invoiceCount || 0);
  const totalBillAmount = Number(summary?.netSales || summary?.invoiceAmount || 0);
  const totalItemsSold = Number(summary?.totalItemsSold || summary?.itemsSold || 312);
  const totalDiscount = Number(summary?.totalDiscount || summary?.discountAmount || 0);
  const totalGst = Number(summary?.totalTax || summary?.taxNet || 0);

  // Cancelled Bills Metrics
  const cancelledBills = Number(summary?.cancelledInvoiceCount ?? shift?.cancelledInvoiceCount ?? 0);
  const cancelledAmount = Number(summary?.cancelledSalesTotal ?? shift?.cancelledSalesTotal ?? 0);
  const cancelledCash = Number(summary?.cancelledCashTotal ?? shift?.cancelledCashTotal ?? 0);
  const cancelledUpi = Number(summary?.cancelledUpiTotal ?? shift?.cancelledUpiTotal ?? 0);
  const cancelledSplit = Number(summary?.cancelledSplitTotal ?? shift?.cancelledSplitTotal ?? 0);
  const cancelledInvoices = summary?.cancelledInvoices || shift?.cancelledInvoices || [];
  const cancelledBreakdown = summary?.cancelledBreakdown || shift?.cancelledBreakdown || null;

  // Payment Breakdown
  const cashNet = Number(summary?.cashNet ?? shift?.cashNet ?? 0);
  const cashBills = Number(summary?.cashInvoiceCount ?? shift?.cashInvoiceCount ?? 0);

  const qrNet = Number(summary?.qrNet ?? shift?.qrNet ?? 0);
  const qrBills = Number(summary?.paymentQrCount ?? shift?.paymentQrCount ?? 0);
  const upiBreakdown = summary?.upiBreakdown || shift?.upiBreakdown || [];

  const cardNet = Number(summary?.cardNet ?? shift?.cardNet ?? 0);
  const cardBills = Number(summary?.cardInvoiceCount ?? shift?.cardInvoiceCount ?? 0);

  const walletNet = Number(summary?.walletNet ?? shift?.walletNet ?? 0);
  const walletBills = Number(summary?.walletInvoiceCount ?? shift?.walletInvoiceCount ?? 0);

  const splitNet = Number(summary?.splitNet ?? shift?.splitNet ?? summary?.splitSalesTotal ?? shift?.splitSalesTotal ?? 0);
  const splitBills = Number(summary?.splitInvoiceCount ?? shift?.splitInvoiceCount ?? 0);

  const splitCashAmount = Number(summary?.splitCashAmount ?? shift?.splitCashAmount ?? 0);
  const splitUpiAmount = Number(summary?.splitUpiAmount ?? shift?.splitUpiAmount ?? 0);
  const pureCashAmount = Number(summary?.pureCashAmount ?? shift?.pureCashAmount ?? (cashNet - splitCashAmount));
  const pureUpiAmount = Number(summary?.pureUpiAmount ?? shift?.pureUpiAmount ?? (qrNet - splitUpiAmount));

  const paymentMethods = useMemo(() => {
    const list = [
      {
        id: "cash",
        label: "Cash",
        icon: Banknote,
        bills: cashBills,
        amount: cashNet,
        pureAmount: pureCashAmount,
        splitPortion: splitCashAmount,
        color: "bg-emerald-500",
        textColor: "text-emerald-600 dark:text-emerald-400",
        iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
      },
      {
        id: "upi",
        label: "UPI (QR)",
        icon: QrCode,
        bills: qrBills,
        amount: qrNet,
        pureAmount: pureUpiAmount,
        splitPortion: splitUpiAmount,
        color: "bg-blue-500",
        textColor: "text-blue-600 dark:text-blue-400",
        iconBg: "bg-blue-50 dark:bg-blue-950/40",
      },
      {
        id: "card",
        label: "Card",
        icon: CreditCard,
        bills: cardBills,
        amount: cardNet,
        pureAmount: cardNet,
        splitPortion: 0,
        color: "bg-purple-500",
        textColor: "text-purple-600 dark:text-purple-400",
        iconBg: "bg-purple-50 dark:bg-purple-950/40",
      },
      {
        id: "wallet",
        label: "Wallet / Others",
        icon: Wallet,
        bills: walletBills,
        amount: walletNet,
        pureAmount: walletNet,
        splitPortion: 0,
        color: "bg-amber-500",
        textColor: "text-amber-600 dark:text-amber-400",
        iconBg: "bg-amber-50 dark:bg-amber-950/40",
      },
      {
        id: "split",
        label: "Split Payment",
        icon: Calculator,
        bills: splitBills,
        amount: splitNet,
        splitCash: splitCashAmount,
        splitUpi: splitUpiAmount,
        color: "bg-indigo-500",
        textColor: "text-indigo-600 dark:text-indigo-400",
        iconBg: "bg-indigo-50 dark:bg-indigo-950/40",
      },
    ];

    const totalSum = totalBillAmount || (pureCashAmount + pureUpiAmount + cardNet + walletNet + splitNet) || 1;

    return list.map((item) => ({
      ...item,
      percentage: ((item.amount / totalSum) * 100).toFixed(1),
    }));
  }, [
    cashBills,
    cashNet,
    pureCashAmount,
    splitCashAmount,
    qrBills,
    qrNet,
    pureUpiAmount,
    splitUpiAmount,
    cardBills,
    cardNet,
    walletBills,
    walletNet,
    splitBills,
    splitNet,
    totalBillAmount,
  ]);

  // Denominations Breakdown
  const openingDenominations = useMemo(() => {
    return summary?.openingDenominations || [];
  }, [summary]);

  const closingDenominations = useMemo(() => {
    return summary?.closingDenominations || [];
  }, [summary]);

  // Fund Movements List
  const fundMovements = useMemo(() => {
    const deposits = (summary?.deposits || []).map((d, i) => ({
      id: d._id || `dep-${i}`,
      type: "Deposit",
      refNo: d.transferNumber || d.referenceNo || `DEP-20250430-${String(i + 1).padStart(3, "0")}`,
      amount: Number(d.amount) || 0,
      date: d.transferDate || d.createdAt || d.date || summary?.openedAt,
      createdBy: d.createdBy?.fullName || d.createdBy?.name || d.createdBy || "Cashier",
      notes: d.narration || d.notes || d.remarks || "Deposit transfer",
    }));

    const withdrawals = (summary?.withdrawals || []).map((w, i) => ({
      id: w._id || `wdl-${i}`,
      type: "Withdrawal",
      refNo: w.transferNumber || w.referenceNo || `WDL-20250430-${String(i + 1).padStart(3, "0")}`,
      amount: Number(w.amount) || 0,
      date: w.transferDate || w.createdAt || w.date || summary?.openedAt,
      createdBy: w.createdBy?.fullName || w.createdBy?.name || w.createdBy || "Cashier",
      notes: w.narration || w.notes || w.remarks || "Withdrawal transfer",
    }));

    return [...deposits, ...withdrawals].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [summary]);

  const filteredFundMovements = useMemo(() => {
    if (fundFilter === "deposits") {
      return fundMovements.filter((m) => m.type === "Deposit");
    }
    if (fundFilter === "withdrawals") {
      return fundMovements.filter((m) => m.type === "Withdrawal");
    }
    return fundMovements;
  }, [fundMovements, fundFilter]);

  const depositCount = fundMovements.filter((m) => m.type === "Deposit").length;
  const withdrawalCount = fundMovements.filter((m) => m.type === "Withdrawal").length;
  const netMovement = totalDeposits - totalWithdrawals;

  return (
    <>
      <UIModal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="w-[1040px] max-w-[96vw] h-[84vh] max-h-[740px] min-h-[600px] rounded-2xl border border-border bg-surface shadow-2xl flex flex-col overflow-hidden select-none"
    >
      {/* ── 1. Dialog Header (Fixed, shrink-0) ── */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-border/60 shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Eye className="size-5.5 stroke-[2]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-text tracking-tight">
              View Shift Details
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Complete information and summary of this cashier shift
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

      {/* ── 2. Meta Information Bar (Fixed, shrink-0) ── */}
      <div className="px-6 pt-3 shrink-0">
        <div className="bg-surface rounded-xl border border-border/80 p-3 grid grid-cols-2 sm:grid-cols-5 gap-3 items-center shadow-xs">
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

          {/* Time */}
          <div className="min-w-0">
            <div className="text-[10px] font-medium text-text-muted leading-tight">
              Time
            </div>
            <div className="text-xs font-bold text-text mt-0.5 truncate">
              {timeRangeFormatted}
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-end">
            <UIBadge
              variant="dot"
              color={isClosed ? "neutral" : "success"}
              className="text-[10px] py-0 px-2 shrink-0 capitalize"
            >
              {shift?.status || summary?.status || "open"}
            </UIBadge>
          </div>
        </div>
      </div>

      {/* ── 3. Tabs Navigation Bar (Full Width Equal Columns) ── */}
      <div className="px-6 pt-3 pb-0 border-b border-border/60 shrink-0">
        <div className="grid grid-cols-4 w-full">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2.5 text-xs font-bold text-center transition-all border-b-2 cursor-pointer w-full flex items-center justify-center ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-text-muted hover:text-text"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 4. Tab Body Container (Scrollable, flex-1, fixed size modal) ── */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-4">
        {loading ? (
          <div className="py-20 text-center text-text-muted space-y-2">
            <div className="size-7 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            <p className="text-xs font-medium">Loading shift details...</p>
          </div>
        ) : (
          <>
            {/* ═════════ TAB 1: CASH SUMMARY ═════════ */}
            {activeTab === "cash" && (
              <div className="space-y-4">
                {/* 4 Top KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Opening Float */}
                  <div className="bg-surface rounded-xl border border-border/80 p-3 shadow-xs flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Banknote className="size-4 stroke-[1.8]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text font-mono">
                        {formatCurrency(openingFloat)}
                      </div>
                      <div className="text-[10px] text-text-muted mt-0.5">
                        Opening Float
                      </div>
                    </div>
                  </div>

                  {/* Cash Sales */}
                  <div className="bg-surface rounded-xl border border-border/80 p-3 shadow-xs flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                      <ShoppingCart className="size-4 stroke-[1.8]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text font-mono">
                        {formatCurrency(cashSales)}
                      </div>
                      <div className="text-[10px] text-text-muted mt-0.5">
                        Cash Sales
                      </div>
                    </div>
                  </div>

                  {/* Deposits */}
                  <div className="bg-surface rounded-xl border border-border/80 p-3 shadow-xs flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                      <Inbox className="size-4 stroke-[1.8]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text font-mono">
                        {formatCurrency(totalDeposits)}
                      </div>
                      <div className="text-[10px] text-text-muted mt-0.5">
                        Deposits
                      </div>
                    </div>
                  </div>

                  {/* Withdrawals */}
                  <div className="bg-surface rounded-xl border border-border/80 p-3 shadow-xs flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Upload className="size-4 stroke-[1.8]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text font-mono">
                        {formatCurrency(totalWithdrawals)}
                      </div>
                      <div className="text-[10px] text-text-muted mt-0.5">
                        Withdrawals
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom 2 Cards (Closing Summary & Quick Details) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-start">
                  {/* Closing Summary */}
                  <div className="bg-surface rounded-xl border border-border/80 p-4 space-y-2.5 shadow-xs">
                    <div className="flex items-center gap-2 pb-1 border-b border-border/60">
                      <Banknote className="size-4 text-text" />
                      <h3 className="text-xs font-bold text-text">
                        Closing Summary
                      </h3>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-text-muted font-medium">Expected Closing Cash</span>
                        <span className="font-mono font-bold text-text">{formatCurrency(expectedClosingCash)}</span>
                      </div>

                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-text-muted font-medium">Actual Closing Cash</span>
                        <span className="font-mono font-bold text-text">
                          {isClosed ? formatCurrency(actualClosingCash) : "—"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-text-muted font-medium">Difference</span>
                        {isClosed ? (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold font-mono ${
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
                        ) : (
                          <span className="text-text-muted font-mono">—</span>
                        )}
                      </div>

                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-text-muted font-medium">Closing Time</span>
                        <span className="font-bold text-text">
                          {isClosed ? closedAtTime : "—"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-1 border-t border-border/60">
                        <span className="text-text-muted font-medium">Closed By</span>
                        <div className="flex items-center gap-1.5">
                          <div className="size-5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold text-[9px] flex items-center justify-center">
                            {closedByInitials}
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-text text-xs block leading-tight">
                              {closedByName}
                            </span>
                            <span className="text-[9px] text-text-muted block leading-none">
                              Cashier
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Details */}
                  <div className="bg-surface rounded-xl border border-border/80 p-4 space-y-2.5 shadow-xs">
                    <div className="flex items-center gap-2 pb-1 border-b border-border/60">
                      <FileText className="size-4 text-text" />
                      <h3 className="text-xs font-bold text-text">
                        Quick Details
                      </h3>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      {/* Total Bills */}
                      <div className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2.5">
                          <div className="size-6 rounded-md bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                            <FileText className="size-3.5" />
                          </div>
                          <span className="text-text-muted font-medium">Active Bills</span>
                        </div>
                        <span className="font-bold text-text text-sm font-mono">{totalBills}</span>
                      </div>

                      {/* Cancelled Bills if any */}
                      {cancelledBills > 0 && (
                        <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                          <div className="flex items-center gap-2">
                            <div className="size-5 rounded-md bg-rose-500 text-white flex items-center justify-center">
                              <XCircle className="size-3" />
                            </div>
                            <span className="text-rose-600 dark:text-rose-400 font-semibold text-[11px]">Cancelled Bills</span>
                          </div>
                          <div className="text-right font-mono">
                            <span className="font-bold text-rose-600 dark:text-rose-400 text-xs block">{cancelledBills} bills</span>
                            <span className="text-[10px] text-rose-500 block">{formatCurrency(cancelledAmount)}</span>
                          </div>
                        </div>
                      )}

                      {/* Total Items Sold */}
                      <div className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2.5">
                          <div className="size-6 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <Tag className="size-3.5" />
                          </div>
                          <span className="text-text-muted font-medium">Total Items Sold</span>
                        </div>
                        <span className="font-bold text-text text-sm font-mono">{totalItemsSold}</span>
                      </div>

                      {/* Discounts & Tax */}
                      <div className="flex items-center justify-between pt-1 border-t border-border/60">
                        <div className="flex items-center gap-2.5">
                          <div className="size-6 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                            <Percent className="size-3.5" />
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-text-muted text-[11px] block">Total Discount</span>
                            <span className="text-text-muted text-[11px] block">Total Tax (GST)</span>
                          </div>
                        </div>
                        <div className="text-right space-y-0.5 font-mono">
                          <span className="font-bold text-text text-xs block">{formatCurrency(totalDiscount)}</span>
                          <span className="font-bold text-text text-xs block">{formatCurrency(totalGst)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═════════ TAB 2: BILLS & PAYMENTS ═════════ */}
            {activeTab === "bills" && (
              <div className="space-y-4">
                {/* Cancelled Bills Summary Notice if any */}
                {cancelledBills > 0 && (
                  <div className="bg-rose-500/10 border border-rose-500/25 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Ban className="size-4 stroke-[2]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                          <span>{cancelledBills} Bill(s) Cancelled in this Shift</span>
                          <span className="font-mono text-[11px] font-bold bg-rose-500/20 px-2 py-0.5 rounded-full">
                            {formatCurrency(cancelledAmount)}
                          </span>
                        </div>
                        <p className="text-[11px] text-text-muted mt-0.5">
                          Automatically excluded from active sales totals and bank/drawer collections
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-mono flex-wrap">
                      {cancelledCash > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-surface border border-rose-500/20 text-rose-600 dark:text-rose-400">
                          Cash: {formatCurrency(cancelledCash)}
                        </span>
                      )}
                      {cancelledUpi > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-surface border border-rose-500/20 text-rose-600 dark:text-rose-400">
                          UPI: {formatCurrency(cancelledUpi)}
                        </span>
                      )}
                      {cancelledSplit > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-surface border border-rose-500/20 text-rose-600 dark:text-rose-400">
                          Split: {formatCurrency(cancelledSplit)}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* 4 Top KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Total Bills */}
                  <div className="bg-surface rounded-xl border border-border/80 p-3 shadow-xs flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                      <FileText className="size-4 stroke-[1.8]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text font-mono">
                        {totalBills}
                      </div>
                      <div className="text-[10px] text-text-muted mt-0.5">
                        Active Bills {cancelledBills > 0 ? `(${cancelledBills} cancelled)` : ""}
                      </div>
                    </div>
                  </div>

                  {/* Total Bill Amount */}
                  <div className="bg-surface rounded-xl border border-border/80 p-3 shadow-xs flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Banknote className="size-4 stroke-[1.8]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text font-mono">
                        {formatCurrency(totalBillAmount)}
                      </div>
                      <div className="text-[10px] text-text-muted mt-0.5">
                        Total Bill Amount
                      </div>
                    </div>
                  </div>

                  {/* Total Discount */}
                  <div className="bg-surface rounded-xl border border-border/80 p-3 shadow-xs flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                      <Tag className="size-4 stroke-[1.8]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text font-mono">
                        {formatCurrency(totalDiscount)}
                      </div>
                      <div className="text-[10px] text-text-muted mt-0.5">
                        Total Discount
                      </div>
                    </div>
                  </div>

                  {/* Total GST */}
                  <div className="bg-surface rounded-xl border border-border/80 p-3 shadow-xs flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Percent className="size-4 stroke-[1.8]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text font-mono">
                        {formatCurrency(totalGst)}
                      </div>
                      <div className="text-[10px] text-text-muted mt-0.5">
                        Total GST
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method Breakdown Card */}
                <div className="bg-surface rounded-xl border border-border/80 p-4 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 pb-1 border-b border-border/60">
                    <CreditCard className="size-4 text-text" />
                    <h3 className="text-xs font-bold text-text">
                      Payment Method Breakdown
                    </h3>
                  </div>

                  <div className="overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border/60 text-text-muted font-semibold text-[11px]">
                          <th className="py-2 px-3">Payment Method</th>
                          <th className="py-2 px-3 text-center">No. of Bills</th>
                          <th className="py-2 px-3 text-right">Amount</th>
                          <th className="py-2 px-3 w-48 text-left">Percentage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {paymentMethods.map((method) => {
                          const Icon = method.icon;
                          return (
                            <tr key={method.id} className="hover:bg-surface-alt/40 transition-colors">
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2">
                                  <div className={`size-6 rounded-md ${method.iconBg} ${method.textColor} flex items-center justify-center shrink-0`}>
                                    <Icon className="size-3.5" />
                                  </div>
                                  <div>
                                    <span className="font-semibold text-text">{method.label}</span>
                                    {method.id === "split" && method.bills > 0 && (
                                      <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                                        Divided across Cash & UPI
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>

                              <td className="py-2.5 px-3 text-center font-mono font-medium text-text">
                                {method.bills}
                              </td>

                              <td className="py-2.5 px-3 text-right">
                                {method.id === "split" ? (
                                  <div>
                                    <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                      {formatCurrency(method.amount)}
                                    </div>
                                    <div className="flex items-center justify-end gap-1.5 mt-0.5 text-[10px]">
                                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                                        Cash: {formatCurrency(method.splitCash)}
                                      </span>
                                      <span className="text-text-muted">·</span>
                                      <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold font-mono">
                                        UPI: {formatCurrency(method.splitUpi)}
                                      </span>
                                    </div>
                                  </div>
                                ) : method.id === "cash" ? (
                                  <div>
                                    <div className="font-mono font-bold text-text">
                                      {formatCurrency(method.amount)}
                                    </div>
                                    {method.splitPortion > 0 && (
                                      <div className="text-[10px] text-text-muted font-normal mt-0.5">
                                        ({formatCurrency(method.splitPortion)} from Split)
                                      </div>
                                    )}
                                  </div>
                                ) : method.id === "upi" ? (
                                  <div>
                                    <div className="font-mono font-bold text-text">
                                      {formatCurrency(method.amount)}
                                    </div>
                                    {method.splitPortion > 0 && (
                                      <div className="text-[10px] text-text-muted font-normal mt-0.5">
                                        ({formatCurrency(method.splitPortion)} from Split)
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="font-mono font-bold text-text">
                                    {formatCurrency(method.amount)}
                                  </div>
                                )}
                              </td>

                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2.5">
                                  <span className="font-mono text-[11px] font-semibold text-text-muted w-10 text-right">
                                    {method.percentage}%
                                  </span>
                                  <div className="flex-1 bg-surface-alt rounded-full h-1.5 overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${method.color}`}
                                      style={{ width: `${Math.min(100, Math.max(0, method.percentage))}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Dedicated UPI / QR Terminal & Bank Breakdown Card */}
                {(qrNet > 0 || upiBreakdown.length > 0) && (
                  <div className="bg-surface rounded-xl border border-border/80 p-4 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between pb-1 border-b border-border/60">
                      <div className="flex items-center gap-2">
                        <QrCode className="size-4 text-blue-600 dark:text-blue-400" />
                        <div>
                          <h3 className="text-xs font-bold text-text">
                            UPI & QR Terminal Collections (Bank Breakdown)
                          </h3>
                          <p className="text-[11px] text-text-muted">
                            {isClosed
                              ? "Shift finalized — All amounts transferred and credited to respective bank accounts"
                              : "Shift active — Amounts held until shift lock, then credited to respective bank accounts"}
                          </p>
                        </div>
                      </div>
                      <UIBadge
                        variant="soft"
                        color={isClosed ? "success" : "warning"}
                        className="text-[10px] font-bold"
                      >
                        {isClosed ? "Transferred to Bank" : "Held in Shift"}
                      </UIBadge>
                    </div>

                    <div className="overflow-hidden">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-border/60 text-text-muted font-semibold text-[11px]">
                            <th className="py-2 px-3 text-center w-16">QR Code</th>
                            <th className="py-2 px-3">UPI ID / Terminal</th>
                            <th className="py-2 px-3">Destination Bank Account</th>
                            <th className="py-2 px-3 text-center">Bills Created</th>
                            <th className="py-2 px-3 text-right">Total Collected</th>
                            <th className="py-2 px-3 text-center">Transfer Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {(upiBreakdown.length > 0
                            ? upiBreakdown
                            : [
                                {
                                  paymentQrId: null,
                                  upiId: "UPI Direct",
                                  label: "Primary Counter QR",
                                  bankName: "Primary Bank Account",
                                  accountName: "Main Account",
                                  accountNumber: "",
                                  billCount: qrBills + (splitBills > 0 ? splitBills : 0),
                                  pureBillCount: qrBills,
                                  splitBillCount: splitBills,
                                  totalAmount: qrNet,
                                },
                              ]
                          ).map((item, idx) => {
                            const displayBillCount = Number(
                              item.billCount ||
                              ((item.pureBillCount || 0) + (item.splitBillCount || 0)) ||
                              (qrBills + (splitBills > 0 ? splitBills : 0)) ||
                              item.transactionCount ||
                              0
                            );
                            const displaySplitCount = Number(
                              item.splitBillCount !== undefined
                                ? item.splitBillCount
                                : (splitBills > 0 ? splitBills : 0)
                            );
                            const displayPureCount = Number(
                              item.pureBillCount !== undefined
                                ? item.pureBillCount
                                : Math.max(0, displayBillCount - displaySplitCount)
                            );
                            const qrSrc =
                              item.qrImageUrl ||
                              `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=4&data=${encodeURIComponent(
                                `upi://pay?pa=${item.upiId || "store@upi"}&pn=${encodeURIComponent(
                                  item.label || "Store"
                                )}&cu=INR`
                              )}`;

                            return (
                              <tr key={item.paymentQrId || idx} className="hover:bg-surface-alt/40 transition-colors">
                                <td className="py-2.5 px-3 text-center">
                                  <div
                                    className="inline-flex items-center justify-center size-9 rounded-lg bg-white p-1 border border-border shadow-2xs hover:shadow-sm hover:scale-105 transition-all cursor-pointer group"
                                    onClick={() => setViewingQrItem(item)}
                                    title="Click to view full UPI QR Code"
                                  >
                                    <img
                                      src={qrSrc}
                                      alt="UPI QR"
                                      className="size-full object-contain"
                                    />
                                  </div>
                                </td>

                                <td className="py-2.5 px-3">
                                  <div className="flex items-center gap-2">
                                    <div className="size-7 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                      <QrCode className="size-3.5" />
                                    </div>
                                    <div>
                                      <div className="font-semibold text-text">{item.label || item.upiId}</div>
                                      {item.upiId && item.label && item.label !== item.upiId && (
                                        <div className="text-[10px] text-text-muted font-mono">{item.upiId}</div>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                <td className="py-2.5 px-3">
                                  <div className="flex items-center gap-2">
                                    <Landmark className="size-3.5 text-text-muted shrink-0" />
                                    <div>
                                      <div className="font-medium text-text">{item.bankName || "Linked Bank"}</div>
                                      <div className="text-[10px] text-text-muted font-mono">
                                        {item.accountName} {item.accountNumber && `(${item.accountNumber})`}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-2.5 px-3 text-center">
                                  <div className="font-mono font-bold text-text text-xs">
                                    {displayBillCount} {displayBillCount === 1 ? "bill" : "bills"}
                                  </div>
                                  {displaySplitCount > 0 ? (
                                    <div className="text-[10px] text-text-muted mt-0.5 whitespace-nowrap">
                                      ({displayPureCount} UPI + {displaySplitCount} Split)
                                    </div>
                                  ) : (
                                    <div className="text-[10px] text-text-muted mt-0.5 whitespace-nowrap">
                                      ({displayPureCount || displayBillCount} UPI bills)
                                    </div>
                                  )}
                                </td>

                                <td className="py-2.5 px-3 text-right font-mono font-bold text-text">
                                  {formatCurrency(item.totalAmount)}
                                </td>

                                <td className="py-2.5 px-3 text-center">
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      isClosed
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                    }`}
                                  >
                                    {isClosed ? "Transferred" : "Held"}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ── Cancelled Bills Breakdown Table ── */}
                <div className="bg-surface rounded-xl border border-border/80 p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between pb-1 border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <Ban className="size-4 text-rose-600 dark:text-rose-400" />
                      <div>
                        <h3 className="text-xs font-bold text-text">
                          Cancelled Bills Breakdown
                        </h3>
                        <p className="text-[11px] text-text-muted">
                          Detailed audit log of all bills cancelled in this shift session
                        </p>
                      </div>
                    </div>
                    <UIBadge
                      variant="soft"
                      color={cancelledBills > 0 ? "error" : "neutral"}
                      className="text-[10px] font-bold"
                    >
                      {cancelledBills > 0 ? `${cancelledBills} Cancelled · ${formatCurrency(cancelledAmount)}` : "0 Cancelled"}
                    </UIBadge>
                  </div>

                  {cancelledInvoices.length > 0 ? (
                    <div className="overflow-hidden">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-border/60 text-text-muted font-semibold text-[11px]">
                            <th className="py-2 px-3">Invoice No</th>
                            <th className="py-2 px-3">Cancelled At</th>
                            <th className="py-2 px-3">Customer</th>
                            <th className="py-2 px-3">Payment Method</th>
                            <th className="py-2 px-3 text-right">Bill Amount</th>
                            <th className="py-2 px-3 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {cancelledInvoices.map((inv, idx) => {
                            const isSplit = inv.paymentMethod === "Split";
                            return (
                              <tr key={inv.invoiceId || inv.invoiceNo || idx} className="hover:bg-rose-500/5 transition-colors">
                                <td className="py-2.5 px-3">
                                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                                    {inv.invoiceNo}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-text-muted font-mono text-[11px]">
                                  {formatShortDate(inv.cancelledAt)} {formatTimeOnly(inv.cancelledAt)}
                                </td>
                                <td className="py-2.5 px-3 font-medium text-text">
                                  {inv.customerName || "Walk-in Customer"}
                                </td>
                                <td className="py-2.5 px-3">
                                  <div className="flex flex-col gap-0.5">
                                    <span className="font-semibold text-text">
                                      {inv.paymentMethod || "Cash"}
                                    </span>
                                    {isSplit && Array.isArray(inv.payments) && inv.payments.length > 0 && (
                                      <span className="text-[10px] text-text-muted font-mono">
                                        {inv.payments.map((p) => `${p.paymentType || p.mode}: ₹${p.amount}`).join(" + ")}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                                  <span className="line-through text-text-muted mr-1.5 text-[10px]">
                                    {formatCurrency(inv.grandTotal)}
                                  </span>
                                  {formatCurrency(inv.grandTotal)}
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                    Cancelled
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-text-muted text-xs">
                      <CheckCircle2 className="size-6 text-emerald-500 mx-auto mb-1 opacity-70" />
                      No bills were cancelled during this shift session.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ═════════ TAB 3: CASH DRAWER ═════════ */}
            {activeTab === "drawer" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                {/* Left Table: Opening Denominations */}
                <div className="bg-surface rounded-xl border border-border/80 p-4 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 pb-1 border-b border-border/60">
                    <div className="size-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 text-[10px]">
                      <Banknote className="size-3" />
                    </div>
                    <h3 className="text-xs font-bold text-text">
                      Opening Denominations (From Drawer)
                    </h3>
                  </div>

                  <div className="overflow-hidden rounded-lg border border-border/60">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-surface-alt/70 border-b border-border/60 text-text font-semibold text-[11px]">
                          <th className="py-1.5 px-3">Denomination</th>
                          <th className="py-1.5 px-3 text-center">Count</th>
                          <th className="py-1.5 px-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {DENOMINATIONS.map((note) => {
                          const item = openingDenominations.find(
                            (d) => Number(d.denomination) === note
                          );
                          const count = Number(item?.count ?? item?.quantity) || 0;
                          const amount = count * note;

                          return (
                            <tr key={note} className="hover:bg-surface-alt/30 transition-colors">
                              <td className="py-1.5 px-3 font-mono font-bold text-text">
                                ₹ {note}
                              </td>
                              <td className="py-1.5 px-3 text-center font-mono text-text-muted">
                                {count}
                              </td>
                              <td className="py-1.5 px-3 text-right font-mono font-semibold text-text">
                                {formatCurrency(amount)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Total Opening Float Card */}
                  <div className="bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-2.5 px-3.5 flex items-center justify-between">
                    <span className="text-xs font-bold text-text">
                      Total Opening Float
                    </span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                      {formatCurrency(openingFloat)}
                    </span>
                  </div>
                </div>

                {/* Right Table: Closing Denominations */}
                <div className="bg-surface rounded-xl border border-border/80 p-4 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 pb-1 border-b border-border/60">
                    <div className="size-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 text-[10px]">
                      <Banknote className="size-3" />
                    </div>
                    <h3 className="text-xs font-bold text-text">
                      Closing Denominations (Counted)
                    </h3>
                  </div>

                  <div className="overflow-hidden rounded-lg border border-border/60">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-surface-alt/70 border-b border-border/60 text-text font-semibold text-[11px]">
                          <th className="py-1.5 px-3">Denomination</th>
                          <th className="py-1.5 px-3 text-center">Count</th>
                          <th className="py-1.5 px-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {DENOMINATIONS.map((note) => {
                          const item = closingDenominations.find(
                            (d) => Number(d.denomination) === note
                          );
                          const count = Number(item?.count ?? item?.quantity) || 0;
                          const amount = count * note;

                          return (
                            <tr key={note} className="hover:bg-surface-alt/30 transition-colors">
                              <td className="py-1.5 px-3 font-mono font-bold text-text">
                                ₹ {note}
                              </td>
                              <td className="py-1.5 px-3 text-center font-mono text-text-muted">
                                {isClosed ? count : "—"}
                              </td>
                              <td className="py-1.5 px-3 text-right font-mono font-semibold text-text">
                                {isClosed ? formatCurrency(amount) : "—"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Total Closing Cash Card */}
                  <div className="bg-sky-500/10 dark:bg-sky-950/20 border border-sky-500/20 rounded-xl p-2.5 px-3.5 flex items-center justify-between">
                    <span className="text-xs font-bold text-text">
                      Total Closing Cash
                    </span>
                    <span className="text-sm font-bold text-sky-600 dark:text-sky-400 font-mono tabular-nums">
                      {isClosed ? formatCurrency(actualClosingCash) : "Pending Close"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ═════════ TAB 4: FUND MOVEMENTS ═════════ */}
            {activeTab === "funds" && (
              <div className="space-y-4">
                {/* 3 Top KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Total Deposits */}
                  <div className="bg-surface rounded-xl border border-border/80 p-3 shadow-xs flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Inbox className="size-4 stroke-[1.8]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text font-mono">
                        {formatCurrency(totalDeposits)}
                      </div>
                      <div className="text-[10px] text-text-muted mt-0.5">
                        Total Deposits · {depositCount} Transactions
                      </div>
                    </div>
                  </div>

                  {/* Total Withdrawals */}
                  <div className="bg-surface rounded-xl border border-border/80 p-3 shadow-xs flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Upload className="size-4 stroke-[1.8]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text font-mono">
                        {formatCurrency(totalWithdrawals)}
                      </div>
                      <div className="text-[10px] text-text-muted mt-0.5">
                        Total Withdrawals · {withdrawalCount} Transactions
                      </div>
                    </div>
                  </div>

                  {/* Net Movement */}
                  <div className="bg-surface rounded-xl border border-border/80 p-3 shadow-xs flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                      <ArrowLeftRight className="size-4 stroke-[1.8]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text font-mono">
                        {formatCurrency(netMovement)}
                      </div>
                      <div className="text-[10px] text-text-muted mt-0.5">
                        Net Movement · Deposits - Withdrawals
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFundFilter("all")}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      fundFilter === "all"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-surface-alt text-text-muted hover:text-text border border-border"
                    }`}
                  >
                    All ({fundMovements.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setFundFilter("deposits")}
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      fundFilter === "deposits"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-surface-alt text-text-muted hover:text-text border border-border"
                    }`}
                  >
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Deposits ({depositCount})
                  </button>

                  <button
                    type="button"
                    onClick={() => setFundFilter("withdrawals")}
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      fundFilter === "withdrawals"
                        ? "bg-amber-600 text-white shadow-xs"
                        : "bg-surface-alt text-text-muted hover:text-text border border-border"
                    }`}
                  >
                    <span className="size-1.5 rounded-full bg-amber-500" />
                    Withdrawals ({withdrawalCount})
                  </button>
                </div>

                {/* Transactions Table */}
                <div className="bg-surface rounded-xl border border-border/80 overflow-hidden shadow-xs">
                  {filteredFundMovements.length === 0 ? (
                    <div className="py-12 text-center text-text-muted text-xs">
                      No fund transfers or movements recorded for this filter.
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-surface-alt/70 border-b border-border/60 text-text-muted font-semibold text-[11px]">
                          <th className="py-2.5 px-3 w-8 text-center">#</th>
                          <th className="py-2.5 px-3">Date & Time</th>
                          <th className="py-2.5 px-3">Type</th>
                          <th className="py-2.5 px-3">Reference No.</th>
                          <th className="py-2.5 px-3 text-right">Amount</th>
                          <th className="py-2.5 px-3">Created By</th>
                          <th className="py-2.5 px-3">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {filteredFundMovements.map((item, index) => {
                          const isDep = item.type === "Deposit";
                          const creatorInitials = getInitials(item.createdBy);

                          return (
                            <tr key={item.id} className="hover:bg-surface-alt/30 transition-colors">
                              <td className="py-2.5 px-3 text-center text-text-muted font-mono text-[11px]">
                                {index + 1}
                              </td>

                              <td className="py-2.5 px-3">
                                <div className="text-text font-medium leading-tight">
                                  {formatShortDate(item.date)}
                                </div>
                                <div className="text-text-muted text-[10px] mt-0.5">
                                  {formatTimeOnly(item.date)}
                                </div>
                              </td>

                              <td className="py-2.5 px-3">
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                                    isDep
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                  }`}
                                >
                                  {item.type}
                                </span>
                              </td>

                              <td className="py-2.5 px-3 font-mono font-semibold text-text text-[11px]">
                                {item.refNo}
                              </td>

                              <td className="py-2.5 px-3 text-right font-mono font-bold text-text">
                                {formatCurrency(item.amount)}
                              </td>

                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-1.5">
                                  <div className="size-5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold text-[9px] flex items-center justify-center shrink-0">
                                    {creatorInitials}
                                  </div>
                                  <span className="font-medium text-text truncate max-w-[120px]">
                                    {item.createdBy}
                                  </span>
                                </div>
                              </td>

                              <td className="py-2.5 px-3 text-text-muted text-[11px] truncate max-w-[180px]">
                                {item.notes}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── 5. Dialog Footer (Fixed, shrink-0) ── */}
      <div className="px-6 py-3 border-t border-border/60 bg-surface flex items-center justify-end shrink-0">
        <UIButton
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          className="h-9 px-5 text-xs font-semibold"
        >
          Close
        </UIButton>
      </div>
    </UIModal>

    {/* ── 6. QR Code Preview Modal ── */}
    {viewingQrItem && (
      <UIModal
        isOpen={Boolean(viewingQrItem)}
        onClose={() => setViewingQrItem(null)}
        showCloseButton={true}
        className="w-[360px] max-w-[92vw] rounded-2xl border border-border bg-surface shadow-2xl p-5 select-none"
      >
        <div className="flex flex-col items-center text-center space-y-3.5">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <QrCode className="size-4.5" />
            </div>
            <div className="text-left min-w-0">
              <h3 className="text-sm font-bold text-text truncate">
                {viewingQrItem.label || "UPI Terminal QR"}
              </h3>
              <p className="text-[11px] text-text-muted truncate">
                {viewingQrItem.bankName || "Destination Bank"}
              </p>
            </div>
          </div>

          {/* QR Code Card */}
          <div className="size-52 bg-white rounded-2xl p-3 border border-border shadow-md flex items-center justify-center">
            <img
              src={
                viewingQrItem.qrImageUrl ||
                `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=6&data=${encodeURIComponent(
                  `upi://pay?pa=${viewingQrItem.upiId || "store@upi"}&pn=${encodeURIComponent(
                    viewingQrItem.label || "Store"
                  )}&cu=INR`
                )}`
              }
              alt="UPI QR Code"
              className="size-full object-contain"
            />
          </div>

          {/* UPI ID + 1-Click Copy */}
          <div className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-surface-alt border border-border text-xs">
            <span className="font-mono font-semibold text-text truncate">
              {viewingQrItem.upiId || "—"}
            </span>
            <button
              type="button"
              onClick={() => {
                if (viewingQrItem.upiId) {
                  navigator.clipboard.writeText(viewingQrItem.upiId);
                  setCopiedUpi(true);
                  setTimeout(() => setCopiedUpi(false), 2000);
                }
              }}
              className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline ml-2 cursor-pointer shrink-0"
            >
              {copiedUpi ? (
                <>
                  <Check className="size-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {viewingQrItem.accountName && (
            <div className="text-[11px] text-text-muted">
              Crediting to: <strong className="text-text">{viewingQrItem.accountName}</strong>{" "}
              {viewingQrItem.accountNumber && `(${viewingQrItem.accountNumber})`}
            </div>
          )}
        </div>
      </UIModal>
    )}
  </>
  );
};

export default ViewShiftDialog;
