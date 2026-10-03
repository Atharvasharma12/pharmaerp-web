import React, { useEffect, useState } from "react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalBody,
  UIModalFooter,
  UIButton,
} from "@/components/ui";
import { Clock, IndianRupee, QrCode, FileText, ArrowLeftRight } from "lucide-react";
import { apiClient } from "@/services";
import { ShiftFundTransferPanel } from "./ShiftFundTransferPanel";

const DENOMINATIONS = [500, 200, 100, 50, 20, 10, 5, 2, 1];

export const ViewShiftDialog = ({ isOpen, onClose, shift }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const getFallbackShiftName = () => {
    if (summary?.shiftName) return summary.shiftName;
    if (shift?.shiftName) return shift.shiftName;
    const hour = new Date(shift?.openedAt || shift?.createdAt || new Date()).getHours();
    if (hour < 12) return "Morning Shift";
    if (hour < 17) return "Afternoon Shift";
    if (hour < 20) return "Evening Shift";
    return "Night Shift";
  };

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="lg">
      <UIModalHeader>
        <UIModalTitle>View Shift: {shift?.shiftNo}</UIModalTitle>
      </UIModalHeader>
      <UIModalBody className="max-h-[70vh] overflow-y-auto">
        {loading ? (
          <div className="py-10 text-center text-text-muted">Loading shift summary...</div>
        ) : !summary ? (
          <div className="py-10 text-center text-text-muted">No summary available.</div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-muted">Shift Name</p>
                <p className="text-sm font-medium">{getFallbackShiftName()}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Business Date</p>
                <p className="text-sm font-medium">{new Date(summary.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Status</p>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${summary.status === 'open' ? 'bg-success/10 text-success' : 'bg-text-muted/10 text-text'}`}>
                  {summary.status.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-xs text-text-muted">Opened By</p>
                <p className="text-sm font-medium">{summary.openedBy?.name || "System"}</p>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-4">
                <IndianRupee className="w-4 h-4" /> Cash Summary
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-surface-secondary p-3 rounded-lg border border-border">
                  <p className="text-xs text-text-muted">Opening Float</p>
                  <p className="text-lg font-bold">₹{summary.openingFloatAmount || 0}</p>
                </div>
                <div className="bg-surface-secondary p-3 rounded-lg border border-border">
                  <p className="text-xs text-text-muted">Expected Closing</p>
                  <p className="text-lg font-bold">₹{summary.expectedClosingCashAmount || 0}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    Opening + Sales
                    {summary.totalWithdrawals > 0 && ` − Withdraw`}
                    {summary.totalDeposits > 0 && ` + Deposit`}
                  </p>
                </div>
                <div className="bg-surface-secondary p-3 rounded-lg border border-border">
                  <p className="text-xs text-text-muted">Actual Closing</p>
                  <p className="text-lg font-bold">₹{summary.actualClosingCashAmount || 0}</p>
                </div>
              </div>

              {/* Fund transfer impact cards */}
              {(summary.totalWithdrawals > 0 || summary.totalDeposits > 0) && (
                <div className="grid grid-cols-2 gap-4 mt-3">
                  {summary.totalWithdrawals > 0 && (
                    <div className="bg-error/5 p-3 rounded-lg border border-error/20">
                      <p className="text-xs text-error">Fund Withdrawals</p>
                      <p className="text-base font-bold text-error">
                        −₹{Number(summary.totalWithdrawals).toLocaleString("en-IN")}
                      </p>
                    </div>
                  )}
                  {summary.totalDeposits > 0 && (
                    <div className="bg-success/5 p-3 rounded-lg border border-success/20">
                      <p className="text-xs text-success">Fund Deposits</p>
                      <p className="text-base font-bold text-success">
                        +₹{Number(summary.totalDeposits).toLocaleString("en-IN")}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Denominations Grid */}
              <div className="grid grid-cols-2 gap-6 mt-4">
                {/* 1. Opening Denominations */}
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-text-muted mb-2 border-b border-border pb-1">
                    Opening Count
                  </h4>
                  <div className="space-y-1">
                    {DENOMINATIONS.map((note) => {
                      const count =
                        summary?.openingDenominations?.find((d) => Number(d.denomination) === note)?.count || 0;
                      return (
                        <div key={note} className="flex justify-between items-center text-xs p-1 rounded bg-surface-secondary/50">
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

                {/* 2. Actual Closing Denominations */}
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary mb-2 border-b border-border pb-1">
                    {summary.status === 'closed' ? 'Actual Count' : 'Count Pending (Open)'}
                  </h4>
                  <div className="space-y-1">
                    {DENOMINATIONS.map((note) => {
                      const count = summary.status === 'closed'
                        ? (summary?.closingDenominations?.find((d) => Number(d.denomination) === note)?.count || 0)
                        : "-";
                      return (
                        <div key={note} className="flex justify-between items-center text-xs p-1 rounded bg-surface-secondary/50">
                          <span className="font-medium text-text-muted">₹{note}</span>
                          <span className="text-text-muted text-[10px]">×</span>
                          <span className="font-mono text-text">{count}</span>
                        </div>
                      );
                    })}
                    <div className="flex justify-between items-center text-xs p-1 rounded bg-surface-alt font-bold mt-2 pt-2 border-t border-border">
                      <span>Total</span>
                      <span>₹{summary.status === 'closed' ? (summary?.actualClosingCashAmount || 0) : "-"}</span>
                    </div>
                  </div>
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
                  <p className="text-sm font-medium">{summary.invoiceCount}</p>
                  <div className="mt-1 space-y-0.5">
                    <p className="text-[10px] text-text-muted">Cash: {summary.cashInvoiceCount || 0}</p>
                    <p className="text-[10px] text-text-muted">UPI: {summary.paymentQrCount || 0}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Net Sales</p>
                  <p className="text-sm font-medium text-success">₹{summary.netSales}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Returns Count</p>
                  <p className="text-sm font-medium">{summary.returnCount}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Refund Amount</p>
                  <p className="text-sm font-medium text-error">₹{summary.returnAmount}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-4">
                <QrCode className="w-4 h-4" /> Payment QR Summary
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-text-muted">QR Count</p>
                  <p className="text-sm font-medium">{summary.paymentQrCount}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">QR Net Total</p>
                  <p className="text-sm font-medium text-primary">₹{summary.qrNet}</p>
                </div>
              </div>
            </div>

            {/* ── Fund Transfers Section ── */}
            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-4">
                <ArrowLeftRight className="w-4 h-4" /> Fund Transfers During Shift
              </h4>
              <ShiftFundTransferPanel
                withdrawals={summary.withdrawals || []}
                deposits={summary.deposits || []}
                totalWithdrawals={summary.totalWithdrawals || 0}
                totalDeposits={summary.totalDeposits || 0}
              />
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
