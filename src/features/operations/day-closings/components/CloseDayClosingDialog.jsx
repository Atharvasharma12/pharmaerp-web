// src/features/operations/day-closings/components/CloseDayClosingDialog.jsx

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
  UIBadge,
  UIStatCard,
  UIInfoCard,
  UIDetailRow,
} from "@/components/ui";
import { updateDayClosingStatus, listDayClosings } from "../store/dayClosingThunk";
import { API_STATUS } from "@/constants";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import { apiClient } from "@/services";
import useBranchCash from "@/features/finance/treasury/cash-management/branch-cash/hooks/useBranchCash";
import {
  FileText,
  IndianRupee,
  QrCode,
  Eye,
  Banknote,
  ArrowLeftRight,
  Snowflake,
  Landmark,
  Lock,
  Clock,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { ViewShiftDialog } from "@/features/operations/shifts/components/ViewShiftDialog";
import { ShiftFundTransferPanel } from "@/features/operations/shifts/components/ShiftFundTransferPanel";
import { PostDayCloseDialog } from "./PostDayCloseDialog";

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
      }),    );

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
      <UIModal isOpen={isOpen} onClose={onClose} size="xl">
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

                {/* Cash account info */}
                {branchCash && (
                  <div className="flex items-center gap-2 bg-surface-alt/50 border border-border/60 rounded-lg px-3 py-2 text-xs">
                    <Banknote className="size-3.5 text-emerald-500 shrink-0" />
                    <span className="text-text-muted">Reconciling:</span>
                    <span className="font-semibold text-text">Running Cash Partition</span>
                    <span className="ml-auto font-mono font-bold text-emerald-500 tabular-nums">
                      ₹{(branchCash?.runningCash || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="bg-error/10 p-4 rounded-lg border border-error/20 mb-4 text-error">
                  <h4 className="text-sm font-semibold mb-1">Confirm Day Closing Lock</h4>
                  <p className="text-xs">
                    Locking this day closing will finalize the entire day. No further shifts or billing can be performed for this business date.
                  </p>
                </div>

                {summary && (
                  <>
                    {/* Operations Totals */}
                    <div className="grid grid-cols-2 gap-4 border-b border-border pb-4">
                      <div className="bg-surface-secondary p-3 rounded-lg border border-border">
                        <h4 className="text-xs font-semibold flex items-center gap-2 mb-2 text-text-muted">
                          <FileText className="w-3 h-3" /> Day Operations
                        </h4>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Total Shifts</span>
                          <span className="font-medium">{summary.shifts?.length || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Total Invoices</span>
                          <span className="font-medium">{summary.totalInvoiceCount}</span>
                        </div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-text-muted pl-2">↳ Cash Invoices</span>
                          <span className="font-medium text-text-muted">{summary.totalCashInvoiceCount || 0}</span>
                        </div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-text-muted pl-2">↳ UPI Invoices</span>
                          <span className="font-medium text-text-muted">{summary.totalPaymentQrCount || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1 mt-2">
                          <span>Net Sales</span>
                          <span className="font-medium text-success">₹{summary.totalNetSales}</span>
                        </div>
                      </div>

                      <div className="bg-surface-secondary p-3 rounded-lg border border-border">
                        <h4 className="text-xs font-semibold flex items-center gap-2 mb-2 text-text-muted">
                          <QrCode className="w-3 h-3" /> Day Cash & UPI
                        </h4>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Cash (Net)</span>
                          <span className="font-medium text-success">₹{summary.totalCashNet || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>UPI/QR (Net)</span>
                          <span className="font-medium text-primary">₹{summary.totalQrNet || 0}</span>
                        </div>

                        {summary.upiBreakdown?.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-border/50">
                            <p className="text-[10px] uppercase font-bold text-text-muted mb-1.5 tracking-wider">UPI Breakdown</p>
                            {summary.upiBreakdown.map((upi, idx) => (
                              <div key={idx} className="flex justify-between text-xs mb-1">
                                <span className="text-text-muted truncate max-w-[120px]" title={upi.upiId}>
                                  {upi.upiId} <span className="opacity-50">({upi.transactionCount})</span>
                                </span>
                                <span className="font-mono text-text">₹{upi.totalAmount}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-between text-sm mt-2 border-t border-border pt-1">
                          <span>System Expected Cash</span>
                          <span className="font-bold text-primary">₹{expectedCash}</span>
                        </div>
                      </div>
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

                    {/* Shift-wise Breakdown */}
                    <div className="pt-2">
                      <h4 className="text-sm font-semibold mb-3">Shift-wise Breakdown</h4>
                      <div className="space-y-3">
                        {summary.shiftSummaries?.map((shift) => (
                          <div
                            key={shift._id}
                            className="bg-surface p-3.5 rounded-xl border border-border flex flex-col sm:flex-row justify-between sm:items-center gap-3 transition-colors hover:border-primary/40"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-text">{shift.shiftName || shift.shiftNo}</p>
                              <p className="text-xs text-text-muted mt-0.5">
                                Invoices: {shift.invoiceCount} (Cash: {shift.cashInvoiceCount}, UPI: {shift.paymentQrCount})
                              </p>
                            </div>
                            <div className="text-left sm:text-right">
                              <p className="text-sm font-bold text-success">Sales: ₹{shift.netSales}</p>
                              <p className="text-xs text-text-muted mt-0.5">
                                Cash: ₹{shift.cashNet} | QR: ₹{shift.qrNet}
                              </p>
                            </div>
                            <div className="text-left sm:text-right sm:pl-4 sm:border-l border-border">
                              <p className="text-xs text-text-muted">Expected Cash</p>
                              <p className="text-sm font-bold text-primary">₹{shift.expectedClosingCashAmount}</p>
                              <p className="text-[10px] text-text-muted mt-0.5">Actual: ₹{shift.actualClosingCashAmount}</p>
                            </div>
                            <div className="flex sm:flex-col justify-end sm:pl-3 sm:border-l border-border">
                              <UIButton
                                type="button"
                                variant="outline"
                                size="xs"
                                onClick={() => setSelectedShiftForView(shift)}
                                className="flex items-center gap-1.5 whitespace-nowrap text-xs h-8 px-2.5 font-medium border-border/80 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                              >
                                <Eye className="size-3.5" />
                                <span>View Shift</span>
                              </UIButton>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                              {[
                                ["Opening Float", fmt(s.openingFloatAmount || 0)],
                                ["Cash Sales", fmt(s.cashNet || 0)],
                                ["Expected Cash", fmt(s.expectedClosingCashAmount || 0)],
                                ["Actual Cash", fmt(s.actualClosingCashAmount || 0)],
                              ].map(([label, val]) => (
                                <div key={label} className="bg-surface/80 rounded-lg p-2 border border-border/60">
                                  <p className="text-[10px] text-text-muted font-medium">{label}</p>
                                  <p className="font-mono font-bold text-xs text-text mt-0.5">₹{val}</p>
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

              <Lock className="size-4 mr-1 opacity-80" />
              <span>Lock & Finalize Day Closing</span>
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
        runningAmount={branchCash?.runningCash ?? summary?.currentFrozenCash ?? totalAmount}
      />
    </>
  );
};

export default CloseDayClosingDialog;
