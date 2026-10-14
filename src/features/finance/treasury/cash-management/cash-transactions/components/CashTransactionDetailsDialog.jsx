// src/features/finance/treasury/cash-management/cash-transactions/components/CashTransactionDetailsDialog.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  Banknote,
  Copy,
  Check,
  Calendar,
  Clock,
  User,
  ExternalLink,
  Receipt,
  FileText,
  Landmark,
  Coins,
  CreditCard,
  Layers,
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

export const CashTransactionDetailsDialog = ({
  isOpen,
  onClose,
  transaction,
  onOpenInvoiceDrawer,
}) => {
  const [copiedTxnNo, setCopiedTxnNo] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!transaction) return null;

  const {
    transactionNumber,
    transactionType,
    direction,
    amount,
    cashPartition,
    transactionDate,
    referenceNumber,
    narration,
    counterpartyAccountId,
    journalVoucherId,
    cashDenominationId,
    denominations: directDenominations,
    invoice,
    createdBy,
  } = transaction;

  const isCredit = String(direction).toUpperCase() === "CREDIT" || String(transactionType).toUpperCase() === "CASH_IN";

  // Denominations resolution
  const denominationsList =
    cashDenominationId?.denominations || directDenominations || [];
  const activeDenoms = (denominationsList || []).filter((d) => (d.quantity || 0) > 0);

  // Check if linked to an invoice or sales bill
  const hasInvoice = Boolean(
    invoice ||
    (referenceNumber && /^(INV|BILL|CTB|P[0-9]|SALE)/i.test(referenceNumber)) ||
    (narration && /Invoice/i.test(narration))
  );

  const invoiceNo = invoice?.invoiceNo || referenceNumber;
  const invoiceCustomer = invoice?.customerId?.name || counterpartyAccountId?.accountName;
  const invoiceCustomerCode = invoice?.customerId?.code || counterpartyAccountId?.accountCode;
  const invoiceCustomerPhone = invoice?.customerId?.mobile || invoice?.customerId?.phone;
  const invoiceItems = Array.isArray(invoice?.items) ? invoice.items : [];
  const invoicePayments = Array.isArray(invoice?.payments) ? invoice.payments : [];

  const handleCopyTxnNo = (e) => {
    e?.stopPropagation();
    if (!transactionNumber) return;
    navigator.clipboard.writeText(transactionNumber);
    setCopiedTxnNo(true);
    setTimeout(() => setCopiedTxnNo(false), 2000);
  };

  const handleCopySummary = () => {
    const lines = [
      `Cash Transaction: ${transactionNumber}`,
      `Amount: ${isCredit ? "+" : "-"} ₹${formatCurrency(amount)} (${isCredit ? "Inward / Credit" : "Outward / Debit"})`,
      `Type: ${transactionType}`,
      `Partition: ${cashPartition === "running" ? "Running Cash" : "Frozen Cash"}`,
      `Date: ${formatDate(transactionDate)} ${formatTime(transactionDate)}`,
      referenceNumber ? `Ref / Bill: ${referenceNumber}` : null,
      counterpartyAccountId
        ? `Account: ${counterpartyAccountId.accountCode ? `${counterpartyAccountId.accountCode} - ` : ""}${counterpartyAccountId.accountName}`
        : null,
      narration ? `Narration: ${narration}` : null,
    ].filter(Boolean);

    navigator.clipboard.writeText(lines.join("\n"));
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <UIModal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      className="my-auto overflow-hidden max-h-[88vh]"
    >
      {/* ── Compact Header ── */}
      <UIModalHeader className="px-4 py-2.5 border-b border-border bg-surface shrink-0">
        <div className="flex items-center justify-between gap-2.5 w-full pr-6">
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Banknote className="size-3.5 stroke-[2]" />
            </div>
            <div className="min-w-0 flex items-center gap-1.5 flex-wrap">
              <UIModalTitle className="text-xs font-bold text-text truncate">
                Cash Transaction
              </UIModalTitle>
              <span className="font-mono text-[11px] font-bold text-text-muted bg-surface-alt px-1.5 py-0.2 rounded border border-border/60">
                {transactionNumber}
              </span>
              <button
                type="button"
                onClick={handleCopyTxnNo}
                className="p-0.5 text-text-muted hover:text-primary transition-colors cursor-pointer"
                title="Copy Transaction #"
              >
                {copiedTxnNo ? (
                  <Check className="size-3 text-emerald-500" />
                ) : (
                  <Copy className="size-3" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <UIBadge
              variant="soft"
              color={isCredit ? "success" : "danger"}
              className="text-[10px] font-bold px-1.5 py-0.2 whitespace-nowrap"
            >
              {isCredit ? "Inward (Credit)" : "Outward (Debit)"}
            </UIBadge>
            <span
              className={cn(
                "px-1.5 py-0.2 rounded text-[10px] font-semibold border",
                cashPartition === "running"
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
              )}
            >
              {cashPartition === "running" ? "Running" : "Frozen"}
            </span>
          </div>
        </div>
      </UIModalHeader>

      {/* ── Compact Body (Designed to fit completely without scroll) ── */}
      <UIModalBody className="p-3.5 space-y-2.5 bg-bg/50">
        {/* ── 1. Amount & Time Banner ── */}
        <div className="rounded-xl bg-surface border border-border p-2.5 flex items-center justify-between gap-3 shadow-2xs">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 text-text-muted">
              <span>Impact on Drawer</span>
              <span className="inline-flex items-center rounded px-1.5 py-0 text-[9px] font-bold bg-surface-alt border border-border text-text">
                {transactionType}
              </span>
            </div>
            <div
              className={cn(
                "text-2xl font-extrabold font-mono tabular-nums leading-tight mt-0.5",
                isCredit
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              )}
            >
              {isCredit ? "+" : "-"} ₹{formatCurrency(amount)}
            </div>
          </div>

          <div className="text-right text-xs text-text-muted space-y-0.5">
            <div className="flex items-center justify-end gap-1.5 text-text font-medium">
              <Calendar className="size-3 text-text-muted" />
              <span>{formatDate(transactionDate)}</span>
              <Clock className="size-3 text-text-muted ml-0.5" />
              <span>{formatTime(transactionDate)}</span>
            </div>
            {createdBy?.name && (
              <div className="text-[10.5px] text-text-muted truncate">
                Cashier: <span className="font-semibold text-text">{createdBy.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── 2. Sale Bill Invoice Card (if transaction links to an invoice) ── */}
        {hasInvoice && (
          <div className="rounded-xl border border-primary/25 bg-primary/5 p-2.5 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between gap-2 border-b border-primary/20 pb-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <Receipt className="size-3.5 text-primary shrink-0" />
                <span className="text-[11px] font-bold text-text uppercase tracking-wider">
                  Sale Bill:
                </span>
                <span className="font-mono font-bold text-primary text-xs truncate">
                  {invoiceNo}
                </span>
                {invoiceCustomer && (
                  <span className="text-[10.5px] text-text-muted truncate max-w-[130px]">
                    ({invoiceCustomer})
                  </span>
                )}
              </div>

              {onOpenInvoiceDrawer && (
                <UIButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenInvoiceDrawer(transaction)}
                  endIcon={<ExternalLink className="size-3" />}
                  className="h-6 px-2 text-[10.5px] text-primary font-bold hover:bg-primary/10 rounded cursor-pointer shrink-0"
                >
                  View Full Invoice
                </UIButton>
              )}
            </div>

            {/* Invoice Items preview if loaded */}
            {invoiceItems.length > 0 ? (
              <div className="flex flex-wrap gap-1 max-h-[48px] overflow-hidden">
                {invoiceItems.slice(0, 3).map((it, idx) => (
                  <span
                    key={it._id || idx}
                    className="inline-flex items-center gap-1 bg-surface px-1.5 py-0.5 rounded text-[10px] text-text border border-border/60"
                  >
                    <span className="font-medium truncate max-w-[120px]">
                      {it.productName || it.name || "Item"}
                    </span>
                    <span className="font-mono text-text-muted">×{it.quantity || it.qty || 1}</span>
                    <span className="font-mono font-semibold text-text">
                      ₹{formatCurrency(it.total || (it.quantity * it.unitPrice) || 0)}
                    </span>
                  </span>
                ))}
                {invoiceItems.length > 3 && (
                  <span className="text-[10px] text-text-muted self-center font-medium pl-1">
                    +{invoiceItems.length - 3} more items
                  </span>
                )}
              </div>
            ) : (
              <div className="text-[10.5px] text-text-muted">
                Retail cash sales invoice settlement record
              </div>
            )}

            {/* Split breakdown if invoice had split payments */}
            {invoicePayments.length > 1 && (
              <div className="flex items-center gap-1.5 pt-1 border-t border-primary/15 text-[10px] text-text-muted flex-wrap">
                <span className="font-semibold text-text">Bill Split:</span>
                {invoicePayments.map((p, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 py-0.2 rounded font-mono font-semibold bg-surface border border-border/70 text-text"
                  >
                    {p.paymentType || p.mode || "Payment"}: ₹{formatCurrency(p.amount)}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── 3. Ledger & Offset Details (2-Column compact grid) ── */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Box A: Counterparty / Account */}
          <div className="rounded-xl border border-border bg-surface p-2.5 space-y-1 shadow-2xs">
            <div className="flex items-center gap-1 text-text-muted font-bold text-[10px] uppercase tracking-wider">
              <User className="size-3 text-primary" />
              <span>Counterparty / Account</span>
            </div>
            <div className="min-w-0 pt-0.5">
              <span className="font-semibold text-text text-xs truncate block" title={counterpartyAccountId?.accountName}>
                {counterpartyAccountId
                  ? counterpartyAccountId.accountName
                  : invoiceCustomer || "Retail Customer / Store Drawer"}
              </span>
              {(counterpartyAccountId?.accountCode || invoiceCustomerCode || invoiceCustomerPhone) && (
                <span className="text-[10px] text-text-muted font-mono block truncate">
                  {counterpartyAccountId?.accountCode
                    ? `Code: ${counterpartyAccountId.accountCode}`
                    : invoiceCustomerPhone
                    ? `Mob: ${invoiceCustomerPhone}`
                    : `ID: ${invoiceCustomerCode}`}
                </span>
              )}
            </div>
          </div>

          {/* Box B: Reference & Narration */}
          <div className="rounded-xl border border-border bg-surface p-2.5 space-y-1 shadow-2xs">
            <div className="flex items-center gap-1 text-text-muted font-bold text-[10px] uppercase tracking-wider">
              <FileText className="size-3 text-primary" />
              <span>Reference & Narration</span>
            </div>
            <div className="min-w-0 pt-0.5">
              <span className="font-mono text-xs font-bold text-text truncate block">
                {referenceNumber || "Direct Cash Entry"}
              </span>
              {narration && (
                <span className="text-[10px] text-text-muted italic truncate block" title={narration}>
                  "{narration}"
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── 4. Compact Denomination Chips (when present) ── */}
        {activeDenoms.length > 0 && (
          <div className="rounded-xl border border-border bg-surface p-2 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between text-[10px] text-text-muted font-bold uppercase tracking-wider">
              <div className="flex items-center gap-1">
                <Coins className="size-3 text-emerald-500" />
                <span>Cash Denomination Count</span>
              </div>
              <span className="font-mono font-semibold text-text">
                ₹{formatCurrency(
                  activeDenoms.reduce((s, d) => s + (d.subtotal || d.denomination * (d.quantity || 0)), 0)
                )}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {activeDenoms.map((d) => (
                <span
                  key={d.denomination}
                  className="inline-flex items-center gap-1 bg-surface-alt px-2 py-0.5 rounded text-[10.5px] font-mono border border-border"
                >
                  <span className="font-bold text-text">₹{d.denomination}</span>
                  <span className="text-text-muted text-[10px]">×{d.quantity}</span>
                  <span className="text-text font-semibold pl-0.5">
                    = ₹{formatCurrency(d.subtotal || d.denomination * d.quantity)}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── 5. Journal Voucher Strip (Subtle 1-liner) ── */}
        {journalVoucherId && (
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-surface border border-border/70 text-[10.5px] text-text-muted">
            <span className="flex items-center gap-1">
              <Landmark className="size-3 text-primary" />
              <span>Linked Journal Voucher:</span>
            </span>
            <Link
              to={`/finance/journal-vouchers/${journalVoucherId._id || journalVoucherId}`}
              className="text-primary font-bold hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
            >
              {journalVoucherId.voucherNumber || "View Voucher"}
              <ExternalLink className="size-2.5" />
            </Link>
          </div>
        )}
      </UIModalBody>

      {/* ── Compact Footer (No Void button) ── */}
      <UIModalFooter className="px-4 py-2 border-t border-border bg-surface flex items-center justify-between shrink-0">
        <UIButton
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleCopySummary}
          startIcon={
            copiedSummary ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />
          }
          className="text-xs h-7.5 px-3"
        >
          {copiedSummary ? "Copied" : "Copy Tally Text"}
        </UIButton>

        <UIButton
          type="button"
          variant="primary"
          size="sm"
          onClick={onClose}
          className="px-5 font-semibold text-xs h-7.5"
        >
          Close
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
};

export default CashTransactionDetailsDialog;
