import React, { useEffect, useState } from "react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalBody,
  UIModalFooter,
  UIButton,
} from "@/components/ui";
import { Clock, IndianRupee, QrCode, FileText, Eye, ArrowLeftRight, Banknote } from "lucide-react";
import { apiClient } from "@/services";
import { ViewShiftDialog } from "@/features/operations/shifts/components/ViewShiftDialog";
import { ShiftFundTransferPanel } from "@/features/operations/shifts/components/ShiftFundTransferPanel";

const DENOMINATIONS = [500, 200, 100, 50, 20, 10, 5, 2, 1];

export const ViewDayClosingDialog = ({ isOpen, onClose, dayClosing }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedShiftForView, setSelectedShiftForView] = useState(null);

  useEffect(() => {
    if (isOpen && dayClosing?._id) {
      setLoading(true);
      setSelectedShiftForView(null);
      apiClient
        .get(`/operations/day-closings/${dayClosing._id}/summary`)
        .then((res) => setSummary(res.data.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setSummary(null);
      setSelectedShiftForView(null);
    }
  }, [isOpen, dayClosing]);

  return (
    <>
      <UIModal isOpen={isOpen} onClose={onClose} size="xl">
        <UIModalHeader>
          <UIModalTitle>View Day Closing: {dayClosing?.dayClosingNo}</UIModalTitle>
        </UIModalHeader>
        <UIModalBody className="max-h-[75vh] overflow-y-auto">
          {loading ? (
            <div className="py-10 text-center text-text-muted">Loading day closing summary...</div>
          ) : !summary ? (
            <div className="py-10 text-center text-text-muted">No summary available.</div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-text-muted">Business Date</p>
                  <p className="text-sm font-medium">{new Date(summary.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Status</p>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium border ${
                      summary.status === "closed"
                        ? "bg-border/20 text-text border-border"
                        : summary.status === "draft"
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-error/10 text-error border-error/20"
                    }`}
                  >
                    {summary.status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Processed By</p>
                  <p className="text-sm font-medium">{summary.createdBy?.fullName || summary.createdBy?.name || "System"}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Total Shifts</p>
                  <p className="text-sm font-medium">{summary.shifts?.length || 0}</p>
                </div>
              </div>

              {/* Cash Summary */}
              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-semibold flex items-center gap-2 mb-4">
                  <IndianRupee className="w-4 h-4" /> Day Cash Summary
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-surface-secondary p-3 rounded-lg border border-border">
                    <p className="text-xs text-text-muted">Opening Float</p>
                    <p className="text-lg font-bold">₹{summary.openingFloatAmount || 0}</p>
                  </div>
                  <div className="bg-surface-secondary p-3 rounded-lg border border-border">
                    <p className="text-xs text-text-muted">Expected Closing</p>
                    <p className="text-lg font-bold text-primary">₹{summary.expectedClosingCashAmount || 0}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">
                      Opening + Sales
                      {summary.totalWithdrawals > 0 && ` − Withdraw`}
                      {summary.totalDeposits > 0 && ` + Deposit`}
                    </p>
                  </div>
                  <div className="bg-surface-secondary p-3 rounded-lg border border-border">
                    <p className="text-xs text-text-muted">Actual Closing</p>
                    <p className="text-lg font-bold">
                      {summary.status === "closed" ? `₹${summary.actualClosingCashAmount || 0}` : "Pending (Draft)"}
                    </p>
                    {summary.status === "closed" && (
                      <p
                        className={`text-[10px] font-bold mt-0.5 ${
                          summary.cashDifferenceAmount === 0 ? "text-success" : "text-error"
                        }`}
                      >
                        Diff: {summary.cashDifferenceAmount > 0 ? "+" : ""}₹{summary.cashDifferenceAmount || 0}
                      </p>
                    )}
                  </div>
                </div>

                {/* Fund transfer impact cards */}
                {(summary.totalWithdrawals > 0 || summary.totalDeposits > 0) && (
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    {summary.totalWithdrawals > 0 && (
                      <div className="bg-error/5 p-3 rounded-lg border border-error/20">
                        <p className="text-xs text-error">Fund Withdrawals During Day</p>
                        <p className="text-base font-bold text-error">
                          −₹{Number(summary.totalWithdrawals).toLocaleString("en-IN")}
                        </p>
                      </div>
                    )}
                    {summary.totalDeposits > 0 && (
                      <div className="bg-success/5 p-3 rounded-lg border border-success/20">
                        <p className="text-xs text-success">Fund Deposits During Day</p>
                        <p className="text-base font-bold text-success">
                          +₹{Number(summary.totalDeposits).toLocaleString("en-IN")}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Denominations Grid (Opening vs Closing) */}
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
                      {summary.status === "closed" ? "Actual Closing Count" : "Closing Count (Pending)"}
                    </h4>
                    <div className="space-y-1">
                      {DENOMINATIONS.map((note) => {
                        const count = summary.status === "closed"
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
                        <span>₹{summary.status === "closed" ? (summary?.actualClosingCashAmount || 0) : "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Operations Totals */}
              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-semibold flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4" /> Day Operations Totals
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
                    <p className="text-sm font-medium text-success">₹{summary.totalCashNet || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">QR Net</p>
                    <p className="text-sm font-medium text-primary">₹{summary.totalQrNet || 0}</p>
                  </div>
                </div>
              </div>

              {/* Fund Transfers During Day */}
              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-semibold flex items-center gap-2 mb-4">
                  <ArrowLeftRight className="w-4 h-4" /> Fund Transfers During Day
                </h4>
                <ShiftFundTransferPanel
                  withdrawals={summary.withdrawals || []}
                  deposits={summary.deposits || []}
                  totalWithdrawals={summary.totalWithdrawals || 0}
                  totalDeposits={summary.totalDeposits || 0}
                />
              </div>

              {/* Shift-wise Breakdown */}
              <div className="border-t border-border pt-4">
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
                          Cash In: ₹{shift.cashNet} | QR: ₹{shift.qrNet}
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
                    </div>
                  ))}
                </div>
              </div>

              {summary.note && (
                <div className="border-t border-border pt-3">
                  <p className="text-xs text-text-muted font-semibold">Note / Remarks:</p>
                  <p className="text-sm text-text mt-1">{summary.note}</p>
                </div>
              )}
            </div>
          )}
        </UIModalBody>
        <UIModalFooter>
          <UIButton variant="ghost" onClick={onClose}>
            Close
          </UIButton>
        </UIModalFooter>
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
