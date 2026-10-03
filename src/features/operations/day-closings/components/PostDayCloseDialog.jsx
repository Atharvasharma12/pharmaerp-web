import React from "react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalBody,
  UIModalFooter,
  UIButton,
} from "@/components/ui";
import { CheckCircle2, Snowflake, Banknote, Landmark, ArrowRight, X } from "lucide-react";

const fmt = (n) => (Number(n) || 0).toLocaleString("en-IN");

/**
 * Shown after a day closing is successfully locked.
 * Asks the user if they want to create/open a bank deposit slip or close.
 */
export const PostDayCloseDialog = ({
  isOpen,
  onClose,
  onCreateBankSlip,
  frozenAmount = 0,
  runningAmount = 0,
  dayClosingNo,
}) => {
  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="md">
      <UIModalHeader>
        <UIModalTitle>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </div>
            <span>Day Closing Locked Successfully</span>
            {dayClosingNo && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-surface-secondary border border-border text-text-muted font-normal font-mono">
                {dayClosingNo}
              </span>
            )}
          </div>
        </UIModalTitle>
      </UIModalHeader>

      <UIModalBody>
        <div className="space-y-4">
          {/* Dual Balance Cards: Running & Frozen */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-1">
                <Banknote className="size-3" /> Carry Forward (Running)
              </div>
              <p className="font-mono font-bold text-xl text-emerald-700 dark:text-emerald-400">
                ₹{fmt(runningAmount)}
              </p>
              <p className="text-[10px] text-emerald-600/70 dark:text-emerald-500 mt-0.5">
                Active in drawer
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400 mb-1">
                <Snowflake className="size-3" /> Frozen Reserve
              </div>
              <p className="font-mono font-bold text-xl text-blue-700 dark:text-blue-400">
                ₹{fmt(frozenAmount)}
              </p>
              <p className="text-[10px] text-blue-600/70 dark:text-blue-500 mt-0.5">
                Awaiting bank deposit
              </p>
            </div>
          </div>

          <div className="text-center py-1">
            <p className="text-sm font-semibold text-text">
              Do you want to make a bank slip or close?
            </p>
            <p className="text-xs text-text-muted mt-0.5">
              {frozenAmount > 0
                ? `You have ₹${fmt(frozenAmount)} locked in frozen reserve ready to deposit.`
                : "You can generate a bank deposit slip or finish day closing now."}
            </p>
          </div>

          {/* Action options */}
          <div className="grid gap-2.5">
            <button
              type="button"
              onClick={onCreateBankSlip}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border-2 border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary text-primary transition group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 text-primary transition">
                  <Landmark className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-text group-hover:text-primary transition">
                    Open Bank Slip
                  </p>
                  <p className="text-xs text-text-muted">
                    Create bank deposit slip for the frozen cash reserve
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 text-primary group-hover:translate-x-1 transition" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-border hover:bg-surface-secondary text-text transition text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-surface-secondary text-text-muted">
                  <X className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Close</p>
                  <p className="text-xs text-text-muted">
                    Finish day closing and stay on this page
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </UIModalBody>

      <UIModalFooter>
        <UIButton variant="ghost" onClick={onClose} className="w-full">
          Close for now
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
};

export default PostDayCloseDialog;
