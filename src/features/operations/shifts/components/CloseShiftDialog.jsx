// src/features/operations/shifts/components/CloseShiftDialog.jsx

import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalBody,
  UIModalFooter,
  UIButton,
  UIAlert,
  UIBadge,
} from "@/components/ui";
import { updateShiftStatus, listShifts } from "../store/shiftThunk";
import { API_STATUS } from "@/constants";
import { apiClient } from "@/services";
import { useBranchCash } from "@/features/finance/treasury/cash-management/branch-cash/hooks/useBranchCash";
import {
  FileText,
  QrCode,
  Banknote,
  ArrowLeftRight,
  Snowflake,
  HandCoins,
  Zap,
  Pencil,
  LockKeyhole,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { ShiftFundTransferPanel } from "./ShiftFundTransferPanel";
import { PostShiftCloseDialog } from "./PostShiftCloseDialog";

const DENOMINATIONS = [500, 200, 100, 50, 20, 10, 5, 2, 1];

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
  const [isEditingCounts, setIsEditingCounts] = useState(false);

  const [countedCounts, setCountedCounts] = useState(
    DENOMINATIONS.reduce((acc, note) => ({ ...acc, [note]: "" }), {})
  );

  const [frozenCounts, setFrozenCounts] = useState(
    DENOMINATIONS.reduce((acc, note) => ({ ...acc, [note]: "" }), {})
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

  useEffect(() => {
    if (isOpen && runningDenominations?.length > 0) {
      const initial = {};
      DENOMINATIONS.forEach((d) => {
        const found = runningDenominations.find(
          (x) => Number(x.denomination) === d
        );
        initial[d] = found && found.quantity > 0 ? found.quantity : "";
      });
      setCountedCounts(initial);
    }
    if (!isOpen) {
      setCountedCounts(
        DENOMINATIONS.reduce((acc, n) => ({ ...acc, [n]: "" }), {})
      );
      setFrozenCounts(
        DENOMINATIONS.reduce((acc, n) => ({ ...acc, [n]: "" }), {})
      );
      setNote("");
      setLocalError(null);
      setIsEditingCounts(false);
    }
  }, [isOpen, runningDenominations]);

  useEffect(() => {
    if (isOpen && shift?._id) {
      setLoading(true);
      apiClient
        .get(`/operations/shifts/${shift._id}/summary`)
        .then((res) => setSummary(res.data.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setSummary(null);
    }
  }, [isOpen, shift]);

  const totalCounted = useMemo(() => {
    return DENOMINATIONS.reduce((sum, n) => {
      return sum + (Number(countedCounts[n]) || 0) * n;
    }, 0);
  }, [countedCounts]);

  const totalFrozen = useMemo(() => {
    return DENOMINATIONS.reduce((sum, n) => {
      return sum + (Number(frozenCounts[n]) || 0) * n;
    }, 0);
  }, [frozenCounts]);

  const runningCounts = useMemo(() => {
    const result = {};
    DENOMINATIONS.forEach((n) => {
      const counted = Number(countedCounts[n]) || 0;
      const frozen = Number(frozenCounts[n]) || 0;
      result[n] = Math.max(0, counted - frozen);
    });
    return result;
  }, [countedCounts, frozenCounts]);

  const totalRunning = useMemo(() => {
    return DENOMINATIONS.reduce((sum, n) => sum + runningCounts[n] * n, 0);
  }, [runningCounts]);

  const isDenominationMismatch = useMemo(() => {
    if (!runningDenominations || runningDenominations.length === 0) return false;
    let mismatch = false;
    DENOMINATIONS.forEach((d) => {
      const found = runningDenominations.find((x) => Number(x.denomination) === d);
      const expected = found && found.quantity > 0 ? found.quantity : 0;
      const counted = Number(countedCounts[d]) || 0;
      if (expected !== counted) mismatch = true;
    });
    return mismatch;
  }, [countedCounts, runningDenominations]);

  const frozenValidation = useMemo(() => {
    const errors = [];
    DENOMINATIONS.forEach((n) => {
      const counted = Number(countedCounts[n]) || 0;
      const frozen = Number(frozenCounts[n]) || 0;
      if (frozen > counted) {
        errors.push(`₹${n}: Frozen (${frozen}) cannot exceed counted (${counted})`);
      }
    });
    return errors;
  }, [countedCounts, frozenCounts]);

  const handleCountedChange = (denom, val) => {
    setCountedCounts((prev) => ({ ...prev, [denom]: val }));
    setFrozenCounts((prev) => {
      const newCounted = Number(val) || 0;
      const frozenVal = Number(prev[denom]) || 0;
      if (frozenVal > newCounted) {
        return { ...prev, [denom]: newCounted === 0 ? "" : String(newCounted) };
      }
      return prev;
    });
  };

  const handleFrozenChange = (denom, val) => {
    const counted = Number(countedCounts[denom]) || 0;
    const newFrozen = Math.min(Number(val) || 0, counted);
    setFrozenCounts((prev) => ({
      ...prev,
      [denom]: val === "" ? "" : String(newFrozen),
    }));
  };

  const handleFreezeHighDenoms = () => {
    setFrozenCounts((prev) => {
      const next = { ...prev };
      [500, 200, 100].forEach((n) => {
        const counted = Number(countedCounts[n]) || 0;
        next[n] = counted > 0 ? String(counted) : "";
      });
      return next;
    });
  };

  const handleFreezeAll = () => {
    const next = {};
    DENOMINATIONS.forEach((n) => {
      const counted = Number(countedCounts[n]) || 0;
      next[n] = counted > 0 ? String(counted) : "";
    });
    setFrozenCounts(next);
  };

  const handleClearFrozen = () => {
    setFrozenCounts(
      DENOMINATIONS.reduce((acc, n) => ({ ...acc, [n]: "" }), {})
    );
  };

  const handleLockShift = async () => {
    setLocalError(null);

    if (frozenValidation.length > 0) {
      setLocalError(frozenValidation[0]);
      return;
    }

    const closingDenominations = DENOMINATIONS.filter(
      (n) => (Number(countedCounts[n]) || 0) > 0
    ).map((n) => ({
      denomination: n,
      count: Number(countedCounts[n]),
      amount: Number(countedCounts[n]) * n,
    }));

    const frozenDenominations = DENOMINATIONS.filter(
      (n) => (Number(frozenCounts[n]) || 0) > 0
    ).map((n) => ({
      denomination: n,
      quantity: Number(frozenCounts[n]),
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
            carryForwardAmount: totalRunning,
            frozenDenominations,
          },
        })
      ).unwrap();
      dispatch(listShifts());
      setClosedShiftData(result);
      setShowPostClose(true);
    } catch {
      // Handled by slice error
    }
  };

  const safeRunning = totalRunning;
  const safeFrozen = totalFrozen;

  return (
    <>
      <UIModal isOpen={isOpen} onClose={onClose} size="2xl">
        <UIModalHeader>
          <UIModalTitle>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 text-white shadow-md shadow-rose-500/20">
                <LockKeyhole className="h-5.5 w-5.5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-text tracking-tight">
                  Lock & Close Shift Session
                </h3>
                <p className="text-xs font-mono font-medium text-text-muted mt-0.5">
                  {shift?.shiftNo || "N/A"}
                </p>
              </div>
            </div>
          </UIModalTitle>
        </UIModalHeader>

        <UIModalBody className="max-h-[78vh] overflow-y-auto">
          {loading ? (
            <div className="py-16 text-center text-text-muted space-y-2">
              <div className="size-7 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
              <p className="text-xs font-medium">Loading session audit data...</p>
            </div>
          ) : (
            <div className="space-y-4 py-1">
              {(shiftError || localError) && (
                <UIAlert
                  intent="danger"
                  title="Error"
                  description={localError || shiftError}
                />
              )}

              {/* Top Warning Banner */}
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3.5 flex items-start gap-3 text-rose-700 dark:text-rose-400">
                <AlertTriangle className="size-5 shrink-0 mt-0.5 text-rose-500" />
                <div className="text-xs">
                  <h4 className="font-bold">Finalize Register Session</h4>
                  <p className="mt-0.5 opacity-90">
                    Locking this shift will finalize all cashier transactions and update branch treasury balances. Further billing in this session will be disabled.
                  </p>
                </div>
              </div>

              {/* Operations & Payments Summary Grid */}
              {summary && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-surface-alt/60 border border-border/80 rounded-xl p-3.5 space-y-2">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                      <FileText className="size-3.5 text-primary" /> Operations Totals
                    </h4>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted">Total Invoices</span>
                      <span className="font-mono font-bold text-text">{summary.invoiceCount}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted">Cash Invoices</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{summary.cashInvoiceCount || 0}</span>
                    </div>
                    <div className="flex justify-between text-xs pt-1 border-t border-border/50 font-bold">
                      <span>Net Sales Total</span>
                      <span className="font-mono text-primary">₹{summary.netSales}</span>
                    </div>
                  </div>

                  <div className="bg-surface-alt/60 border border-border/80 rounded-xl p-3.5 space-y-2">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                      <QrCode className="size-3.5 text-purple-500" /> Payment Channels
                    </h4>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted">Digital UPI Txns</span>
                      <span className="font-mono font-bold text-text">{summary.paymentQrCount}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted">UPI Volume</span>
                      <span className="font-mono font-bold text-purple-600 dark:text-purple-400">₹{summary.qrNet}</span>
                    </div>
                    <div className="flex justify-between text-xs pt-1 border-t border-border/50 font-bold">
                      <span>Expected System Cash</span>
                      <span className="font-mono text-primary">₹{summary.expectedClosingCashAmount || 0}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Cash Reconciliation Cards */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="bg-surface-alt/60 border border-border/80 rounded-xl p-3.5 flex-1 space-y-1.5">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    Expected Cash Calculation
                  </h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-text-muted">
                      <span>Opening Float</span>
                      <span className="font-mono">₹{summary?.openingFloatAmount || 0}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>+ Cash Sales</span>
                      <span className="font-mono">+₹{summary?.cashNet || 0}</span>
                    </div>
                    <div className="border-t border-border/60 pt-1 flex justify-between font-bold">
                      <span>Expected Cash</span>
                      <span className="font-mono text-primary">₹{summary?.expectedClosingCashAmount || 0}</span>
                    </div>
                  </div>
                </div>

                <div
                  className={`border rounded-xl p-3.5 sm:w-5/12 flex flex-col justify-center ${
                    totalCounted === (summary?.expectedClosingCashAmount || 0) && !isDenominationMismatch
                      ? "bg-emerald-500/5 border-emerald-500/30"
                      : "bg-amber-500/5 border-amber-500/30"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block text-center">
                    Actual Cash Counted
                  </span>
                  <span className="text-2xl font-mono font-black text-center text-text mt-1">
                    ₹{totalCounted}
                  </span>
                  {summary && totalCounted - (summary?.expectedClosingCashAmount || 0) !== 0 ? (
                    <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 text-center block mt-1">
                      Variance: ₹{totalCounted - summary.expectedClosingCashAmount}
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Denominations Split Table */}
              <div className="border border-border/80 rounded-xl overflow-hidden bg-surface">
                <div className="bg-surface-alt/80 px-3.5 py-2.5 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-text">Cash Denomination Split</h4>
                    <p className="text-[11px] text-text-muted">
                      Count cash → Allocate to <span className="font-bold text-amber-600 dark:text-amber-400">Frozen 🔒</span> → Remainder stays <span className="font-bold text-emerald-600 dark:text-emerald-400">Running ✓</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleFreezeHighDenoms}
                      className="text-[10px] font-bold px-2 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Zap className="size-3" /> Freeze High
                    </button>
                    <button
                      type="button"
                      onClick={handleFreezeAll}
                      className="text-[10px] font-bold px-2 py-1 rounded-md bg-surface-alt border border-border text-text-muted hover:text-text transition-all cursor-pointer"
                    >
                      Freeze All
                    </button>
                    <button
                      type="button"
                      onClick={handleClearFrozen}
                      className="text-[10px] font-bold px-2 py-1 rounded-md text-text-muted hover:text-text transition-all cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted border-b border-border/60 bg-surface-alt/40 items-center">
                  <div className="col-span-2">Note</div>
                  <div className="col-span-2 text-center">Expected</div>
                  <div className="col-span-3 text-center flex items-center justify-center gap-1">
                    Counted
                    <button
                      type="button"
                      onClick={() => setIsEditingCounts(!isEditingCounts)}
                      className={`p-0.5 rounded transition ${isEditingCounts ? "text-primary" : "text-text-muted"}`}
                    >
                      <Pencil className="size-3" />
                    </button>
                  </div>
                  <div className="col-span-3 text-center text-amber-600 dark:text-amber-400">Freeze 🔒</div>
                  <div className="col-span-2 text-right text-emerald-600 dark:text-emerald-400">Running ✓</div>
                </div>

                <div className="divide-y divide-border/40 text-xs">
                  {DENOMINATIONS.map((denom) => {
                    const expectedQty =
                      runningDenominations?.find(
                        (d) => Number(d.denomination) === denom
                      )?.quantity || 0;
                    const counted = Number(countedCounts[denom]) || 0;
                    const frozen = Number(frozenCounts[denom]) || 0;
                    const running = Math.max(0, counted - frozen);

                    return (
                      <div key={denom} className="grid grid-cols-12 gap-1 items-center px-3 py-1 hover:bg-surface-alt/30 transition-colors">
                        <div className="col-span-2 font-mono font-bold text-text">₹{denom}</div>
                        <div className="col-span-2 text-center font-mono text-primary text-xs font-semibold">{expectedQty || "-"}</div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            min="0"
                            value={countedCounts[denom]}
                            onChange={(e) => handleCountedChange(denom, e.target.value)}
                            disabled={!isEditingCounts}
                            className={`w-full text-center font-mono text-xs border rounded py-0.5 outline-none transition ${isEditingCounts ? "bg-surface border-primary" : "bg-surface-alt/50 border-border/60 text-text-muted cursor-not-allowed"}`}
                            placeholder="0"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            min="0"
                            max={counted}
                            value={frozenCounts[denom]}
                            onChange={(e) => handleFrozenChange(denom, e.target.value)}
                            className="w-full text-center font-mono text-xs border border-amber-500/30 bg-amber-500/5 rounded py-0.5 outline-none focus:border-amber-500"
                            placeholder="0"
                          />
                        </div>
                        <div className="col-span-2 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {running > 0 ? running : "—"}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-surface-alt/80 border-t border-border/80 font-bold text-xs">
                  <div className="col-span-2">Totals</div>
                  <div className="col-span-2" />
                  <div className="col-span-3 text-center font-mono text-text">₹{totalCounted.toLocaleString("en-IN")}</div>
                  <div className="col-span-3 text-center font-mono text-amber-600 dark:text-amber-400">₹{totalFrozen.toLocaleString("en-IN")}</div>
                  <div className="col-span-2 text-right font-mono text-emerald-600 dark:text-emerald-400">₹{totalRunning.toLocaleString("en-IN")}</div>
                </div>
              </div>

              {/* Final Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Snowflake className="size-3.5" /> To Frozen Reserve
                  </span>
                  <p className="font-mono font-black text-xl text-amber-600 dark:text-amber-400">
                    ₹{safeFrozen.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] text-text-muted">Awaiting bank deposit</p>
                </div>

                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <HandCoins className="size-3.5" /> Running Cash Carry-Forward
                  </span>
                  <p className="font-mono font-black text-xl text-emerald-600 dark:text-emerald-400">
                    ₹{safeRunning.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] text-text-muted">Kept in drawer for next shift</p>
                </div>
              </div>

              {/* Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text">Closing Remarks (Optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-surface border border-border/80 rounded-xl text-xs focus:ring-1 focus:ring-primary focus:border-primary p-2.5 outline-none resize-none"
                  placeholder="Note any cash discrepancies or counter observations..."
                  rows={2}
                />
              </div>
            </div>
          )}
        </UIModalBody>

        <UIModalFooter>
          <UIButton variant="ghost" onClick={onClose}>
            Cancel
          </UIButton>
          <UIButton
            variant="danger"
            onClick={handleLockShift}
            isLoading={updateShiftStatusStatus === API_STATUS.LOADING}
            disabled={frozenValidation.length > 0}
          >
            <LockKeyhole className="size-4 mr-1.5" />
            <span>Lock & Close Shift</span>
          </UIButton>
        </UIModalFooter>
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
