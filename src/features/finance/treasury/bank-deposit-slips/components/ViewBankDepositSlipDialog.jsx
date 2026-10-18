// src/features/finance/treasury/bank-deposit-slips/components/ViewBankDepositSlipDialog.jsx

import React, { useState } from "react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalBody,
  UIModalFooter,
  UIButton,
  UIBadge,
  UIAlert,
  uiToast,
} from "@/components/ui";
import {
  FileText,
  Landmark,
  Building2,
  Calendar,
  User,
  Tag,
  Coins,
  CheckCircle2,
  Clock,
  XCircle,
  Printer,
  Check,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Banknote,
} from "lucide-react";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";

const formatCurrency = (val) =>
  `₹ ${Number(val || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const DENOMINATIONS_CONFIG = {
  500: { label: "₹ 500", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800", icon: "₹" },
  200: { label: "₹ 200", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800", icon: "₹" },
  100: { label: "₹ 100", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800", icon: "₹" },
  50:  { label: "₹ 50",  color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800", icon: "₹" },
  20:  { label: "₹ 20",  color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800", icon: "₹" },
  10:  { label: "₹ 10",  color: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800", icon: "₹" },
  5:   { note: 5,   label: "₹ 5",   color: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300 border-pink-200 dark:border-pink-800", icon: "₹" },
  2:   { label: "₹ 2",   color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700", icon: "•" },
  1:   { label: "₹ 1",   color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700", icon: "•" },
};

export const ViewBankDepositSlipDialog = ({
  isOpen,
  onClose,
  slip,
  onConfirmDeposit,
  onCancelSlip,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [bankReference, setBankReference] = useState("");
  const [depositDate, setDepositDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [cancelReason, setCancelReason] = useState("");
  const [actionError, setActionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!slip) return null;

  const isPrepared = slip.status === "PREPARED" || slip.status === "PENDING";
  const isDeposited = slip.status === "DEPOSITED";
  const isCancelled = slip.status === "CANCELLED";

  const bankAccount = slip.toBankAccountId || slip.bankAccount || {};
  const bankName = bankAccount.bank || bankAccount.bankMasterId?.bankName || bankAccount.accountName || "Corporate Bank";
  const denominations = slip.denominations || [];

  const handlePrint = () => {
    window.print();
  };

  const submitConfirm = async () => {
    setActionError("");
    if (!bankReference.trim()) {
      const msg = "Please provide the bank acknowledgment or transaction reference number.";
      setActionError(msg);
      uiToast.warning("Reference Required", msg);
      return;
    }
    setIsSubmitting(true);
    try {
      await onConfirmDeposit(slip._id, {
        actualDepositDate: depositDate,
        bankAcknowledgmentRef: bankReference.trim(),
      });
      setIsConfirming(false);
      onClose();
    } catch (err) {
      const msg = typeof err === "string" ? err : err?.message || "Failed to confirm bank deposit.";
      setActionError(msg);
      uiToast.error("Confirmation Failed", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitCancel = async () => {
    setActionError("");
    if (!cancelReason.trim()) {
      const msg = "Please provide a cancellation reason.";
      setActionError(msg);
      uiToast.warning("Reason Required", msg);
      return;
    }
    setIsSubmitting(true);
    try {
      await onCancelSlip(slip._id, {
        cancellationReason: cancelReason.trim(),
      });
      setIsCancelling(false);
      onClose();
    } catch (err) {
      const msg = typeof err === "string" ? err : err?.message || "Failed to cancel bank deposit slip.";
      setActionError(msg);
      uiToast.error("Cancellation Failed", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UIModal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      className="w-[820px] max-w-[96vw] max-h-[92vh] flex flex-col overflow-hidden"
    >
      {/* ── Modal Header ── */}
      <UIModalHeader className="border-b border-border/80 px-6 py-4.5 bg-surface shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div
            className={cn(
              "size-11 rounded-2xl flex items-center justify-center text-white shadow-xs shrink-0",
              isDeposited
                ? "bg-emerald-600"
                : isCancelled
                ? "bg-rose-600"
                : "bg-amber-500"
            )}
          >
            {isDeposited ? (
              <CheckCircle2 className="size-5" />
            ) : isCancelled ? (
              <XCircle className="size-5" />
            ) : (
              <Clock className="size-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <UIModalTitle className="text-xl font-bold text-text tracking-tight font-mono">
                {slip.slipNumber}
              </UIModalTitle>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[10.5px] font-bold uppercase border tracking-wider",
                  isDeposited
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    : isCancelled
                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                )}
              >
                {slip.status}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Created on {dayjs(slip.slipDate).format("DD MMMM YYYY")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="size-9 rounded-xl border border-border bg-surface hover:bg-surface-alt flex items-center justify-center text-text-muted hover:text-text transition-colors cursor-pointer"
          title="Print Slip"
        >
          <Printer className="size-4" />
        </button>
      </UIModalHeader>

      <UIModalBody className="p-6 overflow-y-auto space-y-4 bg-bg flex-1">
        {actionError && (
          <UIAlert
            intent="danger"
            title="Action Error"
            description={actionError}
            onClose={() => setActionError("")}
          />
        )}

        {/* ── 3 Metric Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1: Deposit Amount */}
          <div className="bg-surface rounded-2xl border border-border p-3.5 shadow-2xs">
            <div className="text-[11px] font-medium text-text-muted">Total Deposit Amount</div>
            <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
              {formatCurrency(slip.amount)}
            </div>
            <div className="text-[10px] text-text-muted mt-0.5 font-mono">
              {denominations.reduce((sum, d) => sum + (Number(d.quantity) || 0), 0)} notes total
            </div>
          </div>

          {/* Card 2: Destination Bank */}
          <div className="bg-surface rounded-2xl border border-border p-3.5 shadow-2xs">
            <div className="text-[11px] font-medium text-text-muted">Destination Bank</div>
            <div className="text-sm font-bold text-text truncate mt-0.5">
              {bankName}
            </div>
            <div className="text-[10px] text-text-muted font-mono truncate mt-0.5">
              A/C: {bankAccount.accountNumber || "—"}
            </div>
          </div>

          {/* Card 3: Branch / Courier Bag */}
          <div className="bg-surface rounded-2xl border border-border p-3.5 shadow-2xs">
            <div className="text-[11px] font-medium text-text-muted">Bag / Reference</div>
            <div className="text-sm font-bold text-text truncate mt-0.5">
              {slip.depositBagReference || "Direct Counter"}
            </div>
            <div className="text-[10px] text-text-muted truncate mt-0.5">
              Branch: {slip.branchId?.name || "Main Branch"}
            </div>
          </div>
        </div>

        {/* ── Confirmation Details Card (if DEPOSITED) ── */}
        {isDeposited && (
          <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <div className="font-bold text-emerald-900 dark:text-emerald-200">
                Confirmed Bank Deposit
              </div>
              <div className="text-emerald-800/90 dark:text-emerald-300/80 font-mono text-[11.5px]">
                Bank Acknowledgment Ref: {slip.bankAcknowledgmentRef || "—"}
              </div>
              {slip.actualDepositDate && (
                <div className="text-emerald-800/70 dark:text-emerald-400/70 text-[11px]">
                  Deposited On: {dayjs(slip.actualDepositDate).format("DD MMM YYYY")}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Denominations Table Breakdown ── */}
        <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs">
          <div className="px-4 py-2.5 border-b border-border bg-surface-alt/50 flex items-center gap-2">
            <Banknote className="size-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-text">Denomination Note Breakdown</span>
          </div>

          <div className="grid grid-cols-12 px-4 py-2 border-b border-border/80 text-[11px] font-bold text-text-muted uppercase tracking-wider bg-surface-alt/30">
            <div className="col-span-5">Note</div>
            <div className="col-span-3 text-center">Count / Pieces</div>
            <div className="col-span-4 text-right">Subtotal</div>
          </div>

          <div className="divide-y divide-border/50 text-xs">
            {denominations.length === 0 ? (
              <div className="py-4 text-center text-text-muted text-xs">
                No denomination breakdown recorded.
              </div>
            ) : (
              denominations.map((d, idx) => {
                const noteVal = Number(d.denomination);
                const count = Number(d.quantity);
                const subtotal = noteVal * count;
                const config = DENOMINATIONS_CONFIG[noteVal] || {
                  label: `₹ ${noteVal}`,
                  color: "bg-surface-alt text-text border-border",
                  icon: "₹",
                };

                return (
                  <div key={idx} className="grid grid-cols-12 px-4 py-2.5 items-center hover:bg-surface-alt/30 transition">
                    <div className="col-span-5 flex items-center gap-2">
                      <span className={`size-6 rounded-md flex items-center justify-center text-[10px] font-bold border ${config.color}`}>
                        {config.icon}
                      </span>
                      <span className="font-bold text-text">{config.label}</span>
                    </div>
                    <div className="col-span-3 text-center font-mono font-semibold text-text">
                      {count}
                    </div>
                    <div className="col-span-4 text-right font-mono font-bold text-text">
                      {formatCurrency(subtotal)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Additional Notes / Narration ── */}
        {slip.narration && (
          <div className="bg-surface rounded-2xl border border-border p-3.5 space-y-1 shadow-2xs">
            <div className="text-[11px] font-semibold text-text-muted">Narration / Cashier Remarks</div>
            <p className="text-xs text-text leading-relaxed">{slip.narration}</p>
          </div>
        )}

        {/* ── Inline Action Panel: Confirm Deposit ── */}
        {isConfirming && (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="size-4" />
              <span>Confirm Bank Deposit Entry</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-text block mb-1">
                  Bank Acknowledgment / Ref # *
                </label>
                <input
                  type="text"
                  value={bankReference}
                  onChange={(e) => setBankReference(e.target.value)}
                  placeholder="e.g. ACK-994821 or Stamped Ref"
                  className="w-full text-xs bg-surface border border-border rounded-lg px-3 py-1.5 outline-none focus:border-emerald-500 text-text font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-text block mb-1">
                  Actual Deposit Date *
                </label>
                <input
                  type="date"
                  value={depositDate}
                  onChange={(e) => setDepositDate(e.target.value)}
                  className="w-full text-xs bg-surface border border-border rounded-lg px-3 py-1.5 outline-none focus:border-emerald-500 text-text font-mono"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <UIButton
                variant="outline"
                size="sm"
                onClick={() => setIsConfirming(false)}
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                Back
              </UIButton>
              <UIButton
                variant="primary"
                size="sm"
                onClick={submitConfirm}
                isLoading={isSubmitting}
                loadingText="Confirming..."
                disabled={isSubmitting || !bankReference.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
              >
                Submit Confirmation
              </UIButton>
            </div>
          </div>
        )}

        {/* ── Inline Action Panel: Cancel Slip ── */}
        {isCancelling && (
          <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-300">
              <AlertTriangle className="size-4" />
              <span>Cancel Bank Deposit Slip</span>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-text block mb-1">
                Cancellation Reason *
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Explain why this slip is being cancelled..."
                rows={2}
                className="w-full text-xs bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-rose-500 text-text resize-none"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <UIButton
                variant="outline"
                size="sm"
                onClick={() => setIsCancelling(false)}
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                Back
              </UIButton>
              <UIButton
                variant="danger"
                size="sm"
                onClick={submitCancel}
                isLoading={isSubmitting}
                loadingText="Cancelling..."
                disabled={isSubmitting || !cancelReason.trim()}
                className="font-bold cursor-pointer"
              >
                Confirm Cancellation
              </UIButton>
            </div>
          </div>
        )}

      </UIModalBody>

      {/* ── Modal Footer ── */}
      <UIModalFooter className="border-t border-border/80 px-6 py-3.5 bg-surface shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isPrepared && !isConfirming && !isCancelling && (
            <>
              <UIButton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCancelling(true)}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-800 cursor-pointer"
              >
                Cancel Slip
              </UIButton>
              <UIButton
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setIsConfirming(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
              >
                Confirm Deposit
              </UIButton>
            </>
          )}
        </div>

        <UIButton
          type="button"
          variant="secondary"
          size="md"
          onClick={onClose}
          className="cursor-pointer"
        >
          Close
        </UIButton>

      </UIModalFooter>
    </UIModal>
  );
};

export default ViewBankDepositSlipDialog;
