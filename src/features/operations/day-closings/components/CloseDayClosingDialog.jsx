import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalBody,
  UIModalFooter,
  UIButton,
  UIInput,
  UIAlert,
} from "@/components/ui";
import { updateDayClosingStatus, listDayClosings } from "../store/dayClosingThunk";
import { API_STATUS } from "@/constants";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import { apiClient } from "@/services";
import useBranchCash from "@/features/finance/treasury/cash-management/branch-cash/hooks/useBranchCash";
import { FileText, IndianRupee, QrCode, Eye, Banknote, ArrowLeftRight, Snowflake, Landmark } from "lucide-react";
import { ViewShiftDialog } from "@/features/operations/shifts/components/ViewShiftDialog";
import { ShiftFundTransferPanel } from "@/features/operations/shifts/components/ShiftFundTransferPanel";
import { PostDayCloseDialog } from "./PostDayCloseDialog";
import { Clock } from "lucide-react";

const fmt = (n) => (Number(n) || 0).toLocaleString("en-IN");

const DENOMINATIONS = [500, 200, 100, 50, 20, 10, 5, 2, 1];

export const CloseDayClosingDialog = ({ isOpen, onClose, dayClosing }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { updateDayClosingStatusStatus, error } = useSelector((state) => state.dayClosing);

  const [note, setNote] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedShiftForView, setSelectedShiftForView] = useState(null);
  const [showPostClose, setShowPostClose] = useState(false);
  const [closedDayClosingData, setClosedDayClosingData] = useState(null);

  // Denominations State
  const [counts, setCounts] = useState(
    DENOMINATIONS.reduce((acc, note) => ({ ...acc, [note]: "" }), {})
  );

  const totalAmount = useMemo(() => {
    return DENOMINATIONS.reduce((sum, note) => {
      const cnt = Number(counts[note]) || 0;
      return sum + cnt * note;
    }, 0);
  }, [counts]);

  const { currentBranchCash: branchCash, fetchBranchCash: getBranchCash } = useBranchCash();

  useEffect(() => {
    if (isOpen && dayClosing?.branchId) {
      getBranchCash(dayClosing.branchId);
    }
  }, [isOpen, dayClosing?.branchId]);

  useEffect(() => {
    if (isOpen && dayClosing?._id) {
      setLoading(true);
      setSelectedShiftForView(null);
      apiClient
        .get(`/operations/day-closings/${dayClosing._id}/summary`)
        .then((res) => {
          const data = res.data.data;
          setSummary(data);

          // Populate initial denomination counts
          const initialCounts = {};
          if (data?.closingDenominations?.length > 0) {
            DENOMINATIONS.forEach((note) => {
              const found = data.closingDenominations.find((d) => Number(d.denomination) === note);
              initialCounts[note] = found && found.count > 0 ? found.count : "";
            });
          } else if (branchCash?.denominationBalance?.runningDenominations) {
            const expectedDenoms = branchCash.denominationBalance.runningDenominations;
            DENOMINATIONS.forEach((note) => {
              const found = expectedDenoms.find((d) => Number(d.denomination) === note);
              initialCounts[note] = found && found.quantity > 0 ? found.quantity : "";
            });
          }
          if (Object.keys(initialCounts).length > 0) {
            setCounts((prev) => ({ ...prev, ...initialCounts }));
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setSummary(null);
      setNote("");
      setSelectedShiftForView(null);
      setCounts(DENOMINATIONS.reduce((acc, note) => ({ ...acc, [note]: "" }), {}));
    }
  }, [isOpen, dayClosing, branchCash]);

  useEffect(() => {
    if (!isOpen) {
      setShowPostClose(false);
      setClosedDayClosingData(null);
    }
  }, [isOpen]);

  const handleCountChange = (note, val) => {
    setCounts((prev) => ({ ...prev, [note]: val }));
  };

  const handleOpenBankSlip = () => {
    setShowPostClose(false);
    onClose();
    const dcId = closedDayClosingData?._id || dayClosing?._id || "";
    navigate(`${ROUTES.CREATE_BANK_DEPOSIT_SLIP}${dcId ? `?dayClosingId=${dcId}` : ""}`);
  };

  const handlePostCloseDismiss = () => {
    setShowPostClose(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!summary) return;

    const closingDenominations = DENOMINATIONS.map((note) => ({
      denomination: note,
      count: Number(counts[note]) || 0,
      amount: (Number(counts[note]) || 0) * note,
    })).filter((d) => d.count > 0);

    const resultAction = await dispatch(
      updateDayClosingStatus({
        id: dayClosing._id,
        payload: {
          status: "closed",
          actualClosingCashAmount: totalAmount,
          closingDenominations,
          note,
        },
      }),
    );

    if (updateDayClosingStatus.fulfilled.match(resultAction)) {
      dispatch(listDayClosings());
      setClosedDayClosingData(resultAction.payload || dayClosing);
      setShowPostClose(true);
    }
  };

  const expectedCash = summary?.expectedClosingCashAmount || 0;
  const cashDifference = totalAmount - expectedCash;

  return (
    <>
      <UIModal isOpen={isOpen && !showPostClose} onClose={onClose} size="xl">
        <form onSubmit={handleSubmit}>
          <UIModalHeader>
            <UIModalTitle>Lock Day Closing: {dayClosing?.dayClosingNo}</UIModalTitle>
          </UIModalHeader>
          <UIModalBody className="max-h-[75vh] overflow-y-auto">
            {loading ? (
              <div className="py-10 text-center text-text-muted">Loading day closing data...</div>
            ) : (
              <div className="space-y-6 py-2">
                {error && <UIAlert intent="danger" title="Error" description={error} />}

                {/* Cash Account Status: Current Running & Frozen Cash (Reserve) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-success-soft border border-success/30 rounded-xl p-3.5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-success mb-1">
                        <Banknote className="size-3.5" /> Current Running Cash (Now)
                      </div>
                      <p className="font-mono font-bold text-2xl text-success">
                        ₹{fmt(branchCash?.runningCash ?? summary?.currentRunningCash ?? 0)}
                      </p>
                      <p className="text-[11px] text-success/80 dark:text-success mt-0.5">
                        Active in drawer partition
                      </p>
                    </div>
                  </div>

                  <div className="bg-info-soft border border-info/30 rounded-xl p-3.5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-info mb-1">
                        <Snowflake className="size-3.5" /> Frozen Cash (Reserve)
                      </div>
                      <p className="font-mono font-bold text-2xl text-info">
                        ₹{fmt(branchCash?.frozenCash ?? summary?.currentFrozenCash ?? 0)}
                      </p>
                      <p className="text-[11px] text-info/80 dark:text-info mt-0.5">
                        Locked cash awaiting bank deposit
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-error/10 p-4 rounded-lg border border-error/20 mb-4 text-error">
                  <h4 className="text-sm font-semibold mb-1">Confirm Day Closing Lock</h4>
                  <p className="text-xs">
                    Locking this day closing will finalize the entire day. No further shifts or billing can be performed for this business date.
                  </p>
                </div>

                {summary && (
                  <>
                    {/* ── Payment Breakdown ────────────────────────────────────────── */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3 flex items-center gap-2">
                        <QrCode className="size-3.5" /> Payment Breakdown
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-success-soft border border-success/30 rounded-xl p-3">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-success mb-1">
                            <Banknote className="size-3" /> Cash Bills
                          </div>
                          <p className="font-mono font-bold text-xl text-success">₹{fmt(summary.totalCashNet)}</p>
                          <p className="text-[11px] text-success/70 mt-0.5">{summary.totalCashInvoiceCount || 0} bills</p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 rounded-xl p-3">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-1">
                            <QrCode className="size-3" /> UPI / QR
                          </div>
                          <p className="font-mono font-bold text-xl text-purple-700 dark:text-purple-400">₹{fmt(summary.totalQrNet)}</p>
                          <p className="text-[11px] text-purple-600/70 mt-0.5">{summary.totalPaymentQrCount || 0} bills</p>
                        </div>
                      </div>
                      {summary.totalNetSales !== undefined && (
                        <div className="mt-2 bg-surface-secondary border border-border rounded-xl p-3 flex justify-between items-center">
                          <p className="text-sm font-semibold">Total Net Sales (All Shifts)</p>
                          <p className="font-mono font-bold text-lg text-primary">₹{fmt(summary.totalNetSales)}</p>
                        </div>
                      )}
                    </div>

                    {/* ── Fund Transfers Section ── */}
                    {(summary.withdrawals?.length > 0 || summary.deposits?.length > 0) && (
                      <div className="border border-border rounded-lg p-3 bg-surface-secondary">
                        <h4 className="text-xs font-semibold text-text-muted mb-3 flex items-center gap-1.5">
                          <ArrowLeftRight className="w-3.5 h-3.5" />
                          Fund Transfers During Day
                        </h4>
                        <ShiftFundTransferPanel
                          withdrawals={summary.withdrawals || []}
                          deposits={summary.deposits || []}
                          totalWithdrawals={summary.totalWithdrawals || 0}
                          totalDeposits={summary.totalDeposits || 0}
                        />
                      </div>
                    )}

                    {/* ── Cash Drawer Reconciliation ── */}
                    <div className="mb-4 space-y-3">
                      <h4 className="text-sm font-semibold border-b border-border pb-1">
                        Cash Drawer Reconciliation
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-surface-secondary border border-border rounded-lg p-3">
                          <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted mb-1">
                            1. Opening Cash
                          </p>
                          <p className="text-lg font-mono">
                            ₹{summary?.openingFloatAmount || 0}
                          </p>
                          <p className="text-[10px] text-text-muted mt-1">
                            Initial drawer balance
                          </p>
                        </div>
                        <div className="bg-surface-secondary border border-border rounded-lg p-3">
                          <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted mb-1">
                            2. System Expected
                          </p>
                          <p className="text-lg font-mono text-primary">
                            ₹{expectedCash}
                          </p>
                          <p className="text-[10px] text-text-muted mt-1">
                            Opening + Sales
                            {(summary?.totalWithdrawals || 0) > 0 && ` − Withdraw`}
                            {(summary?.totalDeposits || 0) > 0 && ` + Deposit`}
                          </p>
                        </div>
                        <div
                          className={`border rounded-lg p-3 ${
                            cashDifference === 0
                              ? "bg-success-soft border-success/30"
                              : "bg-warning-soft border-warning/30"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted mb-1">
                              3. Actual Counted
                            </p>
                            {cashDifference !== 0 && (
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  cashDifference < 0
                                    ? "bg-error/10 text-error"
                                    : "bg-success/10 text-success"
                                }`}
                              >
                                Diff: {cashDifference > 0 ? "+" : ""}
                                ₹{cashDifference}
                              </span>
                            )}
                          </div>
                          <p className="text-lg font-mono font-bold">₹{totalAmount}</p>
                          <p className="text-[10px] text-text-muted mt-1">
                            Calculated from grid below
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ── 3-column Denominations Grid ── */}
                    <div className="grid grid-cols-3 gap-6 pt-2">
                      {/* 1. Opening Denominations */}
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-text-muted mb-2 border-b border-border pb-1">
                          1. Opening
                        </h4>
                        <div className="space-y-1">
                          {DENOMINATIONS.map((note) => {
                            const count =
                              summary?.openingDenominations?.find(
                                (d) => Number(d.denomination) === note,
                              )?.count || 0;
                            return (
                              <div
                                key={note}
                                className="flex justify-between items-center text-xs p-1 rounded bg-surface-secondary/50"
                              >
                                <span className="font-medium text-text-muted">₹{note}</span>
                                <span className="text-text-muted text-[10px]">×</span>
                                <span className="font-mono text-text">{count}</span>
                              </div>
                            );
                          })}
                          <div className="flex justify-between items-center text-xs p-1 rounded bg-surface-alt font-bold mt-2 pt-2 border-t border-border">
                            <span>Total</span>
                            <span>₹{summary?.openingFloatAmount || 0}</span>
                          </div>
                        </div>
                      </div>

                      {/* 2. System Expected Denominations */}
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary mb-2 border-b border-border pb-1">
                          2. Expected
                        </h4>
                        <div className="space-y-1">
                          {DENOMINATIONS.map((note) => {
                            const expectedCount =
                              branchCash?.balance?.runningDenominations?.find(
                                (d) => Number(d.denomination) === note,
                              )?.quantity || 0;
                            return (
                              <div
                                key={note}
                                className="flex justify-between items-center text-xs p-1 rounded bg-primary-soft/30"
                              >
                                <span className="font-medium text-text-muted">₹{note}</span>
                                <span className="text-primary text-[10px]">×</span>
                                <span className="font-mono font-bold text-primary">
                                  {expectedCount}
                                </span>
                              </div>
                            );
                          })}
                          <div className="flex justify-between items-center text-xs p-1 rounded bg-primary-soft/50 font-bold text-primary mt-2 pt-2 border-t border-primary/20">
                            <span>Total</span>
                            <span>
                              ₹{branchCash?.runningCash || expectedCash}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 3. Actual Counted */}
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-text mb-2 border-b border-border pb-1">
                          3. Actual Counted
                        </h4>
                        <div className="space-y-1">
                          {DENOMINATIONS.map((note) => (
                            <div key={note} className="flex items-center gap-1 p-0.5">
                              <span className="text-xs font-medium text-text-muted w-8 text-right">
                                ₹{note}
                              </span>
                              <span className="text-text-muted text-[10px] mx-0.5">×</span>
                              <input
                                type="number"
                                min="0"
                                value={counts[note]}
                                onChange={(e) => handleCountChange(note, e.target.value)}
                                className="flex-1 min-w-0 bg-surface-secondary border border-border rounded text-text font-mono text-xs p-1 text-center focus:border-primary outline-none"
                                placeholder="0"
                              />
                            </div>
                          ))}
                          <div className="flex justify-between items-center text-xs p-1 rounded bg-surface-secondary font-bold mt-2 pt-2 border-t border-border">
                            <span>Total</span>
                            <span>₹{totalAmount}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ── Per-Shift Cards ──────────────────────────────────────────── */}
                    <div className="pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3 flex items-center gap-2">
                        <Clock className="size-3.5" /> Included Shifts ({summary.shiftSummaries?.length || 0})
                      </h4>
                      <div className="space-y-2">
                        {summary.shiftSummaries?.map((s) => (
                          <div
                            key={s._id}
                            className="bg-surface border border-border rounded-xl p-3.5 hover:border-primary/30 transition"
                          >
                            <div className="flex flex-wrap justify-between items-start gap-3">
                              <div>
                                <p className="font-semibold text-sm">{s.shiftName || s.shiftNo || "Shift"}</p>
                                <p className="text-[10px] text-text-muted mt-0.5">{s.shiftNo || ""}</p>
                              </div>
                              <UIButton
                                type="button"
                                variant="outline"
                                size="xs"
                                onClick={() => setSelectedShiftForView(s)}
                                className="flex items-center gap-1 text-xs h-7 px-2"
                              >
                                <Eye className="size-3" /> View
                              </UIButton>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                              {[
                                ["Opening", fmt(s.openingFloatAmount || 0)],
                                ["Cash Sales", fmt(s.cashNet || 0)],
                                ["Expected", fmt(s.expectedClosingCashAmount || 0)],
                                ["Actual", fmt(s.actualClosingCashAmount || 0)],
                              ].map(([label, val]) => (
                                <div key={label} className="bg-surface-secondary rounded-lg p-2 border border-border">
                                  <p className="text-[10px] text-text-muted">{label}</p>
                                  <p className="font-mono font-semibold text-sm mt-0.5">₹{val}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <UIInput
                  label="Closing Note (Optional)"
                  placeholder="Any remarks before locking day closing..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            )}
          </UIModalBody>
          <UIModalFooter>
            <UIButton variant="ghost" type="button" onClick={onClose}>
              Cancel
            </UIButton>
            <UIButton
              type="submit"
              variant="danger"
              isLoading={updateDayClosingStatusStatus === API_STATUS.LOADING}
            >
              Lock Day Closing
            </UIButton>
          </UIModalFooter>
        </form>
      </UIModal>

      {/* Nested Shift Details Modal */}
      <ViewShiftDialog
        isOpen={Boolean(selectedShiftForView)}
        onClose={() => setSelectedShiftForView(null)}
        shift={selectedShiftForView}
      />

      {/* Post-day-closing action dialog */}
      <PostDayCloseDialog
        isOpen={showPostClose}
        onClose={handlePostCloseDismiss}
        onCreateBankSlip={handleOpenBankSlip}
        dayClosingNo={closedDayClosingData?.dayClosingNo || dayClosing?.dayClosingNo}
        frozenAmount={branchCash?.frozenCash ?? summary?.currentFrozenCash ?? 0}
        runningAmount={branchCash?.runningCash ?? summary?.currentRunningCash ?? totalAmount}
      />
    </>
  );
};
