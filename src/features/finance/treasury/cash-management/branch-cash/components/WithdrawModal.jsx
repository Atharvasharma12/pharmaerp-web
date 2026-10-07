// src/features/finance/treasury/cash-management/branch-cash/components/WithdrawModal.jsx

import React, { useState, useEffect } from "react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalBody,
  UIModalFooter,
  UIButton,
  UIAlert,
  UISelect,
} from "@/components/ui";
import {
  ArrowUpFromLine,
  Building2,
  Wallet,
  BarChart3,
  Banknote,
  FileText,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Calculator,
} from "lucide-react";
import { useBranchCash } from "../hooks/useBranchCash";
import useBranch from "@/features/branch/hooks/useBranch";

const DENOMINATIONS_CONFIG = [
  { note: 500, label: "₹ 500", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800", icon: "P" },
  { note: 200, label: "₹ 200", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800", icon: "P" },
  { note: 100, label: "₹ 100", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800", icon: "P" },
  { note: 50,  label: "₹ 50",  color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800", icon: "P" },
  { note: 20,  label: "₹ 20",  color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800", icon: "P" },
  { note: 10,  label: "₹ 10",  color: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800", icon: "P" },
  { note: 5,   label: "₹ 5",   color: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300 border-pink-200 dark:border-pink-800", icon: "P" },
  { note: 2,   label: "₹ 2",   color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700", icon: "i" },
  { note: 1,   label: "₹ 1",   color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700", icon: "i" },
];

const SOURCE_OPTIONS = [
  { value: "running", label: "Running Cash Drawer" },
  { value: "frozen", label: "Frozen Reserve Vault" },
];

const formatCurrency = (val) =>
  `₹ ${Number(val || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const WithdrawModal = ({ isOpen, onClose }) => {
  const { currentBranch } = useBranch();
  const {
    currentBranchCash,
    withdrawCash,
    withdrawStatus,
    error: apiError,
    resetStatus,
  } = useBranchCash();

  const [source, setSource] = useState("running"); // "running" | "frozen"
  const [counts, setCounts] = useState(
    DENOMINATIONS_CONFIG.reduce((acc, d) => ({ ...acc, [d.note]: 0 }), {})
  );
  const [narration, setNarration] = useState("");
  const [validationError, setValidationError] = useState("");

  const isSubmitting = withdrawStatus === "loading";
  const isShiftOpen = Boolean(currentBranchCash?.currentShiftId);

  // Derive source balances
  const runningBalance = Number(currentBranchCash?.runningCash || 0);
  const frozenBalance = Number(currentBranchCash?.frozenCash || 0);
  const availableSourceBalance = source === "running" ? runningBalance : frozenBalance;

  // Helper to read stock count for given denomination and source
  const getAvailableCount = (note) => {
    if (!currentBranchCash) return 0;
    if (source === "running") {
      const arr = currentBranchCash.denominationBalance?.runningDenominations || [];
      const item = arr.find((d) => Number(d.denomination) === Number(note));
      return item ? Number(item.quantity ?? item.count ?? 0) : 0;
    } else {
      const arr =
        currentBranchCash.denominationBalance?.frozenDenominations ||
        currentBranchCash.balance?.frozenDenominations ||
        [];
      const item = arr.find((d) => Number(d.denomination) === Number(note));
      return item ? Number(item.quantity ?? item.count ?? 0) : 0;
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSource("running");
      setCounts(
        DENOMINATIONS_CONFIG.reduce((acc, d) => ({ ...acc, [d.note]: 0 }), {})
      );
      setNarration("");
      setValidationError("");
      if (typeof resetStatus === "function") resetStatus();
    }
  }, [isOpen, resetStatus]);

  useEffect(() => {
    if (withdrawStatus === "success") {
      onClose();
      if (typeof resetStatus === "function") resetStatus();
    }
  }, [withdrawStatus, onClose, resetStatus]);

  // When source changes, reset withdrawal counts
  const handleSourceChange = (newSource) => {
    setSource(newSource);
    setCounts(
      DENOMINATIONS_CONFIG.reduce((acc, d) => ({ ...acc, [d.note]: 0 }), {})
    );
    setValidationError("");
  };

  const totalWithdrawAmount = DENOMINATIONS_CONFIG.reduce((sum, d) => {
    const qty = Number(counts[d.note]) || 0;
    return sum + d.note * qty;
  }, 0);

  const remainingBalance = Math.max(0, availableSourceBalance - totalWithdrawAmount);

  const handleCountChange = (note, rawVal) => {
    const available = getAvailableCount(note);
    const cleaned = String(rawVal).replace(/\D/g, "");
    let qty = cleaned === "" ? 0 : Math.max(0, parseInt(cleaned, 10));
    if (qty > available) qty = available;
    setCounts((prev) => ({ ...prev, [note]: qty }));
  };

  const handleStep = (note, delta) => {
    const available = getAvailableCount(note);
    setCounts((prev) => {
      const current = Number(prev[note]) || 0;
      let next = Math.max(0, current + delta);
      if (next > available) next = available;
      return { ...prev, [note]: next };
    });
  };

  const handleSubmit = async () => {
    if (!currentBranch?._id) {
      setValidationError("No branch selected.");
      return;
    }
    if (source === "running" && !isShiftOpen) {
      setValidationError("A shift must be open to perform running cash withdrawals.");
      return;
    }
    if (totalWithdrawAmount <= 0) {
      setValidationError("Withdrawal amount must be greater than zero.");
      return;
    }
    if (!narration.trim()) {
      setValidationError("Narration / Purpose is required to document cash withdrawal.");
      return;
    }

    const withdrawDenominations = DENOMINATIONS_CONFIG.map((d) => ({
      denomination: d.note,
      count: Number(counts[d.note]) || 0,
      quantity: Number(counts[d.note]) || 0,
      amount: (Number(counts[d.note]) || 0) * d.note,
    })).filter((d) => d.count > 0);

    const payload = {
      branchId: currentBranch._id,
      source,
      amount: totalWithdrawAmount,
      denominations: withdrawDenominations,
      narration: narration.trim(),
    };

    try {
      await withdrawCash(payload).unwrap();
      onClose();
    } catch {
      // Error handled via Redux state
    }
  };

  if (!isOpen) return null;

  const branchName = currentBranch?.name || "Makati Branch";
  const branchCode =
    currentBranch?.code ||
    currentBranch?.branchCode ||
    (currentBranch?._id ? `MB-${String(currentBranch._id).slice(-3).toUpperCase()}` : "MB-001");

  return (
    <UIModal
      isOpen={isOpen}
      onClose={isSubmitting ? undefined : onClose}
      size="2xl"
      className="w-[980px] max-w-[96vw] max-h-[92vh] flex flex-col overflow-hidden select-none"
    >
      {/* ── Modal Header: Red Icon + Title + Subtitle ── */}
      <UIModalHeader className="border-b border-border/80 px-6 py-4.5 bg-surface shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="size-11 rounded-2xl bg-[#ef4444] text-white flex items-center justify-center shadow-xs shrink-0">
            <ArrowUpFromLine className="size-5" />
          </div>
          <div>
            <UIModalTitle className="text-xl font-bold text-text tracking-tight">
              Withdraw Cash
            </UIModalTitle>
            <p className="text-xs text-text-muted mt-0.5">
              Withdraw cash from the branch drawer or vault.
            </p>
          </div>
        </div>
      </UIModalHeader>

      <UIModalBody className="p-6 overflow-y-auto space-y-4 bg-bg flex-1">
        {/* Error Alert */}
        {(validationError || apiError) && (
          <UIAlert
            intent="danger"
            title="Withdrawal Error"
            description={validationError || apiError}
            onClose={() => setValidationError("")}
          />
        )}

        {/* ── Top Row: Branch Info & Withdraw From Selector ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Branch */}
          <div className="bg-surface rounded-2xl border border-border p-4 flex items-center gap-3.5 shadow-xs">
            <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-text-muted flex items-center justify-center shrink-0">
              <Building2 className="size-5" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-text-muted">Branch</div>
              <div className="text-sm font-bold text-text">{branchName}</div>
              <div className="text-[11px] text-text-muted font-mono">{branchCode}</div>
            </div>
          </div>

          {/* Card 2: Withdraw From */}
          <div className="bg-surface rounded-2xl border border-border p-4 flex items-center gap-3.5 shadow-xs">
            <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Wallet className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium text-text-muted mb-1">Withdraw From</div>
              <UISelect
                value={source}
                onChange={(val) => handleSourceChange(val)}
                options={SOURCE_OPTIONS}
                disabled={isSubmitting}
                size="sm"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* ── Second Row: Available Balance & Remaining Balance ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Available Balance Card */}
          <div className="bg-surface rounded-2xl border border-border p-4 flex items-center gap-3.5 shadow-xs">
            <div className="size-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Wallet className="size-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-text-muted">
                Available Balance ({source === "running" ? "Running" : "Frozen"})
              </div>
              <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {formatCurrency(availableSourceBalance)}
              </div>
            </div>
          </div>

          {/* Remaining After Withdrawal Card */}
          <div className="bg-surface rounded-2xl border border-border p-4 flex items-center gap-3.5 shadow-xs">
            <div className="size-11 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <BarChart3 className="size-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-text-muted">
                Remaining After Withdrawal
              </div>
              <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
                {formatCurrency(remainingBalance)}
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Section: 2 Columns (Denominations on Left, Summary/Narration on Right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* ══════════ LEFT COLUMN: Cash Denominations Table (7 Cols) ══════════ */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs">
              <div className="px-4 py-3 border-b border-border bg-surface-alt/50 flex items-center gap-2">
                <Banknote className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-text">Cash Denominations</span>
              </div>

              {/* Table Headers */}
              <div className="grid grid-cols-12 px-4 py-2 border-b border-border/80 text-[11px] font-bold text-text-muted uppercase tracking-wider bg-surface-alt/30">
                <div className="col-span-4">Denomination</div>
                <div className="col-span-2 text-center">Available</div>
                <div className="col-span-3 text-center">Withdraw Count</div>
                <div className="col-span-3 text-right">Subtotal</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-border/50">
                {DENOMINATIONS_CONFIG.map((d) => {
                  const availableCount = getAvailableCount(d.note);
                  const withdrawCount = Number(counts[d.note]) || 0;
                  const subtotal = d.note * withdrawCount;

                  return (
                    <div
                      key={d.note}
                      className="grid grid-cols-12 px-4 py-2 items-center hover:bg-surface-alt/30 transition text-xs"
                    >
                      {/* Denomination Pill */}
                      <div className="col-span-4 flex items-center gap-2">
                        <span
                          className={`size-6 rounded-md flex items-center justify-center text-[10px] font-bold border ${d.color}`}
                        >
                          {d.icon}
                        </span>
                        <span className="font-bold text-text">{d.label}</span>
                      </div>

                      {/* Available Count */}
                      <div className="col-span-2 text-center font-mono font-medium text-xs text-text-muted">
                        {availableCount}
                      </div>

                      {/* Withdraw Stepper */}
                      <div className="col-span-3 flex items-center justify-center">
                        <div className="flex items-center border border-border rounded-lg bg-surface shadow-2xs overflow-hidden w-24">
                          <input
                            type="text"
                            inputMode="numeric"
                            value={withdrawCount === 0 ? "0" : withdrawCount}
                            onChange={(e) => handleCountChange(d.note, e.target.value)}
                            disabled={isSubmitting || availableCount === 0}
                            className="w-full text-center font-mono font-semibold text-xs py-1 px-1.5 bg-transparent outline-none text-text disabled:opacity-40"
                          />
                          <div className="flex flex-col border-l border-border shrink-0">
                            <button
                              type="button"
                              onClick={() => handleStep(d.note, 1)}
                              disabled={isSubmitting || withdrawCount >= availableCount || availableCount === 0}
                              className="px-1 py-0.5 hover:bg-surface-alt text-text-muted hover:text-text transition-colors cursor-pointer disabled:opacity-30"
                            >
                              <ChevronUp className="size-2.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStep(d.note, -1)}
                              disabled={isSubmitting || withdrawCount <= 0}
                              className="px-1 py-0.5 hover:bg-surface-alt text-text-muted hover:text-text transition-colors cursor-pointer disabled:opacity-30"
                            >
                              <ChevronDown className="size-2.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="col-span-3 text-right font-mono font-bold text-xs text-text">
                        {formatCurrency(subtotal)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ══════════ RIGHT COLUMN: Summary, Narration & Alert (5 Cols) ══════════ */}
          <div className="lg:col-span-5 space-y-4">
            {/* Card 1: Summary */}
            <div className="bg-surface rounded-2xl border border-border p-4 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-text">
                <Calculator className="size-4 text-text-muted" />
                <span>Summary</span>
              </div>
              <div className="bg-surface-alt/70 rounded-xl p-3 border border-border/70 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Total Withdrawal Amount</span>
                  <span className="font-bold text-text font-mono">
                    {formatCurrency(totalWithdrawAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-border/50 pt-2">
                  <span className="text-text-muted">Source</span>
                  <span className="font-medium text-text">
                    {source === "running" ? "Running Cash Drawer" : "Frozen Reserve Vault"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-border/50 pt-2">
                  <span className="text-text-muted">Balance After Withdrawal</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatCurrency(remainingBalance)}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Narration / Purpose */}
            <div className="bg-surface rounded-2xl border border-border p-4 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-text">
                <FileText className="size-4 text-text-muted" />
                <span>Narration / Purpose</span>
              </div>
              <div className="relative pt-1">
                <textarea
                  value={narration}
                  onChange={(e) => setNarration(e.target.value.slice(0, 500))}
                  placeholder="Enter withdrawal reason (e.g. bank deposit, petty cash, expenses, etc.)"
                  disabled={isSubmitting}
                  rows={4}
                  className="w-full text-xs bg-surface border border-border rounded-xl p-3 outline-none focus:border-primary transition resize-none placeholder:text-text-muted/60"
                />
                <span className="absolute bottom-2.5 right-3 text-[10px] text-text-muted font-mono">
                  {narration.length}/500
                </span>
              </div>
            </div>

            {/* Card 3: Amber Alert Box */}
            <div className="bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="size-8 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 shadow-2xs">
                <AlertTriangle className="size-4" />
              </div>
              <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
                You can only <strong className="font-bold text-amber-950 dark:text-amber-100">withdraw up to the available</strong> denomination count for each currency.
              </p>
            </div>
          </div>
        </div>
      </UIModalBody>

      {/* ── Modal Footer ── */}
      <UIModalFooter className="border-t border-border/80 px-6 py-4 bg-surface flex items-center justify-between shrink-0">
        <UIButton
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-5 py-2 rounded-xl text-xs font-bold"
        >
          Cancel
        </UIButton>

        <UIButton
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || totalWithdrawAmount <= 0}
          isLoading={isSubmitting}
          startIcon={<ArrowUpFromLine className="size-4" />}
          className="px-6 py-2 rounded-xl bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-bold shadow-xs cursor-pointer"
        >
          Withdraw Cash
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
};

export default WithdrawModal;
