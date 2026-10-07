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
  UICheckbox,
  UIButton,
  UIAlert,
  UIKeyValueList,
  UIBadge,
  UISkeleton,
} from "@/components/ui";

import useBankAccount from "@/features/finance/treasury/bank-management/bank-accounts/hooks/useBankAccount";

const INITIAL_FORM = {
  qrName: "",
  upiId: "",
  description: "",
  bankAccountId: "",
  isPrimary: false,
  isActive: true,
};

export function PaymentQrDialog({
  isOpen,
  onClose,
  mode = "create",
  entityId = null,
  qrData = null,
  onSubmitCreate,
  onSubmitUpdate,
  onFetchById,
  onSuccess,
}) {
  const { bankAccounts = [], getBankAccounts } = useBankAccount();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [details, setDetails] = useState(qrData);

  // Load bank accounts list when modal opens
  useEffect(() => {
    if (isOpen) {
      getBankAccounts().catch(() => {});
    }
  }, [isOpen, getBankAccounts]);

  // Load details for edit / view
  useEffect(() => {
    if (!isOpen) {
      setFormData(INITIAL_FORM);
      setFormErrors({});
      setServerError(null);
      setDetails(null);
      return;
    }

    if (mode === "view" || mode === "edit") {
      if (qrData) {
        setDetails(qrData);
        if (mode === "edit") {
          setFormData({
            qrName: qrData.qrName || qrData.name || "",
            upiId: qrData.upiId || "",
            description: qrData.description || "",
            bankAccountId: qrData.bankAccountId?._id || qrData.bankAccountId || "",
            isPrimary: Boolean(qrData.isPrimary),
            isActive: qrData.isActive !== false,
          });
        }
      } else if (entityId && onFetchById) {
        setIsFetching(true);
        setServerError(null);
        onFetchById(entityId)
          .then((data) => {
            setDetails(data);
            if (mode === "edit" && data) {
              setFormData({
                qrName: data.qrName || data.name || "",
                upiId: data.upiId || "",
                description: data.description || "",
                bankAccountId: data.bankAccountId?._id || data.bankAccountId || "",
                isPrimary: Boolean(data.isPrimary),
                isActive: data.isActive !== false,
              });
            }
          })
          .catch((err) => setServerError(typeof err === "string" ? err : "Failed to load payment QR details."))
          .finally(() => setIsFetching(false));
      }
    }
  }, [isOpen, mode, entityId, qrData, onFetchById]);

  const bankOptions = useMemo(() => {
    return bankAccounts.map((acc) => ({
      label: `${acc.accountName} (${acc.accountNumber})`,
      value: acc._id,
    }));
  }, [bankAccounts]);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.qrName.trim()) errors.qrName = "QR Name / Label is required";
    if (!formData.upiId.trim()) {
      errors.upiId = "UPI ID is required";
    } else if (!formData.upiId.includes("@")) {
      errors.upiId = "Invalid UPI ID (e.g. name@bank)";
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

    const payload = {
      qrName: formData.qrName.trim(),
      name: formData.qrName.trim(),
      upiId: formData.upiId.trim(),
      description: formData.description.trim() || undefined,
      bankAccountId: formData.bankAccountId || undefined,
      isPrimary: formData.isPrimary,
      isActive: formData.isActive,
    };

    try {
      if (mode === "create") {
        await onSubmitCreate(payload);
      } else {
        await onSubmitUpdate(entityId, payload);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setServerError(typeof err === "string" ? err : "Failed to save Payment QR.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isView = mode === "view";
  const isCreate = mode === "create";
  const title = isCreate ? "Add Payment QR" : isView ? "Payment QR Details" : "Edit Payment QR";
  const subtitle = isCreate
    ? "Setup a new UPI QR code for counter billing."
    : isView
    ? "View details and UPI configuration."
    : "Update Payment QR configuration.";

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="md" mobileSheet>
      <UIModalHeader>
        <UIModalTitle>{title}</UIModalTitle>
        <UIModalDescription>{subtitle}</UIModalDescription>
      </UIModalHeader>

      <UIModalBody>
        {isFetching && <UISkeleton rows={5} />}

        {serverError && !isFetching && (
          <UIAlert variant="error" onDismiss={() => setServerError(null)}>
            {serverError}
          </UIAlert>
        )}

        {/* VIEW MODE */}
        {isView && !isFetching && details && (
          <div className="space-y-4">
            <div className="flex justify-center p-4 bg-surface-alt rounded-2xl border border-border">
              <div className="text-center space-y-2">
                <div className="size-44 mx-auto bg-white p-3 rounded-xl border border-border flex items-center justify-center shadow-sm">
                  {/* Generated QR Code preview using Google Chart API or standard fallback */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                      `upi://pay?pa=${details.upiId}&pn=${encodeURIComponent(details.qrName || details.name || "Pharmacy")}&cu=INR`
                    )}`}
                    alt="UPI QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs font-mono font-bold text-text">{details.upiId}</p>
              </div>
            </div>

            <UIKeyValueList
              items={[
                { label: "QR Name / Label", value: details.qrName || details.name },
                { label: "UPI ID", value: details.upiId, copyable: true },
                {
                  label: "Mapped Bank Account",
                  value: details.bankAccount?.accountName || details.bankAccountId?.accountName || "N/A",
                },
                {
                  label: "Primary QR",
                  value: details.isPrimary ? "Yes (Default POS QR)" : "No",
                },
                { label: "Description", value: details.description || "N/A" },
                {
                  label: "Status",
                  value: (
                    <UIBadge variant={details.isActive !== false ? "success" : "neutral"}>
                      {details.isActive !== false ? "ACTIVE" : "INACTIVE"}
                    </UIBadge>
                  ),
                },
              ]}
            />
          </div>
        )}

        {/* CREATE / EDIT MODE */}
        {!isView && !isFetching && (
          <form id="payment-qr-form" onSubmit={handleSubmit} className="space-y-4">
            <UIFormSection title="QR Identity & UPI Handle">
              <UIInput
                label="QR Name / Label"
                placeholder="e.g. Counter HDFC QR"
                value={formData.qrName}
                onChange={(e) => handleFieldChange("qrName", e.target.value)}
                error={Boolean(formErrors.qrName)}
                helperText={formErrors.qrName}
                required
              />

              <UIInput
                label="UPI ID / VPA"
                placeholder="e.g. pharmacy@hdfcbank"
                value={formData.upiId}
                onChange={(e) => handleFieldChange("upiId", e.target.value)}
                error={Boolean(formErrors.upiId)}
                helperText={formErrors.upiId}
                required
              />

              <UISelect
                label="Mapped Bank Account (Optional)"
                value={formData.bankAccountId}
                onChange={(e) => handleFieldChange("bankAccountId", e.target.value)}
                options={bankOptions}
              />

              <UIInput
                label="Description (Optional)"
                placeholder="e.g. Main counter UPI payment display"
                value={formData.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
              />

              <div className="pt-2">
                <UICheckbox
                  label="Set as Primary Default QR"
                  checked={formData.isPrimary}
                  onChange={(e) => handleFieldChange("isPrimary", e.target.checked)}
                  helperText="Primary QR code will automatically appear on POS Billing screen."
                />
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
            form="payment-qr-form"
            isLoading={isSubmitting}
          >
            {isCreate ? "Add QR Code" : "Save Changes"}
          </UIButton>
        )}
      </UIModalFooter>
    </UIModal>
  );
}

export default PaymentQrDialog;
