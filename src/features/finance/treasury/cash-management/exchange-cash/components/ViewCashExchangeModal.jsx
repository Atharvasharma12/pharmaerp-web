// src/features/finance/treasury/cash-management/exchange-cash/components/ViewCashExchangeModal.jsx

import React, { useEffect, useState } from "react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalBody,
  UIModalFooter,
  UIButton,
  UISkeleton,
  UIAlert,
} from "@/components/ui";
import {
  Repeat,
  ArrowDownToLine,
  ArrowUpFromLine,
  Building2,
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle2,
  XCircle,
  Wallet,
  Shield,
  X,
} from "lucide-react";
import useCashExchange from "../hooks/useCashExchange";

const DENOMINATIONS_CONFIG = [
  { note: 500, label: "₹ 500", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800" },
  { note: 200, label: "₹ 200", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800" },
  { note: 100, label: "₹ 100", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
  { note: 50,  label: "₹ 50",  color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" },
  { note: 20,  label: "₹ 20",  color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800" },
  { note: 10,  label: "₹ 10",  color: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800" },
  { note: 5,   label: "₹ 5",   color: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300 border-pink-200 dark:border-pink-800" },
  { note: 2,   label: "₹ 2",   color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700" },
  { note: 1,   label: "₹ 1",   color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700" },
];

const getDenomColor = (note) => {
  const found = DENOMINATIONS_CONFIG.find((d) => d.note === Number(note));
  return found ? found.color : "bg-slate-100 text-slate-700 border-slate-200";
};

const formatCurrency = (val) =>
  `₹ ${Number(val || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (val) => {
  if (!val) return "—";
  try {
    const d = new Date(val);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(val);
  }
};

const formatTime = (val) => {
  if (!val) return "";
  try {
    const d = new Date(val);
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

export const ViewCashExchangeModal = ({
  isOpen,
  onClose,
  exchangeId,
  initialData,
}) => {
  const { getCashExchangeById } = useCashExchange();
  const [exchange, setExchange] = useState(initialData || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialData && (!exchangeId || initialData._id === exchangeId)) {
        setExchange(initialData);
      }
      if (exchangeId) {
        setIsLoading(true);
        setError("");
        getCashExchangeById(exchangeId)
          .then((res) => {
            setExchange(res);
          })
          .catch((err) => {
            setError(typeof err === "string" ? err : "Failed to load exchange details.");
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    } else {
      setExchange(null);
      setError("");
    }
  }, [isOpen, exchangeId, initialData, getCashExchangeById]);

  const isCompleted = exchange?.status === "COMPLETED";
  const isCancelled = exchange?.status === "CANCELLED";

  const totalReceived = exchange?.totalReceived || 0;
  const totalGiven = exchange?.totalGiven || 0;

  const denominationsReceived = exchange?.denominationsReceived || [];
  const denominationsGiven = exchange?.denominationsGiven || [];

  return (
    <UIModal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="max-w-[800px] w-full max-h-[90vh] flex flex-col p-0 overflow-hidden select-none"
    >
      {/* ── Modal Header ── */}
      <UIModalHeader className="px-6 py-4 border-b border-border bg-surface shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 text-white flex items-center justify-center shadow-xs">
            <Repeat className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <UIModalTitle className="text-base font-bold text-text">
                Cash Exchange {exchange?.exchangeNumber ? `#${exchange.exchangeNumber}` : ""}
              </UIModalTitle>
              {isCompleted && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> COMPLETED
                </span>
              )}
              {isCancelled && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                  <XCircle className="size-3" /> CANCELLED
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              {exchange?.exchangeDate
                ? `Processed on ${formatDate(exchange.exchangeDate)} at ${formatTime(exchange.exchangeDate || exchange.createdAt)}`
                : "Denomination exchange details"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="size-7 rounded-full bg-surface-alt hover:bg-surface-hover text-text-muted hover:text-text flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>
      </UIModalHeader>

      {/* ── Modal Body (Scrollable) ── */}
      <UIModalBody className="p-6 overflow-y-auto space-y-5 flex-1 min-h-0 bg-[#f8fafc] dark:bg-bg">
        {error && (
          <UIAlert intent="danger" title="Error loading details" description={error} />
        )}

        {isLoading && !exchange ? (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <UISkeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <UISkeleton className="h-48 rounded-2xl" />
              <UISkeleton className="h-48 rounded-2xl" />
            </div>
          </div>
        ) : (
          <>
            {/* ── 4 Summary Stat Cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-surface border border-border rounded-xl p-3 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                  Exchanged Amount
                </span>
                <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  {formatCurrency(totalReceived)}
                </span>
                <span className="text-[10px] text-text-muted">Net Zero Drawer Impact</span>
              </div>

              <div className="bg-surface border border-border rounded-xl p-3 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                  Cash Partition
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Wallet className="size-3.5 text-text-muted" />
                  <span className="text-xs font-bold text-text capitalize">
                    {exchange?.cashPartition === "frozen" ? "Frozen Reserve" : "Running Drawer"}
                  </span>
                </div>
                <span className="text-[10px] text-text-muted">Drawer Source</span>
              </div>

              <div className="bg-surface border border-border rounded-xl p-3 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                  Processed By
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <User className="size-3.5 text-text-muted" />
                  <span className="text-xs font-bold text-text truncate">
                    {exchange?.createdBy?.name || exchange?.createdBy?.fullName || "Staff Cashier"}
                  </span>
                </div>
                <span className="text-[10px] text-text-muted truncate block">
                  {exchange?.createdBy?.role || "Authorized Staff"}
                </span>
              </div>

              <div className="bg-surface border border-border rounded-xl p-3 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                  Date & Time
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Calendar className="size-3.5 text-text-muted" />
                  <span className="text-xs font-bold text-text">
                    {formatDate(exchange?.exchangeDate || exchange?.createdAt)}
                  </span>
                </div>
                <span className="text-[10px] text-text-muted">
                  {formatTime(exchange?.exchangeDate || exchange?.createdAt)}
                </span>
              </div>
            </div>

            {/* ── Dual Side-by-Side Breakdown ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Received from Customer */}
              <div className="bg-surface border border-emerald-500/20 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-border/70 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                      <ArrowDownToLine className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-text">Received from Customer</h4>
                      <p className="text-[10px] text-text-muted">Cash taken in</p>
                    </div>
                  </div>
                  <div className="text-right font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(totalReceived)}
                  </div>
                </div>

                <div className="space-y-1.5">
                  {denominationsReceived.map((d, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-surface-alt/40 border border-border/50 text-xs"
                    >
                      <span
                        className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md border ${getDenomColor(
                          d.denomination
                        )}`}
                      >
                        ₹ {d.denomination}
                      </span>
                      <span className="font-mono text-text-muted text-xs">
                        × {d.quantity} {d.quantity === 1 ? "note" : "notes"}
                      </span>
                      <span className="font-mono font-bold text-text">
                        {formatCurrency(d.denomination * d.quantity)}
                      </span>
                    </div>
                  ))}
                  {denominationsReceived.length === 0 && (
                    <p className="text-center text-xs text-text-muted py-4">
                      No denominations recorded
                    </p>
                  )}
                </div>
              </div>

              {/* Given to Customer */}
              <div className="bg-surface border border-blue-500/20 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-border/70 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                      <ArrowUpFromLine className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-text">Given to Customer</h4>
                      <p className="text-[10px] text-text-muted">Change handed back</p>
                    </div>
                  </div>
                  <div className="text-right font-mono font-black text-sm text-blue-600 dark:text-blue-400">
                    {formatCurrency(totalGiven)}
                  </div>
                </div>

                <div className="space-y-1.5">
                  {denominationsGiven.map((d, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-surface-alt/40 border border-border/50 text-xs"
                    >
                      <span
                        className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md border ${getDenomColor(
                          d.denomination
                        )}`}
                      >
                        ₹ {d.denomination}
                      </span>
                      <span className="font-mono text-text-muted text-xs">
                        × {d.quantity} {d.quantity === 1 ? "note" : "notes"}
                      </span>
                      <span className="font-mono font-bold text-text">
                        {formatCurrency(d.denomination * d.quantity)}
                      </span>
                    </div>
                  ))}
                  {denominationsGiven.length === 0 && (
                    <p className="text-center text-xs text-text-muted py-4">
                      No denominations recorded
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Narration / Remarks ── */}
            <div className="bg-surface border border-border rounded-xl p-3.5 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-text">
                <FileText className="size-3.5 text-text-muted" />
                <span>Exchange Narration</span>
              </div>
              <p className="text-xs text-text-muted bg-surface-alt/50 border border-border/60 rounded-lg p-2.5 leading-relaxed">
                {exchange?.narration || "No custom narration recorded for this transaction."}
              </p>
            </div>

            {/* Cancellation info (if cancelled) */}
            {isCancelled && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3.5 space-y-1 text-xs">
                <span className="font-bold text-rose-700 dark:text-rose-300">
                  Cancelled by {exchange?.cancelledBy?.name || "Staff"}
                </span>
                <p className="text-rose-600/90 dark:text-rose-400">
                  Reason: {exchange?.cancellationReason || "No cancellation reason provided."}
                </p>
              </div>
            )}
          </>
        )}
      </UIModalBody>

      {/* ── Modal Footer ── */}
      <UIModalFooter className="px-6 py-3 border-t border-border bg-surface shrink-0 flex items-center justify-end">
        <UIButton
          type="button"
          size="sm"
          onClick={onClose}
          className="rounded-xl text-xs font-semibold px-5"
        >
          Close
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
};

export default ViewCashExchangeModal;
