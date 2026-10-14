// src/features/sales/components/CashBreakdownModal.jsx
import { useState, useEffect, useMemo } from "react";
import { UIModal, UIButton } from "@/components/ui";
import {
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Banknote,
  Coins,
  ArrowRight,
  SlidersHorizontal,
  Wallet,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const DENOM_NOTES = [500, 200, 100, 50, 20, 10];
const DENOM_COINS = [5, 2, 1];
const ALL_DENOMS = [...DENOM_NOTES, ...DENOM_COINS];

const DENOM_THEMES = {
  500: { bg: "bg-emerald-500/10 dark:bg-emerald-950/20", border: "border-emerald-500/30", text: "text-emerald-700 dark:text-emerald-300" },
  200: { bg: "bg-amber-500/10 dark:bg-amber-950/20", border: "border-amber-500/30", text: "text-amber-700 dark:text-amber-300" },
  100: { bg: "bg-indigo-500/10 dark:bg-indigo-950/20", border: "border-indigo-500/30", text: "text-indigo-700 dark:text-indigo-300" },
  50: { bg: "bg-cyan-500/10 dark:bg-cyan-950/20", border: "border-cyan-500/30", text: "text-cyan-700 dark:text-cyan-300" },
  20: { bg: "bg-orange-500/10 dark:bg-orange-950/20", border: "border-orange-500/30", text: "text-orange-700 dark:text-orange-300" },
  10: { bg: "bg-amber-900/10 dark:bg-amber-950/30", border: "border-amber-700/30", text: "text-amber-800 dark:text-amber-300" },
  5: { bg: "bg-slate-500/10 dark:bg-slate-800/30", border: "border-slate-500/30", text: "text-slate-700 dark:text-slate-300" },
  2: { bg: "bg-slate-500/10 dark:bg-slate-800/30", border: "border-slate-500/30", text: "text-slate-700 dark:text-slate-300" },
  1: { bg: "bg-slate-500/10 dark:bg-slate-800/30", border: "border-slate-500/30", text: "text-slate-700 dark:text-slate-300" },
};

/** Decompose an integer amount into optimal currency denominations */
export const decomposeAmount = (amount) => {
  let rem = Math.max(0, Math.round(amount));
  const res = {};
  for (const d of ALL_DENOMS) {
    if (rem >= d) {
      const count = Math.floor(rem / d);
      if (count > 0) {
        res[d] = count;
        rem -= count * d;
      }
    }
  }
  return res;
};

/**
 * Decompose change amount strictly constrained by the cash drawer's available denominations & quantities.
 * - Will NOT select denominations not present in drawer (count === 0 or missing).
 * - Will NOT select a quantity greater than what is present in the drawer.
 * - Backtracks to find the minimal note count combination matching exact amount.
 */
export const decomposeChangeWithDrawer = (amount, drawerMap = {}) => {
  const target = Math.max(0, Math.round(amount));
  if (target <= 0) return {};

  const hasDrawerStock = drawerMap && Object.values(drawerMap).some((qty) => Number(qty) > 0);
  if (!hasDrawerStock) {
    return {};
  }

  // Filter available denominations that exist in drawer with quantity > 0 and <= target
  const denoms = ALL_DENOMS.filter((d) => d <= target && (Number(drawerMap[d]) || 0) > 0);
  if (denoms.length === 0) return {};

  // 1. Fast Greedy decomposition pass (instant 0ms for standard currency)
  let remGreedy = target;
  const greedy = {};
  for (const d of denoms) {
    const avail = Number(drawerMap[d]) || 0;
    if (avail > 0 && remGreedy >= d) {
      const take = Math.min(Math.floor(remGreedy / d), avail);
      if (take > 0) {
        greedy[d] = take;
        remGreedy -= take * d;
      }
    }
  }

  if (remGreedy === 0) {
    return greedy;
  }

  // 2. Bounded minimal-note search if greedy left remainder (capped to prevent CPU freeze)
  let bestSolution = null;
  let bestCount = Infinity;
  let steps = 0;
  const MAX_STEPS = 300;

  const solve = (index, remaining, current) => {
    if (++steps > MAX_STEPS) return false;
    if (remaining === 0) {
      const count = Object.values(current).reduce((s, c) => s + c, 0);
      if (count < bestCount) {
        bestCount = count;
        bestSolution = { ...current };
      }
      return true;
    }
    if (index >= denoms.length) return false;

    const d = denoms[index];
    const maxAvailable = Number(drawerMap[d]) || 0;
    const maxPossible = Math.min(Math.floor(remaining / d), maxAvailable);

    for (let c = maxPossible; c >= 0; c--) {
      if (steps > MAX_STEPS) break;
      const currentCount = Object.values(current).reduce((s, cnt) => s + cnt, 0);
      if (currentCount + c >= bestCount) continue;

      if (c > 0) current[d] = c;
      const found = solve(index + 1, remaining - c * d, current);
      if (c > 0) delete current[d];

      if (found && bestCount <= currentCount + c) break;
    }
    return bestSolution !== null;
  };

  solve(0, target, {});

  if (bestSolution) {
    return bestSolution;
  }

  // 3. Fallback: Return partial greedy result
  return greedy;
};

export function CashBreakdownModal({
  isOpen,
  onClose,
  onConfirm,
  targetAmount = 0,
  initialReceived = {},
  initialReturned = {},
  availableDenominations = [],
  availableBalance = 0,
  cashAccountName = "Cash Drawer",
}) {
  const [received, setReceived] = useState({});
  const [returned, setReturned] = useState({});
  const [isCustomizingChange, setIsCustomizingChange] = useState(false);
  const [error, setError] = useState(null);

  // Available denominations map for drawer context & strict physical limits
  const availableDenomsMap = useMemo(() => {
    const map = {};
    if (Array.isArray(availableDenominations)) {
      availableDenominations.forEach((d) => {
        if (!d) return;
        const denom = Number(d.denomination || d.val || d.note || 0);
        const qty = Number(d.quantity ?? d.count ?? d.qty ?? 0);
        if (denom > 0) {
          map[denom] = Math.max(0, qty);
        }
      });
    } else if (availableDenominations && typeof availableDenominations === "object") {
      Object.entries(availableDenominations).forEach(([d, q]) => {
        const denom = Number(d);
        const qty = Number(q);
        if (denom > 0) {
          map[denom] = Math.max(0, qty);
        }
      });
    }
    return map;
  }, [availableDenominations]);

  const hasDrawerStock = useMemo(() => {
    return Object.values(availableDenomsMap).some((qty) => Number(qty) > 0);
  }, [availableDenomsMap]);

  // Initialize cleanly when modal transitions from closed to open
  useEffect(() => {
    if (isOpen) {
      const hasInitReceived = initialReceived && Object.keys(initialReceived).length > 0;
      const hasInitReturned = initialReturned && Object.keys(initialReturned).length > 0;

      if (hasInitReceived) {
        setReceived({ ...initialReceived });
        setReturned(hasInitReturned ? { ...initialReturned } : {});
      } else if (targetAmount > 0) {
        // Pre-fill exact tender so cashier is immediately 1 click away from confirming
        const exact = decomposeAmount(targetAmount);
        setReceived(exact);
        setReturned({});
      } else {
        setReceived({});
        setReturned({});
      }
      setIsCustomizingChange(false);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const receivedTotal = useMemo(() =>
    Object.entries(received).reduce((sum, [d, q]) => sum + Number(d) * (Number(q) || 0), 0),
    [received]
  );

  const returnedTotal = useMemo(() =>
    Object.entries(returned).reduce((sum, [d, q]) => sum + Number(d) * (Number(q) || 0), 0),
    [returned]
  );

  const expectedChange = Math.max(0, receivedTotal - Number(targetAmount || 0));
  const netApplied = receivedTotal - returnedTotal;

  // Auto-calculate optimal returned change denominations strictly constrained by cash drawer
  useEffect(() => {
    if (!isCustomizingChange) {
      if (expectedChange > 0) {
        setReturned(decomposeChangeWithDrawer(expectedChange, availableDenomsMap));
      } else {
        setReturned({});
      }
    }
  }, [expectedChange, isCustomizingChange, availableDenomsMap]);

  const totalReceivedNotes = useMemo(() =>
    Object.values(received).reduce((sum, q) => sum + (Number(q) || 0), 0),
    [received]
  );

  const totalReturnedNotes = useMemo(() =>
    Object.values(returned).reduce((sum, q) => sum + (Number(q) || 0), 0),
    [returned]
  );

  // Quick tender presets
  const quickTenders = useMemo(() => {
    const target = Math.round(targetAmount);
    if (target <= 0) return [];
    const list = [{ label: `Exact ₹${target}`, amount: target, isExact: true }];
    const roundMilestones = [50, 100, 200, 500, 1000, 2000];
    const seen = new Set([target]);

    if (target % 50 !== 0) seen.add(Math.ceil(target / 50) * 50);
    if (target % 100 !== 0) seen.add(Math.ceil(target / 100) * 100);
    if (target % 500 !== 0) seen.add(Math.ceil(target / 500) * 500);

    roundMilestones.forEach((m) => {
      if (m > target && seen.size < 5) seen.add(m);
    });

    Array.from(seen)
      .filter((v) => v > target)
      .sort((a, b) => a - b)
      .slice(0, 4)
      .forEach((amt) => {
        list.push({ label: `₹${amt}`, amount: amt, isExact: false });
      });

    return list;
  }, [targetAmount]);

  const handleApplyTenderAmount = (amt) => {
    const nextRec = decomposeAmount(amt);
    setReceived(nextRec);
    setIsCustomizingChange(false);
    setError(null);
  };

  const handleUpdateReceived = (denom, delta) => {
    setReceived((prev) => {
      const next = { ...prev };
      const current = Number(next[denom]) || 0;
      const nextVal = Math.max(0, current + delta);
      if (nextVal === 0) {
        delete next[denom];
      } else {
        next[denom] = nextVal;
      }
      return next;
    });
    setIsCustomizingChange(false);
    setError(null);
  };

  const handleSetReceivedDirect = (denom, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setReceived((prev) => {
      const next = { ...prev };
      if (num === 0) {
        delete next[denom];
      } else {
        next[denom] = num;
      }
      return next;
    });
    setIsCustomizingChange(false);
    setError(null);
  };

  const handleUpdateReturned = (denom, delta) => {
    const d = Number(denom);
    const maxAvailable = hasDrawerStock ? (Number(availableDenomsMap[d]) || 0) : Infinity;

    setReturned((prev) => {
      const next = { ...prev };
      const current = Number(next[denom]) || 0;
      let nextVal = current + delta;
      if (nextVal > maxAvailable) {
        nextVal = maxAvailable;
      }
      nextVal = Math.max(0, nextVal);
      if (nextVal === 0) {
        delete next[denom];
      } else {
        next[denom] = nextVal;
      }
      return next;
    });
    setError(null);
  };

  const isConfirmDisabled = useMemo(() => {
    if (receivedTotal <= 0) return true;
    if (receivedTotal < targetAmount) return true;
    if (returnedTotal !== expectedChange) return true;
    return false;
  }, [receivedTotal, targetAmount, returnedTotal, expectedChange]);

  const handleConfirm = () => {
    if (receivedTotal <= 0) {
      setError("Please select the denominations received from customer.");
      return;
    }
    if (receivedTotal < targetAmount) {
      setError(`Received cash (₹${receivedTotal}) is less than required (₹${targetAmount})`);
      return;
    }
    if (returnedTotal !== expectedChange) {
      setError(`Returned change (₹${returnedTotal}) does not match expected change (₹${expectedChange})`);
      return;
    }
    setError(null);
    onConfirm({
      received,
      returned,
      receivedTotal,
      returnedTotal,
      netApplied: receivedTotal - returnedTotal,
    });
  };

  if (!isOpen) return null;

  const returnedEntries = Object.entries(returned)
    .filter(([, qty]) => Number(qty) > 0)
    .sort(([a], [b]) => Number(b) - Number(a));

  return (
    <UIModal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      className="max-w-4xl w-full h-[92vh] max-h-[92vh] flex flex-col overflow-hidden"
      showCloseButton={false}
    >
      <div className="p-4 sm:p-5 font-sans flex flex-col h-full max-h-full overflow-hidden select-none">

        {/* ── 1. MODAL HEADER (No top-right cross icon) ─────────────── */}
        <div className="flex items-center justify-between pb-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Banknote className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text leading-tight">Cash Drawer & Tender</h2>
              <p className="text-xs text-text-muted leading-tight">Select cash denominations received and change to return</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Target Bill</span>
            <span className="text-lg font-black font-mono text-primary leading-tight">₹{Number(targetAmount).toFixed(2)}</span>
          </div>
        </div>

        {/* ── 2. POS SUMMARY STRIP ───────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3 shrink-0">
          {/* Target Amount */}
          <div className="p-2.5 bg-surface-alt/60 rounded-xl border border-border">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Target Bill</span>
            <span className="text-lg font-black font-mono text-text block mt-0.5">₹{targetAmount.toFixed(2)}</span>
          </div>

          {/* Received Total */}
          <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider block truncate">
              Received ({totalReceivedNotes} pcs)
            </span>
            <span className="text-lg font-black font-mono text-primary block mt-0.5">₹{receivedTotal.toFixed(2)}</span>
          </div>

          {/* Expected Change */}
          <div className={cn(
            "p-2.5 rounded-xl border transition-all",
            expectedChange > 0
              ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300"
              : "bg-success-soft/30 border-success/30 text-success"
          )}>
            <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80 truncate">
              {expectedChange > 0 ? "Change to Return" : "Change (Exact)"}
            </span>
            <span className="text-lg font-black font-mono block mt-0.5">₹{expectedChange.toFixed(2)}</span>
          </div>

          {/* Drawer Balance */}
          <div className="p-2.5 bg-surface-alt/40 rounded-xl border border-border">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block truncate flex items-center gap-1">
              <Wallet className="size-3 text-text-muted" /> {cashAccountName}
            </span>
            <span className="text-lg font-black font-mono text-text block mt-0.5">₹{Number(availableBalance).toFixed(2)}</span>
          </div>
        </div>

        {/* ── 3. QUICK TENDER PRESETS ────────────────────────────────── */}
        <div className="flex items-center justify-between gap-2 p-2 bg-surface-alt/40 rounded-xl border border-border mb-3 shrink-0 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-text-muted px-1.5 flex items-center gap-1">
              <Zap className="size-3 text-amber-500" /> Quick Tender:
            </span>
            {quickTenders.map((btn) => (
              <button
                key={btn.label}
                type="button"
                onClick={() => handleApplyTenderAmount(btn.amount)}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer shadow-2xs",
                  btn.isExact
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700"
                    : "bg-surface hover:bg-surface-hover text-text border-border"
                )}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setReceived({});
              setReturned({});
              setIsCustomizingChange(false);
              setError(null);
            }}
            className="text-[11px] font-semibold text-text-muted hover:text-error px-2 py-1 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RefreshCw className="size-3" /> Clear All
          </button>
        </div>

        {/* ── 4. ERROR ALERT ────────────────────────────────────────── */}
        {error && (
          <div className="p-2.5 rounded-lg bg-error-soft/60 border border-error/30 text-error text-xs flex items-center gap-2 shrink-0 mb-3">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ── 5. TWO-COLUMN WORKSPACE WITH INDEPENDENT SCROLLBARS ───── */}
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-4 overflow-hidden mb-3">

          {/* LEFT: Customer Cash Received Denomination Tiles (7 cols, Fits without scroll) */}
          <div className="md:col-span-7 flex flex-col h-full min-h-0 bg-surface-alt/30 p-3 rounded-2xl border border-border overflow-hidden">
            <div className="flex items-center justify-between pb-1.5 border-b border-border shrink-0">
              <span className="text-xs font-bold text-text flex items-center gap-1.5">
                <Banknote className="size-3.5 text-primary" /> Notes Given by Customer (Tap card to add +1)
              </span>
              <span className="text-xs font-mono font-bold text-primary">
                Total: ₹{receivedTotal.toFixed(2)}
              </span>
            </div>

            {/* Notes & Coins Area with padding from parent so selected ring never touches parent borders */}
            <div className="flex-1 overflow-y-auto min-h-0 p-1.5 space-y-2">
              {/* Currency Notes Grid (Compact 3x2, fits without scroll) */}
              <div className="grid grid-cols-3 gap-1.5">
                {DENOM_NOTES.map((d) => {
                  const count = Number(received[d]) || 0;
                  const theme = DENOM_THEMES[d];

                  return (
                    <div
                      key={`rec-${d}`}
                      onClick={() => handleUpdateReceived(d, 1)}
                      className={cn(
                        "rounded-lg border px-2 py-1.5 flex flex-col justify-between transition-all select-none cursor-pointer shadow-2xs hover:shadow-xs",
                        count > 0
                          ? `${theme.bg} ${theme.border} ring-1.5 ring-primary/80 shadow-xs`
                          : "bg-surface border-border hover:border-primary/50 hover:bg-surface-hover/60"
                      )}
                    >
                      {/* Top Row: Denomination & Subtotal / Count */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs font-black text-text">₹{d}</span>
                          {count > 0 && (
                            <span className="text-[9.5px] font-mono font-bold text-primary">
                              ₹{d * count}
                            </span>
                          )}
                        </div>
                        {count > 0 ? (
                          <span className="text-[9px] font-bold text-primary bg-primary/10 px-1 py-0.2 rounded">
                            {count} pcs
                          </span>
                        ) : (
                          <span className="text-[8.5px] text-text-muted">+1</span>
                        )}
                      </div>

                      {/* Stepper Controls */}
                      <div
                        className="flex items-center justify-between gap-0.5 mt-1 pt-1 border-t border-border/40"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          disabled={count === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateReceived(d, -1);
                          }}
                          className="size-5 rounded flex items-center justify-center text-text-muted hover:text-error hover:bg-surface-hover disabled:opacity-20 cursor-pointer"
                        >
                          <Minus className="size-2.5" />
                        </button>

                        <input
                          type="number"
                          min="0"
                          value={count || ""}
                          onChange={(e) => handleSetReceivedDirect(d, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="0"
                          className="w-9 h-5 text-center font-mono font-bold text-xs bg-surface border border-border rounded focus:border-primary focus:outline-none"
                        />

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateReceived(d, 1);
                          }}
                          className="size-5 rounded flex items-center justify-center text-text-muted hover:text-success hover:bg-surface-hover cursor-pointer"
                        >
                          <Plus className="size-2.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coins Row */}
              <div className="pt-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted block mb-1 flex items-center gap-1">
                  <Coins className="size-2.5 text-text-muted" /> Coins (₹5, ₹2, ₹1)
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {DENOM_COINS.map((d) => {
                    const count = Number(received[d]) || 0;
                    return (
                      <div
                        key={`rec-${d}`}
                        onClick={() => handleUpdateReceived(d, 1)}
                        className={cn(
                          "rounded-lg border px-2 py-1 flex items-center justify-between transition-all select-none cursor-pointer",
                          count > 0
                            ? "bg-slate-500/10 border-slate-500/30 ring-1.5 ring-primary/80 shadow-xs"
                            : "bg-surface border-border hover:border-primary/50 hover:bg-surface-hover/60"
                        )}
                      >
                        <div>
                          <span className="text-[11px] font-bold text-text flex items-center gap-0.5">
                            ₹{d}
                          </span>
                          {count > 0 && (
                            <span className="text-[8.5px] font-mono text-primary font-bold block">
                              ₹{d * count}
                            </span>
                          )}
                        </div>

                        <div
                          className="flex items-center gap-0.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            disabled={count === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateReceived(d, -1);
                            }}
                            className="size-4.5 rounded flex items-center justify-center text-text-muted hover:text-error disabled:opacity-20 cursor-pointer"
                          >
                            <Minus className="size-2" />
                          </button>
                          <span className="w-4 text-center font-mono font-bold text-[10.5px]">{count}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateReceived(d, 1);
                            }}
                            className="size-4.5 rounded flex items-center justify-center text-text-muted hover:text-success cursor-pointer"
                          >
                            <Plus className="size-2" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Cash Drawer Change Dispenser (5 cols, Scrollable) */}
          <div className="md:col-span-5 flex flex-col justify-between h-full min-h-0 bg-surface-alt/30 p-3.5 rounded-2xl border border-border overflow-hidden">
            <div className="flex flex-col min-h-0 flex-1">
              <div className="flex items-center justify-between pb-1.5 border-b border-border shrink-0">
                <span className="text-xs font-bold text-text flex items-center gap-1.5">
                  <ArrowRight className="size-3.5 text-amber-600" /> Return to Customer
                </span>
                <span className="text-sm font-black font-mono text-amber-700 dark:text-amber-300">
                  ₹{expectedChange.toFixed(2)}
                </span>
              </div>

              {/* Scrollable Dispense Plan */}
              <div className="flex-1 overflow-y-auto min-h-0 space-y-2 my-2 pr-1">
                {expectedChange === 0 ? (
                  <div className="p-4 rounded-xl border border-success/30 bg-success-soft/20 text-center space-y-1 my-auto">
                    <CheckCircle2 className="size-6 text-success mx-auto" />
                    <p className="text-xs font-bold text-success">Exact Cash Received</p>
                    <p className="text-[11px] text-text-muted">No change required. Accept cash and bill.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-text-muted font-medium">
                        Drawer Dispense Plan ({totalReturnedNotes} pcs):
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsCustomizingChange(!isCustomizingChange)}
                        className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <SlidersHorizontal className="size-3" />
                        {isCustomizingChange ? "Auto-Suggest" : "Customize"}
                      </button>
                    </div>

                    {/* Notes Breakup Badges */}
                    <div className="space-y-1.5">
                      {returnedEntries.map(([denom, qty]) => {
                        const d = Number(denom);
                        const avail = availableDenomsMap[d];
                        return (
                          <div
                            key={`dispense-${denom}`}
                            className="flex items-center justify-between p-2 rounded-xl bg-surface border border-border shadow-2xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-text px-1.5 py-0.5 rounded bg-surface-alt border border-border">
                                ₹{d}
                              </span>
                              <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                                × {qty} note{qty !== 1 ? "s" : ""}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="font-mono font-bold text-xs text-text">
                                ₹{d * qty}
                              </span>
                              {avail !== undefined && (
                                <span className="text-[9px] text-text-muted block">
                                  In drawer: {avail}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Manual adjustment section (if customized) */}
                    {isCustomizingChange && (
                      <div className="p-2.5 rounded-xl border border-dashed border-amber-500/40 bg-surface space-y-2 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 block">
                            Adjust Notes Manually (Drawer Capped)
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setReturned(decomposeChangeWithDrawer(expectedChange, availableDenomsMap));
                              setIsCustomizingChange(false);
                            }}
                            className="text-[10px] text-primary hover:underline font-bold cursor-pointer"
                          >
                            Auto-Fix
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-0.5">
                          {ALL_DENOMS.map((d) => {
                            const count = Number(returned[d]) || 0;
                            const avail = Number(availableDenomsMap[d]) || 0;
                            const isOutOfStock = hasDrawerStock && avail === 0;
                            const isMaxed = hasDrawerStock && count >= avail;

                            return (
                              <div
                                key={`adj-${d}`}
                                className={cn(
                                  "flex items-center justify-between p-1.5 border rounded-lg text-xs transition-colors",
                                  isOutOfStock
                                    ? "bg-surface-alt/30 border-border/40 opacity-50"
                                    : "bg-surface-alt/60 border-border"
                                )}
                              >
                                <div>
                                  <span className="font-bold text-[11px] block">₹{d}</span>
                                  <span className="text-[9px] text-text-muted block">
                                    {hasDrawerStock ? `In drawer: ${avail}` : "Uncapped"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    disabled={count === 0}
                                    onClick={() => handleUpdateReturned(d, -1)}
                                    className="size-4.5 rounded flex items-center justify-center text-text-muted hover:text-error disabled:opacity-20 cursor-pointer"
                                  >
                                    <Minus className="size-2.5" />
                                  </button>
                                  <span className="font-mono font-bold w-4 text-center text-[11px]">{count}</span>
                                  <button
                                    type="button"
                                    disabled={isMaxed || isOutOfStock}
                                    onClick={() => handleUpdateReturned(d, 1)}
                                    className="size-4.5 rounded flex items-center justify-center text-text-muted hover:text-success disabled:opacity-20 cursor-pointer"
                                    title={
                                      isOutOfStock
                                        ? `No ₹${d} notes in cash drawer`
                                        : isMaxed
                                        ? `Maximum ${avail} available in cash drawer`
                                        : `Add ₹${d}`
                                    }
                                  >
                                    <Plus className="size-2.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Net Settlement Strip */}
            <div className="pt-2 border-t border-border flex items-center justify-between text-xs shrink-0">
              <span className="text-text-muted font-medium">Net Kept in Drawer:</span>
              <span className="text-sm font-black font-mono text-primary">₹{netApplied.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* ── 6. ACTION FOOTER (Single Cancel on Left, Centered Message in Middle, Confirm on Right) ─────────── */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-border shrink-0">
          {/* Left: Single Dismiss Button (Removed redundant Close button) */}
          <UIButton variant="outline" size="sm" onClick={onClose} className="px-4 shrink-0">
            Cancel
          </UIButton>

          {/* Middle: Centered Dynamic Status / Validation Message */}
          <div className="flex-1 flex items-center justify-center min-w-0 px-2">
            {receivedTotal <= 0 ? (
              <span className="text-xs text-text-muted italic truncate">
                Select denominations received from customer
              </span>
            ) : receivedTotal < targetAmount ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-medium max-w-full truncate">
                <AlertCircle className="size-3.5 shrink-0 text-amber-600" />
                <span className="truncate">
                  Tender ₹{receivedTotal.toFixed(2)} — short by ₹{(Number(targetAmount) - receivedTotal).toFixed(2)}
                </span>
              </div>
            ) : returnedTotal !== expectedChange ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error-soft border border-error/30 text-error text-xs font-medium max-w-full">
                <AlertCircle className="size-3.5 shrink-0" />
                <span className="truncate">
                  {hasDrawerStock && expectedChange > 0 && returnedTotal < expectedChange
                    ? `Drawer lacks change: selected ₹${returnedTotal.toFixed(2)} of ₹${expectedChange.toFixed(2)}`
                    : `Change mismatch: ₹${returnedTotal.toFixed(2)} of ₹${expectedChange.toFixed(2)}`}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setReturned(decomposeChangeWithDrawer(expectedChange, availableDenomsMap));
                    setIsCustomizingChange(false);
                  }}
                  className="text-xs font-bold text-primary underline cursor-pointer shrink-0 hover:text-primary-hover ml-1"
                >
                  Auto-Fix
                </button>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-soft/80 border border-success/30 text-success text-xs font-medium max-w-full truncate">
                <CheckCircle2 className="size-3.5 shrink-0 text-success" />
                <span className="font-semibold truncate">
                  Ready to finalize cash tender: Net ₹{netApplied.toFixed(2)}
                </span>
                <span className="text-[11px] font-bold opacity-80 shrink-0">✓ Balanced</span>
              </div>
            )}
          </div>

          {/* Right: Confirm Cash Action Button */}
          <UIButton
            variant="success"
            size="sm"
            onClick={handleConfirm}
            className="px-6 font-bold shrink-0"
            disabled={isConfirmDisabled}
            startIcon={<CheckCircle2 className="size-4" />}
          >
            Confirm Cash (₹{netApplied.toFixed(2)})
          </UIButton>
        </div>

      </div>
    </UIModal>
  );
}

export default CashBreakdownModal;
