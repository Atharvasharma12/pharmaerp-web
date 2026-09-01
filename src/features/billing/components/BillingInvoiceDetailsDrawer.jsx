// src/features/billing/components/BillingInvoiceDetailsDrawer.jsx

import React from "react";
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
  Calendar,
  CreditCard,
  User,
  Trash2,
} from "lucide-react";
import { UIButton, UIBadge } from "@/components/ui";
import { PermissionGate } from "@/components/common/PermissionGate";

export const BillingInvoiceDetailsDrawer = ({
  invoice,
  isOpen,
  onClose,
  onMarkPaid,
  onCancelInvoice,
}) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return <UIBadge variant="soft" intent="success">Paid</UIBadge>;
      case "Pending":
        return <UIBadge variant="soft" intent="warning">Pending</UIBadge>;
      case "Overdue":
        return <UIBadge variant="soft" intent="error">Overdue</UIBadge>;
      case "Cancelled":
        return <UIBadge variant="soft" intent="error">Cancelled</UIBadge>;
      default:
        return <UIBadge variant="soft" intent="info">{status}</UIBadge>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xl bg-surface border-l border-border h-full shadow-2xl flex flex-col justify-between font-sans">
        {/* Drawer Header */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-primary-soft text-primary flex items-center justify-center font-bold">
              <FileText className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text">{invoice.invoiceNo}</h2>
              <p className="text-xs text-text-muted">Issued on {invoice.issueDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {getStatusBadge(invoice.status)}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-muted hover:bg-surface-alt hover:text-text cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Customer & Doctor Block */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-surface-alt/50 border border-border/70">
            <div>
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                Billed To
              </span>
              <p className="font-bold text-text text-sm mt-0.5">{invoice.customer}</p>
              <p className="text-text-muted font-mono">{invoice.phone}</p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                Prescription Info
              </span>
              <p className="font-bold text-text mt-0.5">{invoice.doctor}</p>
              <p className="text-text-muted">Payment: {invoice.paymentMode}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-2">
            <h3 className="font-bold text-text text-xs uppercase tracking-wider text-text-muted">
              Medicine Line Items ({invoice.itemCount})
            </h3>
            <div className="overflow-x-auto rounded-xl border border-border/80 bg-surface">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-[11px] font-semibold text-text-muted bg-surface-alt/40">
                    <th className="py-2.5 px-3">Item</th>
                    <th className="py-2.5 px-3 text-right">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Rate</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {invoice.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-semibold text-text">{item.name}</td>
                      <td className="py-2.5 px-3 font-mono text-right text-text tabular-nums">
                        {item.qty}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-right text-text-muted tabular-nums">
                        ₹{item.price?.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-right text-text tabular-nums">
                        ₹{item.total?.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Breakdown Card */}
          <div className="p-4 rounded-xl border border-border bg-surface-alt/60 space-y-2 font-mono">
            <div className="flex justify-between text-text-muted">
              <span>Invoice Total:</span>
              <span className="font-bold text-text">₹{invoice.amount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-success">
              <span>Paid to Date:</span>
              <span>₹{invoice.paidAmount?.toFixed(2)}</span>
            </div>
            {invoice.balance > 0 && (
              <div className="flex justify-between text-error font-bold border-t border-border pt-1.5">
                <span>Outstanding Balance:</span>
                <span>₹{invoice.balance?.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-border bg-surface flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <UIButton
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="size-3.5" />}
            >
              Print
            </UIButton>

            {invoice.status !== "Cancelled" && (
              <PermissionGate permission="bill:delete">
                <UIButton
                  variant="outline"
                  size="sm"
                  onClick={() => onCancelInvoice(invoice.id)}
                  className="text-error hover:bg-error-soft hover:border-error/30"
                  leftIcon={<Trash2 className="size-3.5" />}
                >
                  Cancel Bill
                </UIButton>
              </PermissionGate>
            )}
          </div>

          {invoice.status !== "Paid" && invoice.status !== "Cancelled" && (
            <PermissionGate permission="bill:update">
              <UIButton
                variant="primary"
                size="sm"
                onClick={() => onMarkPaid(invoice.id)}
                leftIcon={<CheckCircle2 className="size-3.5" />}
              >
                Mark as Paid
              </UIButton>
            </PermissionGate>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingInvoiceDetailsDrawer;
