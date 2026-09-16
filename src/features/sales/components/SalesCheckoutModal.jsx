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
  Building2,
  FileText,
} from "lucide-react";
import { UIModal, UIButton, UIBadge } from "@/components/ui";
import { PermissionGate } from "@/components/common/PermissionGate";

export const SalesCheckoutModal = ({
  isOpen,
  onClose,
  cartSummary,
  customer,
  billingMode = "B2C",
  onCompleteSale,
}) => {
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [cashTendered, setCashTendered] = useState("");
  const [discountPercent, setDiscountPercent] = useState(customer?.defaultDiscount || 0);
  const [notes, setNotes] = useState("");

  // Detailed Billing & Tax Calculations
  const items = cartSummary?.items || [];
  const subtotal = items.reduce((sum, item) => {
    const rate = Number(item.price) || 0;
    const qty = Math.max(1, Number(item.qty) || 1);
    return sum + rate * qty;
  }, 0);

  const isB2B = billingMode === "B2B";

  // Line-level item discounts sum
  const itemDiscount = items.reduce((sum, item) => {
    const rate = Number(item.price) || 0;
    const qty = Math.max(1, Number(item.qty) || 1);
    const discPct = Number(item.disc) || 0;
    return sum + (rate * qty * discPct) / 100;
  }, 0);

  const schemeDiscount = 0; // Configured at party/order level if needed

  const subtotalAfterDiscounts = subtotal - itemDiscount - schemeDiscount;
  const extraDiscountAmt = (subtotalAfterDiscounts * (Number(discountPercent) || 0)) / 100;

  // Calculate GST Breakdown grouped by tax rate
  const gstSlabMap = {};
  items.forEach((item) => {
    const rate = Number(item.price) || 0;
    const qty = Math.max(1, Number(item.qty) || 1);
    const discPct = Number(item.disc) || 0;
    const lineSubtotal = rate * qty * (1 - discPct / 100);
    // Apply extra discount proportion
    const lineFinal = lineSubtotal * (1 - (Number(discountPercent) || 0) / 100);

    const gstPct = Number(item.gst !== undefined && item.gst !== null ? item.gst : 5);
    
    let taxable, taxAmt;
    if (isB2B) {
      // B2B prices are exclusive of tax, so tax is added ON TOP
      taxable = lineFinal;
      taxAmt = lineFinal * (gstPct / 100);
    } else {
      // B2C prices are inclusive of tax, so tax is EXTRACTED from total
      taxable = lineFinal / (1 + gstPct / 100);
      taxAmt = lineFinal - taxable;
    }

    const halfTax = taxAmt / 2;

    if (!gstSlabMap[gstPct]) {
      gstSlabMap[gstPct] = { gstPct, taxable: 0, cgst: 0, sgst: 0, total: 0 };
    }
    gstSlabMap[gstPct].taxable += taxable;
    gstSlabMap[gstPct].cgst += halfTax;
    gstSlabMap[gstPct].sgst += halfTax;
    gstSlabMap[gstPct].total += taxAmt;
  });

  const gstSlabs = Object.values(gstSlabMap).sort((a, b) => a.gstPct - b.gstPct);

  const totalTaxable = gstSlabs.reduce((acc, s) => acc + s.taxable, 0);
  const totalCgst = gstSlabs.reduce((acc, s) => acc + s.cgst, 0);
  const totalSgst = gstSlabs.reduce((acc, s) => acc + s.sgst, 0);
  const totalGst = gstSlabs.reduce((acc, s) => acc + s.total, 0);

  const grandTotal = Math.max(0, totalTaxable + totalGst);

  const tenderedNum = Number(cashTendered) || 0;
  const changeDue = Math.max(0, tenderedNum - grandTotal);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleProcessSale = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const prefix = isB2B ? "TAX-INV" : "RET-INV";
      const salePayload = {
        invoiceNo: `${prefix}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        customer,
        billingMode,
        partyType: isB2B ? customer?.partyType || "wholesaler" : "retail_consumer",
        items,
        subtotal,
        itemDiscount,
        schemeDiscount,
        extraDiscount: extraDiscountAmt,
        taxableAmount: totalTaxable,
        tax: totalGst,
        grandTotal,
        gstSlabs,
        paymentMethod: paymentMode,
        cashTendered: paymentMode === "Cash" ? tenderedNum : grandTotal,
        changeDue: paymentMode === "Cash" ? changeDue : 0,
        notes,
      };

      await onCompleteSale(salePayload);
    } catch (err) {
      console.error("Sale invoice creation error:", err);
      setErrorMessage(err?.response?.data?.message || err.message || "Failed to create invoice in backend");
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentModes = [
    { id: "Cash", label: "Cash", icon: Banknote },
    { id: "UPI", label: "UPI / QR Code", icon: QrCode },
    { id: "Card", label: "Debit/Credit Card", icon: CreditCard },
    { id: "Credit", label: "Party Credit / Due", icon: Wallet },
  ];

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6 font-sans space-y-5 max-h-[88vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-text">
                {isB2B ? "B2B Commercial Tax Invoice Preview" : "B2C Retail Sale Preview & Billing"}
              </h2>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  isB2B
                    ? "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                    : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                }`}
              >
                {isB2B ? `B2B ${customer?.partyType || "Commercial"}` : "B2C Retail"}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Billed To: <span className="font-bold text-text">{customer?.name || "Walk-in Customer"}</span>
              {customer?.gstin ? ` • GSTIN: ${customer.gstin}` : ""}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-text-muted">Grand Total:</span>
            <div className="text-xl font-extrabold font-mono text-primary tabular-nums">
              ₹{grandTotal.toFixed(2)}
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
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary-soft text-primary shadow-xs ring-1 ring-primary"
                      : "border-border bg-surface-alt/60 text-text hover:bg-surface-hover"
                  }`}
                >
                  <Icon className="size-4 mb-1" />
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Extra Discount & Tender Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text">Extra Discount (%)</label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[0, 5, 10, 15, 20].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setDiscountPercent(pct)}
                    className={`px-2 py-1 rounded-lg border text-xs font-semibold transition-all ${
                      Number(discountPercent) === pct
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-surface-alt/70 text-text hover:bg-surface-hover"
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
              <div className="relative flex-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-lg border border-border bg-surface-alt/60 px-2 py-1 text-xs font-mono font-bold text-text focus:border-primary focus:outline-none pr-5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">%</span>
              </div>
            </div>
          </div>

          {paymentMode === "Cash" ? (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text">Cash Tendered (₹)</label>
              <input
                type="number"
                placeholder={grandTotal.toFixed(2)}
                value={cashTendered}
                onChange={(e) => setCashTendered(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-alt/60 p-1.5 text-xs font-mono font-bold text-text focus:border-primary focus:outline-none"
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
            <div className="p-2.5 rounded-xl border border-border bg-surface-alt/50 flex items-center gap-3">
              <QrCode className="size-6 text-primary shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-text">Dynamic UPI QR Code</p>
                <p className="text-text-muted text-[11px]">Scan to pay directly</p>
              </div>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl border border-border bg-surface-alt/50 flex items-center gap-3">
              <CreditCard className="size-6 text-primary shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-text">Credit Ledger</p>
                <p className="text-text-muted text-[11px]">Recorded in Party Accounts</p>
              </div>
            </div>
          )}
        </div>

        {/* Structured Billing Summary */}
        <div className="rounded-xl border border-border bg-surface-alt/40 p-4 space-y-2 text-xs">
          <h3 className="font-bold text-sm text-text border-b border-border/60 pb-1.5">Billing Summary</h3>

          <div className="space-y-1.5 font-mono">
            <div className="flex justify-between text-text">
              <span className="text-text-muted font-sans font-medium">Subtotal</span>
              <span className="font-bold">₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-text">
              <span className="text-text-muted font-sans font-medium">Item Discount</span>
              <span className="text-emerald-600 font-semibold">- ₹{itemDiscount.toFixed(2)}</span>
            </div>

            {billingMode !== "B2C" && schemeDiscount > 0 && (
              <div className="flex justify-between text-text">
                <span className="text-text-muted font-sans font-medium">Scheme Discount</span>
                <span className="text-emerald-600 font-semibold">- ₹{schemeDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-text">
              <span className="text-text-muted font-sans font-medium">Extra Discount ({discountPercent}%)</span>
              <span className="text-emerald-600 font-semibold">- ₹{extraDiscountAmt.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-text pt-1 border-t border-border/40">
              <span className="text-text-muted font-sans font-medium">Taxable Amount</span>
              <span className="font-bold">₹{totalTaxable.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-text">
              <span className="text-text-muted font-sans font-medium">GST (incl.)</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">₹{totalGst.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm font-extrabold text-text pt-2 border-t border-border">
              <span className="font-sans">Grand Total</span>
              <span className="text-primary font-mono text-base">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* GST Slab Breakdown Table */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-text-muted">GST Slab Breakdown</h3>
          <div className="overflow-x-auto rounded-xl border border-border bg-surface-alt/20">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-border bg-surface-alt/70 text-[11px] font-bold text-text-muted uppercase">
                  <th className="py-2 px-3">GST</th>
                  <th className="py-2 px-3 text-right">Taxable</th>
                  <th className="py-2 px-3 text-right">CGST</th>
                  <th className="py-2 px-3 text-right">SGST</th>
                  <th className="py-2 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {gstSlabs.length > 0 ? (
                  gstSlabs.map((s) => (
                    <tr key={s.gstPct} className="hover:bg-surface-hover/50">
                      <td className="py-2 px-3 font-bold text-purple-600 dark:text-purple-400">{s.gstPct}%</td>
                      <td className="py-2 px-3 text-right text-text">₹{s.taxable.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right text-text-muted">₹{s.cgst.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right text-text-muted">₹{s.sgst.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right font-bold text-text">₹{s.total.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-2 px-3 font-bold text-purple-600 dark:text-purple-400">5%</td>
                    <td className="py-2 px-3 text-right text-text">₹{totalTaxable.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right text-text-muted">₹{totalCgst.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right text-text-muted">₹{totalSgst.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right font-bold text-text">₹{totalGst.toFixed(2)}</td>
                  </tr>
                )}
                <tr className="bg-surface-alt/80 font-bold border-t border-border">
                  <td className="py-2 px-3 text-text">Total</td>
                  <td className="py-2 px-3 text-right text-text">₹{totalTaxable.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right text-text">₹{totalCgst.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right text-text">₹{totalSgst.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right text-primary">₹{totalGst.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-error-soft/60 border border-error/30 text-error flex items-center gap-2.5 text-xs font-semibold">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <UIButton variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Back to Cart
          </UIButton>

          <PermissionGate
            permission="pos:create"
            fallback={
              <UIButton variant="primary" size="sm" disabled title="Requires pos:create permission">
                Process Invoice (Permission Required)
              </UIButton>
            }
          >
            <UIButton
              variant="primary"
              size="sm"
              loading={isSubmitting}
              disabled={isSubmitting}
              onClick={handleProcessSale}
              leftIcon={<CheckCircle2 className="size-4" />}
            >
              Generate {isB2B ? "B2B Tax Invoice" : "B2C Receipt"} (₹{grandTotal.toFixed(2)})
            </UIButton>
          </PermissionGate>
        </div>
      </div>
    </UIModal>
  );
};

export default SalesCheckoutModal;
