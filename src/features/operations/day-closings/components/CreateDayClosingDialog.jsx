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
import { Eye } from "lucide-react";
import { ViewShiftDialog } from "@/features/operations/shifts/components/ViewShiftDialog";

export const CreateDayClosingDialog = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { createDayClosingStatus, error } = useSelector((state) => state.dayClosing);
  const { currentBranch } = useBranch();
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
              <div className="space-y-4">
                <div className="bg-surface-secondary p-4 rounded-xl border border-border">
                  <h4 className="text-sm font-semibold mb-3">Day Closing Preview ({selectedDate})</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-text-muted">Total Shifts</p>
                      <p className="text-lg font-bold">{summary.shifts.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Total Invoices</p>
                      <p className="text-lg font-bold">{summary.totalInvoiceCount}</p>
                      <p className="text-[10px] text-text-muted">Cash: {summary.totalCashInvoiceCount || 0} | UPI: {summary.totalPaymentQrCount || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Opening Float</p>
                      <p className="text-lg font-bold">₹{summary.totalOpening || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Expected Cash</p>
                      <p className="text-lg font-bold text-primary">₹{summary.totalExpected}</p>
                    </div>
                  </div>

                  {/* Fund transfer indicators if present */}
                  {(summary.totalWithdrawals > 0 || summary.totalDeposits > 0) && (
                    <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-border">
                      <div className="bg-error/5 p-2 rounded-lg border border-error/15 text-xs">
                        <span className="text-text-muted">Withdrawals: </span>
                        <span className="font-bold text-error tabular-nums">
                          −₹{Number(summary.totalWithdrawals || 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="bg-success/5 p-2 rounded-lg border border-success/15 text-xs">
                        <span className="text-text-muted">Deposits: </span>
                        <span className="font-bold text-success tabular-nums">
                          +₹{Number(summary.totalDeposits || 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Shift-wise Breakdown with View Details button */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Included Shifts ({summary.shifts.length})
                  </h4>
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {summary.shifts.map((shift) => (
                      <div
                        key={shift._id}
                        className="bg-surface p-3 rounded-lg border border-border flex justify-between items-center text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-text truncate">{shift.shiftName || shift.shiftNo}</p>
                          <p className="text-text-muted text-[11px] mt-0.5">
                            Sales: ₹{shift.netSales} | Cash: ₹{shift.cashNet} | Expected: ₹{shift.expectedClosingCashAmount}
                          </p>
                        </div>
                        <UIButton
                          type="button"
                          variant="outline"
                          size="xs"
                          onClick={() => setSelectedShiftForView(shift)}
                          className="flex items-center gap-1.5 text-xs h-7.5 px-2.5 shrink-0"
                        >
                          <Eye className="size-3.5" />
                          <span>View Shift</span>
                        </UIButton>
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
