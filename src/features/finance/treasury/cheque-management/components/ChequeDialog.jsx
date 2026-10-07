import React, { useState, useEffect, useMemo } from "react";
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
  UIAlert,
  UIKeyValueList,
  UIBadge,
  UISkeleton,
} from "@/components/ui";

import useBankAccount from "@/features/finance/treasury/bank-management/bank-accounts/hooks/useBankAccount";

const chequeTypeOptions = [
  { label: "Received Cheque (From Customer)", value: "RECEIVED" },
  { label: "Issued Cheque (To Supplier)", value: "ISSUED" },
];

const INITIAL_FORM = {
  chequeNumber: "",
  type: "RECEIVED",
  partyName: "",
  bankAccountId: "",
  amount: "",
  chequeDate: new Date().toISOString().split("T")[0],
  remarks: "",
};

export function ChequeDialog({
  isOpen,
  onClose,
  mode = "create",
  entityId = null,
  chequeData = null,
  onSubmitCreate,
  onFetchById,
  onClearCheque,
  onBounceCheque,
  onSuccess,
}) {
  const { bankAccounts = [], getBankAccounts } = useBankAccount();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [details, setDetails] = useState(chequeData);

  // Load bank accounts list when modal opens
  useEffect(() => {
    if (isOpen) {
      getBankAccounts().catch(() => {});
    }
  }, [isOpen, getBankAccounts]);

  // Load cheque details for view mode
  useEffect(() => {
    if (!isOpen) {
      setFormData(INITIAL_FORM);
      setFormErrors({});
      setServerError(null);
      setDetails(null);
      return;
    }

    if (mode === "view") {
      if (chequeData) {
        setDetails(chequeData);
      } else if (entityId && onFetchById) {
        setIsFetching(true);
        setServerError(null);
        onFetchById(entityId)
          .then((data) => setDetails(data))
          .catch((err) => setServerError(typeof err === "string" ? err : "Failed to load cheque details."))
          .finally(() => setIsFetching(false));
      }
    }
  }, [isOpen, mode, entityId, chequeData, onFetchById]);

  const bankOptions = useMemo(() => {
    return bankAccounts.map((acc) => ({
      label: `${acc.accountName} (${acc.accountNumber})`,
      value: acc._id,
    }));
  }, [bankAccounts]);

  const handleFieldChange = (name, valueOrEvent) => {
    let val = valueOrEvent;
    if (valueOrEvent && typeof valueOrEvent === "object" && "target" in valueOrEvent) {
      val = valueOrEvent.target.type === "checkbox" ? valueOrEvent.target.checked : valueOrEvent.target.value;
    }
    setFormData((prev) => ({ ...prev, [name]: val }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.chequeNumber.trim()) errors.chequeNumber = "Cheque number is required";
    if (!formData.partyName.trim()) errors.partyName = "Party name is required";
    if (!formData.bankAccountId) errors.bankAccountId = "Select bank account";

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
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    const payload = {
      chequeNumber: formData.chequeNumber.trim(),
      type: formData.type,
      partyName: formData.partyName.trim(),
      bankAccountId: formData.bankAccountId,
      amount: parseFloat(formData.amount),
      chequeDate: new Date(formData.chequeDate).toISOString(),
      remarks: formData.remarks.trim() || undefined,
    };

    try {
      await onSubmitCreate(payload);
      onSuccess?.();
      onClose();
    } catch (err) {
      setServerError(typeof err === "string" ? err : "Failed to register cheque.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAction = async (actionFn) => {
    if (!details?._id) return;
    setIsSubmitting(true);
    setServerError(null);
    try {
      await actionFn(details._id);
      onSuccess?.();
      onClose();
    } catch (err) {
      setServerError(typeof err === "string" ? err : "Action failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isView = mode === "view";
  const title = isView ? "Cheque Details" : "Register Cheque";
  const subtitle = isView
    ? "View details and status for this cheque entry."
    : "Record a received or issued cheque in treasury.";

  const statusVariantMap = {
    RECEIVED: "info",
    DEPOSITED: "warning",
    CLEARED: "success",
    BOUNCED: "danger",
    CANCELLED: "neutral",
  };

  return (
    <UIModal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      mobileSheet
      className="w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col rounded-3xl border border-border bg-surface shadow-2xl overflow-hidden"
    >
      <UIModalHeader>
        <UIModalTitle>{title}</UIModalTitle>
        <UIModalDescription>{subtitle}</UIModalDescription>
      </UIModalHeader>

      <UIModalBody className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7 space-y-6">
        {isFetching && <UISkeleton rows={5} />}

        {serverError && !isFetching && (
          <UIAlert variant="error" onDismiss={() => setServerError(null)}>
            {serverError}
          </UIAlert>
        )}

        {/* VIEW MODE */}
        {isView && !isFetching && details && (
          <div className="space-y-4">
            <UIKeyValueList
              items={[
                { label: "Cheque Number", value: details.chequeNumber, copyable: true },
                { label: "Cheque Type", value: details.type === "RECEIVED" ? "Received Cheque" : "Issued Cheque" },
                { label: "Party Name", value: details.partyName },
                {
                  label: "Bank Account",
                  value: details.bankAccount?.accountName || details.bankAccountId?.accountName || "Bank Account",
                },
                {
                  label: "Amount",
                  value: `₹ ${(details.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
                },
                {
                  label: "Cheque Date",
                  value: details.chequeDate
                    ? new Date(details.chequeDate).toLocaleDateString("en-IN")
                    : "N/A",
                },
                {
                  label: "Status",
                  value: (
                    <UIBadge variant={statusVariantMap[details.status] || "neutral"}>
                      {details.status || "RECEIVED"}
                    </UIBadge>
                  ),
                },
                { label: "Remarks", value: details.remarks || "N/A" },
              ]}
            />
          </div>
        )}

        {/* CREATE MODE */}
        {!isView && (
          <form id="cheque-form" onSubmit={handleSubmit} className="space-y-4">
            <UIFormSection title="Cheque Details & Party">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UIInput
                  label="Cheque Number"
                  placeholder="e.g. 000123"
                  value={formData.chequeNumber}
                  onChange={(e) => handleFieldChange("chequeNumber", e.target.value)}
                  error={Boolean(formErrors.chequeNumber)}
                  helperText={formErrors.chequeNumber}
                  required
                />

                <UISelect
                  label="Cheque Type"
                  value={formData.type}
                  onChange={(val) => handleFieldChange("type", val)}
                  options={chequeTypeOptions}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UIInput
                  label="Party Name (Payer / Payee)"
                  placeholder="Party / Customer / Supplier name"
                  value={formData.partyName}
                  onChange={(e) => handleFieldChange("partyName", e.target.value)}
                  error={Boolean(formErrors.partyName)}
                  helperText={formErrors.partyName}
                  required
                />

                <UISelect
                  label="Bank Account"
                  value={formData.bankAccountId}
                  onChange={(val) => handleFieldChange("bankAccountId", val)}
                  options={bankOptions}
                  error={Boolean(formErrors.bankAccountId)}
                  helperText={formErrors.bankAccountId}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UIInput
                  type="number"
                  label="Amount (₹)"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleFieldChange("amount", e.target.value)}
                  error={Boolean(formErrors.amount)}
                  helperText={formErrors.amount}
                  required
                />

                <UIInput
                  type="date"
                  label="Cheque Date"
                  value={formData.chequeDate}
                  onChange={(e) => handleFieldChange("chequeDate", e.target.value)}
                  error={Boolean(formErrors.chequeDate)}
                  helperText={formErrors.chequeDate}
                  required
                />
              </div>

              <UIInput
                label="Remarks (Optional)"
                placeholder="Additional notes..."
                value={formData.remarks}
                onChange={(e) => handleFieldChange("remarks", e.target.value)}
              />
            </UIFormSection>
          </form>
        )}
      </UIModalBody>

      <UIModalFooter>
        <UIButton variant="outline" onClick={onClose} disabled={isSubmitting}>
          {isView ? "Close" : "Cancel"}
        </UIButton>

        {isView && details && details.status !== "CLEARED" && details.status !== "BOUNCED" && (
          <>
            {onClearCheque && (
              <UIButton
                variant="success"
                onClick={() => handleAction(onClearCheque)}
                isLoading={isSubmitting}
              >
                Mark Cleared
              </UIButton>
            )}
            {onBounceCheque && (
              <UIButton
                variant="danger"
                onClick={() => handleAction(onBounceCheque)}
                isLoading={isSubmitting}
              >
                Mark Bounced
              </UIButton>
            )}
          </>
        )}

        {!isView && (
          <UIButton
            variant="primary"
            type="submit"
            form="cheque-form"
            isLoading={isSubmitting}
          >
            Register Cheque
          </UIButton>
        )}
      </UIModalFooter>
    </UIModal>
  );
}

export default ChequeDialog;
