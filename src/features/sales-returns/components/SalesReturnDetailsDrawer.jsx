import React, { useState } from "react";
import {
  Printer,
  Calendar,
  User,
  RotateCcw,
  Banknote,
  Receipt,
  Boxes,
  FileText,
  Clock,
  Building2,
  Tag,
} from "lucide-react";
import { UIModal, UIButton, UIBadge } from "@/components/ui";
import { OrderInvoiceModal } from "@/features/sales/components";
import useBranch from "@/features/branch/hooks/useBranch";
import useWorkspace from "@/features/workspace/hooks/useWorkspace";

const DENOM_CONFIG = {
  500: { label: "₹500", color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20" },
  200: { label: "₹200", color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
  100: { label: "₹100", color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20" },
  50: { label: "₹50", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  20: { label: "₹20", color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20" },
  10: { label: "₹10", color: "text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/20" },
  5: { label: "₹5", color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20" },
  2: { label: "₹2", color: "text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/20" },
  1: { label: "₹1", color: "text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/20" },
};

const formatCurrency = (val) => {
  const num = Number(val) || 0;
  return `₹${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const SalesReturnDetailsDrawer = ({ open, onClose, returnItem }) => {
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const { currentBranch } = useBranch();
  const { currentCompany } = useWorkspace();

  if (!returnItem) return null;

  const returnNo = returnItem.returnNo || returnItem.invoiceNo || "RET-MEMO";
  const originalInvoiceNo = returnItem.originalInvoiceNo || returnItem.originalInvoiceId?.invoiceNo || "—";
  const returnDate = returnItem.date
    ? new Date(returnItem.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";
  const returnTime = returnItem.date
    ? new Date(returnItem.date).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const customerName =
    returnItem.customerId?.name ||
    returnItem.customerName ||
    returnItem.customer?.name ||
    "Walk-in Customer";
  const customerMobile =
    returnItem.customerId?.mobile ||
    returnItem.customerPhone ||
    returnItem.customer?.phone ||
    "";

  const grandTotal = Math.abs(Number(returnItem.grandTotal || returnItem.returnAmount || 0));
  const subtotal = Math.abs(Number(returnItem.subtotal || 0));
  const tax = Math.abs(Number(returnItem.tax || 0));
  const discount = Math.abs(Number(returnItem.discount || 0));

  const items = Array.isArray(returnItem.items) ? returnItem.items : [];
  const returnType = String(returnItem.returnType || "").toLowerCase();
  const isAdvance = returnType.includes("advance");
  const isCredit = returnType.includes("credit");

  const rawDenoms = Array.isArray(returnItem.refundDenominations) && returnItem.refundDenominations.length > 0
    ? returnItem.refundDenominations
    : (Array.isArray(returnItem.denominations) ? returnItem.denominations : []);

  const denoms = rawDenoms
    .map((d) => ({
      note: Number(d.denomination || d.note || 0),
      count: Number(d.quantity || d.count || 0),
      total: Number(d.denomination || d.note || 0) * Number(d.quantity || d.count || 0),
    }))
    .filter((d) => d.note > 0 && d.count > 0);

  return (
    <>
      <UIModal
        open={open}
        onClose={onClose}
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base text-text-primary">{returnNo}</span>
                <UIBadge variant="destructive" size="sm">
                  Sales Return
                </UIBadge>
                <UIBadge variant="outline" size="sm">
                  {returnItem.billingMode || "B2C"}
                </UIBadge>
              </div>
              <div className="text-[11px] text-text-muted">
                {returnDate} {returnTime ? `at ${returnTime}` : ""}
              </div>
            </div>
          </div>
        }
        size="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <UIButton variant="outline" size="sm" onClick={onClose}>
              Close
            </UIButton>
            <UIButton
              variant="default"
              size="sm"
              icon={Printer}
              onClick={() => setIsPrintModalOpen(true)}
            >
              Print Return Memo
            </UIButton>
          </div>
        }
      >
        <div className="space-y-5 py-2">
          {/* Header Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl border border-border bg-surface-alt/40">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Refund Amount</span>
              <div className="text-lg font-mono font-extrabold text-rose-600 dark:text-rose-400">
                {formatCurrency(grandTotal)}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Refund Mode</span>
              <div className="text-sm font-semibold text-text-primary capitalize">
                {isAdvance ? "Advance Balance" : isCredit ? "Credit Note" : "Cash Refund"}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Original Bill No</span>
              <div className="text-sm font-mono font-bold text-primary truncate">
                {originalInvoiceNo}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Customer</span>
              <div className="text-sm font-semibold text-text-primary truncate">
                {customerName}
              </div>
              {customerMobile && (
                <div className="text-[10.5px] text-text-muted font-mono">{customerMobile}</div>
              )}
            </div>
          </div>

          {/* Returned Items Table */}
          <div className="border border-border rounded-xl overflow-hidden bg-surface">
            <div className="px-3.5 py-2.5 bg-surface-alt/60 border-b border-border flex items-center justify-between">
              <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                <Boxes className="w-3.5 h-3.5 text-text-muted" />
                Returned Products ({items.length})
              </span>
              <span className="text-[11px] text-text-muted font-medium">Restocked to Inventory</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-surface-alt/20 text-text-muted text-[10px] uppercase font-bold tracking-wider">
                    <th className="py-2 px-3">Item / Medicine</th>
                    <th className="py-2 px-2.5">Batch</th>
                    <th className="py-2 px-2.5">Pack</th>
                    <th className="py-2 px-2.5">Expiry</th>
                    <th className="py-2 px-2.5 text-right">Qty</th>
                    <th className="py-2 px-2.5 text-right">Rate</th>
                    <th className="py-2 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((it, idx) => {
                    const itemName = it.name || it.productName || it.displayName || "Medicine";
                    const batchNo = it.batch || it.batchNo || "STANDARD";
                    const pack = it.pack || "10S";
                    const exp = it.expiry || it.expiryDate || "—";
                    const qty = Number(it.qty || 1);
                    const rate = Number(it.rate || it.price || 0);
                    const total = Number(it.total || it.amount || rate * qty);

                    return (
                      <tr key={idx} className="hover:bg-surface-alt/20 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-text-primary">{itemName}</div>
                          {it.brand && (
                            <div className="text-[10px] text-text-muted">{it.brand}</div>
                          )}
                        </td>
                        <td className="py-2.5 px-2.5 font-mono text-[11px] font-semibold text-text-secondary">
                          {batchNo}
                        </td>
                        <td className="py-2.5 px-2.5 text-text-muted text-[11px]">{pack}</td>
                        <td className="py-2.5 px-2.5 text-text-muted text-[11px]">{exp}</td>
                        <td className="py-2.5 px-2.5 text-right font-mono font-bold text-text-primary">
                          {qty}
                        </td>
                        <td className="py-2.5 px-2.5 text-right font-mono text-text-muted">
                          {formatCurrency(rate)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                          {formatCurrency(total)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cash Denominations Breakdown (If Cash Refund) */}
          {denoms.length > 0 && (
            <div className="p-3 rounded-xl border border-border bg-surface-alt/30 space-y-2">
              <div className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                Cash Drawer Notes Disbursed to Customer
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {denoms.map((d) => {
                  const cfg = DENOM_CONFIG[d.note] || {
                    label: `₹${d.note}`,
                    color: "text-slate-600 bg-slate-500/10 border-slate-500/20",
                  };
                  return (
                    <div
                      key={d.note}
                      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-mono ${cfg.color}`}
                    >
                      <span className="font-bold">{cfg.label}</span>
                      <span className="opacity-60">×</span>
                      <span className="font-extrabold">{d.count}</span>
                      <span className="opacity-60">=</span>
                      <span className="font-bold">{formatCurrency(d.total)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Return Memo Financial Summary */}
          <div className="p-3.5 rounded-xl border border-border bg-surface space-y-1.5 text-xs">
            <div className="flex justify-between text-text-muted">
              <span>Taxable Subtotal</span>
              <span className="font-mono">{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-text-muted">
                <span>Discount Reversed</span>
                <span className="font-mono text-emerald-600">-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-text-muted">
              <span>GST Adjusted (Credit Note)</span>
              <span className="font-mono">{formatCurrency(tax)}</span>
            </div>
            <div className="pt-2 border-t border-border flex justify-between font-bold text-sm text-text-primary">
              <span>Net Refund Total</span>
              <span className="font-mono text-rose-600 dark:text-rose-400 font-extrabold text-base">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>
        </div>
      </UIModal>

      {/* Printable Receipt Modal */}
      <OrderInvoiceModal
        open={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        saleData={{
          ...returnItem,
          isReturn: true,
          invoiceNo: returnNo,
          customer: returnItem.customerId || { name: customerName, mobile: customerMobile },
        }}
        branch={currentBranch}
        company={currentCompany}
      />
    </>
  );
};

export default SalesReturnDetailsDrawer;
