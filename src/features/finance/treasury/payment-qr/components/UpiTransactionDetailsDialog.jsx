// src/features/finance/treasury/payment-qr/components/UpiTransactionDetailsDialog.jsx

import React, { useState } from "react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalBody,
  UIModalFooter,
  UIBadge,
  UIButton,
} from "@/components/ui";
import {
  QrCode,
  Landmark,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  Clock,
  User,
  Receipt,
  Banknote,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const formatCurrency = (val) => {
  if (val === undefined || val === null || isNaN(Number(val))) return "0.00";
  return Number(val).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (val) => {
  if (!val) return "";
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const renderProviderBadge = (provider) => {
  const raw = String(provider || "").toUpperCase();
  let bg = "bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20";
  if (raw === "GPAY") bg = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30";
  else if (raw === "PHONEPE") bg = "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30";
  else if (raw === "PAYTM") bg = "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30";
  else if (raw === "BHIM") bg = "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30";
  else if (raw === "RAZORPAY") bg = "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30";
  return (
    <span className={cn("px-1.5 py-0.2 rounded text-[9.5px] font-black uppercase border tracking-wider", bg)}>
      {raw || "UPI"}
    </span>
  );
};

const renderSourceBadge = (sourceType) => {
  switch (sourceType) {
    case "INVOICE":
      return (
        <UIBadge
          variant="soft"
          color="primary"
          icon={<Receipt className="size-3 shrink-0" />}
          className="inline-flex items-center whitespace-nowrap font-semibold text-xs"
        >
          Sale Invoice
        </UIBadge>
      );
    case "CREDIT_SETTLEMENT":
      return (
        <UIBadge
          variant="soft"
          color="warning"
          icon={<CreditCard className="size-3 shrink-0" />}
          className="inline-flex items-center whitespace-nowrap font-semibold text-xs"
        >
          Credit Settlement
        </UIBadge>
      );
    case "ADVANCE_RECEIPT":
      return (
        <UIBadge
          variant="soft"
          color="success"
          icon={<Banknote className="size-3 shrink-0" />}
          className="inline-flex items-center whitespace-nowrap font-semibold text-xs"
        >
          Advance Receipt
        </UIBadge>
      );
    default:
      return (
        <UIBadge
          variant="soft"
          color="neutral"
          className="inline-flex items-center whitespace-nowrap font-semibold text-xs"
        >
          {sourceType || "UPI"}
        </UIBadge>
      );
  }
};

export const UpiTransactionDetailsDialog = ({
  isOpen,
  onClose,
  transaction,
  onOpenInvoiceDrawer,
}) => {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!transaction) return null;

  const {
    id,
    sourceType,
    referenceNo,
    date,
    upiAmount,
    totalAmount,
    isSplit,
    paymentQr,
    customer,
    shift,
    narration,
    status,
    details = {},
  } = transaction;

  const handleCopyUpiId = (e) => {
    e?.stopPropagation();
    const upiId = paymentQr?.upiId;
    if (!upiId) return;
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCopySummary = () => {
    const lines = [
      `UPI Collection Record: ${referenceNo || id}`,
      `Amount: ₹${formatCurrency(upiAmount)}`,
      `UPI ID: ${paymentQr?.upiId || "N/A"}`,
      `Customer: ${customer?.name || "Walk-in"}${customer?.mobile ? ` (${customer.mobile})` : ""}`,
      `Date: ${formatDate(date)} ${formatTime(date)}`,
      `Source: ${sourceType}`,
      paymentQr?.bankAccount?.accountName ? `Settlement Bank: ${paymentQr.bankAccount.accountName}` : null,
    ].filter(Boolean);

    navigator.clipboard.writeText(lines.join("\n"));
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <UIModal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      className="my-auto overflow-hidden max-h-[90vh]"
    >
      {/* ── Compact Header ── */}
      <UIModalHeader className="px-5 py-3 border-b border-border bg-surface shrink-0">
        <div className="flex items-center justify-between gap-3 w-full pr-7">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-8 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <QrCode className="size-4 stroke-[2]" />
            </div>
            <div className="min-w-0 flex items-center gap-2 flex-wrap">
              <UIModalTitle className="text-sm font-bold text-text truncate">
                UPI Transaction
              </UIModalTitle>
              {renderProviderBadge(paymentQr?.provider)}
              <span className="font-mono text-xs font-bold text-text-muted bg-surface-alt px-1.5 py-0.5 rounded border border-border/60">
                {referenceNo}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {renderSourceBadge(sourceType)}
            <UIBadge variant="dot" color="success" className="text-[11px] whitespace-nowrap py-0.5 px-2">
              {status || "Settled"}
            </UIBadge>
          </div>
        </div>
      </UIModalHeader>

      {/* ── Compact Body (Non-scrolling layout) ── */}
      <UIModalBody className="p-4 space-y-3 bg-bg/50">
        {/* ── 1. Amount & Attribution Banner (Unified Single Row) ── */}
        <div className="rounded-xl bg-surface border border-border p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="size-3" />
              Verified UPI Amount
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-text font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                ₹{formatCurrency(upiAmount)}
              </span>
              {isSplit ? (
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  Split of ₹{formatCurrency(totalAmount)}
                </span>
              ) : (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  100% Direct Digital
                </span>
              )}
            </div>
          </div>

          <div className="flex sm:flex-col sm:items-end gap-1 text-xs text-text-muted border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40">
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              <span className="font-medium text-text">{formatDate(date)}</span>
              <span>•</span>
              <Clock className="size-3.5" />
              <span>{formatTime(date)}</span>
            </div>
            {(shift?.shiftName || details?.createdByName) && (
              <div className="text-[11px] text-text-muted truncate">
                {shift?.shiftName ? `${shift.shiftName}` : ""}
                {shift?.shiftName && details?.createdByName ? " · " : ""}
                {details?.createdByName ? `By ${details.createdByName}` : ""}
              </div>
            )}
          </div>
        </div>

        {/* ── 2. Two-Column Compact Grid: Bank Account & Customer ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Box A: UPI Register & Bank Settlement */}
          <div className="rounded-xl border border-border bg-surface p-3 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
              <div className="flex items-center gap-1.5 text-text font-bold text-[11px] uppercase tracking-wider">
                <Landmark className="size-3.5 text-primary" />
                <span>UPI & Settlement Bank</span>
              </div>
              {paymentQr?.upiId && (
                <button
                  type="button"
                  onClick={handleCopyUpiId}
                  className="inline-flex items-center gap-1 text-[10.5px] font-medium text-primary hover:underline cursor-pointer"
                >
                  {copiedUpi ? (
                    <>
                      <Check className="size-3 text-emerald-500" />
                      <span className="text-emerald-500 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" />
                      <span>Copy VPA</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-text-muted text-[11px]">UPI VPA:</span>
                <span className="font-mono font-bold text-text truncate max-w-[180px]">
                  {paymentQr?.upiId || "—"}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-text-muted text-[11px]">Bank:</span>
                <span className="font-semibold text-text truncate max-w-[180px]">
                  {paymentQr?.bankAccount?.accountName || paymentQr?.label || "Corporate Bank"}
                </span>
              </div>
              {paymentQr?.bankAccount?.accountNumber && (
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-text-muted text-[11px]">Account #:</span>
                  <span className="font-mono text-text-muted text-[11px]">
                    {paymentQr.bankAccount.accountNumber}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Box B: Customer & Notes */}
          <div className="rounded-xl border border-border bg-surface p-3 space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 border-b border-border/60 pb-1.5 text-text font-bold text-[11px] uppercase tracking-wider">
              <User className="size-3.5 text-primary" />
              <span>Customer Details</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-text-muted text-[11px]">Name:</span>
                <span className="font-semibold text-text truncate max-w-[180px]">
                  {customer?.name || "Walk-in Retail Customer"}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-text-muted text-[11px]">Phone:</span>
                <span className="font-mono text-text truncate">
                  {customer?.mobile || "—"}
                </span>
              </div>
              {narration && (
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-text-muted text-[11px]">Note:</span>
                  <span className="text-text-muted italic truncate max-w-[180px]">
                    {narration}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── 3. Compact Polymorphic Source Section ── */}
        {sourceType === "INVOICE" && (
          <div className="rounded-xl border border-border bg-surface p-3 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
              <div className="flex items-center gap-1.5 text-text font-bold text-[11px] uppercase tracking-wider">
                <Receipt className="size-3.5 text-primary" />
                <span>Invoice Items ({details?.items?.length || 0})</span>
              </div>

              {onOpenInvoiceDrawer && (
                <UIButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenInvoiceDrawer(transaction)}
                  endIcon={<ExternalLink className="size-3" />}
                  className="h-6 px-2 text-[11px] text-primary font-semibold hover:bg-primary/10 rounded cursor-pointer"
                >
                  View Full Invoice Drawer
                </UIButton>
              )}
            </div>

            <div className="space-y-1.5 text-xs">
              {Array.isArray(details?.items) && details.items.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 max-h-[64px] overflow-hidden">
                  {details.items.slice(0, 4).map((it, idx) => (
                    <span
                      key={it._id || idx}
                      className="inline-flex items-center gap-1 bg-surface-alt px-2 py-0.5 rounded text-[11px] text-text border border-border/60"
                    >
                      <span className="font-medium truncate max-w-[140px]">
                        {it.productName || it.name || "Item"}
                      </span>
                      <span className="font-mono text-text-muted text-[10px]">
                        ×{it.quantity || it.qty || 1}
                      </span>
                      <span className="font-mono font-semibold text-text text-[10.5px]">
                        ₹{formatCurrency(it.total || (it.quantity * it.unitPrice) || 0)}
                      </span>
                    </span>
                  ))}
                  {details.items.length > 4 && (
                    <span className="text-[10.5px] text-text-muted self-center font-medium pl-1">
                      +{details.items.length - 4} more
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-[11px] text-text-muted">
                  Standard retail sales invoice entry
                </div>
              )}

              {isSplit && Array.isArray(details?.payments) && details.payments.length > 0 && (
                <div className="flex items-center gap-2 pt-1 border-t border-border/40 text-[10.5px] text-text-muted">
                  <span className="font-semibold text-text">Payment Split:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {details.payments.map((p, idx) => (
                      <span
                        key={idx}
                        className={cn(
                          "px-1.5 py-0.2 rounded font-mono font-semibold",
                          p.method === "UPI"
                            ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                            : "bg-surface-alt text-text border border-border/60"
                        )}
                      >
                        {p.method}: ₹{formatCurrency(p.amount)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {sourceType === "CREDIT_SETTLEMENT" && (
          <div className="rounded-xl border border-border bg-surface p-3 space-y-2 shadow-2xs">
            <div className="flex items-center gap-1.5 border-b border-border/60 pb-1.5 text-text font-bold text-[11px] uppercase tracking-wider">
              <CreditCard className="size-3.5 text-amber-500" />
              <span>Credit Settlement Breakdown</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-surface-alt/50 p-2 rounded-lg border border-border/50">
                <span className="text-text-muted block text-[10.5px]">Original Bill</span>
                <span className="font-mono font-bold text-text truncate block mt-0.5">
                  {details.invoiceNo || "—"}
                </span>
              </div>
              <div className="bg-surface-alt/50 p-2 rounded-lg border border-border/50">
                <span className="text-text-muted block text-[10.5px]">Total Bill Amount</span>
                <span className="font-mono font-semibold text-text block mt-0.5">
                  ₹{formatCurrency(details.invoiceAmount)}
                </span>
              </div>
              <div className="bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                <span className="text-amber-700 dark:text-amber-300 block text-[10.5px] font-medium">
                  Remaining Due
                </span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400 block mt-0.5">
                  ₹{formatCurrency(details.balanceDue)}
                </span>
              </div>
            </div>
          </div>
        )}

        {sourceType === "ADVANCE_RECEIPT" && (
          <div className="rounded-xl border border-border bg-surface p-3 space-y-2 shadow-2xs">
            <div className="flex items-center gap-1.5 border-b border-border/60 pb-1.5 text-text font-bold text-[11px] uppercase tracking-wider">
              <Banknote className="size-3.5 text-emerald-500" />
              <span>Customer Advance Wallet Deposit</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                <span className="text-emerald-700 dark:text-emerald-300 block text-[10.5px] font-medium">
                  Advance Credited to Wallet
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm block mt-0.5">
                  ₹{formatCurrency(upiAmount)}
                </span>
              </div>
              <div className="bg-surface-alt/50 p-2.5 rounded-lg border border-border/50">
                <span className="text-text-muted block text-[10.5px]">
                  Customer Closing Wallet Balance
                </span>
                <span className="font-mono font-bold text-text text-sm block mt-0.5">
                  ₹{formatCurrency(details.balanceAfter || upiAmount)}
                </span>
              </div>
            </div>
          </div>
        )}
      </UIModalBody>

      {/* ── Compact Footer ── */}
      <UIModalFooter className="px-5 py-2.5 border-t border-border bg-surface flex items-center justify-between shrink-0">
        <UIButton
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleCopySummary}
          startIcon={copiedSummary ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
          className="text-xs h-8"
        >
          {copiedSummary ? "Copied Summary" : "Copy Tally Text"}
        </UIButton>

        <UIButton
          type="button"
          variant="primary"
          size="sm"
          onClick={onClose}
          className="px-5 font-semibold text-xs h-8"
        >
          Close
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
};

export default UpiTransactionDetailsDialog;
