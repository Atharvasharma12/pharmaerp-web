// src/features/sales/components/SalesReceiptModal.jsx

import React from "react";
import {
  Printer,
  Download,
  CheckCircle2,
  Share2,
  FileText,
  Building2,
  Calendar,
  CreditCard,
  User,
  Briefcase,
  Store,
} from "lucide-react";
import { UIModal, UIButton, UIBadge } from "@/components/ui";

export const SalesReceiptModal = ({ isOpen, onClose, saleData }) => {
  if (!saleData) return null;

  const {
    invoiceNo = "TAX-INV-2026-0891",
    date = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    customer = { name: "Walk-in Retail Customer", phone: "9876543210" },
    billingMode = "B2C",
    partyType = "retail",
    items = [],
    subtotal = 0,
    discount = 0,
    tax = 0,
    grandTotal = 0,
    paymentMethod = "Cash",
  } = saleData;

  const isB2B = billingMode === "B2B";

  const handlePrint = () => {
    window.print();
  };

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6 font-sans space-y-5">
        {/* Success Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-success-soft text-success flex items-center justify-center">
              <CheckCircle2 className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-text">
                  {isB2B ? "B2B Tax Invoice Generated" : "B2C Retail Sale Completed"}
                </h2>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isB2B
                      ? "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                      : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    }`}
                >
                  {isB2B ? `B2B ${partyType.toUpperCase()}` : "B2C RETAIL"}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Invoice {invoiceNo} • {date}
              </p>
            </div>
          </div>

          <UIBadge variant="soft" intent="success" className="text-xs font-semibold">
            PAID & ISSUED
          </UIBadge>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="rounded-2xl border border-border bg-surface-alt/40 p-5 space-y-4 text-xs">
          {/* Pharmacy Header */}
          <div className="flex items-start justify-between border-b border-border/70 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-text tracking-tight">
                  PharmaERP Healthcare & Chemist
                </h3>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 bg-surface border border-border rounded text-text-muted">
                  {isB2B ? "TAX INVOICE" : "RETAIL INVOICE"}
                </span>
              </div>
              <p className="text-text-muted mt-0.5">DL No: 20B/1429 • GSTIN: 27AABCP1234F1Z9</p>
              <p className="text-text-muted">Main Branch, MG Road, Mumbai 400001</p>
            </div>
            <div className="text-right">
              <span className="font-mono font-bold text-text text-sm">{invoiceNo}</span>
              <p className="text-text-muted">{date}</p>
            </div>
          </div>

          {/* Customer / B2B Party Details */}
          <div className="grid grid-cols-2 gap-4 border-b border-border/70 pb-3">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1">
                {isB2B ? <Building2 className="size-3 text-purple-600" /> : <User className="size-3 text-emerald-600" />}
                {isB2B ? `B2B Party Details (${partyType.toUpperCase()})` : "Customer Details"}
              </span>
              <p className="font-bold text-text mt-0.5">{customer.name}</p>
              {customer.gstin && (
                <p className="text-purple-600 dark:text-purple-400 font-mono font-bold text-[11px]">
                  GSTIN: {customer.gstin}
                </p>
              )}
              {customer.dlNo && <p className="text-text-muted font-mono text-[11px]">DL: {customer.dlNo}</p>}
              {customer.phone && <p className="text-text-muted font-mono">{customer.phone}</p>}
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Payment & Terms
              </span>
              <p className="font-bold text-text mt-0.5">{paymentMethod}</p>
              <p className="text-text-muted">Ref: {invoiceNo}-TXN</p>
              {isB2B && customer.paymentTerms && (
                <p className="text-emerald-600 font-semibold text-[11px]">{customer.paymentTerms}</p>
              )}
            </div>
          </div>

          {/* Medicine Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[11px] font-semibold text-text-muted uppercase">
                  <th className="py-2">Item Name & Brand</th>
                  <th className="py-2">HSN / Batch</th>
                  <th className="py-2 text-right">Qty</th>
                  <th className="py-2 text-right">Rate</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {items.map((item, idx) => (
                  <tr key={idx} className="py-2">
                    <td className="py-2">
                      <span className="font-bold text-text">{item.name}</span>
                      <span className="text-[10px] text-text-muted block">{item.brand}</span>
                    </td>
                    <td className="py-2 font-mono text-text-muted text-[11px]">
                      {item.hsn || "300490"} • {item.batch}
                    </td>
                    <td className="py-2 font-mono text-right text-text tabular-nums">{item.qty}</td>
                    <td className="py-2 font-mono text-right text-text tabular-nums">
                      ₹{item.price?.toFixed(2)}
                    </td>
                    <td className="py-2 font-mono font-bold text-right text-text tabular-nums">
                      ₹{(item.qty * item.price)?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="border-t border-border/70 pt-3 space-y-1.5 font-mono">
            <div className="flex justify-between text-text-muted">
              <span>Subtotal:</span>
              <span>₹{Number(subtotal).toFixed(2)}</span>
            </div>
            {saleData.schemeDiscount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Scheme Discount:</span>
                <span>-₹{Number(saleData.schemeDiscount).toFixed(2)}</span>
              </div>
            )}
            {saleData.extraDiscount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Extra Discount:</span>
                <span>-₹{Number(saleData.extraDiscount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-text-muted pt-1 border-t border-border/40">
              <span>Taxable Amount:</span>
              <span>₹{Number(saleData.taxableAmount || (grandTotal - tax)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-purple-600 dark:text-purple-400">
              <span>GST Tax Amount:</span>
              <span>₹{Number(tax).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-text pt-2 border-t border-border">
              <span>Grand Total:</span>
              <span className="text-primary font-mono text-base">₹{Number(grandTotal).toFixed(2)}</span>
            </div>
          </div>

          {/* GST Slab Breakdown in Receipt */}
          {Array.isArray(saleData.gstSlabs) && saleData.gstSlabs.length > 0 && (
            <div className="border-t border-border/70 pt-3 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">GST Slab Breakdown</span>
              <table className="w-full text-left font-mono text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-border text-text-muted">
                    <th className="py-1">Rate</th>
                    <th className="py-1 text-right">Taxable</th>
                    <th className="py-1 text-right">CGST</th>
                    <th className="py-1 text-right">SGST</th>
                    <th className="py-1 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {saleData.gstSlabs.map((s) => (
                    <tr key={s.gstPct}>
                      <td className="py-1 font-bold text-purple-600">{s.gstPct}%</td>
                      <td className="py-1 text-right">₹{s.taxable?.toFixed(2)}</td>
                      <td className="py-1 text-right">₹{s.cgst?.toFixed(2)}</td>
                      <td className="py-1 text-right">₹{s.sgst?.toFixed(2)}</td>
                      <td className="py-1 text-right font-bold">₹{s.total?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <UIButton variant="outline" size="sm" onClick={onClose}>
            New Sale
          </UIButton>

          <div className="flex items-center gap-2">
            <UIButton
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="size-4" />}
            >
              Print {isB2B ? "Tax Invoice" : "Receipt"}
            </UIButton>

            <UIButton
              variant="primary"
              size="sm"
              onClick={onClose}
              leftIcon={<FileText className="size-4" />}
            >
              Done & Save Invoice
            </UIButton>
          </div>
        </div>
      </div>
    </UIModal>
  );
};

export default SalesReceiptModal;
