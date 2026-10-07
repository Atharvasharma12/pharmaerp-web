import React, { useState, useEffect, useMemo } from "react";
import { FiPlus, FiTrash2, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIModalFooter,
  UIFormSection,
  UIInput,
  UISelect,
  UIButton,
  UIIconButton,
  UIAlert,
  UIKeyValueList,
  UIBadge,
} from "@/components/ui";

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
  debit: 0,
  credit: 0,
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

  useEffect(() => {
    if (isOpen) {
      if ((mode === "edit" || mode === "view") && voucherData) {
        const rawDate = voucherData.voucherDate ? new Date(voucherData.voucherDate).toISOString().split("T")[0] : getTodayString();
        
        const mappedLines = (voucherData.lines || []).map((line) => ({
          accountId: typeof line.accountId === "object" ? line.accountId?._id : line.accountId || "",
          debit: line.debit || 0,
          credit: line.credit || 0,
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
    const opts = [{ label: "Select Account", value: "" }];
    accounts.forEach((acc) => {
      opts.push({
        label: `${acc.accountName || acc.name} (${acc.accountCode || acc.code || ""})`,
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
          return { ...line, debit: debVal, credit: debVal > 0 ? 0 : line.credit };
        }
        if (field === "credit") {
          const credVal = parseFloat(value) || 0;
          return { ...line, credit: credVal, debit: credVal > 0 ? 0 : line.debit };
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

  const validate = () => {
    const errors = {};
    if (!formData.voucherDate) errors.voucherDate = "Voucher date is required";
    if (!formData.voucherType) errors.voucherType = "Voucher type is required";
    if (!formData.narration.trim()) errors.narration = "Narration is required";

    if (formData.lines.length < 2) {
      errors.lines = "At least two entry rows are required (1 debit, 1 credit)";
    }

    formData.lines.forEach((line, idx) => {
      if (!line.accountId) {
        errors.lines = `Account selection missing on row ${idx + 1}`;
      }
      const deb = parseFloat(line.debit) || 0;
      const cred = parseFloat(line.credit) || 0;
      if (deb === 0 && cred === 0) {
        errors.lines = `Row ${idx + 1} must contain either debit or credit`;
      }
    });

    if (!errors.lines) {
      if (!totals.isBalanced) {
        errors.lines = `Imbalanced entry: Debits (${formatCurrency(totals.debits)}) must equal Credits (${formatCurrency(totals.credits)})`;
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
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
      status: "POSTED", // Auto-post on save (F12)
      lines: verifiedLines,
    };

    try {
      if (mode === "create") {
        await onSubmitCreate(payload);
      } else if (mode === "edit" && voucherData?._id) {
        await onSubmitUpdate(voucherData._id, payload);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setServerError(typeof err === "string" ? err : "Failed to save journal voucher.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";

  const title = isCreate
    ? "Create Journal Voucher"
    : isEdit
    ? "Edit Journal Voucher"
    : "Journal Voucher Details";

  const subtitle = isCreate
    ? "Record double-entry accounting adjustments or transfers."
    : isEdit
    ? "Modify voucher details or line item amounts."
    : "View complete debit/credit entry log and status.";

  const getAccountName = (accId) => {
    if (!accId) return "N/A";
    const id = typeof accId === "object" ? accId._id : accId;
    const acc = accounts.find((a) => (a._id || a.id) === id);
    if (acc) return `${acc.accountName || acc.name} (${acc.accountCode || acc.code || ""})`;
    return typeof accId === "object" ? accId.accountName || accId.name || "N/A" : "N/A";
  };

  return (
    <UIModal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      mobileSheet
      className="w-full max-w-5xl max-h-[92vh] sm:max-h-[88vh] flex flex-col rounded-3xl border border-border bg-surface shadow-2xl overflow-hidden"
    >
      <UIModalHeader>
        <UIModalTitle>{title}</UIModalTitle>
        <UIModalDescription>{subtitle}</UIModalDescription>
      </UIModalHeader>

      <UIModalBody className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7 space-y-6">
        {serverError && (
          <UIAlert variant="error" onDismiss={() => setServerError(null)}>
            {serverError}
          </UIAlert>
        )}

        {/* VIEW MODE */}
        {isView && voucherData && (
          <div className="space-y-6">
            <UIKeyValueList
              items={[
                { label: "Voucher Number / Ref", value: voucherData.referenceNumber || voucherData.voucherNumber || "Auto-generated", copyable: true },
                {
                  label: "Voucher Type",
                  value: (
                    <UIBadge variant="info">
                      {voucherData.voucherType || "JOURNAL"}
                    </UIBadge>
                  ),
                },
                {
                  label: "Date",
                  value: voucherData.voucherDate
                    ? new Date(voucherData.voucherDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A",
                },
                {
                  label: "Status",
                  value: (
                    <UIBadge variant={voucherData.status === "POSTED" ? "success" : "neutral"}>
                      {voucherData.status || "POSTED"}
                    </UIBadge>
                  ),
                },
                { label: "Narration", value: voucherData.narration || "No narration" },
              ]}
            />

            <div>
              <h4 className="text-sm font-semibold text-text mb-3">Line Items Entry Table</h4>
              <div className="overflow-x-auto border border-border rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-muted border-b border-border text-text-muted font-medium">
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Account</th>
                      <th className="px-4 py-3">Line Narration</th>
                      <th className="px-4 py-3 text-right">Debit (Dr)</th>
                      <th className="px-4 py-3 text-right">Credit (Cr)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(voucherData.lines || []).map((line, idx) => (
                      <tr key={idx} className="hover:bg-surface-muted/30">
                        <td className="px-4 py-3 text-text-muted">{idx + 1}</td>
                        <td className="px-4 py-3 font-medium text-text">{getAccountName(line.accountId)}</td>
                        <td className="px-4 py-3 text-text-muted">{line.narration || "-"}</td>
                        <td className="px-4 py-3 text-right font-medium text-text">
                          {line.debit > 0 ? formatCurrency(line.debit) : "-"}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-text">
                          {line.credit > 0 ? formatCurrency(line.credit) : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-surface-muted/50 border-t border-border font-semibold text-text">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right">Total:</td>
                      <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(
                          (voucherData.lines || []).reduce((acc, l) => acc + (l.debit || 0), 0)
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-sky-600 dark:text-sky-400">
                        {formatCurrency(
                          (voucherData.lines || []).reduce((acc, l) => acc + (l.credit || 0), 0)
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CREATE / EDIT MODE */}
        {!isView && (
          <form id="journal-voucher-form" onSubmit={handleSubmit} className="space-y-4">
            <UIFormSection title="Header Information">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <UISelect
                  label="Voucher Type"
                  value={formData.voucherType}
                  onChange={(val) => handleFieldChange("voucherType", val)}
                  options={voucherTypeOptions}
                  required
                />

                <UIInput
                  type="date"
                  label="Voucher Date"
                  value={formData.voucherDate}
                  onChange={(e) => handleFieldChange("voucherDate", e.target.value)}
                  error={Boolean(formErrors.voucherDate)}
                  helperText={formErrors.voucherDate}
                  required
                />

                <UIInput
                  label="Ref / Voucher No (Optional)"
                  placeholder="Auto-generated if empty"
                  value={formData.referenceNumber}
                  onChange={(e) => handleFieldChange("referenceNumber", e.target.value)}
                />
              </div>

              <UIInput
                label="Main Narration / Description"
                placeholder="State the business reason for this adjustment..."
                value={formData.narration}
                onChange={(e) => handleFieldChange("narration", e.target.value)}
                error={Boolean(formErrors.narration)}
                helperText={formErrors.narration}
                required
              />
            </UIFormSection>

            <UIFormSection title="Debit & Credit Entry Table">
              {formErrors.lines && (
                <UIAlert variant="error" onDismiss={() => setFormErrors((p) => ({ ...p, lines: "" }))}>
                  {formErrors.lines}
                </UIAlert>
              )}

              <div className="overflow-x-auto border border-border rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-muted border-b border-border text-text-muted font-medium">
                    <tr>
                      <th className="px-3 py-2 w-10">#</th>
                      <th className="px-3 py-2 min-w-[200px]">Account Name</th>
                      <th className="px-3 py-2 min-w-[120px] text-right">Debit (Dr ₹)</th>
                      <th className="px-3 py-2 min-w-[120px] text-right">Credit (Cr ₹)</th>
                      <th className="px-3 py-2 min-w-[150px]">Line Note</th>
                      <th className="px-3 py-2 w-10 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {formData.lines.map((line, idx) => (
                      <tr key={idx} className="hover:bg-surface-muted/20">
                        <td className="px-3 py-2 text-text-muted">{idx + 1}</td>
                        <td className="px-3 py-2">
                          <UISelect
                            value={line.accountId}
                            onChange={(val) => handleLineChange(idx, "accountId", val)}
                            options={accountSelectOptions}
                            size="small"
                          />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <UIInput
                            type="number"
                            placeholder="0.00"
                            value={line.debit || ""}
                            onChange={(e) => handleLineChange(idx, "debit", e.target.value)}
                            size="small"
                          />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <UIInput
                            type="number"
                            placeholder="0.00"
                            value={line.credit || ""}
                            onChange={(e) => handleLineChange(idx, "credit", e.target.value)}
                            size="small"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <UIInput
                            placeholder="Optional note"
                            value={line.narration}
                            onChange={(e) => handleLineChange(idx, "narration", e.target.value)}
                            size="small"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <UIIconButton
                            icon={<FiTrash2 size={14} />}
                            onClick={() => handleRemoveLine(idx)}
                            disabled={formData.lines.length <= 2}
                            tooltip="Remove row"
                            size="xs"
                            variant="danger"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-surface-muted/50 border-t border-border font-semibold text-xs">
                    <tr>
                      <td colSpan={2} className="px-4 py-2.5">
                        <UIButton
                          type="button"
                          variant="outline"
                          size="small"
                          startIcon={<FiPlus />}
                          onClick={handleAddLine}
                        >
                          Add Row
                        </UIButton>
                      </td>
                      <td className="px-3 py-2.5 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                        {formatCurrency(totals.debits)}
                      </td>
                      <td className="px-3 py-2.5 text-right text-sky-600 dark:text-sky-400 font-bold">
                        {formatCurrency(totals.credits)}
                      </td>
                      <td colSpan={2} className="px-3 py-2.5">
                        <div className="flex items-center justify-end">
                          {totals.isBalanced ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <FiCheckCircle size={13} /> Balanced
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                              <FiAlertCircle size={13} /> Diff: {formatCurrency(totals.diff)}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </UIFormSection>
          </form>
        )}
      </UIModalBody>

      <UIModalFooter>
        <UIButton variant="outline" onClick={onClose} disabled={isSubmitting}>
          {isView ? "Close" : "Cancel"}
        </UIButton>

        {!isView && (
          <UIButton
            variant="primary"
            type="submit"
            form="journal-voucher-form"
            isLoading={isSubmitting}
            disabled={!totals.isBalanced}
          >
            {isCreate ? "Post Voucher" : "Save Changes"}
          </UIButton>
        )}
      </UIModalFooter>
    </UIModal>
  );
}

export default JournalVoucherDialog;
