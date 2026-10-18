import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Hash,
  FileText,
  Sparkles,
  Copy,
  Check,
  Printer,
  X,
  Scale,
  Receipt,
  Layers,
} from "lucide-react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalBody,
  UIModalFooter,
  UIButton,
  UIIconButton,
  UIInput,
  UISelect,
  UIBadge,
  UIAlert,
  uiToast,
} from "@/components/ui";
import { cn } from "@/lib/utils";

const voucherTypeOptions = [
  { label: "Adjustment Entry (JOURNAL)", value: "JOURNAL" },
  { label: "Cash Transfer (CONTRA)", value: "CONTRA" },
  { label: "Payment Made (PAYMENT)", value: "PAYMENT" },
  { label: "Payment Received (RECEIPT)", value: "RECEIPT" },
  { label: "Opening Balance (OPENING_BALANCE)", value: "OPENING_BALANCE" },
];

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const INITIAL_LINE_ITEM = {
  accountId: "",
  debit: "",
  credit: "",
  narration: "",
};

const INITIAL_FORM = {
  voucherDate: getTodayString(),
  voucherType: "JOURNAL",
  referenceNumber: "",
  narration: "",
  status: "POSTED",
  lines: [
    { ...INITIAL_LINE_ITEM },
    { ...INITIAL_LINE_ITEM },
  ],
};

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export function JournalVoucherDialog({
  isOpen,
  onClose,
  mode = "create",
  voucherData = null,
  accounts = [],
  onSubmitCreate,
  onSubmitUpdate,
  onSuccess,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if ((mode === "edit" || mode === "view") && voucherData) {
        const rawDate = voucherData.voucherDate
          ? new Date(voucherData.voucherDate).toISOString().split("T")[0]
          : getTodayString();

        const mappedLines = (voucherData.lines || []).map((line) => ({
          accountId: typeof line.accountId === "object" ? line.accountId?._id : line.accountId || "",
          debit: line.debit ? String(line.debit) : "",
          credit: line.credit ? String(line.credit) : "",
          narration: line.narration || "",
        }));

        setFormData({
          voucherDate: rawDate,
          voucherType: voucherData.voucherType || "JOURNAL",
          referenceNumber: voucherData.referenceNumber || voucherData.voucherNumber || "",
          narration: voucherData.narration || "",
          status: voucherData.status || "POSTED",
          lines: mappedLines.length >= 2 ? mappedLines : [{ ...INITIAL_LINE_ITEM }, { ...INITIAL_LINE_ITEM }],
        });
      } else {
        setFormData({ ...INITIAL_FORM, voucherDate: getTodayString() });
      }
      setFormErrors({});
      setServerError(null);
    } else {
      setFormData(INITIAL_FORM);
      setFormErrors({});
      setServerError(null);
    }
  }, [isOpen, mode, voucherData]);

  const accountSelectOptions = useMemo(() => {
    const opts = [{ label: "Select Account...", value: "" }];
    (accounts || []).forEach((acc) => {
      const name = acc.accountName || acc.name || "Unnamed Account";
      const code = acc.accountCode || acc.code;
      const type = acc.accountType || acc.group || acc.category;
      let label = name;
      if (code) label += ` (${code})`;
      if (type) label += ` • ${type}`;
      opts.push({
        label,
        value: acc._id || acc.id,
      });
    });
    return opts;
  }, [accounts]);

  const handleFieldChange = (name, valueOrEvent) => {
    let val = valueOrEvent;
    if (valueOrEvent && typeof valueOrEvent === "object" && "target" in valueOrEvent) {
      val = valueOrEvent.target.type === "checkbox" ? valueOrEvent.target.checked : valueOrEvent.target.value;
    }
    setFormData((prev) => ({ ...prev, [name]: val }));
    setFormErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
  };

  const handleLineChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedLines = prev.lines.map((line, idx) => {
        if (idx !== index) return line;

        if (field === "debit") {
          const debVal = parseFloat(value) || 0;
          return {
            ...line,
            debit: value,
            credit: debVal > 0 ? "" : line.credit,
          };
        }
        if (field === "credit") {
          const credVal = parseFloat(value) || 0;
          return {
            ...line,
            credit: value,
            debit: credVal > 0 ? "" : line.debit,
          };
        }

        return { ...line, [field]: value };
      });
      return { ...prev, lines: updatedLines };
    });
    setFormErrors((prev) => ({ ...prev, lines: "", submit: "" }));
  };

  const handleAddLine = () => {
    setFormData((prev) => ({
      ...prev,
      lines: [...prev.lines, { ...INITIAL_LINE_ITEM }],
    }));
  };

  const handleRemoveLine = (index) => {
    setFormData((prev) => {
      if (prev.lines.length <= 2) return prev;
      return {
        ...prev,
        lines: prev.lines.filter((_, idx) => idx !== index),
      };
    });
  };

  // Compute total debits and credits
  const totals = useMemo(() => {
    let debits = 0;
    let credits = 0;
    (formData.lines || []).forEach((line) => {
      debits += parseFloat(line.debit) || 0;
      credits += parseFloat(line.credit) || 0;
    });
    const diff = Math.abs(debits - credits);
    const isBalanced = debits > 0 && diff < 0.01;
    return { debits, credits, diff, isBalanced };
  }, [formData.lines]);

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
    if (!formData.voucherDate) errors.voucherDate = "Voucher date is required";
    if (!formData.voucherType) errors.voucherType = "Voucher type is required";
    if (!formData.narration.trim()) errors.narration = "Main narration is required";

    if (formData.lines.length < 2) {
      errors.lines = "At least two entry rows are required (1 debit, 1 credit)";
    }

    formData.lines.forEach((line, idx) => {
      if (!line.accountId) {
        errors.lines = `Please select an account for line #${idx + 1}`;
      }
      const deb = parseFloat(line.debit) || 0;
      const cred = parseFloat(line.credit) || 0;
      if (deb === 0 && cred === 0) {
        errors.lines = `Line #${idx + 1} must have either a Debit or Credit amount`;
      }
    });

    if (!errors.lines) {
      if (!totals.isBalanced) {
        errors.lines = `Imbalanced entry: Debits (${formatCurrency(totals.debits)}) must equal Credits (${formatCurrency(totals.credits)}). Difference: ${formatCurrency(totals.diff)}`;
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      if (errors.lines) {
        uiToast.error("Validation Error", errors.lines);
      }
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    const verifiedLines = formData.lines.map((line) => ({
      accountId: line.accountId,
      debit: parseFloat(line.debit) || 0,
      credit: parseFloat(line.credit) || 0,
      narration: String(line.narration || "").trim() || undefined,
    }));

    const payload = {
      voucherDate: new Date(formData.voucherDate).toISOString(),
      voucherType: formData.voucherType,
      referenceNumber: String(formData.referenceNumber || "").trim() || null,
      narration: String(formData.narration || "").trim() || null,
      status: "POSTED",
      lines: verifiedLines,
    };

    try {
      if (mode === "create") {
        await onSubmitCreate(payload);
        uiToast.success(
          "General Voucher Posted",
          `Successfully posted ${formData.voucherType} voucher for ${formatCurrency(totals.debits)}.`
        );
      } else if (mode === "edit" && voucherData?._id) {
        await onSubmitUpdate(voucherData._id, payload);
        uiToast.success(
          "General Voucher Updated",
          `Successfully updated voucher details.`
        );
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      const errMsg = typeof err === "string" ? err : err?.message || "Failed to save journal voucher.";
      setServerError(errMsg);
      uiToast.error("Failed to Save Voucher", errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";

  const title = isCreate
    ? "Create General Voucher"
    : isEdit
    ? "Edit General Voucher"
    : "General Voucher Details";

  const subtitle = isCreate
    ? "Record double-entry accounting adjustments, expenses, or transfers."
    : isEdit
    ? "Modify voucher details or line item ledger allocations."
    : "View complete double-entry ledger allocation and balance status.";

  const getAccountName = (accId) => {
    if (!accId) return "Unassigned";
    const id = typeof accId === "object" ? accId._id || accId.id : accId;
    const acc = (accounts || []).find((a) => (a._id || a.id) === id);
    if (acc) {
      const code = acc.accountCode || acc.code;
      return `${acc.accountName || acc.name}${code ? ` (${code})` : ""}`;
    }
    return typeof accId === "object" ? accId.accountName || accId.name || "N/A" : "N/A";
  };

  return (
    <UIModal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      size="2xl"
      mobileSheet
      className="w-full max-w-5xl max-h-[92vh] flex flex-col p-0 overflow-hidden select-none"
    >
      {/* ── Modal Header ── */}
      <UIModalHeader className="px-6 py-4.5 border-b border-border bg-surface shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-xs shrink-0">
            <BookOpen className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <UIModalTitle className="text-base sm:text-lg font-bold text-text">
                {title}
              </UIModalTitle>
              {isCreate && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                  <Sparkles className="size-3" /> DOUBLE-ENTRY
                </span>
              )}
              {isEdit && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  EDITING
                </span>
              )}
              {isView && voucherData && (
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1",
                    voucherData.status === "POSTED"
                      ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                      : "bg-surface-alt text-text-muted border-border"
                  )}
                >
                  <CheckCircle2 className="size-3" /> {voucherData.status || "POSTED"}
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="size-8 rounded-full bg-surface-alt hover:bg-surface-hover text-text-muted hover:text-text flex items-center justify-center transition-colors cursor-pointer"
          title="Close dialog"
        >
          <X className="size-4" />
        </button>
      </UIModalHeader>

      {/* ── Modal Body ── */}
      <UIModalBody className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 min-h-0 bg-[#f8fafc] dark:bg-bg">
        {serverError && (
          <UIAlert variant="error" onDismiss={() => setServerError(null)}>
            {serverError}
          </UIAlert>
        )}

        {/* ══════════════════════════════════════════════════════════════════════════ */}
        {/* VIEW MODE                                                                 */}
        {/* ══════════════════════════════════════════════════════════════════════════ */}
        {isView && voucherData && (
          <div className="space-y-5">
            {/* Metadata Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="bg-surface border border-border rounded-xl p-3.5 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                  Voucher / Ref No
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-sm font-bold font-mono text-text truncate">
                    {voucherData.referenceNumber || voucherData.voucherNumber || "N/A"}
                  </span>
                  {(voucherData.referenceNumber || voucherData.voucherNumber) && (
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          voucherData.referenceNumber || voucherData.voucherNumber,
                          "voucherRef"
                        )
                      }
                      className="text-text-muted hover:text-text transition-colors p-0.5 cursor-pointer"
                      title="Copy voucher number"
                    >
                      {copiedKey === "voucherRef" ? (
                        <Check className="size-3 text-emerald-600" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-surface border border-border rounded-xl p-3.5 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                  Voucher Type
                </span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1 block">
                  {voucherData.voucherType || "JOURNAL"}
                </span>
              </div>

              <div className="bg-surface border border-border rounded-xl p-3.5 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                  Voucher Date
                </span>
                <span className="text-sm font-bold text-text mt-1 block">
                  {voucherData.voucherDate
                    ? new Date(voucherData.voucherDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>

              <div className="bg-surface border border-border rounded-xl p-3.5 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                  Total Value
                </span>
                <span className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
                  {formatCurrency(
                    (voucherData.lines || []).reduce((acc, l) => acc + (parseFloat(l.debit) || 0), 0)
                  )}
                </span>
              </div>
            </div>

            {/* Narration Card */}
            <div className="bg-surface border border-border rounded-xl p-4 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-text">
                <FileText className="size-3.5 text-text-muted" />
                <span>Business Narration / Remarks</span>
              </div>
              <p className="text-xs text-text-muted bg-surface-alt/50 border border-border/60 rounded-lg p-3 leading-relaxed">
                {voucherData.narration || "No custom narration recorded for this voucher."}
              </p>
            </div>

            {/* Read-Only Entry Table */}
            <div className="bg-surface border border-border rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale className="size-4 text-indigo-500" />
                  <h4 className="text-xs sm:text-sm font-bold text-text">
                    Ledger Allocation Entries
                  </h4>
                </div>
                <span className="text-xs text-text-muted font-medium">
                  {(voucherData.lines || []).length} Lines Recorded
                </span>
              </div>

              <div className="overflow-x-auto border border-border rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-alt/70 border-b border-border text-text-muted font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-3.5 py-2.5 w-10 text-center">#</th>
                      <th className="px-4 py-2.5">Account Head</th>
                      <th className="px-4 py-2.5">Line Note</th>
                      <th className="px-4 py-2.5 text-right">Debit (Dr)</th>
                      <th className="px-4 py-2.5 text-right">Credit (Cr)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(voucherData.lines || []).map((line, idx) => (
                      <tr key={idx} className="hover:bg-surface-alt/40 transition-colors">
                        <td className="px-3.5 py-2.5 text-center text-text-muted font-semibold">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-2.5 font-bold text-text">
                          {getAccountName(line.accountId)}
                        </td>
                        <td className="px-4 py-2.5 text-text-muted italic">
                          {line.narration || "—"}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {line.debit > 0 ? formatCurrency(line.debit) : "—"}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono font-bold text-sky-600 dark:text-sky-400">
                          {line.credit > 0 ? formatCurrency(line.credit) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-surface-alt/80 border-t border-border font-bold text-xs">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right uppercase tracking-wider text-text-muted text-[11px]">
                        Total Ledger Balance:
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-black text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(
                          (voucherData.lines || []).reduce(
                            (acc, l) => acc + (parseFloat(l.debit) || 0),
                            0
                          )
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-black text-sky-600 dark:text-sky-400">
                        {formatCurrency(
                          (voucherData.lines || []).reduce(
                            (acc, l) => acc + (parseFloat(l.credit) || 0),
                            0
                          )
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════════ */}
        {/* CREATE / EDIT MODE                                                        */}
        {/* ══════════════════════════════════════════════════════════════════════════ */}
        {!isView && (
          <form id="journal-voucher-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Header Metadata Card */}
            <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2">
                <Receipt className="size-4 text-indigo-500" />
                <span className="text-xs uppercase font-bold text-text-muted tracking-wider">
                  Voucher Specifications
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-text block mb-1">
                    Voucher Type <span className="text-rose-500">*</span>
                  </label>
                  <UISelect
                    value={formData.voucherType}
                    onChange={(val) => handleFieldChange("voucherType", val)}
                    options={voucherTypeOptions}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text block mb-1">
                    Voucher Date <span className="text-rose-500">*</span>
                  </label>
                  <UIInput
                    type="date"
                    value={formData.voucherDate}
                    onChange={(e) => handleFieldChange("voucherDate", e.target.value)}
                    error={Boolean(formErrors.voucherDate)}
                    helperText={formErrors.voucherDate}
                    startIcon={<Calendar className="size-3.5 text-text-muted" />}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text block mb-1">
                    Ref / Voucher No (Optional)
                  </label>
                  <UIInput
                    placeholder="Auto-generated if empty"
                    value={formData.referenceNumber}
                    onChange={(e) => handleFieldChange("referenceNumber", e.target.value)}
                    startIcon={<Hash className="size-3.5 text-text-muted" />}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-text block mb-1">
                  Main Narration / Description <span className="text-rose-500">*</span>
                </label>
                <UIInput
                  placeholder="State the business reason for this adjustment (e.g., Office expense adjustment, opening entry)..."
                  value={formData.narration}
                  onChange={(e) => handleFieldChange("narration", e.target.value)}
                  error={Boolean(formErrors.narration)}
                  helperText={formErrors.narration}
                  startIcon={<FileText className="size-3.5 text-text-muted" />}
                  required
                />
              </div>
            </div>

            {/* Ledger Line Entries Card */}
            <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale className="size-4 text-indigo-500" />
                  <span className="text-xs uppercase font-bold text-text-muted tracking-wider">
                    Double-Entry Ledger Lines
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-surface-alt border border-border text-text font-semibold">
                    {formData.lines.length} Lines
                  </span>
                </div>

                <UIButton
                  type="button"
                  variant="outline"
                  size="sm"
                  startIcon={<Plus className="size-3.5" />}
                  onClick={handleAddLine}
                  className="font-semibold text-xs"
                >
                  Add Row
                </UIButton>
              </div>

              {formErrors.lines && (
                <UIAlert variant="error" onDismiss={() => setFormErrors((p) => ({ ...p, lines: "" }))}>
                  {formErrors.lines}
                </UIAlert>
              )}

              {/* Entries Table */}
              <div className="overflow-x-auto border border-border rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-alt/70 border-b border-border text-text-muted font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-3 py-2.5 w-10 text-center">#</th>
                      <th className="px-3 py-2.5 min-w-[240px]">Account Head</th>
                      <th className="px-3 py-2.5 min-w-[130px] text-right">Debit (Dr ₹)</th>
                      <th className="px-3 py-2.5 min-w-[130px] text-right">Credit (Cr ₹)</th>
                      <th className="px-3 py-2.5 min-w-[160px]">Line Note</th>
                      <th className="px-3 py-2.5 w-12 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {formData.lines.map((line, idx) => {
                      const hasDebit = parseFloat(line.debit) > 0;
                      const hasCredit = parseFloat(line.credit) > 0;

                      return (
                        <tr
                          key={idx}
                          className={cn(
                            "transition-colors",
                            hasDebit
                              ? "bg-emerald-500/[0.02]"
                              : hasCredit
                              ? "bg-sky-500/[0.02]"
                              : "hover:bg-surface-alt/20"
                          )}
                        >
                          <td className="px-3 py-2 text-center">
                            <span className="size-5 rounded-full bg-surface-alt border border-border inline-flex items-center justify-center text-[10px] font-bold text-text-muted">
                              {idx + 1}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <UISelect
                              value={line.accountId}
                              onChange={(val) => handleLineChange(idx, "accountId", val)}
                              options={accountSelectOptions}
                              placeholder="Select Account..."
                              isSearchable
                              size="sm"
                            />
                          </td>
                          <td className="px-3 py-2 text-right">
                            <UIInput
                              type="number"
                              step="any"
                              placeholder="0.00"
                              value={line.debit}
                              onChange={(e) => handleLineChange(idx, "debit", e.target.value)}
                              size="sm"
                              prefix="₹"
                              inputClassName={cn(
                                "font-mono text-right font-bold tabular-nums",
                                hasDebit && "text-emerald-600 dark:text-emerald-400"
                              )}
                            />
                          </td>
                          <td className="px-3 py-2 text-right">
                            <UIInput
                              type="number"
                              step="any"
                              placeholder="0.00"
                              value={line.credit}
                              onChange={(e) => handleLineChange(idx, "credit", e.target.value)}
                              size="sm"
                              prefix="₹"
                              inputClassName={cn(
                                "font-mono text-right font-bold tabular-nums",
                                hasCredit && "text-sky-600 dark:text-sky-400"
                              )}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <UIInput
                              placeholder="Optional line note"
                              value={line.narration}
                              onChange={(e) => handleLineChange(idx, "narration", e.target.value)}
                              size="sm"
                            />
                          </td>
                          <td className="px-3 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveLine(idx)}
                              disabled={formData.lines.length <= 2}
                              title={
                                formData.lines.length <= 2
                                  ? "Minimum 2 lines required"
                                  : "Remove this line"
                              }
                              className={cn(
                                "size-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer",
                                formData.lines.length <= 2
                                  ? "text-text-muted/40 cursor-not-allowed"
                                  : "text-text-muted hover:text-rose-600 hover:bg-rose-500/10"
                              )}
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ── Live Balance & Totals Summary Strip ── */}
              <div className="bg-surface-alt/60 border border-border rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Scale className="size-4 shrink-0 text-indigo-500" />
                  <span>Double-entry rule: Total Debits must strictly equal Total Credits.</span>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 shrink-0 w-full sm:w-auto justify-end">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                      Total Debit (Dr)
                    </span>
                    <span className="text-sm sm:text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(totals.debits)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                      Total Credit (Cr)
                    </span>
                    <span className="text-sm sm:text-base font-black font-mono text-sky-600 dark:text-sky-400">
                      {formatCurrency(totals.credits)}
                    </span>
                  </div>

                  <div>
                    {totals.isBalanced ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-2xs">
                        <CheckCircle2 className="size-4 shrink-0" /> Balanced
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold shadow-2xs">
                        <AlertCircle className="size-4 shrink-0" /> Diff: {formatCurrency(totals.diff)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </UIModalBody>

      {/* ── Modal Footer ── */}
      <UIModalFooter className="px-6 py-4 bg-surface border-t border-border flex items-center justify-between">
        <div>
          {!isView && (
            <div className="text-xs">
              {totals.isBalanced ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5" /> Ready to post voucher to ledger
                </span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1.5">
                  <AlertCircle className="size-3.5" /> Balance difference of {formatCurrency(totals.diff)}
                </span>
              )}
            </div>
          )}
          {isView && (
            <UIButton
              type="button"
              variant="outline"
              size="sm"
              startIcon={<Printer className="size-3.5" />}
              onClick={handlePrint}
            >
              Print Voucher
            </UIButton>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <UIButton variant="outline" onClick={onClose} disabled={isSubmitting}>
            {isView ? "Close" : "Cancel"}
          </UIButton>

          {!isView && (
            <UIButton
              variant="primary"
              type="submit"
              form="journal-voucher-form"
              isLoading={isSubmitting}
              disabled={!totals.isBalanced || isSubmitting}
              startIcon={<CheckCircle2 className="size-4" />}
            >
              {isCreate ? "Post Voucher" : "Save Changes"}
            </UIButton>
          )}
        </div>
      </UIModalFooter>
    </UIModal>
  );
}

export default JournalVoucherDialog;
