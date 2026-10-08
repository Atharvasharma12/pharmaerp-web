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

export function FundTransferDialog({
  isOpen,
  onClose,
  mode = "create",
  transferData = null,
  entityId = null,
  onSubmitCreate,
  onFetchById,
  onSuccess,
}) {
  const { bankAccounts = [], getBankAccounts } = useBankAccount();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [details, setDetails] = useState(transferData);

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
      setServerError(null);
      setDetails(null);
      return;
    }

    if (mode === "view") {
      if (transferData) {
        setDetails(transferData);
      } else if (entityId && onFetchById) {
        setIsFetching(true);
        setServerError(null);
        onFetchById(entityId)
          .then((data) => setDetails(data))
          .catch((err) => setServerError(typeof err === "string" ? err : "Failed to load transfer details."))
          .finally(() => setIsFetching(false));
      }
    }
  }, [isOpen, mode, entityId, transferData, onFetchById]);

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
    if (!formData.fromAccountId) errors.fromAccountId = "Select source account";
    if (!formData.toAccountId) errors.toAccountId = "Select destination account";
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
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    const payload = {
      transferDate: new Date(formData.transferDate).toISOString(),
      fromAccountType: formData.fromAccountType,
      fromAccountId: formData.fromAccountId,
      toAccountType: formData.toAccountType,
      toAccountId: formData.toAccountId,
      amount: parseFloat(formData.amount),
      referenceNumber: formData.referenceNumber.trim() || undefined,
      narration: formData.narration.trim() || undefined,
    };

    try {
      await onSubmitCreate(payload);
      onSuccess?.();
      onClose();
    } catch (err) {
      setServerError(typeof err === "string" ? err : "Failed to create fund transfer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isView = mode === "view";
  const title = isView ? "Fund Transfer Details" : "New Fund Transfer";
  const subtitle = isView
    ? "View details for this fund transfer transaction."
    : "Transfer money between bank accounts or cash accounts.";

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
                {
                  label: "Transfer Date",
                  value: details.transferDate
                    ? new Date(details.transferDate).toLocaleDateString("en-IN")
                    : "N/A",
                },
                {
                  label: "From Account",
                  value: details.fromAccount?.accountName || details.fromAccountId?.accountName || "Bank Account",
                },
                {
                  label: "To Account",
                  value: details.toAccount?.accountName || details.toAccountId?.accountName || "Bank Account",
                },
                {
                  label: "Transfer Amount",
                  value: `₹ ${(details.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
                },
                {
                  label: "Reference Number",
                  value: details.referenceNumber || "N/A",
                  copyable: Boolean(details.referenceNumber),
                },
                {
                  label: "Narration / Notes",
                  value: details.narration || "N/A",
                },
                {
                  label: "Status",
                  value: (
                    <UIBadge variant={details.status === "CANCELLED" ? "danger" : "success"}>
                      {details.status || "COMPLETED"}
                    </UIBadge>
                  ),
                },
              ]}
            />
          </div>
        )}

        {/* CREATE MODE */}
        {!isView && (
          <form id="fund-transfer-form" onSubmit={handleSubmit} className="space-y-4">
            <UIFormSection title="Source & Destination Accounts">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UISelect
                  label="From Account (Source)"
                  value={formData.fromAccountId}
                  onChange={(val) => handleFieldChange("fromAccountId", val)}
                  options={bankOptions}
                  error={Boolean(formErrors.fromAccountId)}
                  helperText={formErrors.fromAccountId}
                  required
                />

                <UISelect
                  label="To Account (Destination)"
                  value={formData.toAccountId}
                  onChange={(val) => handleFieldChange("toAccountId", val)}
                  options={bankOptions}
                  error={Boolean(formErrors.toAccountId)}
                  helperText={formErrors.toAccountId}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UIInput
                  type="number"
                  label="Transfer Amount (₹)"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleFieldChange("amount", e.target.value)}
                  error={Boolean(formErrors.amount)}
                  helperText={formErrors.amount}
                  required
                />

                <UIInput
                  type="date"
                  label="Transfer Date"
                  value={formData.transferDate}
                  onChange={(e) => handleFieldChange("transferDate", e.target.value)}
                  error={Boolean(formErrors.transferDate)}
                  helperText={formErrors.transferDate}
                  required
                />
              </div>

              <UIInput
                label="Reference Number (Optional)"
                placeholder="e.g. UTR12345678"
                value={formData.referenceNumber}
                onChange={(e) => handleFieldChange("referenceNumber", e.target.value)}
              />

              <UIInput
                label="Narration / Remarks (Optional)"
                placeholder="Reason for transfer..."
                value={formData.narration}
                onChange={(e) => handleFieldChange("narration", e.target.value)}
              />
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
            form="fund-transfer-form"
            isLoading={isSubmitting}
          >
            Transfer Funds
          </UIButton>
        )}
      </UIModalFooter>
    </UIModal>
  );
}

export default FundTransferDialog;
