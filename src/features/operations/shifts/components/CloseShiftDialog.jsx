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
} from "lucide-react";
import { ShiftFundTransferPanel } from "./ShiftFundTransferPanel";
import { PostShiftCloseDialog } from "./PostShiftCloseDialog";

const DENOMINATIONS = [500, 200, 100, 50, 20, 10, 5, 2, 1];

export const CloseShiftDialog = ({ isOpen, onClose, shift, onOpenNewShift, onCreateDayClosing }) => {
  const dispatch = useDispatch();
  const { updateShiftStatusStatus, error: shiftError } = useSelector(
    (state) => state.shift,
  );

  const [note, setNote] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [showPostClose, setShowPostClose] = useState(false);
  const [closedShiftData, setClosedShiftData] = useState(null);

  // --- Physical cash counted (actual drawer count) ---
  const [countedCounts, setCountedCounts] = useState(
    DENOMINATIONS.reduce((acc, note) => ({ ...acc, [note]: "" }), {}),
  );

  // --- Frozen split: how many of each note goes to frozen reserve ---
  const [frozenCounts, setFrozenCounts] = useState(
    DENOMINATIONS.reduce((acc, note) => ({ ...acc, [note]: "" }), {}),
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
          (x) => Number(x.denomination) === d,
        );
        initial[d] = found && found.quantity > 0 ? found.quantity : "";
      });
      setCountedCounts(initial);
    }
    if (!isOpen) {
      setCountedCounts(
        DENOMINATIONS.reduce((acc, n) => ({ ...acc, [n]: "" }), {}),
      );
      setFrozenCounts(
        DENOMINATIONS.reduce((acc, n) => ({ ...acc, [n]: "" }), {}),
      );
      setNote("");
      setLocalError(null);
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

  // Totals derived from counted denominations
  const totalCounted = useMemo(() => {
    return DENOMINATIONS.reduce((sum, n) => {
      return sum + (Number(countedCounts[n]) || 0) * n;
    }, 0);
  }, [countedCounts]);

  // Totals derived from frozen selections
  const totalFrozen = useMemo(() => {
    return DENOMINATIONS.reduce((sum, n) => {
      return sum + (Number(frozenCounts[n]) || 0) * n;
    }, 0);
  }, [frozenCounts]);

  // Running = counted - frozen (computed per denomination)
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

  // Validation helpers
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
    // Also clamp frozen if it now exceeds the new counted value
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
    setFrozenCounts((prev) => ({ ...prev, [denom]: val === "" ? "" : String(newFrozen) }));
  };

  // Freeze all high-denomination notes (500, 200, 100) by one click
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

  // Freeze everything
  const handleFreezeAll = () => {
    const next = {};
    DENOMINATIONS.forEach((n) => {
      const counted = Number(countedCounts[n]) || 0;
      next[n] = counted > 0 ? String(counted) : "";
    });
    setFrozenCounts(next);
  };

  // Clear frozen
  const handleClearFrozen = () => {
    setFrozenCounts(
      DENOMINATIONS.reduce((acc, n) => ({ ...acc, [n]: "" }), {}),
    );
  };

  const handleLockShift = async () => {
    setLocalError(null);

    if (frozenValidation.length > 0) {
      setLocalError(frozenValidation[0]);
      return;
    }

    // Build arrays for API
    const closingDenominations = DENOMINATIONS.filter(
      (n) => (Number(countedCounts[n]) || 0) > 0,
    ).map((n) => ({
      denomination: n,
      count: Number(countedCounts[n]),
      amount: Number(countedCounts[n]) * n,
    }));

    const frozenDenominations = DENOMINATIONS.filter(
      (n) => (Number(frozenCounts[n]) || 0) > 0,
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
        }),
      ).unwrap();
      dispatch(listShifts());
      setClosedShiftData(result);
      setShowPostClose(true); // show post-close action dialog
    } catch (e) {
      // handled by redux
    }
  };

  const safeRunning = totalRunning;
  const safeFrozen = totalFrozen;

  return (
    <>
      <UIModal isOpen={isOpen} onClose={onClose} size="2xl">
      <UIModalHeader>
        <UIModalTitle>Lock Shift: {shift?.shiftNo}</UIModalTitle>
      </UIModalHeader>
      <UIModalBody className="max-h-[80vh] overflow-y-auto">
        {loading ? (
          <div className="py-10 text-center text-text-muted">
            Loading shift data...
          </div>
        ) : (
          <div className="space-y-5 py-2">
            {(shiftError || localError) && (
              <UIAlert
                intent="danger"
                title="Error"
                description={localError || shiftError}
              />
            )}

            {/* Branch Cash Status Overview */}
            {currentBranchCash && (
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div className="flex flex-col gap-1 bg-surface-alt/50 border border-border/60 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1 font-bold tracking-widest uppercase">
                    <Banknote className="size-3.5 text-emerald-500" />
                    Running Cash
                  </div>
                  <div className="font-mono font-bold text-emerald-600 text-lg">
                    ₹{(currentBranchCash?.runningCash || 0).toLocaleString("en-IN")}
                  </div>
                  <div className="text-[10px] text-text-muted">Available for next shift</div>
                </div>
                
                <div className="flex flex-col gap-1 bg-surface-alt/50 border border-border/60 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1 font-bold tracking-widest uppercase">
                    <Snowflake className="size-3.5 text-blue-500" />
                    Frozen Reserve
                  </div>
                  <div className="font-mono font-bold text-blue-600 text-lg">
                    ₹{(currentBranchCash?.frozenCash || 0).toLocaleString("en-IN")}
                  </div>
                  <div className="text-[10px] text-text-muted">Awaiting bank deposit</div>
                </div>
              </div>
            )}

            <div className="bg-error/10 p-4 rounded-lg border border-error/20 text-error">
              <h4 className="text-sm font-semibold mb-1">Confirm Shift Lock</h4>
              <p className="text-xs">
                Locking this shift will finalize all transactions. You will not
                be able to perform further billing under this shift.
              </p>
            </div>

            {summary && (
              <div className="grid grid-cols-2 gap-4 border-b border-border pb-4">
                <div className="bg-surface-secondary p-3 rounded-lg border border-border">
                  <h4 className="text-xs font-semibold flex items-center gap-2 mb-2 text-text-muted">
                    <FileText className="w-3 h-3" /> Operations Totals
                  </h4>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Total Invoices</span>
                    <span className="font-medium">{summary.invoiceCount}</span>
                  </div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-muted pl-2">↳ Cash Invoices</span>
                    <span className="font-medium text-text-muted">{summary.cashInvoiceCount || 0}</span>
                  </div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-muted pl-2">↳ UPI Invoices</span>
                    <span className="font-medium text-text-muted">{summary.paymentQrCount || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1 mt-2">
                    <span>Net Sales</span>
                    <span className="font-medium text-success">₹{summary.netSales}</span>
                  </div>
                </div>

                <div className="bg-surface-secondary p-3 rounded-lg border border-border">
                  <h4 className="text-xs font-semibold flex items-center gap-2 mb-2 text-text-muted">
                    <QrCode className="w-3 h-3" /> Payments
                  </h4>
                  <div className="flex justify-between text-sm mb-1">
                    <span>UPI/QR Txns</span>
                    <span className="font-medium">{summary.paymentQrCount}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>QR Total</span>
                    <span className="font-medium text-primary">₹{summary.qrNet}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-3 border-t border-border pt-2">
                    <span>Expected Cash</span>
                    <span className="font-bold">₹{summary.expectedClosingCashAmount || 0}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Fund Transfers */}
            {summary &&
              (summary.withdrawals?.length > 0 ||
                summary.deposits?.length > 0) && (
                <div className="border border-border rounded-lg p-3 bg-surface-secondary">
                  <h4 className="text-xs font-semibold text-text-muted mb-3 flex items-center gap-1.5">
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    Fund Transfers This Shift
                  </h4>
                  <ShiftFundTransferPanel
                    withdrawals={summary.withdrawals || []}
                    deposits={summary.deposits || []}
                    totalWithdrawals={summary.totalWithdrawals || 0}
                    totalDeposits={summary.totalDeposits || 0}
                  />
                </div>
              )}

            {/* Cash Reconciliation Summary (Redesigned) */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Math Breakdown Box */}
              <div className="bg-surface-secondary border border-border rounded-lg p-4 flex-1">
                <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3">
                  Expected Cash Calculation
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Opening Balance</span>
                    <span className="font-mono">₹{summary?.openingFloatAmount || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-success">
                    <span>+ Cash Sales</span>
                    <span className="font-mono">+ ₹{summary?.cashNet || 0}</span>
                  </div>
                  {summary && summary.totalDeposits > 0 && (
                    <div className="flex justify-between items-center text-success">
                      <span>+ Shift Deposits</span>
                      <span className="font-mono">+ ₹{summary.totalDeposits}</span>
                    </div>
                  )}
                  {summary && summary.totalWithdrawals > 0 && (
                    <div className="flex justify-between items-center text-error">
                      <span>- Shift Withdrawals</span>
                      <span className="font-mono">- ₹{summary.totalWithdrawals}</span>
                    </div>
                  )}
                  <div className="border-t border-border mt-2 pt-2 flex justify-between items-center font-bold">
                    <span>Expected Cash</span>
                    <span className="font-mono text-primary text-base">₹{summary?.expectedClosingCashAmount || 0}</span>
                  </div>
                </div>
              </div>

              {/* Counted Cash Box */}
              <div
                className={`border rounded-lg p-4 md:w-1/3 flex flex-col justify-center ${
                  totalCounted === (summary?.expectedClosingCashAmount || 0)
                    ? "bg-success-soft border-success/30"
                    : "bg-warning-soft border-warning/30"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
                    Actual Counted
                  </p>
                  {summary &&
                    totalCounted - (summary?.expectedClosingCashAmount || 0) !== 0 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          totalCounted - summary.expectedClosingCashAmount < 0
                            ? "bg-error/10 text-error"
                            : "bg-success/10 text-success"
                        }`}
                      >
                        {totalCounted - summary.expectedClosingCashAmount > 0 ? "+" : ""}
                        ₹{totalCounted - summary.expectedClosingCashAmount}
                      </span>
                    )}
                </div>
                <p className="text-3xl font-mono font-bold text-center my-2">₹{totalCounted}</p>
                {summary && totalCounted - (summary?.expectedClosingCashAmount || 0) !== 0 && (
                  <p className="text-[10px] text-center opacity-80 font-medium text-error">
                    Mismatch: Please recount or add a note.
                  </p>
                )}
              </div>
            </div>

            {/* ── MAIN DENOMINATION GRID ── */}
            <div className="border border-border rounded-xl overflow-hidden">
              {/* Header */}
              <div className="bg-surface-alt/80 px-4 py-3 border-b border-border flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-text">Cash Denomination Split</h4>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Count cash in drawer → Select which notes go to{" "}
                    <span className="font-semibold text-amber-600">Frozen Reserve</span> →
                    Remainder stays as{" "}
                    <span className="font-semibold text-emerald-600">Running Cash</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleFreezeHighDenoms}
                    className="text-[11px] font-medium px-2 py-1 rounded bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30 transition flex items-center gap-1"
                    title="Freeze all ₹500, ₹200, ₹100 notes"
                  >
                    <Zap className="w-3 h-3" />
                    Freeze High
                  </button>
                  <button
                    type="button"
                    onClick={handleFreezeAll}
                    className="text-[11px] font-medium px-2 py-1 rounded bg-surface border border-border text-text-muted hover:text-text transition"
                  >
                    Freeze All
                  </button>
                  <button
                    type="button"
                    onClick={handleClearFrozen}
                    className="text-[11px] font-medium px-2 py-1 rounded text-text-muted hover:text-text transition"
                  >
                    Clear Frozen
                  </button>
                </div>
              </div>

              {/* Column Headers */}
              <div className="grid grid-cols-12 gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-text-muted border-b border-border bg-surface-alt/40">
                <div className="col-span-2">Note</div>
                <div className="col-span-2 text-center">Expected</div>
                <div className="col-span-3 text-center">Counted ✏️</div>
                <div className="col-span-3 text-center text-amber-600">Freeze 🔒</div>
                <div className="col-span-2 text-right text-emerald-600">Running ✓</div>
              </div>

              {/* Denomination rows */}
              <div className="divide-y divide-border/50">
                {DENOMINATIONS.map((denom) => {
                  const expectedQty =
                    runningDenominations?.find(
                      (d) => Number(d.denomination) === denom,
                    )?.quantity || 0;
                  const counted = Number(countedCounts[denom]) || 0;
                  const frozen = Number(frozenCounts[denom]) || 0;
                  const running = Math.max(0, counted - frozen);
                  const isOverFrozen = frozen > counted;

                  return (
                    <div
                      key={denom}
                      className={`grid grid-cols-12 gap-2 items-center px-4 py-1.5 transition ${
                        isOverFrozen ? "bg-error/5" : "hover:bg-surface-alt/30"
                      }`}
                    >
                      {/* Denomination label */}
                      <div className="col-span-2 text-sm font-bold font-mono text-text">
                        ₹{denom}
                      </div>

                      {/* Expected */}
                      <div className="col-span-2 text-center text-[12px] font-mono text-primary font-semibold">
                        {expectedQty || "-"}
                      </div>

                      {/* Counted (editable) */}
                      <div className="col-span-3">
                        <input
                          type="number"
                          min="0"
                          value={countedCounts[denom]}
                          onChange={(e) =>
                            handleCountedChange(denom, e.target.value)
                          }
                          className="w-full text-center font-mono text-[13px] border border-border rounded py-1 outline-none focus:border-primary bg-surface transition"
                          placeholder="0"
                        />
                      </div>

                      {/* Frozen (editable) */}
                      <div className="col-span-3">
                        <input
                          type="number"
                          min="0"
                          max={counted}
                          value={frozenCounts[denom]}
                          onChange={(e) =>
                            handleFrozenChange(denom, e.target.value)
                          }
                          className={`w-full text-center font-mono text-[13px] border rounded py-1 outline-none transition ${
                            isOverFrozen
                              ? "border-error focus:border-error bg-error/5 text-error"
                              : "border-amber-300 dark:border-amber-600/40 focus:border-amber-500 bg-amber-50/60 dark:bg-amber-500/5"
                          }`}
                          placeholder="0"
                        />
                      </div>

                      {/* Running (auto-calculated) */}
                      <div className="col-span-2 text-right">
                        {running > 0 ? (
                          <span className="text-[12px] font-mono font-bold text-emerald-600">
                            {running}
                          </span>
                        ) : (
                          <span className="text-[11px] text-text-muted/50">—</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals footer */}
              <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-surface-alt border-t border-border">
                <div className="col-span-2 text-xs font-bold text-text uppercase">Totals</div>
                <div className="col-span-2" />
                <div className="col-span-3 text-center text-sm font-mono font-bold text-text">
                  ₹{totalCounted.toLocaleString("en-IN")}
                </div>
                <div className="col-span-3 text-center text-sm font-mono font-bold text-amber-600">
                  ₹{totalFrozen.toLocaleString("en-IN")}
                </div>
                <div className="col-span-2 text-right text-sm font-mono font-bold text-emerald-600">
                  ₹{totalRunning.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            {/* Summary boxes */}
            <div className="grid grid-cols-2 gap-4">
              {/* Frozen summary */}
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/25 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-500 mb-1 flex items-center gap-2">
                  <Snowflake className="w-4 h-4" /> To Frozen Reserve
                </h4>
                <p className="text-2xl font-mono font-black text-amber-700 dark:text-amber-500">
                  ₹{safeFrozen.toLocaleString("en-IN")}
                </p>
                <p className="text-[11px] text-amber-600/70 mt-1">
                  Locked for bank deposit
                </p>
              </div>

              {/* Running summary */}
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-500 mb-1 flex items-center gap-2">
                  <HandCoins className="w-4 h-4" /> Running Cash (Next Shift)
                </h4>
                <p className="text-2xl font-mono font-black text-emerald-700 dark:text-emerald-500">
                  ₹{safeRunning.toLocaleString("en-IN")}
                </p>
                <p className="text-[11px] text-emerald-600/70 mt-1">
                  Stays in drawer for next shift
                </p>
              </div>
            </div>

            {/* Validation errors */}
            {frozenValidation.length > 0 && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-xs text-error space-y-1">
                {frozenValidation.map((err, i) => (
                  <div key={i}>⚠ {err}</div>
                ))}
              </div>
            )}

            {/* Closing note */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Closing Note (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg text-text focus:ring-1 focus:ring-primary focus:border-primary p-2 transition-all outline-none"
                placeholder="Any discrepancies or remarks about cash variation..."
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
          variant="primary"
          onClick={handleLockShift}
          isLoading={updateShiftStatusStatus === API_STATUS.LOADING}
          disabled={frozenValidation.length > 0}
        >
          Confirm &amp; Lock Shift
        </UIButton>
      </UIModalFooter>
    </UIModal>

    {/* Post-close action dialog — shown after shift locks successfully */}
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
