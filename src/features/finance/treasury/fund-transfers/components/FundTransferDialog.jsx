// src/features/finance/treasury/fund-transfers/components/FundTransferDialog.jsx

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalBody,
  UIModalFooter,
  UIButton,
  UIInput,
  UISelect,
  UIBadge,
  UISkeleton,
  uiToast,
} from "@/components/ui";
import {
  ArrowRight,
  ArrowLeftRight,
  Building2,
  Landmark,
  Wallet,
  CheckCircle2,
  Calendar,
  Hash,
  FileText,
  Sparkles,
  Copy,
  Check,
  Printer,
  Ban,
  Clock,
  User,
  ArrowUpRight,
  ArrowDownLeft,
  X,
} from "lucide-react";
import dayjs from "dayjs";
import useBankAccount from "@/features/finance/treasury/bank-management/bank-accounts/hooks/useBankAccount";
import { cn } from "@/lib/utils";

const INITIAL_FORM = {
  transferDate: new Date().toISOString().split("T")[0],
  fromAccountType: "BANK",
  fromAccountId: "",
  toAccountType: "BANK",
  toAccountId: "",
  amount: "",
  referenceNumber: "",
  narration: "",
};

const AMOUNT_PRESETS = [5000, 10000, 25000, 50000, 100000];

