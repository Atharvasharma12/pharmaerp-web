// src/features/sales/components/CashBreakdownModal.jsx
import { useState, useEffect, useMemo } from "react";
import { UIModal, UIButton } from "@/components/ui";
import {
  Plus,
  Minus,
  Check,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Banknote,
  Coins,
  ArrowRight,
  SlidersHorizontal,
  Wallet,
  Zap,
  RotateCcw
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
 * Generate clean, intelligent tender amount suggestions without decomposing note counts.
 * e.g., for bill ₹3,150: Exact ₹3,150, ₹3,200, ₹3,500, ₹4,000.
 */
export const generateSuggestedTenders = (targetAmount) => {
  const target = Math.round(Number(targetAmount) || 0);
  if (target <= 0) return [];

  const list = [{ label: `Exact ₹${target.toLocaleString("en-IN")}`, amount: target, isExact: true }];
  const seen = new Set([target]);
  const candidates = [];

  if (target < 100) {
    [10, 20, 50, 100].forEach((step) => {
      const val = Math.ceil(target / step) * step;
      if (val > target) candidates.push(val);
    });
  } else if (target < 500) {
    [50, 100, 200, 500].forEach((step) => {
      const val = Math.ceil(target / step) * step;
      if (val > target) candidates.push(val);
    });
  } else {
    // For amounts >= 500 (e.g. ₹3,150)
    // Next 50
    const next50 = Math.ceil(target / 50) * 50;
    if (next50 > target) candidates.push(next50);

    // Next 100 (e.g. ₹3,200 for ₹3,150)
    const next100 = Math.ceil(target / 100) * 100;
    if (next100 > target) candidates.push(next100);
    else candidates.push(target + 100);

    // Next 500 (e.g. ₹3,500 for ₹3,150)
    const next500 = Math.ceil(target / 500) * 500;
    if (next500 > target) candidates.push(next500);
    else candidates.push(target + 500);

    // Next 1000 (e.g. ₹4,000 for ₹3,150)
    const next1000 = Math.ceil(target / 1000) * 1000;
    if (next1000 > target) candidates.push(next1000);
    else candidates.push(target + 1000);

    candidates.push(Math.ceil((target + 500) / 500) * 500);
    candidates.push(Math.ceil((target + 1000) / 1000) * 1000);
  }

  // Common high note milestones
  [100, 200, 500, 1000, 2000, 5000].forEach((m) => {
    if (m > target) candidates.push(m);
  });

  candidates.sort((a, b) => a - b);
  for (const val of candidates) {
    if (val > target && !seen.has(val)) {
      seen.add(val);
      list.push({
        label: `₹${val.toLocaleString("en-IN")}`,
        amount: val,
        isExact: false,
      });
      if (list.length >= 5) break; // Exact + up to 4 smart round suggestions
    }
  }

  return list;
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
  mode = "sale", // "sale" | "cancel" | "refund"
}) {
  const isCancelMode = mode === "cancel" || mode === "refund";
  const [received, setReceived] = useState({});
  const [returned, setReturned] = useState({});
  const [selectedTenderAmount, setSelectedTenderAmount] = useState(0);
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
      } else {
        // Do NOT pre-fill denominations. Keep empty for cashier to count and enter.
        setReceived({});
        setReturned({});
      }
      setSelectedTenderAmount(Math.round(Number(targetAmount) || 0));
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

  // Auto-calculate optimal change denominations for SALE mode only:
  // - In sale mode: change is returned from cash drawer, so strictly constrained by drawer stock
  // - In cancel mode: customer gives change back, so NEVER auto-select or wipe denominations (customer gives whatever they have)
  useEffect(() => {
    if (isCancelMode) {
      // In cancel mode: NEVER auto-calculate, auto-select, or auto-wipe denominations.
      // Staff selects exact denominations customer hands them.
      return;
    }
    if (!isCustomizingChange) {
      if (expectedChange > 0) {
        setReturned(decomposeChangeWithDrawer(expectedChange, availableDenomsMap));
      } else {
        setReturned({});
      }
    }
  }, [expectedChange, isCustomizingChange, availableDenomsMap, isCancelMode]);

  const totalReceivedNotes = useMemo(() =>
    Object.values(received).reduce((sum, q) => sum + (Number(q) || 0), 0),
    [received]
  );

  const totalReturnedNotes = useMemo(() =>
    Object.values(returned).reduce((sum, q) => sum + (Number(q) || 0), 0),
    [returned]
  );

  // Quick tender suggestions (intelligent auto suggestions without prefilling note quantities)
  const quickTenders = useMemo(() => {
    const target = Math.round(Number(targetAmount) || 0);
    if (target <= 0) return [];
    return generateSuggestedTenders(target);
  }, [targetAmount]);

  const handleApplyTenderAmount = (amt) => {
    setSelectedTenderAmount(amt);
    // User requirement: ONLY suggest the auto amount, do NOT populate denomination quantities.
    setIsCustomizingChange(false);
    setError(null);
  };

  const handleUpdateReceived = (denom, delta) => {
    const d = Number(denom);
    const maxAvailable = (isCancelMode && hasDrawerStock)
      ? (Number(availableDenomsMap[d]) || 0)
      : Infinity;

    setReceived((prev) => {
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
    setIsCustomizingChange(false);
    setError(null);
  };

  const handleSetReceivedDirect = (denom, val) => {
    const d = Number(denom);
    const maxAvailable = (isCancelMode && hasDrawerStock)
      ? (Number(availableDenomsMap[d]) || 0)
      : Infinity;
    let num = Math.max(0, parseInt(val, 10) || 0);
    if (num > maxAvailable) {
      num = maxAvailable;
    }
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
    // In sale mode, change comes from drawer (capped). In cancel mode, change comes from customer (uncapped).
    const maxAvailable = (!isCancelMode && hasDrawerStock)
      ? (Number(availableDenomsMap[d]) || 0)
      : Infinity;

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
      setError(
        isCancelMode
          ? "Please select the refund denominations to dispense from cash drawer."
          : "Please select the denominations received from customer."
      );
      return;
    }
    if (receivedTotal < targetAmount) {
      setError(
        isCancelMode
          ? `Cash dispensed from drawer (₹${receivedTotal}) is less than refund target (₹${targetAmount})`
          : `Received cash (₹${receivedTotal}) is less than required (₹${targetAmount})`
      );
      return;
    }
    if (returnedTotal !== expectedChange) {
      setError(
        isCancelMode
          ? `Customer change (₹${returnedTotal}) does not match expected change (₹${expectedChange})`
          : `Returned change (₹${returnedTotal}) does not match expected change (₹${expectedChange})`
      );
      return;
    }
    setError(null);
    onConfirm({
      received,
      returned,
      receivedTotal,
      returnedTotal,
      netApplied: receivedTotal - returnedTotal,
      // Descriptive aliases for cancel / refund flows
      dispensed: received,
      customerChange: returned,
      dispensedTotal: receivedTotal,
      customerChangeTotal: returnedTotal,
      netRefund: receivedTotal - returnedTotal,
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
            <div className={cn(
              "p-2 rounded-xl",
              isCancelMode ? "bg-amber-500/10 text-amber-700 dark:text-amber-400" : "bg-primary/10 text-primary"
            )}>
              {isCancelMode ? <RotateCcw className="size-5" /> : <Banknote className="size-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-text leading-tight">
                {isCancelMode ? "Cash Drawer · Cancel Invoice Refund" : "Cash Drawer & Tender"}
              </h2>
              <p className="text-xs text-text-muted leading-tight">
                {isCancelMode
                  ? "Dispense refund cash from drawer and record any change received from customer"
                  : "Select cash denominations received and change to return"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
              {isCancelMode ? "Refund Due" : "Target Bill"}
            </span>
            <span className={cn(
              "text-lg font-black font-mono leading-tight",
              isCancelMode ? "text-amber-700 dark:text-amber-400" : "text-primary"
            )}>
              ₹{Number(targetAmount).toFixed(2)}
            </span>
          </div>
        </div>

        {/* ── 2. POS SUMMARY STRIP ───────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3 shrink-0">
          {/* Target Amount */}
          <div className="p-2.5 bg-surface-alt/60 rounded-xl border border-border">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
              {isCancelMode ? "Refund Target" : "Target Bill"}
            </span>
            <span className="text-lg font-black font-mono text-text block mt-0.5">₹{targetAmount.toFixed(2)}</span>
          </div>

          {/* Received / Dispensed Total */}
          <div className={cn(
            "p-2.5 rounded-xl border",
            isCancelMode ? "bg-amber-500/10 border-amber-500/30" : "bg-primary/10 border-primary/20"
          )}>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-wider block truncate",
              isCancelMode ? "text-amber-700 dark:text-amber-300" : "text-primary"
            )}>
              {isCancelMode ? `Dispensed (${totalReceivedNotes} pcs)` : `Received (${totalReceivedNotes} pcs)`}
            </span>
            <span className={cn(
              "text-lg font-black font-mono block mt-0.5",
              isCancelMode ? "text-amber-700 dark:text-amber-300" : "text-primary"
            )}>
              ₹{receivedTotal.toFixed(2)}
            </span>
          </div>

          {/* Expected Change */}
          <div className={cn(
            "p-2.5 rounded-xl border transition-all",
            receivedTotal > 0
              ? (expectedChange > 0
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300"
                  : "bg-success-soft/30 border-success/30 text-success")
              : (selectedTenderAmount > targetAmount
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300"
                  : "bg-surface-alt/60 border-border text-text-muted")
          )}>
            <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80 truncate">
              {isCancelMode
                ? (receivedTotal > 0
                    ? (expectedChange > 0 ? "Change from Customer" : "Exact Refund")
                    : (selectedTenderAmount > targetAmount ? "Anticipated Customer Change" : "Change from Customer"))
                : (receivedTotal > 0
                    ? (expectedChange > 0 ? "Change to Return" : "Change (Exact)")
                    : (selectedTenderAmount > targetAmount ? "Anticipated Change" : "Change to Return"))}
            </span>
            <span className="text-lg font-black font-mono block mt-0.5">
              ₹{receivedTotal > 0
                ? expectedChange.toFixed(2)
                : Math.max(0, selectedTenderAmount - targetAmount).toFixed(2)}
            </span>
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
              <Zap className="size-3 text-amber-500" /> {isCancelMode ? "Suggest Refund:" : "Suggest Tender:"}
            </span>
            {quickTenders.map((btn) => {
              const isSelected = btn.amount === selectedTenderAmount;
              return (
                <button
                  key={btn.label}
                  type="button"
                  onClick={() => handleApplyTenderAmount(btn.amount)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer shadow-2xs flex items-center gap-1.5",
                    isSelected
                      ? (isCancelMode
                          ? "bg-amber-600 text-white border-amber-600 ring-2 ring-amber-500/40 shadow-xs"
                          : "bg-primary text-primary-foreground border-primary ring-2 ring-primary/40 shadow-xs")
                      : btn.isExact
                      ? "bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-700 dark:text-emerald-300 border-emerald-500/40"
                      : "bg-surface hover:bg-surface-hover text-text border-border"
                  )}
                  title={
                    btn.isExact
                      ? (isCancelMode ? "Suggest exact refund amount from drawer" : "Suggest exact bill amount")
                      : `Suggest ₹${btn.amount}`
                  }
                >
                  <span>{btn.label}</span>
                  {isSelected && <Check className="size-3 stroke-[2.5]" />}
                </button>
              );
            })}
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
            <RefreshCw className="size-3" /> Clear Notes
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

          {/* LEFT: Customer Cash Received or Drawer Refund Dispenser (6 cols in cancel, 7 cols in sale) */}
          <div className={cn(
            "flex flex-col h-full min-h-0 bg-surface-alt/30 p-3 rounded-2xl border border-border overflow-hidden",
            isCancelMode ? "md:col-span-6" : "md:col-span-7"
          )}>
            <div className="flex items-center justify-between pb-1.5 border-b border-border shrink-0">
              <div className="min-w-0">
                <span className="text-xs font-bold text-text flex items-center gap-1.5">
                  <Banknote className={cn("size-3.5", isCancelMode ? "text-amber-600 dark:text-amber-400" : "text-primary")} />
                  {isCancelMode ? "Cash Dispensed from Drawer (Refund to Customer)" : "Notes Given by Customer"}
                </span>
                <span className="text-[10px] text-text-muted block">
                  {isCancelMode
                    ? (receivedTotal === 0
                        ? `Suggested refund: ₹${selectedTenderAmount.toLocaleString("en-IN")}. Tap cards below to select notes from drawer.`
                        : "Notes dispensed from cash drawer to customer (drawer-capped).")
                    : (receivedTotal === 0
                        ? `Suggested tender: ₹${selectedTenderAmount.toLocaleString("en-IN")}. Tap cards below to add physical notes.`
                        : "Tap cards to add +1, or type quantity directly.")}
                </span>
              </div>
              <span className={cn("text-xs font-mono font-bold shrink-0", isCancelMode ? "text-amber-700 dark:text-amber-400" : "text-primary")}>
                {isCancelMode ? "Dispensed" : "Total"}: ₹{receivedTotal.toFixed(2)}
              </span>
            </div>

            {/* Notes & Coins Area with padding from parent so selected ring never touches parent borders */}
            <div className="flex-1 overflow-y-auto min-h-0 p-1.5 space-y-2">
              {/* Currency Notes Grid (Compact 3x2, fits without scroll) */}
              <div className="grid grid-cols-3 gap-1.5">
                {DENOM_NOTES.map((d) => {
                  const count = Number(received[d]) || 0;
                  const theme = DENOM_THEMES[d];
                  const avail = hasDrawerStock ? (Number(availableDenomsMap[d]) || 0) : Infinity;
                  const isOutOfStock = isCancelMode && hasDrawerStock && avail === 0;
                  const isMaxed = isCancelMode && hasDrawerStock && count >= avail;

                  return (
                    <div
                      key={`rec-${d}`}
                      onClick={() => !isMaxed && !isOutOfStock && handleUpdateReceived(d, 1)}
                      className={cn(
                        "rounded-lg border px-2 py-1.5 flex flex-col justify-between transition-all select-none shadow-2xs hover:shadow-xs",
                        isOutOfStock
                          ? "bg-surface-alt/30 border-border/40 opacity-50 cursor-not-allowed"
                          : "cursor-pointer",
                        count > 0
                          ? `${theme.bg} ${theme.border} ring-1.5 ring-primary/80 shadow-xs`
                          : (!isOutOfStock ? "bg-surface border-border hover:border-primary/50 hover:bg-surface-hover/60" : "")
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
                        ) : isCancelMode && hasDrawerStock ? (
                          <span className={cn("text-[8.5px] font-medium", isOutOfStock ? "text-error font-bold" : "text-text-muted")}>
                            {isOutOfStock ? "0 in drawer" : `${avail} left`}
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
                          max={isCancelMode && hasDrawerStock ? avail : undefined}
                          value={count || ""}
                          onChange={(e) => handleSetReceivedDirect(d, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="0"
                          disabled={isOutOfStock}
                          className="w-9 h-5 text-center font-mono font-bold text-xs bg-surface border border-border rounded focus:border-primary focus:outline-none disabled:opacity-50"
                        />

                        <button
                          type="button"
                          disabled={isMaxed || isOutOfStock}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateReceived(d, 1);
                          }}
                          className="size-5 rounded flex items-center justify-center text-text-muted hover:text-success hover:bg-surface-hover disabled:opacity-20 cursor-pointer"
                          title={
                            isOutOfStock
                              ? `No ₹${d} notes in cash drawer`
                              : isMaxed
                              ? `Maximum ${avail} available in drawer`
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

              {/* Coins Row */}
              <div className="pt-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted block mb-1 flex items-center gap-1">
                  <Coins className="size-2.5 text-text-muted" /> Coins (₹5, ₹2, ₹1)
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {DENOM_COINS.map((d) => {
                    const count = Number(received[d]) || 0;
                    const avail = hasDrawerStock ? (Number(availableDenomsMap[d]) || 0) : Infinity;
                    const isOutOfStock = isCancelMode && hasDrawerStock && avail === 0;
                    const isMaxed = isCancelMode && hasDrawerStock && count >= avail;

                    return (
                      <div
                        key={`rec-${d}`}
                        onClick={() => !isMaxed && !isOutOfStock && handleUpdateReceived(d, 1)}
                        className={cn(
                          "rounded-lg border px-2 py-1 flex items-center justify-between transition-all select-none shadow-2xs hover:shadow-xs",
                          isOutOfStock
                            ? "bg-surface-alt/30 border-border/40 opacity-50 cursor-not-allowed"
                            : "cursor-pointer",
                          count > 0
                            ? "bg-slate-500/10 border-slate-500/30 ring-1.5 ring-primary/80 shadow-xs"
                            : (!isOutOfStock ? "bg-surface border-border hover:border-primary/50 hover:bg-surface-hover/60" : "")
                        )}
                      >
                        <div>
                          <span className="text-[11px] font-bold text-text flex items-center gap-0.5">
                            ₹{d}
                          </span>
                          {count > 0 ? (
                            <span className="text-[8.5px] font-mono text-primary font-bold block">
                              ₹{d * count}
                            </span>
                          ) : isCancelMode && hasDrawerStock && (
                            <span className="text-[8px] text-text-muted block">
                              {isOutOfStock ? "0 in drawer" : `${avail} left`}
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
                            disabled={isMaxed || isOutOfStock}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateReceived(d, 1);
                            }}
                            className="size-4.5 rounded flex items-center justify-center text-text-muted hover:text-success disabled:opacity-20 cursor-pointer"
                            title={isOutOfStock ? `No ₹${d} coins in drawer` : isMaxed ? `Maximum ${avail} available` : `Add ₹${d}`}
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

          {/* RIGHT: Cash Drawer Change Dispenser / Customer Change Denomination Drawer (6 cols in cancel, 5 cols in sale) */}
          <div className={cn(
            "flex flex-col justify-between h-full min-h-0 bg-surface-alt/30 p-3 rounded-2xl border border-border overflow-hidden",
            isCancelMode ? "md:col-span-6" : "md:col-span-5"
          )}>
            <div className="flex flex-col min-h-0 flex-1">
              {/* Compact Header: Title + Inline Status Pill + Compact Due/Selected Amounts */}
              <div className="flex items-center justify-between pb-1.5 border-b border-border shrink-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  {isCancelMode ? (
                    <RotateCcw className="size-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <ArrowRight className="size-3.5 text-amber-600 shrink-0" />
                  )}
                  <span className="text-xs font-bold text-text truncate">
                    {isCancelMode ? "Change Received from Customer" : "Return to Customer"}
                  </span>
                  {isCancelMode && (
                    receivedTotal === 0 ? (
                      <span className="text-[9.5px] text-text-muted bg-surface-alt px-1.5 py-0.2 rounded font-medium shrink-0">
                        Dispense left first
                      </span>
                    ) : expectedChange === 0 && returnedTotal === 0 ? (
                      <span className="text-[9.5px] text-success bg-success-soft/50 border border-success/30 px-1.5 py-0.2 rounded font-bold shrink-0 inline-flex items-center gap-0.5">
                        <CheckCircle2 className="size-2.5" /> Exact (₹0)
                      </span>
                    ) : returnedTotal === expectedChange ? (
                      <span className="text-[9.5px] text-success bg-success-soft/50 border border-success/30 px-1.5 py-0.2 rounded font-bold shrink-0 inline-flex items-center gap-0.5">
                        <CheckCircle2 className="size-2.5" /> Balanced
                      </span>
                    ) : returnedTotal < expectedChange ? (
                      <span className="text-[9.5px] text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold shrink-0">
                        Short ₹{(expectedChange - returnedTotal).toFixed(0)}
                      </span>
                    ) : (
                      <span className="text-[9.5px] text-error bg-error-soft border border-error/30 px-1.5 py-0.2 rounded font-bold shrink-0">
                        Over ₹{(returnedTotal - expectedChange).toFixed(0)}
                      </span>
                    )
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isCancelMode ? (
                    <div className="flex items-center gap-1.5 text-right text-xs">
                      <span className="text-[10px] text-text-muted">
                        Due: <strong className="font-mono text-emerald-700 dark:text-emerald-300 font-bold">₹{expectedChange.toFixed(2)}</strong>
                      </span>
                      <span className="text-text-muted/40 text-[10px]">|</span>
                      <span className="text-[10px] text-text-muted">
                        Selected: <strong className={cn("font-mono font-bold", returnedTotal === expectedChange && expectedChange > 0 ? "text-success" : "text-text")}>₹{returnedTotal.toFixed(2)}</strong>
                      </span>
                      {returnedTotal > 0 && (
                        <button
                          type="button"
                          onClick={() => setReturned({})}
                          className="text-[9.5px] font-bold text-text-muted hover:text-error px-1 py-0.2 rounded border border-border hover:border-error/40 bg-surface cursor-pointer ml-1"
                          title="Clear customer change"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm font-black font-mono text-amber-700 dark:text-amber-300">
                      ₹{receivedTotal > 0
                        ? expectedChange.toFixed(2)
                        : Math.max(0, selectedTenderAmount - targetAmount).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Column Content */}
              {isCancelMode ? (
                /* ── CANCEL / REFUND MODE: Full-Space Interactive Customer Change Grid (Parity with Left Drawer) ── */
                <div className="flex-1 overflow-y-auto min-h-0 p-1.5 space-y-2">
                  {/* Currency Notes Grid (Compact 3x2, fits without scroll) */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {DENOM_NOTES.map((d) => {
                      const count = Number(returned[d]) || 0;
                      const theme = DENOM_THEMES[d];

                      return (
                        <div
                          key={`cust-change-note-${d}`}
                          onClick={() => handleUpdateReturned(d, 1)}
                          className={cn(
                            "rounded-lg border px-2 py-1.5 flex flex-col justify-between transition-all select-none cursor-pointer shadow-2xs hover:shadow-xs",
                            count > 0
                              ? "bg-emerald-500/10 border-emerald-500/40 ring-1.5 ring-emerald-500/80 shadow-xs"
                              : "bg-surface border-border hover:border-emerald-500/50 hover:bg-surface-hover/60"
                          )}
                          title={`Click to add 1 ₹${d} note from customer`}
                        >
                          {/* Top Row: Denomination & Subtotal / Count */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-1">
                              <span className="text-xs font-black text-text">₹{d}</span>
                              {count > 0 && (
                                <span className="text-[9.5px] font-mono font-bold text-emerald-700 dark:text-emerald-300">
                                  ₹{d * count}
                                </span>
                              )}
                            </div>
                            {count > 0 ? (
                              <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 px-1 py-0.2 rounded">
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
                                handleUpdateReturned(d, -1);
                              }}
                              className="size-5 rounded flex items-center justify-center text-text-muted hover:text-error hover:bg-surface-hover disabled:opacity-20 cursor-pointer"
                              title={`Subtract 1 ₹${d}`}
                            >
                              <Minus className="size-2.5" />
                            </button>

                            <input
                              type="number"
                              min="0"
                              value={count || ""}
                              onChange={(e) => {
                                const num = Math.max(0, parseInt(e.target.value, 10) || 0);
                                setReturned((prev) => {
                                  const next = { ...prev };
                                  if (num === 0) delete next[d];
                                  else next[d] = num;
                                  return next;
                                });
                              }}
                              onClick={(e) => e.stopPropagation()}
                              placeholder="0"
                              className="w-9 h-5 text-center font-mono font-bold text-xs bg-surface border border-border rounded focus:border-emerald-500 focus:outline-none"
                            />

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateReturned(d, 1);
                              }}
                              className="size-5 rounded flex items-center justify-center text-text-muted hover:text-emerald-600 hover:bg-surface-hover cursor-pointer"
                              title={`Add 1 ₹${d}`}
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
                      <Coins className="size-2.5 text-emerald-600" /> Coins (₹5, ₹2, ₹1)
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {DENOM_COINS.map((d) => {
                        const count = Number(returned[d]) || 0;

                        return (
                          <div
                            key={`cust-change-coin-${d}`}
                            onClick={() => handleUpdateReturned(d, 1)}
                            className={cn(
                              "rounded-lg border px-2 py-1 flex items-center justify-between transition-all select-none cursor-pointer shadow-2xs hover:shadow-xs",
                              count > 0
                                ? "bg-emerald-500/10 border-emerald-500/40 ring-1.5 ring-emerald-500/80 shadow-xs"
                                : "bg-surface border-border hover:border-emerald-500/50 hover:bg-surface-hover/60"
                            )}
                            title={`Click to add 1 ₹${d} coin from customer`}
                          >
                            <div>
                              <span className="text-[11px] font-bold text-text flex items-center gap-0.5">
                                ₹{d}
                              </span>
                              {count > 0 && (
                                <span className="text-[8.5px] font-mono text-emerald-700 dark:text-emerald-300 font-bold block">
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
                                  handleUpdateReturned(d, -1);
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
                                  handleUpdateReturned(d, 1);
                                }}
                                className="size-4.5 rounded flex items-center justify-center text-text-muted hover:text-emerald-600 cursor-pointer"
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
              ) : (
                <div className="flex-1 overflow-y-auto min-h-0 space-y-2 my-2 pr-1">
                  {/* ── SALE MODE: Standard Drawer Dispense Plan with Auto-Suggest ── */}
                  {receivedTotal === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-border bg-surface-alt/40 text-center space-y-2 my-auto">
                      <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                        <Banknote className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text">
                          {selectedTenderAmount > targetAmount
                            ? `Anticipated Change: ₹${(selectedTenderAmount - targetAmount).toFixed(2)}`
                            : "Exact Tender Selected (₹0.00 Change)"}
                        </p>
                        <p className="text-[11px] text-text-muted mt-0.5">
                          {selectedTenderAmount > targetAmount
                            ? `Customer suggested to pay ₹${selectedTenderAmount.toLocaleString("en-IN")}. Count & enter physical notes on left.`
                            : "Please count and enter physical notes received from customer on the left."}
                        </p>
                      </div>
                      {selectedTenderAmount > targetAmount && (
                        <div className="p-2 rounded-lg bg-surface border border-border text-[11px] text-left space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                            Anticipated Drawer Return Plan:
                          </span>
                          {Object.entries(decomposeChangeWithDrawer(selectedTenderAmount - targetAmount, availableDenomsMap))
                            .filter(([, q]) => Number(q) > 0)
                            .map(([d, q]) => (
                              <div key={`anticipate-${d}`} className="flex justify-between text-xs font-mono font-bold text-amber-700 dark:text-amber-300">
                                <span>₹{d} note</span>
                                <span>× {q} note{Number(q) > 1 ? "s" : ""}</span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ) : expectedChange === 0 ? (
                    <div className="p-4 rounded-xl border border-success/30 bg-success-soft/20 text-center space-y-1 my-auto">
                      <CheckCircle2 className="size-6 text-success mx-auto" />
                      <p className="text-xs font-bold text-success">Exact Cash Tendered</p>
                      <p className="text-[11px] text-text-muted">No change required. All notes counted and balanced.</p>
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
              )}
            </div>

            {/* Net Settlement Strip */}
            <div className="pt-2 border-t border-border flex items-center justify-between text-xs shrink-0">
              <span className="text-text-muted font-medium">
                {isCancelMode ? "Net Deducted from Drawer:" : "Net Kept in Drawer:"}
              </span>
              <span className={cn(
                "text-sm font-black font-mono",
                isCancelMode ? "text-amber-700 dark:text-amber-400" : "text-primary"
              )}>
                ₹{netApplied.toFixed(2)}
              </span>
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
                {isCancelMode
                  ? "Select refund denominations to dispense from cash drawer"
                  : "Select denominations received from customer"}
              </span>
            ) : receivedTotal < targetAmount ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-medium max-w-full truncate">
                <AlertCircle className="size-3.5 shrink-0 text-amber-600" />
                <span className="truncate">
                  {isCancelMode
                    ? `Dispensed ₹${receivedTotal.toFixed(2)} — short by ₹${(Number(targetAmount) - receivedTotal).toFixed(2)}`
                    : `Tender ₹${receivedTotal.toFixed(2)} — short by ₹${(Number(targetAmount) - receivedTotal).toFixed(2)}`}
                </span>
              </div>
            ) : returnedTotal !== expectedChange ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error-soft border border-error/30 text-error text-xs font-medium max-w-full">
                <AlertCircle className="size-3.5 shrink-0" />
                <span className="truncate">
                  {isCancelMode
                    ? `Customer change mismatch: selected ₹${returnedTotal.toFixed(2)} of ₹${expectedChange.toFixed(2)}`
                    : (hasDrawerStock && expectedChange > 0 && returnedTotal < expectedChange
                        ? `Drawer lacks change: selected ₹${returnedTotal.toFixed(2)} of ₹${expectedChange.toFixed(2)}`
                        : `Change mismatch: ₹${returnedTotal.toFixed(2)} of ₹${expectedChange.toFixed(2)}`)}
                </span>
                {!isCancelMode && (
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
                )}
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-soft/80 border border-success/30 text-success text-xs font-medium max-w-full truncate">
                <CheckCircle2 className="size-3.5 shrink-0 text-success" />
                <span className="font-semibold truncate">
                  {isCancelMode
                    ? `Ready to finalize refund: ₹${netApplied.toFixed(2)} will be deducted from cash drawer`
                    : `Ready to finalize cash tender: Net ₹${netApplied.toFixed(2)}`}
                </span>
                <span className="text-[11px] font-bold opacity-80 shrink-0">✓ Balanced</span>
              </div>
            )}
          </div>

          {/* Right: Confirm Cash Action Button */}
          <UIButton
            variant={isCancelMode ? "destructive" : "success"}
            size="sm"
            onClick={handleConfirm}
            className="px-6 font-bold shrink-0"
            disabled={isConfirmDisabled}
            startIcon={<CheckCircle2 className="size-4" />}
          >
            {isCancelMode
              ? `Confirm Refund & Deduct (₹${netApplied.toFixed(2)})`
              : `Confirm Cash (₹${netApplied.toFixed(2)})`}
          </UIButton>
        </div>

      </div>
    </UIModal>
  );
}

export default CashBreakdownModal;
