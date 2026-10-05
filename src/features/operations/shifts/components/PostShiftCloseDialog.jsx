// src/features/operations/shifts/components/PostShiftCloseDialog.jsx

import React from "react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalBody,
  UIModalFooter,
  UIButton,
} from "@/components/ui";
import { Clock, FileCheck, CheckCircle2, Banknote, Snowflake, ArrowRight } from "lucide-react";

const fmt = (n) => (Number(n) || 0).toLocaleString("en-IN");

/**
 * Shown immediately after a shift is successfully closed.
 * Offers the user 3 actions: Open Next Shift, Close Business Day, or dismiss.
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
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="size-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-text tracking-tight">
                Shift Session Successfully Locked
              </h3>
              <p className="text-xs font-medium text-text-muted mt-0.5">
                Register session finalized and treasury updated
              </p>
            </div>
          </div>
        </UIModalTitle>
      </UIModalHeader>

      <UIModalBody>
        <div className="space-y-4 py-1">
          {/* Balance summary after close */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3.5 space-y-1">
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <Banknote className="size-3.5" /> Carry Forward
              </div>
              <p className="font-mono font-black text-xl text-emerald-600 dark:text-emerald-400">
                ₹{fmt(runningAmount)}
              </p>
              <p className="text-[10px] text-text-muted">Kept in drawer</p>
            </div>

            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-3.5 space-y-1">
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                <Snowflake className="size-3.5" /> Frozen Reserve
              </div>
              <p className="font-mono font-black text-xl text-cyan-600 dark:text-cyan-400">
                ₹{fmt(frozenAmount)}
              </p>
              <p className="text-[10px] text-text-muted">Awaiting deposit</p>
            </div>
          </div>

          <p className="text-xs font-semibold text-text-muted text-center pt-1">
            Choose your next workflow action:
          </p>

          {/* Action Cards */}
          <div className="grid gap-2.5">
            <button
              type="button"
              onClick={onOpenNewShift}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 text-primary transition-all duration-150 group cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                  <Clock className="size-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-text group-hover:text-primary transition-colors">
                    Start Next Shift
                  </p>
                  <p className="text-xs text-text-muted">
                    Open a new register shift session with carry-forward float
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>

            <button
              type="button"
              onClick={onCreateDayClosing}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-surface-alt/50 hover:bg-surface-alt hover:border-border text-text transition-all duration-150 group cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-surface border border-border text-text-muted group-hover:text-text group-hover:scale-105 transition-all">
                  <FileCheck className="size-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-text">
                    Close Business Day
                  </p>
                  <p className="text-xs text-text-muted">
                    End business day session and lock day-end records
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
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

export default PostShiftCloseDialog;
