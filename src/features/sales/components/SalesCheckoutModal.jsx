// src/features/sales/components/SalesCheckoutModal.jsx

import React, { useState } from "react";
import {
  Banknote,
  QrCode,
  CreditCard,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Percent,
} from "lucide-react";
import { UIModal, UIButton, UIBadge } from "@/components/ui";
import { PermissionGate } from "@/components/common/PermissionGate";

export const SalesCheckoutModal = ({
  isOpen,
  onClose,
  cartSummary,
  customer,
  onCompleteSale,
}) => {
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [cashTendered, setCashTendered] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [notes, setNotes] = useState("");

  const subtotal = cartSummary?.subtotal || 0;
  const discountAmount = (subtotal * (Number(discountPercent) || 0)) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * 0.12; // 12% average GST
  const grandTotal = Math.round(taxableAmount + tax);

  const tenderedNum = Number(cashTendered) || 0;
  const changeDue = Math.max(0, tenderedNum - grandTotal);

  const handleProcessSale = () => {
    const salePayload = {
      invoiceNo: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customer,
      items: cartSummary?.items || [],
      subtotal,
      discount: discountAmount,
      tax,
      grandTotal,
      paymentMethod: paymentMode,
      cashTendered: paymentMode === "Cash" ? tenderedNum : grandTotal,
      changeDue: paymentMode === "Cash" ? changeDue : 0,
      notes,
    };

    onCompleteSale(salePayload);
  };

  const paymentModes = [
    { id: "Cash", label: "Cash", icon: Banknote },
    { id: "UPI", label: "UPI / QR Code", icon: QrCode },
    { id: "Card", label: "Debit/Credit Card", icon: CreditCard },
    { id: "Credit", label: "Customer Credit / Due", icon: Wallet },
  ];

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6 font-sans space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h2 className="text-lg font-bold text-text">Complete Sale & Checkout</h2>
            <p className="text-xs text-text-muted">
              Billing for: <span className="font-semibold text-text">{customer?.name}</span> ({customer?.phone || "Walk-in"})
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-text-muted">Grand Total:</span>
            <div className="text-xl font-extrabold font-mono text-primary tabular-nums">
              ₹{grandTotal.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {/* Payment Methods Grid */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Select Payment Method
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {paymentModes.map((mode) => {
              const Icon = mode.icon;
              const isSelected = paymentMode === mode.id;

              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setPaymentMode(mode.id)}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary-soft text-primary shadow-xs ring-1 ring-primary"
                      : "border-border bg-surface-alt/60 text-text hover:bg-surface-hover"
                  }`}
                >
                  <Icon className="size-5 mb-1.5" />
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Discount & Tender Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text">Customer Discount (%)</label>
            <div className="flex items-center gap-1.5">
              {[0, 5, 10, 15].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setDiscountPercent(pct)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                    discountPercent === pct
                      ? "border-primary bg-primary text-primary-contrast"
                      : "border-border bg-surface-alt/70 text-text hover:bg-surface-hover"
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {paymentMode === "Cash" ? (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text">Cash Tendered (₹)</label>
              <input
                type="number"
                placeholder={grandTotal.toString()}
                value={cashTendered}
                onChange={(e) => setCashTendered(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-alt/60 p-2 text-xs font-mono font-bold text-text focus:border-primary focus:outline-none"
              />
              {tenderedNum > 0 && (
                <p className="text-[11px] font-semibold text-text-muted">
                  Change to return:{" "}
                  <span className="text-success font-mono font-bold">
                    ₹{changeDue.toFixed(2)}
                  </span>
                </p>
              )}
            </div>
          ) : paymentMode === "UPI" ? (
            <div className="p-3 rounded-xl border border-border bg-surface-alt/50 flex items-center gap-3">
              <QrCode className="size-8 text-primary shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-text">Dynamic Pharmacy QR Code</p>
                <p className="text-text-muted">Customer scans & pays via GPay / PhonePe / Paytm</p>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl border border-border bg-surface-alt/50 flex items-center gap-3">
              <CreditCard className="size-8 text-primary shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-text">POS Terminal Ready</p>
                <p className="text-text-muted">Swipe or tap card on POS Machine</p>
              </div>
            </div>
          )}
        </div>

        {/* Calculation Summary Box */}
        <div className="rounded-xl border border-border bg-surface-alt/50 p-4 space-y-1.5 text-xs font-mono">
          <div className="flex justify-between text-text-muted">
            <span>Items Subtotal ({cartSummary?.items?.length || 0} items):</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-success">
              <span>Discount ({discountPercent}%):</span>
              <span>-₹{discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-text-muted">
            <span>Estimated GST:</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-extrabold text-text pt-2 border-t border-border">
            <span>Payable Amount:</span>
            <span className="text-primary font-mono text-base">₹{grandTotal.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Footer Buttons with Permission Gate */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <UIButton variant="outline" size="sm" onClick={onClose}>
            Back to Cart
          </UIButton>

          <PermissionGate
            permission="pos:create"
            fallback={
              <UIButton variant="primary" size="sm" disabled title="Requires pos:create permission">
                Process Sale (Permission Required)
              </UIButton>
            }
          >
            <UIButton
              variant="primary"
              size="sm"
              onClick={handleProcessSale}
              leftIcon={<CheckCircle2 className="size-4" />}
            >
              Confirm & Print Receipt (₹{grandTotal})
            </UIButton>
          </PermissionGate>
        </div>
      </div>
    </UIModal>
  );
};

export default SalesCheckoutModal;
