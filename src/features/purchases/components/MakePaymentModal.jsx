import React, { useState } from "react";
import {
  Banknote,
  X,
  CreditCard,
  Building,
  CheckCircle2,
  Loader2
} from "lucide-react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIButton,
  UIModalFooter
} from "@/components/ui";
import purchaseBillService from "../services/purchaseBillService";

export const MakePaymentModal = ({ bill, isOpen, onClose, onRefresh }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(bill?.amountDue || 0);
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [reference, setReference] = useState("");

  // Re-sync default amount when bill changes
  React.useEffect(() => {
    if (bill && isOpen) {
      setPaymentAmount(bill.amountDue || 0);
      setPaymentMode("CASH");
      setReference("");
    }
  }, [bill, isOpen]);

  if (!isOpen || !bill) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentAmount <= 0) {
      alert("Payment amount must be greater than zero.");
      return;
    }

    try {
      setIsSubmitting(true);
      await purchaseBillService.payPurchaseBill(bill._id || bill.id, {
        amount: Number(paymentAmount),
        paymentMode,
        referenceNumber: reference,
        narration: `Paid via ${paymentMode} - Ref: ${reference}`,
      });
      if (onRefresh) onRefresh();
      onClose();
    } catch (error) {
      console.error("Failed to process payment", error);
      alert(error?.response?.data?.message || "Failed to process payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="lg">
      <UIModalHeader>
        <div className="flex items-center justify-between w-full">
          <div>
            <UIModalTitle className="flex items-center gap-2">
              <Banknote className="size-5 text-primary" />
              <span>Make Supplier Payment</span>
            </UIModalTitle>
            <UIModalDescription>
              Record a payment made to {bill.supplierId?.businessName || "the supplier"}
            </UIModalDescription>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>
      </UIModalHeader>

      <UIModalBody className="space-y-4">
        {/* Bill Summary */}
        <div className="grid grid-cols-2 gap-3 bg-surface-alt/70 p-3.5 rounded-2xl border border-border text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-text-muted block">Bill Number</span>
            <span className="font-mono font-bold text-text block">{bill.purchaseBillNo || "-"}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-text-muted block">Total Bill Amount</span>
            <span className="font-mono font-bold text-text block">₹{(bill.grandTotal || 0).toFixed(2)}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-text-muted block">Amount Already Paid</span>
            <span className="font-mono font-bold text-emerald-600 block">₹{(bill.amountPaid || 0).toFixed(2)}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-rose-700 block">Pending Due</span>
            <span className="font-mono font-bold text-rose-600 block text-lg">₹{(bill.amountDue || 0).toFixed(2)}</span>
          </div>
        </div>

        <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text">Payment Amount (₹)</label>
            <input
              type="number"
              required
              min="1"
              max={bill.amountDue > 0 ? bill.amountDue : undefined}
              step="0.01"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-text">Payment Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "CASH", label: "Cash", icon: <Banknote className="size-4" /> },
                { id: "UPI", label: "UPI", icon: <CreditCard className="size-4" /> },
                { id: "BANK", label: "Bank Transfer", icon: <Building className="size-4" /> },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setPaymentMode(mode.id)}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                    paymentMode === mode.id
                      ? "bg-primary-soft/30 border-primary text-primary"
                      : "bg-surface border-border text-text-muted hover:border-text-muted"
                  }`}
                >
                  {mode.icon}
                  <span className="text-xs font-bold">{mode.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-text">Reference / Transaction Number (Optional)</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder={paymentMode === "CASH" ? "e.g., Cash Receipt No" : "e.g., UTR / Cheque Number"}
              className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
            />
          </div>
        </form>
      </UIModalBody>

      <UIModalFooter className="justify-end bg-surface-alt/40 border-t border-border gap-2">
        <UIButton variant="outline" size="sm" onClick={onClose} className="font-bold text-xs" disabled={isSubmitting}>
          Cancel
        </UIButton>
        
        <UIButton
          type="submit"
          form="payment-form"
          variant="primary"
          size="sm"
          className="font-bold text-xs bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white"
          leftIcon={isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
          disabled={isSubmitting || paymentAmount <= 0}
        >
          {isSubmitting ? "Processing..." : "Confirm Payment"}
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
};
