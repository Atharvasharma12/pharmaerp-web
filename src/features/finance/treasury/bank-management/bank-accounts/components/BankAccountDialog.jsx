import React, { useState, useEffect, useCallback, useMemo } from "react";
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

import useBankMaster from "@/features/bank-master/hooks/useBankMaster";

const accountTypeOptions = [
  { label: "Current Account", value: "CURRENT" },
  { label: "Savings Account", value: "SAVINGS" },
  { label: "Overdraft Account", value: "OVERDRAFT" },
  { label: "Cash Credit Account", value: "CASH_CREDIT" },
];

const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

const INITIAL_FORM = {
  accountName: "",
  accountHolderName: "",
  accountNumber: "",
  ifscCode: "",
  branchName: "",
  branchAddress: "",
  registeredMobile: "",
  accountType: "CURRENT",
  bankMasterId: "",
  isPrimary: false,
  isActive: true,
  openingBalance: 0,
  openingBalanceType: "dr",
};

export function BankAccountDialog({
  isOpen,
  onClose,
  mode = "create",
  entityId = null,
  onSubmitCreate,
  onSubmitUpdate,
  onFetchById,
  onSuccess,
}) {
  const { bankMasters = [], getBankMasters } = useBankMaster();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [accountDetails, setAccountDetails] = useState(null);

  // Load bank masters list when modal opens
  useEffect(() => {
    if (isOpen) {
      getBankMasters({ page: 1, limit: 100 }).catch(() => {});
    }
  }, [isOpen, getBankMasters]);

  // Load existing bank account for edit or view
  useEffect(() => {
    if (!isOpen) {
      setFormData(INITIAL_FORM);
      setFormErrors({});
      setServerError(null);
      setAccountDetails(null);
      return;
    }

    if ((mode === "edit" || mode === "view") && entityId) {
      setIsFetching(true);
      setServerError(null);
      onFetchById(entityId)
        .then((data) => {
          setAccountDetails(data);
          if (mode === "edit" && data) {
            setFormData({
              accountName: data.accountName || "",
              accountHolderName: data.accountHolderName || "",
              accountNumber: data.accountNumber || "",
              ifscCode: data.ifscCode || "",
              branchName: data.branchName || "",
              branchAddress: data.branchAddress || "",
              registeredMobile: data.registeredMobile || "",
              accountType: data.accountType || "CURRENT",
              bankMasterId: data.bankMasterId?._id || data.bankMasterId || "",
              isPrimary: Boolean(data.isPrimary),
              isActive: data.isActive !== undefined ? data.isActive : true,
              openingBalance: data.openingBalance || 0,
              openingBalanceType: data.openingBalanceType || "dr",
            });
          }
        })
        .catch((err) => {
          setServerError(typeof err === "string" ? err : "Failed to load bank account details.");
        })
        .finally(() => {
          setIsFetching(false);
        });
    }
  }, [isOpen, mode, entityId, onFetchById]);

  const bankOptions = useMemo(() => {
    return bankMasters.map((b) => ({
      label: b.name ? `${b.name} (${b.code || b.ifscPrefix || ""})` : b.name,
      value: b._id,
    }));
  }, [bankMasters]);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => {
      const nextData = { ...prev, [name]: value };
      if (name === "bankMasterId" && value && !prev.accountName) {
        const selectedBank = bankMasters.find((b) => b._id === value);
        if (selectedBank) {
          nextData.accountName = `${selectedBank.name} Account`;
        }
      }
      return nextData;
    });
    setFormErrors((prev) => ({ ...prev, [name]: undefined, submit: undefined }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.bankMasterId) errors.bankMasterId = "Select bank from master";
    if (!formData.accountName.trim()) errors.accountName = "Account nickname is required";
    if (!formData.accountHolderName.trim()) errors.accountHolderName = "Holder name is required";
    if (!formData.accountNumber.trim()) errors.accountNumber = "Account number is required";

    if (!formData.ifscCode.trim()) {
      errors.ifscCode = "IFSC code is required";
    } else if (!IFSC_REGEX.test(formData.ifscCode.trim().toUpperCase())) {
      errors.ifscCode = "Invalid IFSC format (e.g. HDFC0001234)";
    }

    if (!formData.branchName.trim()) errors.branchName = "Branch name is required";

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
      ...formData,
      accountName: formData.accountName.trim(),
      accountHolderName: formData.accountHolderName.trim(),
      accountNumber: formData.accountNumber.trim(),
      ifscCode: formData.ifscCode.trim().toUpperCase(),
      branchName: formData.branchName.trim(),
      branchAddress: formData.branchAddress.trim(),
      registeredMobile: formData.registeredMobile.trim(),
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
      setServerError(typeof err === "string" ? err : "Failed to save bank account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isView = mode === "view";
  const isCreate = mode === "create";
  const title = isCreate ? "Add Bank Account" : isView ? "Bank Account Details" : "Edit Bank Account";
  const subtitle = isCreate
    ? "Register a new corporate bank account and map it to an accounting ledger."
    : isView
    ? "View details for this bank account."
    : "Update bank account information and settings.";

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="lg" mobileSheet>
      <UIModalHeader>
        <UIModalTitle>{title}</UIModalTitle>
        <UIModalDescription>{subtitle}</UIModalDescription>
      </UIModalHeader>

      <UIModalBody>
        {isFetching && <UISkeleton rows={6} />}

        {serverError && !isFetching && (
          <UIAlert variant="error" onDismiss={() => setServerError(null)}>
            {serverError}
          </UIAlert>
        )}

        {/* VIEW MODE */}
        {isView && !isFetching && accountDetails && (
          <div className="space-y-4">
            <UIKeyValueList
              items={[
                {
                  label: "Bank Name",
                  value: accountDetails.bankMasterId?.name || accountDetails.bankName || "N/A",
                },
                { label: "Account Nickname", value: accountDetails.accountName },
                { label: "Account Holder Name", value: accountDetails.accountHolderName },
                { label: "Account Number", value: accountDetails.accountNumber, copyable: true },
                { label: "IFSC Code", value: accountDetails.ifscCode, copyable: true },
                { label: "Branch Name", value: accountDetails.branchName },
                { label: "Account Type", value: accountDetails.accountType },
                {
                  label: "Registered Mobile",
                  value: accountDetails.registeredMobile || "Not provided",
                },
                {
                  label: "Primary Account",
                  value: accountDetails.isPrimary ? "Yes (Default Bank Account)" : "No",
                },
                {
                  label: "Current Ledger Balance",
                  value: `₹ ${(accountDetails.currentBalance || accountDetails.openingBalance || 0).toLocaleString("en-IN")}`,
                },
                {
                  label: "Status",
                  value: (
                    <UIBadge variant={accountDetails.isActive ? "success" : "neutral"}>
                      {accountDetails.isActive ? "ACTIVE" : "INACTIVE"}
                    </UIBadge>
                  ),
                },
              ]}
            />
          </div>
        )}

        {/* CREATE / EDIT MODE */}
        {!isView && !isFetching && (
          <form id="bank-account-form" onSubmit={handleSubmit} className="space-y-4">
            <UIFormSection title="Bank & Account Identity">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UISelect
                  label="Select Bank"
                  value={formData.bankMasterId}
                  onChange={(e) => handleFieldChange("bankMasterId", e.target.value)}
                  options={bankOptions}
                  error={Boolean(formErrors.bankMasterId)}
                  helperText={formErrors.bankMasterId}
                  required
                />

                <UIInput
                  label="Account Nickname / Name"
                  placeholder="e.g. HDFC Current A/c"
                  value={formData.accountName}
                  onChange={(e) => handleFieldChange("accountName", e.target.value)}
                  error={Boolean(formErrors.accountName)}
                  helperText={formErrors.accountName}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UIInput
                  label="Account Holder Name"
                  placeholder="Name as in bank record"
                  value={formData.accountHolderName}
                  onChange={(e) => handleFieldChange("accountHolderName", e.target.value)}
                  error={Boolean(formErrors.accountHolderName)}
                  helperText={formErrors.accountHolderName}
                  required
                />

                <UIInput
                  label="Account Number"
                  placeholder="Enter account number"
                  value={formData.accountNumber}
                  onChange={(e) => handleFieldChange("accountNumber", e.target.value)}
                  error={Boolean(formErrors.accountNumber)}
                  helperText={formErrors.accountNumber}
                  required
                />
              </div>
            </UIFormSection>

            <UIFormSection title="Branch Details & Type">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UIInput
                  label="IFSC Code"
                  placeholder="e.g. HDFC0001234"
                  value={formData.ifscCode}
                  onChange={(e) => handleFieldChange("ifscCode", e.target.value.toUpperCase())}
                  error={Boolean(formErrors.ifscCode)}
                  helperText={formErrors.ifscCode}
                  required
                />

                <UIInput
                  label="Branch Name"
                  placeholder="e.g. Connaught Place Branch"
                  value={formData.branchName}
                  onChange={(e) => handleFieldChange("branchName", e.target.value)}
                  error={Boolean(formErrors.branchName)}
                  helperText={formErrors.branchName}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UISelect
                  label="Account Type"
                  value={formData.accountType}
                  onChange={(e) => handleFieldChange("accountType", e.target.value)}
                  options={accountTypeOptions}
                  required
                />

                <UIInput
                  label="Registered Mobile (Optional)"
                  placeholder="Enter mobile number"
                  value={formData.registeredMobile}
                  onChange={(e) => handleFieldChange("registeredMobile", e.target.value)}
                />
              </div>

              <UIInput
                label="Branch Address (Optional)"
                placeholder="Enter street address"
                value={formData.branchAddress}
                onChange={(e) => handleFieldChange("branchAddress", e.target.value)}
              />

              <div className="pt-2">
                <UICheckbox
                  label="Set as Primary Corporate Bank Account"
                  checked={formData.isPrimary}
                  onChange={(e) => handleFieldChange("isPrimary", e.target.checked)}
                  helperText="Primary account will be pre-selected in payment entries."
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
            form="bank-account-form"
            isLoading={isSubmitting}
          >
            {isCreate ? "Add Account" : "Save Changes"}
          </UIButton>
        )}
      </UIModalFooter>
    </UIModal>
  );
}

export default BankAccountDialog;
