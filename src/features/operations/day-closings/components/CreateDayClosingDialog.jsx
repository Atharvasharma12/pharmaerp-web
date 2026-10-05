import React, { useEffect, useState } from "react";
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
import { createDayClosing, listDayClosings } from "../store/dayClosingThunk";
import { apiClient } from "@/services";
import useBranch from "@/features/branch/hooks/useBranch";
import useBranchCash from "@/features/finance/treasury/cash-management/branch-cash/hooks/useBranchCash";
import { Eye, Banknote, QrCode, Clock, Snowflake } from "lucide-react";
import { ViewShiftDialog } from "@/features/operations/shifts/components/ViewShiftDialog";

const fmt = (n) => (Number(n) || 0).toLocaleString("en-IN");

export const CreateDayClosingDialog = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { createDayClosingStatus, error } = useSelector((state) => state.dayClosing);
  const { currentBranch } = useBranch();
  const { currentBranchCash: branchCash, fetchBranchCash: getBranchCash } = useBranchCash();
  const getLocalTodayDateString = (date = new Date()) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = getLocalTodayDateString();
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [note, setNote] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [selectedShiftForView, setSelectedShiftForView] = useState(null);

  useEffect(() => {
    if (isOpen && currentBranch?._id) {
      getBranchCash(currentBranch._id);
    }
  }, [isOpen, currentBranch?._id]);

  useEffect(() => {
    if (isOpen) {
      setNote("");
      setLoading(true);
      setApiError(null);
      const branchIdParam = currentBranch?._id ? `&branchId=${currentBranch._id}` : "";
      apiClient
        .get(`/operations/day-closings/draft-summary?date=${selectedDate}${branchIdParam}`)
        .then((res) => setSummary(res.data.data))
        .catch((err) => {
          console.error(err);
          setApiError(err.response?.data?.message || "Failed to fetch shift summary.");
        })
        .finally(() => setLoading(false));
    } else {
      setSummary(null);
      setApiError(null);
    }
  }, [isOpen, selectedDate, currentBranch?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!summary || summary.shifts?.length === 0) return;

    const resultAction = await dispatch(
      createDayClosing({
        date: selectedDate,
        branchId: currentBranch?._id,
        note,
      }),
    );

    if (createDayClosing.fulfilled.match(resultAction)) {
      dispatch(listDayClosings(currentBranch?._id ? { branchId: currentBranch._id } : {}));
      onClose();
    }
  };

  const hasShifts = summary && summary.shifts && summary.shifts.length > 0;

  return (
    <>
      <UIModal isOpen={isOpen} onClose={onClose} size="lg">
        <form onSubmit={handleSubmit}>
          <UIModalHeader>
            <UIModalTitle>Create Day Closing</UIModalTitle>
          </UIModalHeader>
          <UIModalBody className="space-y-4 py-4 max-h-[75vh] overflow-y-auto">
            {/* Date Selection Bar */}
            <div className="bg-surface-secondary p-3.5 rounded-xl border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
                  Business Closing Date
                </label>
                <p className="text-xs text-text-muted">
                  Select the date for which all shifts and transactions will be closed.
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <UIInput
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={todayStr}
                  className="h-9 text-sm font-medium w-full sm:w-44"
                />
              </div>
            </div>

            {(error || apiError) && <UIAlert intent="danger" title="Notice" description={error || apiError} />}
            
            {loading ? (
              <div className="py-8 text-center text-text-muted">Loading available shifts for {selectedDate}...</div>
            ) : apiError ? (
              <div className="py-8 text-center text-text-muted">
                Please select another date or resolve pending shifts before proceeding.
              </div>
            ) : !hasShifts ? (
              <div className="py-8 text-center text-text-muted">
                {summary?.message || `No closed shifts available to day-close for ${selectedDate}.`}
              </div>
            ) : (
                <div className="space-y-6">
                  {/* ── Current Branch Cash Partition: Running & Frozen Cash ── */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-success-soft border border-success/30 rounded-xl p-3.5 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-success mb-1">
                          <Banknote className="size-3.5" /> Current Running Cash (Now)
                        </div>
                        <p className="font-mono font-bold text-2xl text-success">
                          ₹{fmt(branchCash?.runningCash ?? 0)}
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
                          ₹{fmt(branchCash?.frozenCash ?? 0)}
                        </p>
                        <p className="text-[11px] text-info/80 dark:text-info mt-0.5">
                          Locked cash awaiting bank deposit
                        </p>
                      </div>
                    </div>
                  </div>
                  
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
                  </div>

                  {/* ── Per-Shift Cards ──────────────────────────────────────────── */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3 flex items-center gap-2">
                      <Clock className="size-3.5" /> Included Shifts ({summary.shifts.length})
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {summary.shifts.map((s) => (
                        <div
                          key={s._id}
                          className="bg-surface border border-border rounded-xl p-3.5 hover:border-primary/30 transition"
                        >
                          <div className="flex flex-wrap justify-between items-start gap-3">
                            <div>
                              <p className="font-semibold text-sm">{s.shiftName || s.shiftNo || "Shift"}</p>
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
                  
                  <UIInput
                    label="Note (Optional)"
                    placeholder="Any opening remarks..."
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
              variant="primary"
              isLoading={createDayClosingStatus === "loading"}
              disabled={!hasShifts}
            >
              Create Day Closing
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
    </>
  );
};
