// src/features/finance/treasury/cheque-management/components/ChequeDialog.jsx

import React, { useState, useEffect, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  Check,
  Edit2,
  Calendar,
  User,
  CreditCard,
  Landmark,
  FileText,
  Sparkles,
  Printer,
  Ban,
  X,
  Clock,
  Building2,
} from "lucide-react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalBody,
  UIModalFooter,
  UIInput,
  UISelect,
  UIButton,
  UIBadge,
  UISkeleton,
  uiToast,
} from "@/components/ui";
import useBankAccount from "@/features/finance/treasury/bank-management/bank-accounts/hooks/useBankAccount";
import useAccount from "@/features/finance/chart-of-accounts/accounts/hooks/useAccount";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

const chequeTypeOptions = [
  { label: "Received Cheque (From Customer)", value: "RECEIVED" },
  { label: "Issued Cheque (To Supplier)", value: "ISSUED" },
];

const formatCurrency = (val) => {
  if (val === undefined || val === null || isNaN(Number(val))) return "0.00";
  return Number(val).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const INITIAL_FORM = {
  chequeNumber: "",
  type: "RECEIVED",
  partyName: "",
  bankAccountId: "",
  counterpartyAccountId: "",
  amount: "",
  chequeDate: new Date().toISOString().split("T")[0],
  remarks: "",
};

function numberToWordsINR(num) {
  if (!num || isNaN(num) || num <= 0) return "Zero Rupees Only";
  const a = [
    "",
    "One ",
    "Two ",
    "Three ",
    "Four ",
    "Five ",
    "Six ",
    "Seven ",
    "Eight ",
    "Nine ",
    "Ten ",
    "Eleven ",
    "Twelve ",
    "Thirteen ",
    "Fourteen ",
    "Fifteen ",
    "Sixteen ",
    "Seventeen ",
    "Eighteen ",
    "Nineteen ",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const inWords = (n) => {
    let str = "";
    if (n > 99) {
      str += a[Math.floor(n / 100)] + "Hundred ";
      n %= 100;
    }
    if (n > 19) {
      str += b[Math.floor(n / 10)] + " " + a[n % 10];
    } else if (n > 0) {
      str += a[n];
    }
    return str;
  };

  let n = Math.floor(num);
  let str = "";

  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  if (crore > 0) str += inWords(crore) + "Crore ";

  const lakh = Math.floor(n / 100000);
  n %= 100000;
  if (lakh > 0) str += inWords(lakh) + "Lakh ";

  const thousand = Math.floor(n / 1000);
  n %= 1000;
  if (thousand > 0) str += inWords(thousand) + "Thousand ";

  const hundred = n;
  if (hundred > 0) str += inWords(hundred);

  return (str.trim() + " Rupees Only").replace(/\s+/g, " ");
}

/**
 * Realistic Indian Bank Cheque Leaf Preview
 */
export const ChequeLeafCard = ({ formData = {}, bankAccount = null }) => {
  const isReceived = (formData.type || formData.chequeType) === "RECEIVED";
  const numAmt = parseFloat(formData.amount) || 0;
  const words = numberToWordsINR(numAmt);

  const formattedDate = formData.chequeDate
    ? new Date(formData.chequeDate)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "  ")
    : "D D  M M  Y Y Y Y";

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border-2 border-border/80 bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] dark:from-surface dark:via-surface-alt dark:to-surface p-5 sm:p-6 shadow-sm select-none font-sans transition-all">
      {/* Background Watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.04]">
        <Landmark className="size-64 stroke-[1.2]" />
      </div>

      {/* Top Bank Header & Date Box */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Landmark className="size-5 text-primary shrink-0" />
            <span className="font-extrabold uppercase tracking-wide text-xs sm:text-sm text-text">
              {bankAccount?.bank || bankAccount?.accountName || "National Commercial Bank"}
            </span>
          </div>
          <p className="text-[11px] text-text-muted mt-0.5">
            Branch: {bankAccount?.branchName || bankAccount?.bankBranchName || "Main Commercial Branch"}
          </p>
        </div>

        {/* Date Box */}
        <div className="flex flex-col items-end shrink-0">
          <span className="text-[10px] font-bold text-text-muted tracking-wider uppercase mb-0.5">
            Date
          </span>
          <div className="px-3 py-1 rounded-lg border border-border bg-surface font-mono text-xs font-bold text-text shadow-xs">
            {formattedDate}
          </div>
        </div>
      </div>

      {/* Payee Line */}
      <div className="mt-4 pt-3 border-t border-border/80 flex items-baseline gap-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-text-muted shrink-0">
          PAY:
        </span>
        <div className="flex-1 border-b border-dashed border-border/90 pb-1 font-semibold text-sm text-text truncate">
          {formData.partyName || "CASH / BEARER"}
        </div>
        <span className="text-[10px] font-semibold text-text-muted shrink-0">
          OR BEARER
        </span>
      </div>

      {/* Amount in words and Amount box */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0 flex items-baseline gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-text-muted shrink-0">
            RUPEES:
          </span>
          <div className="flex-1 border-b border-dashed border-border/90 pb-1 font-medium text-xs text-text italic truncate">
            {words}
          </div>
        </div>

        {/* Amount Box */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-text-muted">₹</span>
          <div className="min-w-[120px] px-3 py-1.5 rounded-xl border-2 border-primary/40 bg-surface text-right font-mono text-base font-extrabold text-primary shadow-xs">
            {numAmt.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            <span className="text-xs ml-1 text-text-muted font-normal">/-</span>
          </div>
        </div>
      </div>

      {/* Bottom Cheque Details Row */}
      <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full border",
              isReceived
                ? "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200"
                : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200"
            )}
          >
            {isReceived ? "CUSTOMER CHEQUE (RECEIVED)" : "SUPPLIER CHEQUE (ISSUED)"}
          </span>
          <span className="font-mono text-xs font-bold text-text-muted">
            NO: {formData.chequeNumber || "000000"}
          </span>
        </div>

        <div className="text-right">
          <div className="h-6 w-28 border-b border-border/90 ml-auto" />
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block mt-0.5">
            Authorized Signatory
          </span>
        </div>
      </div>
    </div>
  );
};

export function ChequeDialog({
  isOpen,
  onClose,
  mode = "create",
  entityId = null,
  chequeData = null,
  onSubmitCreate,
  onSubmitUpdate,
  onFetchById,
  onDepositCheque,
  onClearCheque,
  onBounceCheque,
  onCancelCheque,
  onSuccess,
}) {
  const { bankAccounts = [], getBankAccounts } = useBankAccount();
  const { accounts = [], getAccounts } = useAccount();

  const [currentMode, setCurrentMode] = useState(mode);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [activeAction, setActiveAction] = useState(null); // 'deposit' | 'clear' | 'bounce' | 'cancel' | null
  const [details, setDetails] = useState(chequeData);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleActionClick = async (actionType, fn) => {
    if (!fn || activeAction) return;
    try {
      setActiveAction(actionType);
      await fn(details?._id || details?.id);
    } catch {
      // Handled by parent or toast
    } finally {
      setActiveAction(null);
    }
  };

  useEffect(() => {
    setCurrentMode(mode);
  }, [mode, isOpen]);

  // Load bank accounts and general ledger accounts when modal opens
  useEffect(() => {
    if (isOpen) {
      getBankAccounts().catch(() => {});
      getAccounts?.({ all: true }).catch(() => {});
    }
  }, [isOpen, getBankAccounts, getAccounts]);

  // Load cheque details
  useEffect(() => {
    if (!isOpen) {
      setFormData(INITIAL_FORM);
      setFormErrors({});
      setDetails(null);
      setActiveAction(null);
      return;
    }

    if (currentMode === "view" || currentMode === "edit") {
      if (chequeData) {
        setDetails(chequeData);
        setFormData({
          chequeNumber: chequeData.chequeNumber || "",
          type: chequeData.chequeType || chequeData.type || "RECEIVED",
          partyName: chequeData.partyName || "",
          bankAccountId:
            typeof chequeData.bankAccountId === "object"
              ? chequeData.bankAccountId?._id
              : chequeData.bankAccountId || "",
          counterpartyAccountId:
            typeof chequeData.counterpartyAccountId === "object"
              ? chequeData.counterpartyAccountId?._id
              : chequeData.counterpartyAccountId || "",
          amount: String(chequeData.amount || ""),
          chequeDate: chequeData.chequeDate
            ? new Date(chequeData.chequeDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          remarks: chequeData.narration || chequeData.remarks || "",
        });
      } else if (entityId && onFetchById) {
        setIsFetching(true);
        onFetchById(entityId)
          .then((data) => {
            setDetails(data);
            setFormData({
              chequeNumber: data.chequeNumber || "",
              type: data.chequeType || data.type || "RECEIVED",
              partyName: data.partyName || "",
              bankAccountId:
                typeof data.bankAccountId === "object"
                  ? data.bankAccountId?._id
                  : data.bankAccountId || "",
              counterpartyAccountId:
                typeof data.counterpartyAccountId === "object"
                  ? data.counterpartyAccountId?._id
                  : data.counterpartyAccountId || "",
              amount: String(data.amount || ""),
              chequeDate: data.chequeDate
                ? new Date(data.chequeDate).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0],
              remarks: data.narration || data.remarks || "",
            });
          })
          .catch((err) => {
            uiToast.error(
              "Load Error",
              typeof err === "string" ? err : err?.message || "Failed to load cheque details."
            );
          })
          .finally(() => setIsFetching(false));
      }
    } else {
      setFormData(INITIAL_FORM);
      setFormErrors({});
    }
  }, [isOpen, currentMode, entityId, chequeData, onFetchById]);

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

  const accountOptions = useMemo(() => {
    const list = Array.isArray(accounts) ? accounts : [];
    return [
      { label: "Auto-resolve (Default System Account)", value: "" },
      ...list.map((acc) => ({
        label: `${acc.accountCode} — ${acc.accountName}`,
        value: acc._id || acc.id,
      })),
    ];
  }, [accounts]);

  const selectedBank = useMemo(() => {
    return bankAccounts.find((b) => (b._id || b.id) === formData.bankAccountId);
  }, [bankAccounts, formData.bankAccountId]);

  const handleFieldChange = (name, val) => {
    setFormData((prev) => ({ ...prev, [name]: val }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard?.writeText(String(text));
    setCopiedKey(key);
    uiToast.success("Copied to Clipboard", `${text} copied.`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const validate = () => {
    const errors = {};
    if (!formData.chequeNumber.trim())
      errors.chequeNumber = "Cheque number is required";
    if (!formData.partyName.trim())
      errors.partyName = "Party name is required";
    if (!formData.bankAccountId)
      errors.bankAccountId = "Select bank account";

    const numAmt = parseFloat(formData.amount);
    if (!formData.amount || isNaN(numAmt) || numAmt <= 0) {
      errors.amount = "Enter a valid amount (> 0)";
    }

    if (!formData.chequeDate) errors.chequeDate = "Cheque date is required";
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
      chequeNumber: formData.chequeNumber.trim(),
      chequeType: formData.type,
      type: formData.type,
      partyName: formData.partyName.trim(),
      bankAccountId: formData.bankAccountId,
      counterpartyAccountId: formData.counterpartyAccountId || undefined,
      amount: numAmt,
      chequeDate: new Date(formData.chequeDate).toISOString(),
      narration: formData.remarks.trim() || undefined,
      remarks: formData.remarks.trim() || undefined,
    };

    try {
      if (currentMode === "create") {
        await onSubmitCreate?.(payload);
        uiToast.success(
          "Cheque Registered",
          `Cheque #${payload.chequeNumber} for ₹${numAmt.toLocaleString("en-IN")} recorded.`
        );
      } else if (currentMode === "edit" && (entityId || details?._id)) {
        await onSubmitUpdate?.(entityId || details._id, payload);
        uiToast.success(
          "Cheque Updated",
          `Cheque #${payload.chequeNumber} particulars updated successfully.`
        );
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      uiToast.error(
        "Action Failed",
        typeof err === "string" ? err : err?.message || "Failed to process cheque."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isView = currentMode === "view";
  const isEdit = currentMode === "edit";
  const isCreate = currentMode === "create";

  const isPending = details?.status === "PENDING" || details?.status === "RECEIVED";
  const isDeposited = details?.status === "DEPOSITED";
  const isCleared = details?.status === "CLEARED";
  const isBounced = details?.status === "BOUNCED";
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
          <div className="size-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-center shadow-xs">
            <CreditCard className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <UIModalTitle className="text-base font-bold text-text">
                {isCreate
                  ? "Register Cheque"
                  : isEdit
                  ? "Edit Cheque"
                  : `Cheque #${details?.chequeNumber || ""}`}
              </UIModalTitle>
              {isView && details?.status && (
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                    isCleared
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200"
                      : isBounced || isCancelled
                      ? "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200"
                  )}
                >
                  {details.status}
                </span>
              )}
              {isCreate && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200">
                  NEW CHEQUE
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              {isView
                ? `Dated ${dayjs(details?.chequeDate).format("DD MMM YYYY")}`
                : "Record physical cheque particulars for tracking and bank clearance"}
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
            <UISkeleton className="h-44 rounded-2xl" />
            <div className="grid grid-cols-3 gap-3">
              <UISkeleton className="h-20 rounded-xl" />
              <UISkeleton className="h-20 rounded-xl" />
              <UISkeleton className="h-20 rounded-xl" />
            </div>
          </div>
        ) : (
          <>
            {/* Visual Cheque Leaf Card Preview */}
            <ChequeLeafCard
              formData={isView && details ? details : formData}
              bankAccount={
                selectedBank ||
                details?.bankAccount ||
                details?.bankAccountId ||
                null
              }
            />

            {/* ── VIEW MODE DETAILS ── */}
            {isView && details && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-surface border border-border rounded-xl p-3 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                      Cheque Amount
                    </span>
                    <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                      ₹{formatCurrency(details.amount)}
                    </span>
                    <span className="text-[10px] text-text-muted">Cleared upon credit</span>
                  </div>

                  <div className="bg-surface border border-border rounded-xl p-3 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                      Cheque Type
                    </span>
                    <span className="text-xs font-bold text-text mt-0.5 block">
                      {(details.chequeType || details.type) === "RECEIVED" ? "Customer Inward" : "Supplier Outward"}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {(details.chequeType || details.type) === "RECEIVED" ? "Receivable" : "Disbursement"}
                    </span>
                  </div>

                  <div className="bg-surface border border-border rounded-xl p-3 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                      Party / Drawer
                    </span>
                    <span className="text-xs font-bold text-text truncate mt-0.5 block">
                      {details.partyName || "Bearer"}
                    </span>
                    <span className="text-[10px] text-text-muted truncate block">
                      {details.counterpartyAccountId?.accountName
                        ? `${details.counterpartyAccountId.accountCode || ""} ${details.counterpartyAccountId.accountName}`
                        : "Direct Counterparty"}
                    </span>
                  </div>

                  <div className="bg-surface border border-border rounded-xl p-3 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                      Bank Clearance
                    </span>
                    <span className="text-xs font-bold text-text mt-0.5 block capitalize">
                      {details.status || "Pending"}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {details.clearedAt || details.clearDate || details.clearedDate
                        ? dayjs(details.clearedAt || details.clearDate || details.clearedDate).format("DD MMM YYYY")
                        : String(details.status || "").toUpperCase() === "CLEARED"
                        ? (details.updatedAt ? dayjs(details.updatedAt).format("DD MMM YYYY") : "Cleared")
                        : "Not yet cleared"}
                    </span>
                  </div>
                </div>

                {/* Remarks */}
                <div className="bg-surface border border-border rounded-xl p-3.5 shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-text">
                    <FileText className="size-3.5 text-text-muted" />
                    <span>Cheque Remarks / Narration</span>
                  </div>
                  <p className="text-xs text-text-muted bg-surface-alt/50 border border-border/60 rounded-lg p-2.5 leading-relaxed">
                    {details.narration || details.remarks || "No custom remarks recorded."}
                  </p>
                </div>
              </div>
            )}

            {/* ── CREATE / EDIT FORM ── */}
            {!isView && (
              <form id="cheque-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-text block mb-1">
                      Cheque Type <span className="text-rose-500">*</span>
                    </label>
                    <UISelect
                      value={formData.type}
                      onChange={(val) => handleFieldChange("type", val)}
                      options={chequeTypeOptions}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text block mb-1">
                      Cheque Number <span className="text-rose-500">*</span>
                    </label>
                    <UIInput
                      type="text"
                      placeholder="e.g. 000124"
                      maxLength={12}
                      value={formData.chequeNumber}
                      onChange={(e) => handleFieldChange("chequeNumber", e.target.value)}
                      error={Boolean(formErrors.chequeNumber)}
                      helperText={formErrors.chequeNumber}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-text block mb-1">
                      Party Name (Customer / Vendor) <span className="text-rose-500">*</span>
                    </label>
                    <UIInput
                      type="text"
                      placeholder="e.g. Apollo Healthcare Ltd"
                      value={formData.partyName}
                      onChange={(e) => handleFieldChange("partyName", e.target.value)}
                      error={Boolean(formErrors.partyName)}
                      helperText={formErrors.partyName}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text block mb-1">
                      Counterparty Ledger Account <span className="text-text-muted font-normal text-[11px]">(Optional)</span>
                    </label>
                    <UISelect
                      value={formData.counterpartyAccountId}
                      onChange={(val) => handleFieldChange("counterpartyAccountId", val)}
                      options={accountOptions}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-text block mb-1">
                      Bank Account <span className="text-rose-500">*</span>
                    </label>
                    <UISelect
                      value={formData.bankAccountId}
                      onChange={(val) => handleFieldChange("bankAccountId", val)}
                      options={bankOptions}
                      error={Boolean(formErrors.bankAccountId)}
                      helperText={formErrors.bankAccountId}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text block mb-1">
                      Cheque Date <span className="text-rose-500">*</span>
                    </label>
                    <UIInput
                      type="date"
                      value={formData.chequeDate}
                      onChange={(e) => handleFieldChange("chequeDate", e.target.value)}
                      error={Boolean(formErrors.chequeDate)}
                      helperText={formErrors.chequeDate}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-text block mb-1">
                      Cheque Amount (₹) <span className="text-rose-500">*</span>
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
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text block mb-1">
                      Remarks / Purpose (Optional)
                    </label>
                    <UIInput
                      type="text"
                      placeholder="e.g., Security deposit, invoice settlement..."
                      value={formData.remarks}
                      onChange={(e) => handleFieldChange("remarks", e.target.value)}
                    />
                  </div>
                </div>
              </form>
            )}
          </>
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
              disabled={Boolean(activeAction)}
              startIcon={<Printer className="size-3.5" />}
              className="rounded-xl text-xs font-medium cursor-pointer"
            >
              Print Receipt
            </UIButton>

            <div className="flex items-center gap-2">
              {isPending && onDepositCheque && (
                <UIButton
                  type="button"
                  variant="primary"
                  size="sm"
                  isLoading={activeAction === "deposit"}
                  loadingText="Depositing..."
                  disabled={Boolean(activeAction && activeAction !== "deposit")}
                  onClick={() => handleActionClick("deposit", onDepositCheque)}
                  className="rounded-xl text-xs font-semibold px-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-all duration-150"
                >
                  Deposit to Bank
                </UIButton>
              )}

              {isDeposited && onClearCheque && (
                <UIButton
                  type="button"
                  variant="primary"
                  size="sm"
                  isLoading={activeAction === "clear"}
                  loadingText="Clearing..."
                  disabled={Boolean(activeAction && activeAction !== "clear")}
                  onClick={() => handleActionClick("clear", onClearCheque)}
                  className="rounded-xl text-xs font-semibold px-4 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-all duration-150"
                >
                  Mark Cleared
                </UIButton>
              )}

              {isDeposited && onBounceCheque && (
                <UIButton
                  type="button"
                  variant="outline"
                  size="sm"
                  isLoading={activeAction === "bounce"}
                  loadingText="Marking Bounced..."
                  disabled={Boolean(activeAction && activeAction !== "bounce")}
                  onClick={() => handleActionClick("bounce", onBounceCheque)}
                  className="rounded-xl text-xs font-semibold px-4 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 border-rose-200 cursor-pointer transition-all duration-150"
                >
                  Mark Bounced
                </UIButton>
              )}

              {isPending && onCancelCheque && (
                <UIButton
                  type="button"
                  variant="outline"
                  size="sm"
                  isLoading={activeAction === "cancel"}
                  loadingText="Cancelling..."
                  disabled={Boolean(activeAction && activeAction !== "cancel")}
                  onClick={() => handleActionClick("cancel", onCancelCheque)}
                  className="rounded-xl text-xs font-semibold px-4 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 cursor-pointer transition-all duration-150"
                >
                  Cancel Cheque
                </UIButton>
              )}


              {isPending && (
                <UIButton
                  type="button"
                  variant="outline"
                  size="sm"
                  startIcon={<Edit2 className="size-3.5" />}
                  onClick={() => setCurrentMode("edit")}
                  disabled={Boolean(activeAction)}
                  className="rounded-xl text-xs font-semibold px-4 cursor-pointer"
                >
                  Edit
                </UIButton>
              )}

              <UIButton
                type="button"
                size="sm"
                onClick={onClose}
                disabled={Boolean(activeAction)}
                className="rounded-xl text-xs font-semibold px-5 cursor-pointer"
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
              className="rounded-xl text-xs font-semibold px-4 cursor-pointer"
            >
              Cancel
            </UIButton>

            <UIButton
              type="submit"
              form="cheque-form"
              size="sm"
              variant="primary"
              isLoading={isSubmitting}
              loadingText={isEdit ? "Updating..." : "Registering..."}
              startIcon={<CreditCard className="size-3.5" />}
              className="rounded-xl text-xs font-bold px-5 bg-amber-600 hover:bg-amber-700 text-white shadow-xs cursor-pointer transition"
            >
              {isEdit ? "Update Cheque" : "Register Cheque"}
            </UIButton>
          </>
        )}
      </UIModalFooter>

    </UIModal>
  );
}

export default ChequeDialog;
