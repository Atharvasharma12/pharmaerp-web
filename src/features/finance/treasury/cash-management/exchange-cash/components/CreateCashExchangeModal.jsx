// src/features/finance/treasury/cash-management/exchange-cash/components/CreateCashExchangeModal.jsx

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  Repeat,
  ArrowDownToLine,
  ArrowUpFromLine,
  Building2,
  Clock,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Plus,
  Minus,
  Sparkles,
  Info,
} from "lucide-react";
import useBranch from "@/features/branch/hooks/useBranch";
import useActiveShift from "@/features/operations/shifts/hooks/useActiveShift";
import useBranchCash from "@/features/finance/treasury/cash-management/branch-cash/hooks/useBranchCash";
import useCashExchange from "../hooks/useCashExchange";
import { API_STATUS } from "@/constants";

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

const INITIAL_DENOM_MAP = DENOMINATIONS_CONFIG.reduce((acc, d) => {
  acc[d.note] = 0;
  return acc;
}, {});

const formatCurrency = (val) =>
  `₹ ${Number(val || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const CreateCashExchangeModal = ({ isOpen, onClose, onSuccess }) => {
  const { currentBranch } = useBranch();
  const { activeShift } = useActiveShift(currentBranch?._id);
  const { currentBranchCash, fetchBranchCash } = useBranchCash();
  const { createCashExchange, createCashExchangeStatus, error: apiError, clearError } = useCashExchange();

  const [partition, setPartition] = useState("running"); // "running" | "frozen"
  const [receivedMap, setReceivedMap] = useState({ ...INITIAL_DENOM_MAP });
  const [givenMap, setGivenMap] = useState({ ...INITIAL_DENOM_MAP });
  const [narration, setNarration] = useState("");
  const [notes, setNotes] = useState("");
  const [clientError, setClientError] = useState("");

  // Load branch cash when opening
  useEffect(() => {
    if (isOpen && currentBranch?._id) {
      fetchBranchCash(currentBranch._id);
      setReceivedMap({ ...INITIAL_DENOM_MAP });
      setGivenMap({ ...INITIAL_DENOM_MAP });
      setNarration("");
      setNotes("");
      setClientError("");
      clearError();
    }
  }, [isOpen, currentBranch?._id, fetchBranchCash, clearError]);

  // Drawer available denominations
  const availableDenomList = useMemo(() => {
    if (!currentBranchCash?.denominationBalance) {
      return (
        (partition === "running"
          ? currentBranchCash?.balance?.runningDenominations
          : currentBranchCash?.balance?.frozenDenominations) || []
      );
    }
    return (
      (partition === "running"
        ? currentBranchCash.denominationBalance.runningDenominations
        : currentBranchCash.denominationBalance.frozenDenominations) || []
    );
  }, [currentBranchCash, partition]);

  const availableDenomMap = useMemo(() => {
    const map = {};
    for (const d of availableDenomList) {
      map[Number(d.denomination)] = Number(d.quantity || d.count || 0);
    }
    return map;
  }, [availableDenomList]);

  // Drawer partition total
  const drawerTotal = useMemo(() => {
    return Object.entries(availableDenomMap).reduce(
      (sum, [denom, count]) => sum + Number(denom) * count,
      0
    );
  }, [availableDenomMap]);

  // Totals calculation
  const totalReceived = useMemo(() => {
    return Object.entries(receivedMap).reduce(
      (sum, [denom, count]) => sum + Number(denom) * Number(count || 0),
      0
    );
  }, [receivedMap]);

  const totalGiven = useMemo(() => {
    return Object.entries(givenMap).reduce(
      (sum, [denom, count]) => sum + Number(denom) * Number(count || 0),
      0
    );
  }, [givenMap]);

  const diff = totalReceived - totalGiven;
  const isBalanced = totalReceived > 0 && totalReceived === totalGiven;

  // Handlers for Received
  const handleReceivedChange = (note, val) => {
    setClientError("");
    const parsed = Math.max(0, parseInt(val, 10) || 0);
    setReceivedMap((prev) => ({ ...prev, [note]: parsed }));
  };

  // Handlers for Given (clamped to available in drawer)
  const handleGivenChange = (note, val) => {
    setClientError("");
    const maxAvail = availableDenomMap[note] || 0;
    let parsed = Math.max(0, parseInt(val, 10) || 0);
    if (parsed > maxAvail) {
      parsed = maxAvail;
    }
    setGivenMap((prev) => ({ ...prev, [note]: parsed }));
  };

  const handleReset = () => {
    setReceivedMap({ ...INITIAL_DENOM_MAP });
    setGivenMap({ ...INITIAL_DENOM_MAP });
    setClientError("");
  };

  const handleSubmit = async () => {
    setClientError("");

    if (!activeShift) {
      setClientError("An active shift is required to perform cash exchanges.");
      return;
    }

    if (totalReceived <= 0) {
      setClientError("Enter at least one denomination received from the customer.");
      return;
    }

    if (totalGiven <= 0) {
      setClientError("Enter at least one denomination given to the customer.");
      return;
    }

    if (totalReceived !== totalGiven) {
      setClientError(
        `Exchange is imbalanced! Received: ₹${totalReceived.toLocaleString(
          "en-IN"
        )}, Given: ₹${totalGiven.toLocaleString("en-IN")}. Both must be equal.`
      );
      return;
    }

    // Check given denominations against drawer
    for (const [noteStr, count] of Object.entries(givenMap)) {
      const note = Number(noteStr);
      const needed = Number(count);
      const avail = availableDenomMap[note] || 0;
      if (needed > avail) {
        setClientError(
          `Drawer only has ${avail} note(s) of ₹${note}. Cannot give ${needed}.`
        );
        return;
      }
    }

    const denominationsReceived = Object.entries(receivedMap)
      .filter(([_, count]) => Number(count) > 0)
      .map(([denom, count]) => ({
        denomination: Number(denom),
        quantity: Number(count),
      }));

    const denominationsGiven = Object.entries(givenMap)
      .filter(([_, count]) => Number(count) > 0)
      .map(([denom, count]) => ({
        denomination: Number(denom),
        quantity: Number(count),
      }));

    try {
      const payload = {
        exchangeDate: new Date(),
        cashPartition: partition,
        denominationsReceived,
        denominationsGiven,
        narration: narration.trim() || undefined,
        notes: notes.trim() || undefined,
      };

      await createCashExchange(payload);
      if (typeof onSuccess === "function") onSuccess();
      onClose();
    } catch (err) {
      setClientError(
        typeof err === "string" ? err : "Failed to record cash exchange."
      );
    }
  };

  const isSubmitting = createCashExchangeStatus === API_STATUS.LOADING;

  const partitionOptions = [
    { value: "running", label: "Running Cash Drawer" },
    { value: "frozen", label: "Frozen Reserve Vault" },
  ];

  return (
    <UIModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[880px] w-full max-h-[92vh] flex flex-col p-0 overflow-hidden select-none"
    >
      {/* ── Modal Header ── */}
      <UIModalHeader className="px-6 py-4 border-b border-border bg-surface shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 text-white flex items-center justify-center shadow-xs">
            <Repeat className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <UIModalTitle className="text-base font-bold text-text">
                New Cash Exchange
              </UIModalTitle>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                DENOMINATION SWAP
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Swap cash denominations with zero net impact on total drawer balances
            </p>
          </div>
        </div>
      </UIModalHeader>

      {/* ── Modal Body (Scrollable) ── */}
      <UIModalBody className="p-6 overflow-y-auto space-y-5 flex-1 min-h-0 bg-[#f8fafc] dark:bg-bg">
        {/* Errors / Warnings */}
        {(clientError || apiError) && (
          <UIAlert
            intent="danger"
            title="Unable to record exchange"
            description={clientError || apiError}
            onClose={() => {
              setClientError("");
              clearError();
            }}
          />
        )}

        {/* ── Context & Partition Bar ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-surface border border-border rounded-xl p-3 shadow-2xs">
          {/* Branch & Shift Context */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-8 rounded-lg bg-surface-alt flex items-center justify-center text-text-muted shrink-0">
              <Building2 className="size-4" />
            </div>
            <div className="min-w-0 truncate">
              <div className="text-[10px] uppercase font-bold text-text-muted tracking-wider">
                Branch & Active Shift
              </div>
              <div className="text-xs font-bold text-text truncate">
                {currentBranch?.name || "Current Branch"}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium truncate flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {activeShift?.name || activeShift?.shiftNo || "Active Shift"}
              </div>
            </div>
          </div>

          {/* Drawer Partition Selection */}
          <div className="min-w-0">
            <label className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">
              Select Drawer Source
            </label>
            <UISelect
              value={partition}
              onChange={(e) => setPartition(e.target.value)}
              options={partitionOptions}
              className="text-xs font-medium"
            />
          </div>

          {/* Drawer Balance Display */}
          <div className="bg-surface-alt/60 border border-border/80 rounded-lg p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <Wallet className="size-4 text-text-muted shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-text-muted font-medium">Available in Drawer</div>
                <div className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(drawerTotal)}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="text-[10px] text-text-muted hover:text-text font-semibold px-2 py-1 rounded bg-surface hover:bg-surface-alt border border-border cursor-pointer transition"
            >
              Reset
            </button>
          </div>
        </div>

        {/* ── Side-by-Side Denominations Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Panel 1: Received FROM Customer */}
          <div className="bg-surface border border-emerald-500/20 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border/70 mb-3">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                    <ArrowDownToLine className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text">Received from Customer</h4>
                    <p className="text-[10px] text-text-muted">Cash handed in (bigger notes)</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-text-muted font-medium">Total In</div>
                  <div className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(totalReceived)}
                  </div>
                </div>
              </div>

              {/* Denomination Steppers */}
              <div className="space-y-1.5 max-h-[310px] overflow-y-auto pr-1">
                {DENOMINATIONS_CONFIG.map((d) => {
                  const count = receivedMap[d.note] || 0;
                  const lineTotal = d.note * count;

                  return (
                    <div
                      key={d.note}
                      className="flex items-center justify-between p-1.5 rounded-xl border border-border/60 hover:border-emerald-500/30 bg-surface-alt/30 transition-colors"
                    >
                      <span
                        className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md border ${d.color} min-w-[50px] text-center`}
                      >
                        {d.label}
                      </span>

                      {/* Stepper */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleReceivedChange(d.note, count - 1)}
                          disabled={count <= 0}
                          className="size-6 rounded-md bg-surface border border-border text-text hover:bg-surface-alt disabled:opacity-30 flex items-center justify-center cursor-pointer transition"
                        >
                          <Minus className="size-3" />
                        </button>
                        <input
                          type="number"
                          min={0}
                          value={count === 0 ? "" : count}
                          placeholder="0"
                          onChange={(e) => handleReceivedChange(d.note, e.target.value)}
                          className="w-12 h-6 text-center text-xs font-bold font-mono bg-surface border border-border rounded-md focus:border-emerald-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleReceivedChange(d.note, count + 1)}
                          className="size-6 rounded-md bg-surface border border-border text-text hover:bg-surface-alt flex items-center justify-center cursor-pointer transition"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="text-right min-w-[70px]">
                        <span className="text-[11px] font-bold font-mono text-text">
                          {formatCurrency(lineTotal)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Panel 2: Given TO Customer */}
          <div className="bg-surface border border-blue-500/20 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border/70 mb-3">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                    <ArrowUpFromLine className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text">Given to Customer</h4>
                    <p className="text-[10px] text-text-muted">Cash given out (change)</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-text-muted font-medium">Total Out</div>
                  <div className="text-sm font-black font-mono text-blue-600 dark:text-blue-400">
                    {formatCurrency(totalGiven)}
                  </div>
                </div>
              </div>

              {/* Denomination Steppers */}
              <div className="space-y-1.5 max-h-[310px] overflow-y-auto pr-1">
                {DENOMINATIONS_CONFIG.map((d) => {
                  const count = givenMap[d.note] || 0;
                  const maxAvail = availableDenomMap[d.note] || 0;
                  const lineTotal = d.note * count;

                  return (
                    <div
                      key={d.note}
                      className="flex items-center justify-between p-1.5 rounded-xl border border-border/60 hover:border-blue-500/30 bg-surface-alt/30 transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md border ${d.color} min-w-[50px] text-center`}
                        >
                          {d.label}
                        </span>
                        <span
                          className={`text-[9px] font-mono px-1 rounded ${
                            maxAvail > 0 ? "text-text-muted" : "text-rose-500 font-bold"
                          }`}
                          title={`Available in drawer: ${maxAvail}`}
                        >
                          Avail: {maxAvail}
                        </span>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleGivenChange(d.note, count - 1)}
                          disabled={count <= 0}
                          className="size-6 rounded-md bg-surface border border-border text-text hover:bg-surface-alt disabled:opacity-30 flex items-center justify-center cursor-pointer transition"
                        >
                          <Minus className="size-3" />
                        </button>
                        <input
                          type="number"
                          min={0}
                          max={maxAvail}
                          value={count === 0 ? "" : count}
                          placeholder="0"
                          disabled={maxAvail <= 0}
                          onChange={(e) => handleGivenChange(d.note, e.target.value)}
                          className="w-12 h-6 text-center text-xs font-bold font-mono bg-surface border border-border rounded-md focus:border-blue-500 outline-none disabled:opacity-40"
                        />
                        <button
                          type="button"
                          onClick={() => handleGivenChange(d.note, count + 1)}
                          disabled={count >= maxAvail}
                          className="size-6 rounded-md bg-surface border border-border text-text hover:bg-surface-alt disabled:opacity-30 flex items-center justify-center cursor-pointer transition"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="text-right min-w-[70px]">
                        <span className="text-[11px] font-bold font-mono text-text">
                          {formatCurrency(lineTotal)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Balance Status Card ── */}
        <div
          className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
            isBalanced
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200"
              : totalReceived > 0 || totalGiven > 0
              ? "bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-200"
              : "bg-surface border-border text-text-muted"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {isBalanced ? (
              <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 shrink-0" />
            )}
            <div>
              <div className="text-xs font-bold">
                {isBalanced
                  ? "Exchange is Perfectly Balanced"
                  : totalReceived === 0 && totalGiven === 0
                  ? "Enter denominations on both sides to balance"
                  : `Imbalance Difference: ${formatCurrency(Math.abs(diff))}`}
              </div>
              <p className="text-[11px] opacity-80 mt-0.5">
                {isBalanced
                  ? `Total received (${formatCurrency(totalReceived)}) equals total given (${formatCurrency(totalGiven)}). Zero drawer discrepancy.`
                  : diff > 0
                  ? `Customer gave ₹${diff.toLocaleString("en-IN")} more than given out. Add change to balance.`
                  : `Given out ₹${Math.abs(diff).toLocaleString("en-IN")} more than received. Adjust denominations.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 font-mono text-xs font-bold">
            <div>
              <span className="text-[10px] text-text-muted block">Total In</span>
              <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(totalReceived)}</span>
            </div>
            <span className="text-text-muted">=</span>
            <div>
              <span className="text-[10px] text-text-muted block">Total Out</span>
              <span className="text-blue-600 dark:text-blue-400">{formatCurrency(totalGiven)}</span>
            </div>
          </div>
        </div>

        {/* ── Narration / Notes ── */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-text flex items-center gap-1.5">
            <FileText className="size-3.5 text-text-muted" />
            Narration / Customer Note (Optional)
          </label>
          <div className="relative">
            <textarea
              rows={2}
              maxLength={500}
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              placeholder="e.g., Gave change for ₹500 note (5x ₹100 notes)..."
              className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text placeholder:text-text-muted/60 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none outline-none"
            />
            <div className="text-[10px] font-mono text-text-muted text-right mt-0.5">
              {narration.length}/500
            </div>
          </div>
        </div>
      </UIModalBody>

      {/* ── Modal Footer ── */}
      <UIModalFooter className="px-6 py-3 border-t border-border bg-surface shrink-0 flex items-center justify-end gap-2.5">
        <UIButton
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isSubmitting}
          className="rounded-xl text-xs font-semibold px-4"
        >
          Cancel
        </UIButton>

        <UIButton
          type="button"
          size="sm"
          onClick={handleSubmit}
          disabled={!isBalanced || isSubmitting}
          isLoading={isSubmitting}
          startIcon={<Repeat className="size-3.5" />}
          className="rounded-xl text-xs font-bold px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer transition disabled:opacity-40"
        >
          Record Cash Exchange
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
};

export default CreateCashExchangeModal;