const formatCurrency = (val) => {
  if (val === undefined || val === null || isNaN(Number(val))) return "0.00";
  return Number(val).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export function FundTransferDialog({
  isOpen,
  onClose,
  mode = "create",
  transferData = null,
  entityId = null,
  onSubmitCreate,
  onFetchById,
  onCancelTransfer,
  onSuccess,
}) {
  const { bankAccounts = [], getBankAccounts } = useBankAccount();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [details, setDetails] = useState(transferData);
  const [copiedKey, setCopiedKey] = useState(null);

  // Load bank accounts list when modal opens
  useEffect(() => {
    if (isOpen) {
      getBankAccounts().catch(() => {});
    }
  }, [isOpen, getBankAccounts]);

  // Load details if view mode and entityId passed
  useEffect(() => {
    if (!isOpen) {
      setFormData(INITIAL_FORM);
      setFormErrors({});
      setDetails(null);
      return;
    }

    if (mode === "view") {
      if (transferData) {
        setDetails(transferData);
      } else if (entityId && onFetchById) {
        setIsFetching(true);
        onFetchById(entityId)
          .then((data) => setDetails(data))
          .catch((err) => {
            uiToast.error(
              "Load Error",
              typeof err === "string" ? err : err?.message || "Failed to load transfer details."
            );
          })
          .finally(() => setIsFetching(false));
      }
    }
  }, [isOpen, mode, entityId, transferData, onFetchById]);

  const bankOptions = useMemo(() => {
    const list = Array.isArray(bankAccounts) ? bankAccounts : [];
    return [
      { label: "Select Bank Account", value: "" },
      ...list.map((acc) => ({
        label: `${acc.bank || acc.accountName} - ${acc.accountName} (•••• ${String(acc.accountNumber || "").slice(-4)})`,
        value: acc._id || acc.id,
      })),
    ];
  }, [bankAccounts]);

  const selectedFromAccount = useMemo(() => {
    return bankAccounts.find((a) => (a._id || a.id) === formData.fromAccountId) || null;
  }, [bankAccounts, formData.fromAccountId]);

  const selectedToAccount = useMemo(() => {
    return bankAccounts.find((a) => (a._id || a.id) === formData.toAccountId) || null;
  }, [bankAccounts, formData.toAccountId]);

  const handleFieldChange = (name, val) => {
    setFormData((prev) => ({ ...prev, [name]: val }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(String(text));
    setCopiedKey(key);
    uiToast.success("Copied to Clipboard", `${text} copied.`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const validate = () => {
    const errors = {};
    if (!formData.fromAccountId) errors.fromAccountId = "Select source bank account";
    if (!formData.toAccountId) errors.toAccountId = "Select destination bank account";
    if (formData.fromAccountId && formData.fromAccountId === formData.toAccountId) {
      errors.toAccountId = "Destination account must be different from source account";
    }

    const numAmt = parseFloat(formData.amount);
    if (!formData.amount || isNaN(numAmt) || numAmt <= 0) {
      errors.amount = "Enter a valid transfer amount (> 0)";
    }

    if (!formData.transferDate) errors.transferDate = "Transfer date is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstError = Object.values(errors)[0];
      uiToast.warning("Form Incomplete", firstError);
      return;
    }

    setIsSubmitting(true);

    const numAmt = parseFloat(formData.amount);
    const payload = {
      transferDate: new Date(formData.transferDate).toISOString(),
      fromAccountType: formData.fromAccountType,
      fromAccountId: formData.fromAccountId,
      toAccountType: formData.toAccountType,
      toAccountId: formData.toAccountId,
      amount: numAmt,
      referenceNumber: formData.referenceNumber.trim() || undefined,
      narration: formData.narration.trim() || undefined,
    };

    try {
      await onSubmitCreate(payload);
      uiToast.success(
        "Fund Transfer Created",
        `Successfully transferred ₹${numAmt.toLocaleString("en-IN")} between accounts.`
      );
      onSuccess?.();
      onClose();
    } catch (err) {
      uiToast.error(
        "Transfer Failed",
        typeof err === "string" ? err : err?.message || "Failed to record fund transfer."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isView = mode === "view";
  const isCompleted = details?.status === "POSTED" || details?.status === "COMPLETED";
  const isCancelled = details?.status === "CANCELLED";

  return (
    <UIModal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="max-w-[760px] w-full max-h-[92vh] flex flex-col p-0 overflow-hidden select-none"
    >
      {/* ── Modal Header ── */}
      <UIModalHeader className="px-6 py-4 border-b border-border bg-surface shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-xs">
            <ArrowLeftRight className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <UIModalTitle className="text-base font-bold text-text">
                {isView
                  ? `Fund Transfer ${details?.transferNumber ? `#${details.transferNumber}` : ""}`
                  : "New Fund Transfer"}
              </UIModalTitle>
              {isView && isCompleted && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> POSTED
                </span>
              )}
              {isView && isCancelled && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                  <Ban className="size-3" /> CANCELLED
                </span>
              )}
              {!isView && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                  <Sparkles className="size-3" /> INTERNAL TRANSFER
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              {isView
                ? `Transferred on ${dayjs(details?.transferDate).format("DD MMM YYYY")}`
                : "Transfer funds securely between verified bank accounts"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="size-7 rounded-full bg-surface-alt hover:bg-surface-hover text-text-muted hover:text-text flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>
      </UIModalHeader>

      {/* ── Modal Body ── */}
      <UIModalBody className="p-6 overflow-y-auto space-y-5 flex-1 min-h-0 bg-[#f8fafc] dark:bg-bg">
        {isFetching ? (
          <div className="space-y-4">
            <UISkeleton className="h-28 rounded-2xl" />
            <div className="grid grid-cols-2 gap-4">
              <UISkeleton className="h-24 rounded-xl" />
              <UISkeleton className="h-24 rounded-xl" />
            </div>
            <UISkeleton className="h-32 rounded-xl" />
          </div>
        ) : isView && details ? (
          /* ── VIEW MODE ── */
          <div className="space-y-4">
            {/* Visual Account-to-Account Flow Card */}
            <div className="bg-surface border border-border rounded-2xl p-4 shadow-2xs">
              <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
                {/* Source Bank */}
                <div className="md:col-span-3 p-3 rounded-xl bg-surface-alt/50 border border-border/70 flex items-start gap-3">
                  <div className="size-9 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <ArrowUpRight className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                      Source Account (Debited)
                    </span>
                    <span className="text-xs font-bold text-text truncate block mt-0.5">
                      {details.fromAccount?.bank ||
                        details.fromAccount?.accountName ||
                        details.fromAccountId?.accountName ||
                        "Primary Bank Account"}
                    </span>
                    <span className="text-[11px] font-mono text-text-muted truncate block">
                      {details.fromAccount?.accountNumber
                        ? `•••• ${String(details.fromAccount.accountNumber).slice(-4)}`
                        : "Account"}
                    </span>
                  </div>
                </div>

                {/* Transfer Arrow & Amount */}
                <div className="md:col-span-1 flex flex-col items-center justify-center text-center py-1">
                  <div className="size-8 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-2xs">
                    <ArrowRight className="size-4" />
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                    TRANSFERRED
                  </span>
                </div>

                {/* Destination Bank */}
                <div className="md:col-span-3 p-3 rounded-xl bg-surface-alt/50 border border-border/70 flex items-start gap-3">
                  <div className="size-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <ArrowDownLeft className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                      Destination Account (Credited)
                    </span>
                    <span className="text-xs font-bold text-text truncate block mt-0.5">
                      {details.toAccount?.bank ||
                        details.toAccount?.accountName ||
                        details.toAccountId?.accountName ||
                        "Destination Bank Account"}
                    </span>
                    <span className="text-[11px] font-mono text-text-muted truncate block">
                      {details.toAccount?.accountNumber
                        ? `•••• ${String(details.toAccount.accountNumber).slice(-4)}`
                        : "Account"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amount Highlight Banner */}
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">
                    Total Transferred Amount
                  </span>
                  <div className="text-xl sm:text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">
                    ₹{formatCurrency(details.amount)}
                  </div>
                </div>

                {details.referenceNumber && (
                  <button
                    type="button"
                    onClick={() => handleCopy(details.referenceNumber, "utr")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-alt hover:bg-surface-hover border border-border text-xs font-mono font-bold text-text transition cursor-pointer"
                    title="Copy UTR / Reference"
                  >
                    <span>UTR: {details.referenceNumber}</span>
                    {copiedKey === "utr" ? (
                      <Check className="size-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="size-3.5 text-text-muted" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Transfer Metadata 4-Card Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-surface border border-border rounded-xl p-3 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                  Transfer Date
                </span>
                <span className="text-xs font-bold text-text mt-0.5 block">
                  {dayjs(details.transferDate).format("DD MMM YYYY")}
                </span>
                <span className="text-[10px] text-text-muted">
                  {dayjs(details.transferDate).format("dddd")}
                </span>
              </div>

              <div className="bg-surface border border-border rounded-xl p-3 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                  Transfer Type
                </span>
                <span className="text-xs font-bold text-text mt-0.5 block">
                  {details.transferType || "Bank to Bank"}
                </span>
                <span className="text-[10px] text-text-muted">Direct Ledger Debit/Credit</span>
              </div>

              <div className="bg-surface border border-border rounded-xl p-3 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                  Recorded By
                </span>
                <span className="text-xs font-bold text-text truncate mt-0.5 block">
                  {details.createdBy?.name || details.createdBy?.fullName || "Staff User"}
                </span>
                <span className="text-[10px] text-text-muted truncate block">
                  {details.createdBy?.role || "Authorized Staff"}
                </span>
              </div>

              <div className="bg-surface border border-border rounded-xl p-3 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                  Status
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block capitalize">
                  {details.status || "POSTED"}
                </span>
                <span className="text-[10px] text-text-muted">Ledger Synchronized</span>
              </div>
            </div>

            {/* Narration */}
            <div className="bg-surface border border-border rounded-xl p-3.5 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-text">
                <FileText className="size-3.5 text-text-muted" />
                <span>Narration / Purpose</span>
              </div>
              <p className="text-xs text-text-muted bg-surface-alt/50 border border-border/60 rounded-lg p-2.5 leading-relaxed">
                {details.narration || "No custom remarks recorded for this transfer."}
              </p>
            </div>
          </div>
        ) : (
          /* ── CREATE MODE ── */
          <form id="fund-transfer-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Visual Transfer Flow Preview */}
            <div className="bg-surface border border-border rounded-2xl p-4 shadow-2xs">
              <div className="text-[10px] uppercase font-bold text-text-muted tracking-wider mb-2">
                Transfer Preview
              </div>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
                {/* Source Account Box */}
                <div className="md:col-span-3 p-3 rounded-xl bg-surface-alt/40 border border-border flex items-start gap-2.5">
                  <div className="size-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <ArrowUpRight className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-text-muted block">FROM</span>
                    <span className="text-xs font-bold text-text truncate block">
                      {selectedFromAccount?.bank || selectedFromAccount?.accountName || "Select Source"}
                    </span>
                    <span className="text-[10px] font-mono text-text-muted truncate block">
                      {selectedFromAccount?.accountNumber
                        ? `•••• ${String(selectedFromAccount.accountNumber).slice(-4)}`
                        : "No account selected"}
                    </span>
                  </div>
                </div>

                {/* Arrow & Dynamic Amount */}
                <div className="md:col-span-1 flex flex-col items-center justify-center text-center">
                  <div className="size-7 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <ArrowRight className="size-3.5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {formData.amount ? `₹${formatCurrency(formData.amount)}` : "₹ 0.00"}
                  </span>
                </div>

                {/* Destination Account Box */}
                <div className="md:col-span-3 p-3 rounded-xl bg-surface-alt/40 border border-border flex items-start gap-2.5">
                  <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <ArrowDownLeft className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-text-muted block">TO</span>
                    <span className="text-xs font-bold text-text truncate block">
                      {selectedToAccount?.bank || selectedToAccount?.accountName || "Select Destination"}
                    </span>
                    <span className="text-[10px] font-mono text-text-muted truncate block">
                      {selectedToAccount?.accountNumber
                        ? `•••• ${String(selectedToAccount.accountNumber).slice(-4)}`
                        : "No account selected"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Selectors Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-text block mb-1">
                  Source Account (From) <span className="text-rose-500">*</span>
                </label>
                <UISelect
                  value={formData.fromAccountId}
                  onChange={(val) => handleFieldChange("fromAccountId", val)}
                  options={bankOptions}
                  error={Boolean(formErrors.fromAccountId)}
                  helperText={formErrors.fromAccountId}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text block mb-1">
                  Destination Account (To) <span className="text-rose-500">*</span>
                </label>
                <UISelect
                  value={formData.toAccountId}
                  onChange={(val) => handleFieldChange("toAccountId", val)}
                  options={bankOptions}
                  error={Boolean(formErrors.toAccountId)}
                  helperText={formErrors.toAccountId}
                />
              </div>
            </div>

            {/* Amount & Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-text block mb-1">
                  Transfer Amount (₹) <span className="text-rose-500">*</span>
                </label>
                <UIInput
                  type="number"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleFieldChange("amount", e.target.value)}
                  error={Boolean(formErrors.amount)}
                  helperText={formErrors.amount}
                  startIcon={<span className="text-xs font-bold text-text-muted font-mono">₹</span>}
                />
                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  <span className="text-[10px] text-text-muted font-medium">Quick Add:</span>
                  {AMOUNT_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleFieldChange("amount", String(preset))}
                      className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-surface border border-border hover:bg-surface-alt hover:border-indigo-500/40 text-text transition cursor-pointer"
                    >
                      ₹{preset.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-text block mb-1">
                  Transfer Date <span className="text-rose-500">*</span>
                </label>
                <UIInput
                  type="date"
                  value={formData.transferDate}
                  onChange={(e) => handleFieldChange("transferDate", e.target.value)}
                  error={Boolean(formErrors.transferDate)}
                  helperText={formErrors.transferDate}
                />
              </div>
            </div>

            {/* Reference Number & Narration Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-text block mb-1">
                  UTR / Reference Number (Optional)
                </label>
                <UIInput
                  type="text"
                  placeholder="e.g. UTR9823487123"
                  value={formData.referenceNumber}
                  onChange={(e) => handleFieldChange("referenceNumber", e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text block mb-1">
                  Narration / Remarks (Optional)
                </label>
                <UIInput
                  type="text"
                  placeholder="e.g., Transfer for supplier payment buffer..."
                  value={formData.narration}
                  onChange={(e) => handleFieldChange("narration", e.target.value)}
                />
              </div>
            </div>
          </form>
        )}
      </UIModalBody>

      {/* ── Modal Footer ── */}
      <UIModalFooter className="px-6 py-3 border-t border-border bg-surface shrink-0 flex items-center justify-between">
        {isView ? (
          <>
            <UIButton
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              startIcon={<Printer className="size-3.5" />}
              className="rounded-xl text-xs font-medium"
            >
              Print Voucher
            </UIButton>

            <div className="flex items-center gap-2">
              {isCompleted && onCancelTransfer && (
                <UIButton
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => onCancelTransfer(details._id || details.id)}
                  startIcon={<Ban className="size-3.5" />}
                  className="rounded-xl text-xs font-semibold px-4"
                >
                  Cancel Transfer
                </UIButton>
              )}

              <UIButton
                type="button"
                size="sm"
                onClick={onClose}
                className="rounded-xl text-xs font-semibold px-5"
              >
                Close
              </UIButton>
            </div>
          </>
        ) : (
          <>
            <UIButton
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl text-xs font-semibold px-4"
            >
              Cancel
            </UIButton>

            <UIButton
              type="submit"
              form="fund-transfer-form"
              size="sm"
              variant="primary"
              isLoading={isSubmitting}
              startIcon={<ArrowLeftRight className="size-3.5" />}
              className="rounded-xl text-xs font-bold px-5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer transition"
            >
              Transfer Funds
            </UIButton>
          </>
        )}
      </UIModalFooter>
    </UIModal>
  );
}

export default FundTransferDialog;
