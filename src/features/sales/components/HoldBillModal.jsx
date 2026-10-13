// src/features/sales/components/HoldBillModal.jsx

import React, { useState, useEffect, useRef } from "react";
import {
  PauseCircle,
  Tag,
  User,
  ShoppingCart,
  IndianRupee,
  Clock,
  Sparkles,
  Layers,
} from "lucide-react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIModalFooter,
  UIButton,
  UIBadge,
} from "@/components";
import { cn } from "@/lib/utils";

const QUICK_HOLD_TAGS = [
  "📦 Godown Fetch",
  "🏧 Customer at ATM",
  "👨‍⚕️ Doctor Verification",
  "📞 Call on Hold",
  "🛒 Adding More Items",
];

export const HoldBillModal = ({
  isOpen,
  onClose,
  onConfirmHold,
  onOpenQueue,
  heldBillsCount = 0,
  cartSummary = {
    items: [],
    itemCount: 0,
    grandTotal: 0,
    customerName: "",
    customerPhone: "",
    billingMode: "B2C",
  },
}) => {
  const [note, setNote] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setNote("");
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    onConfirmHold(note.trim());
    onClose();
  };

  const handleSelectTag = (tag) => {
    setNote((prev) => (prev ? `${prev} · ${tag}` : tag));
    inputRef.current?.focus();
  };

  const displayName = cartSummary.customerName || "Walk-in Customer";
  const itemCount = cartSummary.itemCount || cartSummary.items?.length || 0;
  const grandTotal = cartSummary.grandTotal || 0;

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="sm">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <UIModalHeader>
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <PauseCircle className="size-5" />
            </div>
            <div>
              <UIModalTitle className="text-base font-bold text-text">
                Hold Active Bill
              </UIModalTitle>
              <UIModalDescription className="text-xs text-text-muted">
                Safely hold this transaction on this device to serve other customers.
              </UIModalDescription>
            </div>
          </div>
        </UIModalHeader>

        <UIModalBody className="space-y-4 p-5">
          {/* Bill Summary Banner */}
          <div className="p-3.5 rounded-xl border border-border/80 bg-surface-alt/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-text truncate max-w-[200px]">
                <User className="size-3.5 text-text-muted shrink-0" />
                <span className="truncate">{displayName}</span>
                {cartSummary.customerPhone && (
                  <span className="text-[11px] text-text-muted font-mono">
                    ({cartSummary.customerPhone})
                  </span>
                )}
              </div>
              <UIBadge
                variant="soft"
                color={cartSummary.billingMode === "B2B" ? "warning" : "primary"}
                className="text-[10px] uppercase font-bold"
              >
                {cartSummary.billingMode === "B2B" ? "B2B Party" : "B2C Retail"}
              </UIBadge>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-border/50 text-xs">
              <div className="flex items-center gap-1.5 text-text-muted">
                <ShoppingCart className="size-3.5" />
                <span>
                  {itemCount} {itemCount === 1 ? "unit" : "units"} (
                  {cartSummary.items?.length || 0} items)
                </span>
              </div>
              <div className="font-mono font-bold text-sm text-text tabular-nums">
                ₹{Number(grandTotal).toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          {/* Optional Note Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">
              Reason / Remark (Optional)
            </label>
            <input
              ref={inputRef}
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Fetching from godown, ATM cash..."
              className="w-full h-10 rounded-xl border border-border px-3.5 text-sm bg-surface text-text focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 outline-none transition-all placeholder:text-text-muted/60"
            />
            <p className="text-[11px] text-text-muted">
              Press <kbd className="px-1 py-0.5 rounded bg-surface-alt border border-border text-[10px] font-mono">Enter</kbd> to hold immediately.
            </p>
          </div>

          {/* Quick Tag Suggestions */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-text-muted flex items-center gap-1">
              <Tag className="size-3" /> Quick Tags:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_HOLD_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleSelectTag(tag)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-surface hover:bg-surface-alt border border-border text-text hover:border-amber-500/40 transition-all cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Link to existing held bills queue if any */}
          {heldBillsCount > 0 && typeof onOpenQueue === "function" && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
              <span className="text-text-muted flex items-center gap-1.5">
                <Clock className="size-3.5 text-amber-500" />
                <span>
                  <strong>{heldBillsCount}</strong> {heldBillsCount === 1 ? "bill" : "bills"} currently on hold
                </span>
              </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenQueue();
                }}
                className="font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                View Queue →
              </button>
            </div>
          )}
        </UIModalBody>

        <UIModalFooter className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
          <UIButton type="button" variant="ghost" onClick={onClose} size="sm">
            Cancel
          </UIButton>
          <UIButton
            type="submit"
            variant="warning"
            size="sm"
            startIcon={<PauseCircle className="size-4" />}
            className="font-bold bg-amber-500 hover:bg-amber-600 text-white border-none shadow-xs"
          >
            Hold Bill Now
          </UIButton>
        </UIModalFooter>
      </form>
    </UIModal>
  );
};

export default HoldBillModal;
