// src/features/operations/day-closings/components/PostDayCloseDialog.jsx

import React from "react";
import {
  UIModal,
  UIButton,
  UIBadge,
} from "@/components/ui";
import {
  CheckCircle2,
  Landmark,
  Banknote,
  Snowflake,
  ArrowRight,
  X,
  Sparkles,
  Receipt,
} from "lucide-react";

const formatCurrency = (val) => {
  const num = Number(val) || 0;
  return `₹ ${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * PostDayCloseDialog
 * Displayed immediately after a day closing is successfully locked.
 * Offers the user the immediate workflow transition to generate a bank deposit slip.
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
    <UIModal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="w-[560px] max-w-[95vw] rounded-2xl border border-border bg-surface shadow-2xl flex flex-col overflow-hidden select-none"
    >
      {/* ── 1. Dialog Header (Fixed) ── */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-border/60 shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <CheckCircle2 className="size-5.5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-text tracking-tight">
                Day Closing Successfully Locked
              </h2>
              {dayClosingNo && (
                <UIBadge
                  variant="soft"
                  color="success"
                  className="text-[10px] py-0 px-2 font-mono font-bold"
                >
                  {dayClosingNo}
                </UIBadge>
              )}
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Financial records finalized and ledger entries written successfully
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors cursor-pointer"
        >
          <X className="size-4.5" />
        </button>
      </div>

      {/* ── 2. Dialog Body ── */}
      <div className="px-6 py-5 space-y-4.5">
        {/* Treasury Balances Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Card 1: Carry Forward (Drawer) */}
          <div className="bg-surface rounded-xl border border-border/80 p-3.5 shadow-xs flex items-center gap-3">
            <div className="size-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Banknote className="size-4.5 stroke-[1.8]" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-text-muted leading-tight">
                Carry Forward (Drawer)
              </div>
              <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 truncate">
                {formatCurrency(runningAmount)}
              </div>
              <div className="text-[10px] text-text-muted leading-tight mt-0.5">
                Counter drawer balance
              </div>
            </div>
          </div>

          {/* Card 2: Frozen Reserve */}
          <div className="bg-surface rounded-xl border border-border/80 p-3.5 shadow-xs flex items-center gap-3">
            <div className="size-9 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <Snowflake className="size-4.5 stroke-[1.8]" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-text-muted leading-tight">
                Frozen Reserve
              </div>
              <div className="text-base font-bold font-mono text-sky-600 dark:text-sky-400 mt-0.5 truncate">
                {formatCurrency(frozenAmount)}
              </div>
              <div className="text-[10px] text-text-muted leading-tight mt-0.5">
                Ready for bank deposit
              </div>
            </div>
          </div>
        </div>

        {/* Section Prompt */}
        <div className="pt-1">
          <div className="flex items-center gap-2 mb-2.5">
            <Sparkles className="size-3.5 text-primary" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
              Choose your next workflow action:
            </span>
          </div>

          {/* Action Cards */}
          <div className="space-y-2.5">
            {/* Action 1: Create Bank Deposit Slip (Recommended if frozenAmount > 0) */}
            <button
              type="button"
              onClick={onCreateBankSlip}
              className="w-full p-4 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all duration-150 flex items-center justify-between group cursor-pointer text-left shadow-xs hover:shadow-sm"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <Landmark className="size-5 stroke-[2]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-text group-hover:text-primary transition-colors">
                      Create Bank Deposit Slip
                    </span>
                    {frozenAmount > 0 && (
                      <UIBadge variant="soft" color="primary" className="text-[9px] font-bold py-0 px-1.5">
                        Recommended
                      </UIBadge>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-0.5 truncate">
                    Transfer frozen cash reserve to official bank ledger account
                  </p>
                </div>
              </div>

              <div className="size-8 rounded-lg bg-surface border border-border/80 flex items-center justify-center text-text-muted group-hover:text-primary group-hover:border-primary/40 group-hover:translate-x-0.5 transition-all shrink-0 ml-3">
                <ArrowRight className="size-4" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. Dialog Footer (Fixed) ── */}
      <div className="px-6 py-3.5 border-t border-border/60 bg-surface flex items-center justify-between shrink-0">
        <span className="text-[11px] text-text-muted">
          You can create bank deposit slips later from the Treasury menu.
        </span>

        <UIButton
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          className="h-9 px-4 text-xs font-semibold"
        >
          Dismiss
        </UIButton>
      </div>
    </UIModal>
  );
};

export default PostDayCloseDialog;
