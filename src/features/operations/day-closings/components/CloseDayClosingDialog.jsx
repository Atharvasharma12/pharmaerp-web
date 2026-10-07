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
      })
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
            <UIModalTitle>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-amber-600 text-white shadow-md shadow-rose-500/20">
                  <Lock className="h-5.5 w-5.5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-text tracking-tight">
                      Lock Day Closing
                    </h3>
                    {dayClosing?.dayClosingNo && (
                      <UIBadge variant="soft" color="rose" className="text-[10px] py-0 px-2 font-mono font-bold">
                        {dayClosing.dayClosingNo}
                      </UIBadge>
                    )}
                  </div>
                  <p className="text-xs font-medium text-text-muted mt-0.5">
                    Reconcile drawer denominations and lock daily business ledger
                  </p>
                </div>
              </div>
            </UIModalTitle>
          </UIModalHeader>

          <UIModalBody className="max-h-[75vh] overflow-y-auto space-y-5 py-4">
            {loading ? (
              <div className="py-16 text-center text-text-muted">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-3" />
                <p className="text-xs font-medium">Loading day closing data...</p>
              </div>
            ) : (
              <div className="space-y-5">
                {error && <UIAlert intent="danger" title="Error" description={error} />}

                {/* Lock Action Notice Alert */}
                <UIAlert
                  intent="warning"
                  title="Confirm Financial Lock"
                  description="Locking this day closing will finalize the entire day. No further shifts or billing operations can be performed for this business date."
                />

                {/* Cash Account Status Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <UIStatCard
                    title="Running Cash (Active)"
                    value={`₹${fmt(branchCash?.runningCash ?? summary?.currentRunningCash ?? 0)}`}
                    subtext="Active in counter drawer partition"
                    color="emerald"
                    icon={Banknote}
                  />

                  <UIStatCard
                    title="Frozen Cash (Reserve)"
                    value={`₹${fmt(branchCash?.frozenCash ?? summary?.currentFrozenCash ?? 0)}`}
                    subtext="Locked cash awaiting deposit"
                    color="blue"
                    icon={Snowflake}
                  />
                </div>

                {summary && (
                  <>
                    {/* Payment Method Breakdown */}
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2.5 flex items-center gap-1.5">
                        <QrCode className="size-3.5 text-primary" /> Payment Method Breakdown
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3.5">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                            <Banknote className="size-3.5" /> Cash Collections
                          </div>
                          <p className="font-mono font-bold text-xl text-emerald-600 dark:text-emerald-400">
                            ₹{fmt(summary.totalCashNet)}
                          </p>
                          <p className="text-[11px] text-text-muted mt-0.5 font-medium">
                            {summary.totalCashInvoiceCount || 0} cash bills
                          </p>
                        </div>

                        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-3.5">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                            <QrCode className="size-3.5" /> UPI / QR Digital
                          </div>
                          <p className="font-mono font-bold text-xl text-indigo-600 dark:text-indigo-400">
                            ₹{fmt(summary.totalQrNet)}
                          </p>
                          <p className="text-[11px] text-text-muted mt-0.5 font-medium">
                            {summary.totalPaymentQrCount || 0} QR invoices
                          </p>
                        </div>
                      </div>

                      {summary.totalNetSales !== undefined && (
                        <div className="mt-2.5 bg-surface-alt/70 border border-border/70 rounded-xl p-3.5 flex justify-between items-center">
                          <span className="text-xs font-bold text-text">Total Net Sales (All Shifts)</span>
                          <span className="font-mono font-bold text-lg text-primary">₹{fmt(summary.totalNetSales)}</span>
                        </div>
                      )}
                    </div>

                    {/* Fund Transfers Section */}
                    {(summary.withdrawals?.length > 0 || summary.deposits?.length > 0) && (
                      <div className="border border-border/70 rounded-xl p-4 bg-surface-alt/50 shadow-2xs">
                        <h4 className="text-xs font-bold text-text uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <ArrowLeftRight className="size-3.5 text-primary" />
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

                    {/* Cash Drawer Reconciliation Overview */}
                    <div className="space-y-3">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                        <Banknote className="size-3.5 text-primary" /> Cash Drawer Reconciliation
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <UIStatCard
                          title="1. Opening Cash"
                          value={`₹${fmt(summary?.openingFloatAmount || 0)}`}
                          subtext="Initial drawer balance"
                          color="slate"
                        />
                        <UIStatCard
                          title="2. System Expected"
                          value={`₹${fmt(expectedCash)}`}
                          subtext="Opening + Net Cash Sales"
                          color="blue"
                        />
                        <UIStatCard
                          title="3. Actual Counted"
                          value={`₹${fmt(totalAmount)}`}
                          subtext={cashDifference === 0 ? "Exact balance match" : cashDifference > 0 ? `+₹${fmt(cashDifference)} overage` : `-₹${fmt(Math.abs(cashDifference))} shortage`}
                          color={cashDifference === 0 ? "emerald" : cashDifference > 0 ? "amber" : "rose"}
                        />
                      </div>
                    </div>

                    {/* 3-Column Denominations Grid */}
                    <div className="border border-border/70 rounded-xl p-4 bg-surface-alt/50 shadow-2xs">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-3">
                        Denomination Breakdown Comparison
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {/* 1. Opening Denominations */}
                        <div>
                          <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2 border-b border-border/60 pb-1">
                            1. Opening
                          </p>
                          <div className="space-y-1">
                            {DENOMINATIONS.map((note) => {
                              const count =
                                summary?.openingDenominations?.find(
                                  (d) => Number(d.denomination) === note
                                )?.count || 0;
                              return (
                                <div
                                  key={note}
                                  className="flex justify-between items-center text-xs p-1 px-2 rounded bg-surface/80 border border-border/50 font-mono"
                                >
                                  <span className="font-semibold text-text-muted">₹{note}</span>
                                  <span className="text-text-muted text-[10px]">×</span>
                                  <span className="font-bold text-text">{count}</span>
                                </div>
                              );
                            })}
                            <div className="flex justify-between items-center text-xs p-1.5 px-2 rounded bg-surface font-bold font-mono mt-2 border-t border-border">
                              <span>Total</span>
                              <span>₹{fmt(summary?.openingFloatAmount || 0)}</span>
                            </div>
                          </div>
                        </div>

                        {/* 2. System Expected Denominations */}
                        <div>
                          <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-2 border-b border-border/60 pb-1">
                            2. Expected
                          </p>
                          <div className="space-y-1">
                            {DENOMINATIONS.map((note) => {
                              const expectedCount =
                                branchCash?.balance?.runningDenominations?.find(
                                  (d) => Number(d.denomination) === note
                                )?.quantity || 0;
                              return (
                                <div
                                  key={note}
                                  className="flex justify-between items-center text-xs p-1 px-2 rounded bg-primary/5 border border-primary/20 font-mono"
                                >
                                  <span className="font-semibold text-text-muted">₹{note}</span>
                                  <span className="text-primary text-[10px]">×</span>
                                  <span className="font-bold text-primary">{expectedCount}</span>
                                </div>
                              );
                            })}
                            <div className="flex justify-between items-center text-xs p-1.5 px-2 rounded bg-primary/10 font-bold font-mono text-primary mt-2 border-t border-primary/20">
                              <span>Total</span>
                              <span>₹{fmt(branchCash?.runningCash || expectedCash)}</span>
                            </div>
                          </div>
                        </div>

                        {/* 3. Actual Counted */}
                        <div>
                          <p className="text-[11px] font-bold text-text uppercase tracking-wider mb-2 border-b border-border/60 pb-1">
                            3. Actual Counted
                          </p>
                          <div className="space-y-1">
                            {DENOMINATIONS.map((note) => (
                              <div key={note} className="flex items-center gap-1.5 p-0.5">
                                <span className="text-xs font-bold font-mono text-text-muted w-8 text-right">
                                  ₹{note}
                                </span>
                                <span className="text-text-muted text-[10px]">×</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={counts[note]}
                                  onChange={(e) => handleCountChange(note, e.target.value)}
                                  className="flex-1 min-w-0 bg-surface border border-border/80 rounded text-text font-mono font-bold text-xs p-1 text-center focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                                  placeholder="0"
                                />
                              </div>
                            ))}
                            <div className="flex justify-between items-center text-xs p-1.5 px-2 rounded bg-surface font-bold font-mono text-text mt-2 border-t border-border">
                              <span>Total</span>
                              <span className="text-emerald-600 dark:text-emerald-400">₹{fmt(totalAmount)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Per-Shift Cards */}
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2.5 flex items-center gap-1.5">
                        <Clock className="size-3.5 text-primary" /> Included Shifts ({summary.shiftSummaries?.length || 0})
                      </h4>
                      <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                        {summary.shiftSummaries?.map((s) => (
                          <div
                            key={s._id}
                            className="bg-surface-alt/60 border border-border/70 rounded-xl p-3.5 hover:border-primary/40 transition duration-150 shadow-2xs"
                          >
                            <div className="flex justify-between items-center gap-3">
                              <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                <p className="font-bold text-xs text-text">{s.shiftName || s.shiftNo || "Shift Session"}</p>
                                {s.shiftNo && (
                                  <span className="text-[10px] font-mono text-text-muted bg-surface p-0.5 px-1.5 rounded border border-border/60">
                                    {s.shiftNo}
                                  </span>
                                )}
                              </div>
                              <UIButton
                                type="button"
                                variant="outline"
                                size="xs"
                                onClick={() => setSelectedShiftForView(s)}
                                className="flex items-center gap-1 text-[11px] h-7 px-2.5 font-medium"
                              >
                                <Eye className="size-3 text-primary" /> View Details
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
                  label="Closing Note / Supervisor Remarks (Optional)"
                  placeholder="Any remarks before locking day closing..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="text-xs"
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

