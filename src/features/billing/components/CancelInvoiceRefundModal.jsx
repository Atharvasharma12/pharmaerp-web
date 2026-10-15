// src/features/billing/components/CancelInvoiceRefundModal.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  AlertTriangle,
  Banknote,
  Wallet,
  Calculator,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Trash2,
  FileText
} from "lucide-react";
import { UIModal, UIButton, UIBadge } from "@/components/ui";
import { CashBreakdownModal } from "@/features/sales/components/CashBreakdownModal";
import { useBranchCash } from "@/features/finance/treasury/cash-management/branch-cash/hooks/useBranchCash";
import useBranch from "@/features/branch/hooks/useBranch";
import { cn } from "@/lib/utils";

const DENOM_THEMES = {
  500: { bg: "bg-purple-500/10 dark:bg-purple-950/20", border: "border-purple-500/30", text: "text-purple-700 dark:text-purple-300" },
  200: { bg: "bg-indigo-500/10 dark:bg-indigo-950/20", border: "border-indigo-500/30", text: "text-indigo-700 dark:text-indigo-300" },
  100: { bg: "bg-blue-500/10 dark:bg-blue-950/20", border: "border-blue-500/30", text: "text-blue-700 dark:text-blue-300" },
  50: { bg: "bg-emerald-500/10 dark:bg-emerald-950/20", border: "border-emerald-500/30", text: "text-emerald-700 dark:text-emerald-300" },
  20: { bg: "bg-amber-500/10 dark:bg-amber-950/20", border: "border-amber-500/30", text: "text-amber-700 dark:text-amber-300" },
  10: { bg: "bg-orange-500/10 dark:bg-orange-950/20", border: "border-orange-500/30", text: "text-orange-700 dark:text-orange-300" },
  5: { bg: "bg-rose-500/10 dark:bg-rose-950/20", border: "border-rose-500/30", text: "text-rose-700 dark:text-rose-300" },
  2: { bg: "bg-slate-500/10 dark:bg-slate-900/30", border: "border-slate-500/30", text: "text-slate-700 dark:text-slate-300" },
  1: { bg: "bg-slate-500/10 dark:bg-slate-900/30", border: "border-slate-500/30", text: "text-slate-700 dark:text-slate-300" },
};

