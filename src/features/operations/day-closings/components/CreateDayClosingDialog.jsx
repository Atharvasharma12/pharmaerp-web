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

export const CreateDayClosingDialog = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { createDayClosingStatus, error } = useSelector((state) => state.dayClosing);
  const [note, setNote] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setNote("");
      setLoading(true);
      setApiError(null);
      // Fetch draft summary for today
      const today = new Date().toISOString().split("T")[0];
      apiClient
        .get(`/operations/day-closings/draft-summary?date=${today}`)
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
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!summary || summary.shifts?.length === 0) return;

    const resultAction = await dispatch(
      createDayClosing({
        date: new Date().toISOString().split("T")[0],
        note,
      }),
    );

    if (createDayClosing.fulfilled.match(resultAction)) {
      dispatch(listDayClosings());
      onClose();
    }
  };

  const hasShifts = summary && summary.shifts && summary.shifts.length > 0;

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="md">
      <form onSubmit={handleSubmit}>
        <UIModalHeader>
          <UIModalTitle>Create Day Closing</UIModalTitle>
        </UIModalHeader>
        <UIModalBody className="space-y-4 py-4">
          {(error || apiError) && <UIAlert intent="danger" title="Error" description={error || apiError} />}
          
          {loading ? (
            <div className="py-8 text-center text-text-muted">Loading available shifts...</div>
          ) : apiError ? (
            <div className="py-8 text-center text-text-danger">
              Please resolve the errors before proceeding.
            </div>
          ) : !hasShifts ? (
            <div className="py-8 text-center text-text-muted">
              {summary?.message || "No closed shifts available to day-close today."}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-surface-secondary p-4 rounded-lg border border-border">
                <h4 className="text-sm font-semibold mb-3">Day Closing Preview</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-muted">Total Shifts</p>
                    <p className="text-lg font-bold">{summary.shifts.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Total Invoices</p>
                    <p className="text-lg font-bold">{summary.totalInvoiceCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Expected Cash</p>
                    <p className="text-lg font-bold text-primary">₹{summary.totalExpected}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Net Sales</p>
                    <p className="text-lg font-bold text-success">₹{summary.totalNetSales}</p>
                  </div>
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
  );
};
