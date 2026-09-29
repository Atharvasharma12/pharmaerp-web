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
import { apiClient } from "@/services";
import { FileText, IndianRupee, QrCode } from "lucide-react";

export const CloseDayClosingDialog = ({ isOpen, onClose, dayClosing }) => {
  const dispatch = useDispatch();
  const { updateDayClosingStatusStatus, error } = useSelector((state) => state.dayClosing);

  const [note, setNote] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && dayClosing?._id) {
      setLoading(true);
      apiClient
        .get(`/operations/day-closings/${dayClosing._id}/summary`)
        .then((res) => {
          setSummary(res.data.data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setSummary(null);
      setNote("");
    }
  }, [isOpen, dayClosing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!summary) return;

    const resultAction = await dispatch(
      updateDayClosingStatus({
        id: dayClosing._id,
        payload: {
          status: "closed",
          note,
        },
      }),
    );

    if (updateDayClosingStatus.fulfilled.match(resultAction)) {
      dispatch(listDayClosings());
      onClose();
    }
  };

  return (
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

              <div className="bg-error/10 p-4 rounded-lg border border-error/20 mb-4 text-error">
                <h4 className="text-sm font-semibold mb-1">Confirm Day Closing Lock</h4>
                <p className="text-xs">
                  Locking this day closing will finalize the entire day. No further shifts or billing can be performed for this date.
                </p>
              </div>

              {summary && (
                <>
                  {/* Totals Summary */}
                  <div className="grid grid-cols-2 gap-4 border-b border-border pb-4">
                    <div className="bg-surface-secondary p-3 rounded-lg border border-border">
                      <h4 className="text-xs font-semibold flex items-center gap-2 mb-2 text-text-muted">
                        <FileText className="w-3 h-3" /> Day Totals
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
                        <IndianRupee className="w-3 h-3" /> Day Cash/QR
                      </h4>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Cash (Net)</span>
                        <span className="font-medium text-success">₹{summary.totalCashNet || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>UPI/QR (Net)</span>
                        <span className="font-medium text-primary">₹{summary.totalQrNet || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1 mt-2">
                        <span>Total Expected Cash</span>
                        <span className="font-medium text-primary">₹{summary.expectedClosingCashAmount || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Total Actual Cash</span>
                        <span className="font-medium">₹{summary.actualClosingCashAmount || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1 border-t border-border mt-2 pt-2">
                        <span>Difference</span>
                        <span className={`font-bold ${summary.cashDifferenceAmount === 0 ? 'text-success' : 'text-error'}`}>
                          ₹{summary.cashDifferenceAmount || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Shift-wise Breakdown */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Shift-wise Breakdown</h4>
                    <div className="space-y-3">
                      {summary.shiftSummaries?.map((shift) => (
                        <div key={shift._id} className="bg-surface p-3 rounded border border-border flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">{shift.shiftName || shift.shiftNo}</p>
                            <p className="text-xs text-text-muted mt-1">
                              Invoices: {shift.invoiceCount} (Cash: {shift.cashInvoiceCount}, UPI: {shift.paymentQrCount})
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-success">Sales: ₹{shift.netSales}</p>
                            <p className="text-xs text-text-muted mt-1">
                              Cash In: ₹{shift.cashNet} | QR: ₹{shift.qrNet}
                            </p>
                          </div>
                          <div className="text-right pl-4 border-l border-border">
                            <p className="text-xs text-text-muted">Expected Cash</p>
                            <p className="text-sm font-bold">₹{shift.expectedClosingCashAmount}</p>
                            <p className="text-[10px] text-text-muted mt-0.5">Actual: ₹{shift.actualClosingCashAmount}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <UIInput
                label="Closing Note (Optional)"
                placeholder="Any remarks before locking..."
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
            isLoading={updateDayClosingStatusStatus === "loading"}
          >
            Lock Day Closing
          </UIButton>
        </UIModalFooter>
      </form>
    </UIModal>
  );
};