const formatCurrency = (val) => {
  const num = Number(val) || 0;
  return `₹${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const CancelInvoiceRefundModal = ({
  isOpen,
  onClose,
  onConfirm,
  invoice,
  isCancelling = false,
}) => {
  const { currentBranch } = useBranch();
  const { fetchBranchCash, runningCash, runningDenominations } = useBranchCash();

  const [refundNotes, setRefundNotes] = useState({});
  const [customerChangeNotes, setCustomerChangeNotes] = useState({});
  const [cancelReason, setCancelReason] = useState("");
  const [isCashKeypadOpen, setIsCashKeypadOpen] = useState(false);

  // Calculate invoice cash amount
  const cashAmount = useMemo(() => {
    if (!isOpen || !invoice) return 0;
    const rawPayments = Array.isArray(invoice.payments) ? invoice.payments : [];
    if (rawPayments.length > 0) {
      let sum = 0;
      for (const p of rawPayments) {
        const type = String(p.paymentType || p.paymentMode || p.type || p.mode || "").toLowerCase();
        if (type.includes("cash")) {
          sum += Number(p.amount || 0);
        }
      }
      return sum;
    }
    const method = String(invoice.paymentMode || invoice.paymentMethod || "").toLowerCase();
    if (method === "cash") {
      return Number(invoice.grandTotal || invoice.amount || 0);
    }
    return 0;
  }, [isOpen, invoice]);

  const hasCashPortion = cashAmount > 0;

  // Fetch live branch running cash drawer when modal opens
  useEffect(() => {
    if (isOpen) {
      const branchId = invoice?.branchId || currentBranch?._id;
      if (branchId) {
        fetchBranchCash(branchId);
      }
    }
  }, [isOpen, invoice?.branchId, currentBranch?._id, fetchBranchCash]);

  // Initialize refund notes cleanly on open (Do NOT prefill denominations)
  useEffect(() => {
    if (isOpen) {
      setRefundNotes({});
      setCustomerChangeNotes({});
      setCancelReason("");
      setIsCashKeypadOpen(false);
    }
  }, [isOpen]);

  // Total cash dispensed from drawer
  const refundTotal = useMemo(() => {
    return Object.entries(refundNotes).reduce(
      (sum, [denom, qty]) => sum + Number(denom) * (Number(qty) || 0),
      0
    );
  }, [refundNotes]);

  // Total change returned by customer into drawer
  const customerChangeTotal = useMemo(() => {
    return Object.entries(customerChangeNotes).reduce(
      (sum, [denom, qty]) => sum + Number(denom) * (Number(qty) || 0),
      0
    );
  }, [customerChangeNotes]);

  // Net cash deducted from drawer = Cash Dispensed - Customer Change Received
  const netRefundTotal = refundTotal - customerChangeTotal;
  const difference = cashAmount - netRefundTotal;
  const isExactMatch = Math.abs(difference) < 0.01 && refundTotal > 0;

  // Active dispensed notes list sorted descending
  const activeNotesList = useMemo(() => {
    return Object.entries(refundNotes)
      .filter(([, qty]) => Number(qty) > 0)
      .map(([denom, qty]) => ({ denomination: Number(denom), quantity: Number(qty) }))
      .sort((a, b) => b.denomination - a.denomination);
  }, [refundNotes]);

  // Active customer change notes list sorted descending
  const activeCustomerChangeList = useMemo(() => {
    return Object.entries(customerChangeNotes)
      .filter(([, qty]) => Number(qty) > 0)
      .map(([denom, qty]) => ({ denomination: Number(denom), quantity: Number(qty) }))
      .sort((a, b) => b.denomination - a.denomination);
  }, [customerChangeNotes]);

  // Handle keypad confirmation from CashBreakdownModal (in mode="cancel")
  const handleConfirmKeypad = (result) => {
    if (result) {
      setRefundNotes(result.dispensed || result.received || {});
      setCustomerChangeNotes(result.customerChange || result.returned || {});
    }
    setIsCashKeypadOpen(false);
  };

  const handleClearNotes = () => {
    setRefundNotes({});
    setCustomerChangeNotes({});
  };

  const handleProceedCancel = async () => {
    if (hasCashPortion && !isExactMatch) return;
    const formattedRefundDenoms = activeNotesList;
    const formattedChangeDenoms = activeCustomerChangeList;
    await onConfirm({
      cancelReason: cancelReason.trim() || "Sale Cancelled by Staff",
      refundDenominations: hasCashPortion ? formattedRefundDenoms : [],
      customerChangeDenominations: hasCashPortion ? formattedChangeDenoms : [],
    });
  };

  if (!isOpen || !invoice) return null;

  return (
    <>
      <UIModal
        isOpen={isOpen}
        onClose={onClose}
        title="Cancel Sale Bill & Refund"
        closeOnEsc={!isCancelling}
        showCloseButton={!isCancelling}
        size="md"
      >
        <div className="p-5 space-y-4 font-sans">
          {/* Header Warning Strip */}
          <div className="flex items-start gap-3 p-3 rounded-xl border border-error/25 bg-error-soft/30">
            <div className="size-9 rounded-lg bg-error text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-text">
                  Cancel Invoice #{invoice.invoiceNo}
                </h3>
                <UIBadge variant="soft" color="neutral" className="font-mono text-[10.5px]">
                  {invoice.billingMode || "Retail"}
                </UIBadge>
              </div>
              <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                Cancelling will revert items back to inventory and void all financial ledger entries.
              </p>
            </div>
          </div>

          {/* Bill Summary Row */}
          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl border border-border bg-surface-alt/40 text-center">
            <div>
              <span className="text-[10px] font-bold text-text-muted uppercase block">Total Bill</span>
              <span className="text-sm font-mono font-bold text-text">
                {formatCurrency(invoice.grandTotal || invoice.amount)}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-text-muted uppercase block">Payment Mode</span>
              <span className="text-xs font-bold text-text">
                {invoice.paymentMode || invoice.paymentMethod || "Cash"}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-text-muted uppercase block">Cash Refund Due</span>
              <span className={cn("text-sm font-mono font-bold", hasCashPortion ? "text-error" : "text-text-muted")}>
                {formatCurrency(cashAmount)}
              </span>
            </div>
          </div>

          {/* ── CASH REFUND DENOMINATIONS SECTION (If Cash Paid) ── */}
          {hasCashPortion ? (
            <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Banknote className="size-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                    Cash Drawer Refund Notes
                  </span>
                </div>
                {/* Live Cash Drawer Balance */}
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-text-muted">
                  <Wallet className="size-3.5 text-success" />
                  <span>Drawer: <strong className="font-mono text-success font-bold">{formatCurrency(runningCash || 0)}</strong></span>
                </div>
              </div>

              {/* Status & Amount Verification */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface border border-border">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-text-muted">Net Cash Refund:</span>
                    <span className={cn(
                      "text-base font-mono font-bold",
                      isExactMatch ? "text-success" : "text-error"
                    )}>
                      {formatCurrency(netRefundTotal)}
                    </span>
                  </div>
                  {customerChangeTotal > 0 && (
                    <span className="text-[10.5px] text-text-muted font-medium block">
                      (Dispensed: {formatCurrency(refundTotal)} - Customer Change: {formatCurrency(customerChangeTotal)})
                    </span>
                  )}
                </div>

                <div className="text-right">
                  {isExactMatch ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-success">
                      <CheckCircle2 className="size-3.5" />
                      Exact Match (100%)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-error">
                      <AlertCircle className="size-3.5" />
                      {refundTotal === 0
                        ? `Target ${formatCurrency(cashAmount)}`
                        : difference > 0
                        ? `Short by ${formatCurrency(difference)}`
                        : `Over by ${formatCurrency(Math.abs(difference))}`}
                    </span>
                  )}
                </div>
              </div>

              {/* Active Notes Badges Display */}
              <div className="space-y-2">
                {activeNotesList.length > 0 ? (
                  <>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10.5px] font-bold text-text-muted">
                        <span>Dispensed from Drawer ({activeNotesList.reduce((s, n) => s + n.quantity, 0)} pcs):</span>
                        <span className="font-mono">{formatCurrency(refundTotal)}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {activeNotesList.map((n) => {
                          const theme = DENOM_THEMES[n.denomination] || {
                            bg: "bg-surface-alt",
                            border: "border-border",
                            text: "text-text",
                          };
                          return (
                            <span
                              key={`dispensed-${n.denomination}`}
                              className={cn(
                                "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-mono font-bold shadow-2xs",
                                theme.bg,
                                theme.border,
                                theme.text
                              )}
                            >
                              <span>₹{n.denomination}</span>
                              <span className="opacity-60 text-[10.5px]">×</span>
                              <span>{n.quantity}</span>
                              <span className="text-[10px] opacity-75 font-normal ml-0.5">
                                (= ₹{n.denomination * n.quantity})
                              </span>
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Customer Change Received (if any) */}
                    {activeCustomerChangeList.length > 0 && (
                      <div className="space-y-1 pt-1.5 border-t border-border/50">
                        <div className="flex items-center justify-between text-[10.5px] font-bold text-emerald-700 dark:text-emerald-300">
                          <span>Change Received from Customer ({activeCustomerChangeList.reduce((s, n) => s + n.quantity, 0)} pcs):</span>
                          <span className="font-mono text-emerald-600">+{formatCurrency(customerChangeTotal)}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {activeCustomerChangeList.map((n) => (
                            <span
                              key={`change-${n.denomination}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold shadow-2xs"
                            >
                              <span>₹{n.denomination}</span>
                              <span className="opacity-60 text-[10.5px]">×</span>
                              <span>{n.quantity}</span>
                              <span className="text-[10px] opacity-75 font-normal ml-0.5">
                                (= ₹{n.denomination * n.quantity})
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-3 rounded-lg border border-dashed border-amber-500/40 bg-amber-500/5 text-center text-xs text-amber-700 dark:text-amber-300 flex items-center justify-center gap-2">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>Please open the Cash Drawer to count and select the physical refund notes (Target: ₹{cashAmount.toFixed(2)}).</span>
                  </div>
                )}
              </div>

              {/* Denomination Action Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-amber-500/20">
                {activeNotesList.length > 0 && (
                  <UIButton
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={handleClearNotes}
                    startIcon={<RotateCcw className="size-3" />}
                    className="h-8 text-xs font-semibold"
                    title="Clear selected refund notes"
                  >
                    Clear Notes
                  </UIButton>
                )}

                <UIButton
                  type="button"
                  variant={activeNotesList.length > 0 ? "outline" : "soft"}
                  size="xs"
                  onClick={() => setIsCashKeypadOpen(true)}
                  startIcon={<Calculator className="size-3.5" />}
                  className={cn(
                    "h-8 text-xs font-bold flex-1 border",
                    activeNotesList.length === 0
                      ? "border-amber-400/60 text-amber-700 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20"
                      : "border-primary/30 text-primary hover:bg-primary/10"
                  )}
                >
                  {activeNotesList.length > 0 ? "Edit Refund & Change Notes" : "Select Refund Notes (Cash Drawer) *"}
                </UIButton>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl border border-info/30 bg-info-soft/10 text-xs text-text-muted flex items-center gap-2">
              <CheckCircle2 className="size-4 text-info shrink-0" />
              <span>
                Non-cash invoice ({invoice.paymentMode || invoice.paymentMethod || "Digital"}). No physical cash refund required from the drawer.
              </span>
            </div>
          )}

          {/* Cancellation Reason Input */}
          <div className="space-y-1">
            <label className="text-[10.5px] font-bold uppercase tracking-wider text-text-muted block">
              Reason for Cancellation (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Customer returned items, billing error, wrong medicine"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full h-8.5 rounded-lg border border-border bg-surface-alt text-xs text-text px-2.5 focus:border-primary focus:outline-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end items-center gap-2.5 pt-3 border-t border-border">
            <UIButton
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isCancelling}
            >
              Keep Bill
            </UIButton>

            <UIButton
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleProceedCancel}
              isLoading={isCancelling}
              loadingText="Cancelling Bill..."
              disabled={isCancelling || (hasCashPortion && !isExactMatch)}
              startIcon={<Trash2 className="size-4" />}
            >
              {hasCashPortion ? `Refund ₹${netRefundTotal > 0 ? netRefundTotal.toFixed(2) : cashAmount.toFixed(2)} & Cancel` : "Yes, Cancel Bill"}
            </UIButton>
          </div>
        </div>
      </UIModal>

      {/* Embedded CashBreakdownModal in mode="cancel" for full interactive note selection */}
      <CashBreakdownModal
        mode="cancel"
        isOpen={isCashKeypadOpen}
        onClose={() => setIsCashKeypadOpen(false)}
        onConfirm={handleConfirmKeypad}
        targetAmount={cashAmount}
        initialReceived={refundNotes}
        initialReturned={customerChangeNotes}
        availableDenominations={runningDenominations || []}
        availableBalance={runningCash || 0}
        cashAccountName="Branch Cash (Running Drawer)"
      />
    </>
  );
};

export default CancelInvoiceRefundModal;
