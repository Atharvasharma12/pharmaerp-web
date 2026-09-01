// src/features/billing/components/BillingCreateInvoiceModal.jsx

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Receipt,
  FileText,
  User,
  CheckCircle2,
} from "lucide-react";
import { UIModal, UIButton } from "@/components/ui";
import { PermissionGate } from "@/components/common/PermissionGate";

export const BillingCreateInvoiceModal = ({ isOpen, onClose, onCreated }) => {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [items, setItems] = useState([
    { name: "Paracetamol 500mg", qty: 2, price: 15.5 },
  ]);

  const handleAddItem = () => {
    setItems((prev) => [...prev, { name: "", qty: 1, price: 0 }]);
  };

  const handleUpdateItem = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleRemoveItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce(
    (acc, it) => acc + (Number(it.qty) || 0) * (Number(it.price) || 0),
    0
  );
  const tax = subtotal * 0.12;
  const grandTotal = Math.round(subtotal + tax);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNo: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: customerName || "Walk-in Customer",
      phone: phone || "9876543210",
      doctor: doctorName || "General Consultation",
      issueDate: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      dueDate: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      itemCount: items.length,
      amount: grandTotal,
      paidAmount: grandTotal,
      balance: 0,
      status: "Paid",
      paymentMode,
      items: items.map((it) => ({
        ...it,
        total: (Number(it.qty) || 0) * (Number(it.price) || 0),
      })),
    };

    onCreated(newInvoice);
    onClose();
  };

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} className="p-6 font-sans space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
              <Receipt className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">Create Pharmacy Invoice</h2>
              <p className="text-xs text-text-muted">Issue tax invoice with GST breakdown</p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text">Customer / Patient Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-alt/60 p-2.5 text-xs text-text focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text">Contact Phone</label>
            <input
              type="tel"
              placeholder="9812345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-alt/60 p-2.5 text-xs text-text font-mono focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text">Prescribing Doctor</label>
            <input
              type="text"
              placeholder="Dr. Arvind Mehta"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-alt/60 p-2.5 text-xs text-text focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Invoice Items Repeater */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Medicine Line Items
            </label>
            <button
              type="button"
              onClick={handleAddItem}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Add Line</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {items.map((it, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 gap-2 items-center p-2 rounded-xl bg-surface-alt/50 border border-border/70 text-xs"
              >
                <div className="col-span-6">
                  <input
                    type="text"
                    required
                    placeholder="Medicine Name & Dosage"
                    value={it.name}
                    onChange={(e) => handleUpdateItem(idx, "name", e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface p-1.5 text-xs text-text focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="Qty"
                    value={it.qty}
                    onChange={(e) => handleUpdateItem(idx, "qty", e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface p-1.5 text-xs text-text font-mono text-center focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="Price (₹)"
                    value={it.price}
                    onChange={(e) => handleUpdateItem(idx, "price", e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface p-1.5 text-xs text-text font-mono text-right focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="col-span-1 text-center">
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-text-muted hover:text-error transition-colors p-1"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation & Payment Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text">Payment Mode</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-alt/60 p-2.5 text-xs font-medium text-text focus:border-primary focus:outline-none"
            >
              <option value="Cash">Cash Payment</option>
              <option value="UPI">UPI / Dynamic QR</option>
              <option value="Card">Credit / Debit Card</option>
              <option value="Bank Transfer">Bank Transfer / NEFT</option>
              <option value="Credit">Credit / Account Receivables</option>
            </select>
          </div>

          <div className="rounded-xl border border-border bg-surface-alt/50 p-3 space-y-1 text-xs font-mono text-right">
            <div className="flex justify-between text-text-muted">
              <span>Taxable Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>GST (12%):</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-text pt-1.5 border-t border-border">
              <span>Grand Total:</span>
              <span className="text-primary font-mono">₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <UIButton type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </UIButton>

          <PermissionGate
            permission="bill:create"
            fallback={
              <UIButton type="button" variant="primary" size="sm" disabled>
                Create Invoice (Requires bill:create)
              </UIButton>
            }
          >
            <UIButton type="submit" variant="primary" size="sm">
              Generate Invoice (₹{grandTotal})
            </UIButton>
          </PermissionGate>
        </div>
      </form>
    </UIModal>
  );
};

export default BillingCreateInvoiceModal;
