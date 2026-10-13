// src/features/sales/components/ResumeConflictDialog.jsx

import React from "react";
import {
  AlertTriangle,
  ArrowRight,
  PauseCircle,
  Trash2,
  ShoppingCart,
  User,
  ArrowLeftRight,
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

export const ResumeConflictDialog = ({
  isOpen,
  onClose,
  targetHeldBill,
  currentCartCount = 0,
  currentCartTotal = 0,
  currentCustomerName = "Walk-in Customer",
  onHoldCurrentAndResume,
  onDiscardCurrentAndResume,
}) => {
  if (!targetHeldBill) return null;

  const targetName = targetHeldBill.customerName || "Walk-in Customer";
  const targetToken = targetHeldBill.holdNumber || "HB-01";
  const targetItems = targetHeldBill.itemCount || targetHeldBill.cart?.length || 0;
  const targetTotal = targetHeldBill.grandTotal || 0;

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="md">
      <div className="flex flex-col">
        {/* Header */}
        <UIModalHeader className="border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <UIModalTitle className="text-base font-bold text-text">
                Active Bill Already In Progress
              </UIModalTitle>
              <UIModalDescription className="text-xs text-text-muted">
                Choose how to handle your active bill before resuming {targetToken}.
              </UIModalDescription>
            </div>
          </div>
        </UIModalHeader>

        {/* Body: Comparison Cards */}
        <UIModalBody className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Current Active Bill Card */}
            <div className="p-3.5 rounded-xl border border-border bg-surface-alt/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Current Active Bill
                </span>
                <UIBadge variant="dot" color="primary" className="text-[10px]">
                  On Screen
                </UIBadge>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-text truncate">
                  {currentCustomerName}
                </p>
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span>{currentCartCount} items</span>
                  <span className="font-mono font-bold text-text tabular-nums">
                    ₹{Number(currentCartTotal).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Target Held Bill Card */}
            <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                  Resuming Held Bill
                </span>
                <span className="font-mono text-[10.5px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">
                  {targetToken}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-text truncate">
                  {targetName}
                </p>
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span>{targetItems} items</span>
                  <span className="font-mono font-bold text-text tabular-nums">
                    ₹{Number(targetTotal).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-text-muted leading-relaxed">
            Would you like to put your current bill on hold so you don't lose it, or discard it and replace it with {targetToken}?
          </p>
        </UIModalBody>

        {/* Footer: 3 Options */}
        <UIModalFooter className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-border px-5 py-3.5">
          <UIButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto text-xs"
          >
            Cancel / Keep Current
          </UIButton>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <UIButton
              type="button"
              variant="outline"
              size="sm"
              onClick={onDiscardCurrentAndResume}
              startIcon={<Trash2 className="size-3.5" />}
              className="w-full sm:w-auto text-xs font-semibold text-error border-error/30 hover:bg-error-soft/30"
            >
              Discard & Resume
            </UIButton>

            <UIButton
              type="button"
              variant="primary"
              size="sm"
              onClick={onHoldCurrentAndResume}
              startIcon={<ArrowLeftRight className="size-3.5" />}
              className="w-full sm:w-auto text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white border-none shadow-xs"
            >
              Hold Current & Resume
            </UIButton>
          </div>
        </UIModalFooter>
      </div>
    </UIModal>
  );
};

export default ResumeConflictDialog;
