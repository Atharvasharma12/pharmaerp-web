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
} from "lucide-react";
import { UIModal, UIButton, UIBadge } from "@/components/ui";

export const SalesReceiptModal = ({ isOpen, onClose, saleData }) => {
  if (!saleData) return null;

  const {
    invoiceNo = "INV-2026-0891",
    date = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    customer = { name: "Walk-in Customer", phone: "9876543210" },
    items = [],
    subtotal = 0,
    discount = 0,
    tax = 0,
    grandTotal = 0,
    paymentMethod = "Cash",
  } = saleData;

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
              <h2 className="text-lg font-bold text-text">Sale Completed Successfully</h2>
              <p className="text-xs text-text-muted">
                Invoice {invoiceNo} • {date}
              </p>
            </div>
          </div>

          <UIBadge variant="soft" intent="success" className="text-xs font-semibold">
            PAID
          </UIBadge>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="rounded-2xl border border-border bg-surface-alt/40 p-5 space-y-4 text-xs">
          {/* Pharmacy Details */}
          <div className="flex items-start justify-between border-b border-border/70 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-text tracking-tight">
                PharmaERP Healthcare & Chemist
              </h3>
              <p className="text-text-muted mt-0.5">DL No: 20B/1429 • GSTIN: 27AABCP1234F1Z9</p>
              <p className="text-text-muted">Main Branch, MG Road, Mumbai 400001</p>
            </div>
            <div className="text-right">
              <span className="font-mono font-bold text-text text-sm">{invoiceNo}</span>
              <p className="text-text-muted">{date}</p>
            </div>
          </div>

          {/* Customer / Doctor Details */}
          <div className="grid grid-cols-2 gap-4 border-b border-border/70 pb-3">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Customer Details
              </span>
              <p className="font-bold text-text mt-0.5">{customer.name}</p>
              {customer.phone && <p className="text-text-muted font-mono">{customer.phone}</p>}
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Payment Mode
              </span>
              <p className="font-bold text-text mt-0.5">{paymentMethod}</p>
              <p className="text-text-muted">Ref: {invoiceNo}-TXN</p>
            </div>
          </div>

          {/* Medicine Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[11px] font-semibold text-text-muted uppercase">
                  <th className="py-2">Item</th>
                  <th className="py-2">Batch</th>
                  <th className="py-2 text-right">Qty</th>
                  <th className="py-2 text-right">Rate</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {items.map((item, idx) => (
                  <tr key={idx} className="py-2">
                    <td className="py-2 font-medium text-text">{item.name}</td>
                    <td className="py-2 font-mono text-text-muted text-[11px]">{item.batch}</td>
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
          <div className="border-t border-border/70 pt-3 space-y-1.5 text-right font-mono">
            <div className="flex justify-between text-text-muted">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount:</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-text-muted">
              <span>GST / Taxes:</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-text pt-2 border-t border-border">
              <span>Grand Total:</span>
              <span className="text-primary">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
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
              Print Receipt
            </UIButton>

            <UIButton
              variant="primary"
              size="sm"
              onClick={onClose}
              leftIcon={<Download className="size-4" />}
            >
              Done & Save
            </UIButton>
          </div>
        </div>
      </div>
    </UIModal>
  );
};

export default SalesReceiptModal;
