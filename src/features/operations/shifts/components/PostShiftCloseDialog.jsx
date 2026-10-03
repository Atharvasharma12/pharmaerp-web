import React from "react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalBody,
  UIModalFooter,
  UIButton,
} from "@/components/ui";
import { Clock, FileCheck, CheckCircle2, Banknote, Snowflake } from "lucide-react";

const fmt = (n) => (Number(n) || 0).toLocaleString("en-IN");

/**
 * Shown immediately after a shift is successfully closed.
 * Offers the user 3 actions: Open Next Shift, Create Day Closing, or dismiss.
 */
export const PostShiftCloseDialog = ({
  isOpen,
  onClose,
  onOpenNewShift,
  onCreateDayClosing,
  frozenAmount = 0,
  runningAmount = 0,
}) => {
  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="md">
      <UIModalHeader>
        <UIModalTitle>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20">
              <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            Shift Closed Successfully
          </div>
        </UIModalTitle>
      </UIModalHeader>

      <UIModalBody>
        <div className="space-y-4">
          {/* Balance summary after close */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-1">
                <Banknote className="size-3" /> Carry Forward (Running)
              </div>
              <p className="font-mono font-bold text-lg text-emerald-700 dark:text-emerald-400">
                ₹{fmt(runningAmount)}
              </p>
              <p className="text-[10px] text-emerald-600/70 dark:text-emerald-500 mt-0.5">Kept in drawer</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400 mb-1">
                <Snowflake className="size-3" /> Moved to Frozen
              </div>
              <p className="font-mono font-bold text-lg text-blue-700 dark:text-blue-400">
                ₹{fmt(frozenAmount)}
              </p>
              <p className="text-[10px] text-blue-600/70 dark:text-blue-500 mt-0.5">Awaiting bank deposit</p>
            </div>
          </div>

          <p className="text-sm text-text-muted text-center">What would you like to do next?</p>

          {/* Action buttons */}
          <div className="grid gap-2">
            <button
              onClick={onOpenNewShift}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 text-primary transition group"
            >
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition">
                <Clock className="size-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Open Next Shift</p>
                <p className="text-xs text-primary/70">Continue operations with a new shift</p>
              </div>
            </button>

            <button
              onClick={onCreateDayClosing}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 border-border hover:border-text-muted/30 hover:bg-surface-secondary text-text transition group"
            >
              <div className="p-2 rounded-lg bg-surface-secondary group-hover:bg-surface-alt transition">
                <FileCheck className="size-5 text-text-muted" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Create Day Closing</p>
                <p className="text-xs text-text-muted">End the business day and reconcile</p>
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
