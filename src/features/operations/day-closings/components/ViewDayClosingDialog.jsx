import React, { useEffect, useState } from "react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalBody,
  UIModalFooter,
  UIButton,
} from "@/components/ui";
import { Clock, IndianRupee, QrCode, FileText } from "lucide-react";
import { apiClient } from "@/services";

export const ViewDayClosingDialog = ({ isOpen, onClose, dayClosing }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && dayClosing?._id) {
      setLoading(true);
      apiClient
        .get(`/operations/day-closings/${dayClosing._id}/summary`)
        .then((res) => setSummary(res.data.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setSummary(null);
    }
  }, [isOpen, dayClosing]);

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="xl">
      <UIModalHeader>
        <UIModalTitle>View Day Closing: {dayClosing?.dayClosingNo}</UIModalTitle>
      </UIModalHeader>
      <UIModalBody className="max-h-[75vh] overflow-y-auto">
        {loading ? (
          <div className="py-10 text-center text-text-muted">Loading summary...</div>
        ) : !summary ? (
          <div className="py-10 text-center text-text-muted">No summary available.</div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-muted">Date</p>
                <p className="text-sm font-medium">{new Date(summary.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Status</p>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${summary.status === 'draft' ? 'bg-primary/10 text-primary' : 'bg-text-muted/10 text-text'}`}>
                  {summary.status.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-xs text-text-muted">Created By</p>
                <p className="text-sm font-medium">{summary.createdBy?.name || "System"}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Total Shifts</p>
                <p className="text-sm font-medium">{summary.shifts?.length || 0}</p>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-4">
                <IndianRupee className="w-4 h-4" /> Day Cash Summary
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-surface-secondary p-3 rounded-lg border border-border">
                  <p className="text-xs text-text-muted">Total Expected Closing</p>
                  <p className="text-lg font-bold">₹{summary.expectedClosingCashAmount || 0}</p>
                </div>
                <div className="bg-surface-secondary p-3 rounded-lg border border-border">
                  <p className="text-xs text-text-muted">Total Actual Closing</p>
                  <p className="text-lg font-bold">₹{summary.actualClosingCashAmount || 0}</p>
                </div>
                <div className="bg-surface-secondary p-3 rounded-lg border border-border">
                  <p className="text-xs text-text-muted">Difference</p>
                  <p className={`text-lg font-bold ${summary.cashDifferenceAmount === 0 ? 'text-success' : 'text-error'}`}>
                    ₹{summary.cashDifferenceAmount || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4" /> Operations Totals
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-text-muted">Total Invoices</p>
                  <p className="text-sm font-medium">{summary.totalInvoiceCount}</p>
                  <div className="mt-1 space-y-0.5">
                    <p className="text-[10px] text-text-muted">Cash: {summary.totalCashInvoiceCount || 0}</p>
                    <p className="text-[10px] text-text-muted">UPI: {summary.totalPaymentQrCount || 0}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Net Sales</p>
                  <p className="text-sm font-medium text-success">₹{summary.totalNetSales}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Cash Net</p>
                  <p className="text-sm font-medium text-success">₹{summary.totalCashNet}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">QR Net</p>
                  <p className="text-sm font-medium text-primary">₹{summary.totalQrNet}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
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
          </div>
        )}
      </UIModalBody>
      <UIModalFooter>
        <UIButton variant="ghost" onClick={onClose}>
          Close
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
};
