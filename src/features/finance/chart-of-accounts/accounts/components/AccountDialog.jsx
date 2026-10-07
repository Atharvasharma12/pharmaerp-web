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
} from "@/components/ui";

const ALL_CATEGORY_OPTIONS = [
  { label: "Customer Ledger Account", value: "CUSTOMER" },
  { label: "Supplier Ledger Account", value: "SUPPLIER" },
  { label: "Bank Account", value: "BANK" },
  { label: "Cash Account", value: "CASH" },
  { label: "Stock / Inventory Account", value: "INVENTORY" },
  { label: "Purchase Account", value: "PURCHASE" },
  { label: "Sales Account", value: "SALES" },
  { label: "GST / Tax Account", value: "GST" },
  { label: "Expense Account", value: "EXPENSE" },
  { label: "Income Account", value: "INCOME" },
  { label: "Shop & Fixed Assets", value: "FIXED_ASSET" },
  { label: "Other Liability", value: "LIABILITY" },
  { label: "Capital / Owner's Equity", value: "EQUITY" },
];

const CATEGORY_MAP_BY_NATURE = {
  ASSET: ["CASH", "BANK", "CUSTOMER", "INVENTORY", "FIXED_ASSET"],
  LIABILITY: ["SUPPLIER", "GST", "LIABILITY"],
  INCOME: ["SALES", "INCOME"],
  EXPENSE: ["PURCHASE", "EXPENSE"],
  EQUITY: ["EQUITY"],
};

const balanceTypeOptions = [
  { label: "Debit (Dr)", value: "dr" },
  { label: "Credit (Cr)", value: "cr" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const INITIAL_FORM = {
  accountName: "",
  accountCode: "",
  accountGroupId: "",
  accountNature: "",
  accountCategory: "",
  openingBalance: 0,
  openingBalanceType: "dr",
  description: "",
  status: "active",
};

export function AccountDialog({
  isOpen,
  onClose,
  mode = "create",
  accountData = null,
  accountGroups = [],
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
      if ((mode === "edit" || mode === "view") && accountData) {
        const groupObj = accountData.accountGroupId;
        const groupId = typeof groupObj === "object" ? groupObj?._id : groupObj || "";
        
        setFormData({
          accountName: accountData.accountName || accountData.name || "",
          accountCode: accountData.accountCode || accountData.code || "",
          accountGroupId: groupId,
          accountNature: accountData.accountNature || accountData.nature || "",
          accountCategory: accountData.accountCategory || accountData.category || "",
          openingBalance: accountData.openingBalance || 0,
          openingBalanceType: accountData.openingBalanceType || "dr",
          description: accountData.description || "",
          status: accountData.status || "active",
        });
      } else {
        setFormData(INITIAL_FORM);
      }
      setFormErrors({});
      setServerError(null);
    } else {
      setFormData(INITIAL_FORM);
      setFormErrors({});
      setServerError(null);
    }
  }, [isOpen, mode, accountData]);

  const groupOptions = useMemo(() => {
    const opts = [{ label: "Select account group", value: "" }];
    accountGroups.forEach((g) => {
      opts.push({ label: g.groupName || g.name, value: g._id || g.id });
    });
    return opts;
  }, [accountGroups]);

  // Derived nature from selected group
  const derivedNature = useMemo(() => {
    if (!formData.accountGroupId) return formData.accountNature || "";
    const group = accountGroups.find(
      (g) => (g._id || g.id) === formData.accountGroupId
    );
    return group?.nature ? group.nature.toUpperCase() : formData.accountNature || "";
  }, [formData.accountGroupId, formData.accountNature, accountGroups]);

  // Filtered categories based on nature (F04 rule)
  const categoryOptions = useMemo(() => {
    let allowedCategories = [];
    if (derivedNature) {
      allowedCategories = CATEGORY_MAP_BY_NATURE[derivedNature] || [];
    }

    if (allowedCategories.length === 0) {
      return [{ label: "Select Category", value: "" }, ...ALL_CATEGORY_OPTIONS];
    }

    const filtered = ALL_CATEGORY_OPTIONS.filter((opt) =>
      allowedCategories.includes(opt.value)
    );
    return [{ label: "Select Category", value: "" }, ...filtered];
  }, [derivedNature]);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => {
      const nextData = { ...prev, [name]: value };

      if (name === "accountGroupId") {
        const group = accountGroups.find((g) => (g._id || g.id) === value);
        if (group && group.nature) {
          const nat = group.nature.toUpperCase();
          nextData.accountNature = nat;

          // Auto-select category guess based on group name if not set
          const groupNameNorm = String(group.groupName || "").toLowerCase();
          if (groupNameNorm.includes("bank")) nextData.accountCategory = "BANK";
          else if (groupNameNorm.includes("cash")) nextData.accountCategory = "CASH";
          else if (groupNameNorm.includes("customer") || groupNameNorm.includes("debtor")) nextData.accountCategory = "CUSTOMER";
          else if (groupNameNorm.includes("supplier") || groupNameNorm.includes("creditor")) nextData.accountCategory = "SUPPLIER";
          else if (groupNameNorm.includes("inventory") || groupNameNorm.includes("stock")) nextData.accountCategory = "INVENTORY";
          else if (groupNameNorm.includes("purchase")) nextData.accountCategory = "PURCHASE";
          else if (groupNameNorm.includes("sale")) nextData.accountCategory = "SALES";
          else if (groupNameNorm.includes("tax") || groupNameNorm.includes("gst")) nextData.accountCategory = "GST";
          else nextData.accountCategory = nat === "ASSET" ? "FIXED_ASSET" : nat;
        }
      }

      return nextData;
    });

    setFormErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.accountName.trim()) {
      errors.accountName = "Account name is required";
    } else if (formData.accountName.trim().length < 2) {
      errors.accountName = "Account name must be at least 2 characters";
    }

    if (!formData.accountCode.trim()) {
      errors.accountCode = "Account code is required";
    }

    if (!formData.accountGroupId) {
      errors.accountGroupId = "Account group is required";
    }

    if (!formData.accountCategory) {
      errors.accountCategory = "Account category is required";
    }

    if (Number(formData.openingBalance) < 0) {
      errors.openingBalance = "Opening balance cannot be negative";
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
      accountName: formData.accountName.trim(),
      accountCode: formData.accountCode.trim(),
      accountGroupId: formData.accountGroupId,
      accountNature: derivedNature,
      accountCategory: formData.accountCategory,
      openingBalance: Number(formData.openingBalance) || 0,
      openingBalanceType: formData.openingBalanceType || "dr",
      description: formData.description.trim(),
      status: formData.status || "active",
    };

    try {
      if (mode === "create") {
        await onSubmitCreate(payload);
      } else if (mode === "edit" && accountData?._id) {
        await onSubmitUpdate(accountData._id, payload);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setServerError(typeof err === "string" ? err : "Failed to save account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";

  const title = isCreate
    ? "Add Account (COA)"
    : isEdit
    ? "Edit Account"
    : "Account Details";

  const subtitle = isCreate
    ? "Create a new general ledger account."
    : isEdit
    ? "Modify account properties or status."
    : "View account metadata, classification, and balances.";

  const natureBadgeVariantMap = {
    ASSET: "success",
    LIABILITY: "danger",
    INCOME: "info",
    EXPENSE: "warning",
    EQUITY: "neutral",
  };

  const selectedGroupObj = accountGroups.find(
    (g) => (g._id || g.id) === formData.accountGroupId
  );

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="md" mobileSheet>
      <UIModalHeader>
        <UIModalTitle>{title}</UIModalTitle>
        <UIModalDescription>{subtitle}</UIModalDescription>
      </UIModalHeader>

      <UIModalBody>
        {serverError && (
          <UIAlert variant="error" onDismiss={() => setServerError(null)}>
            {serverError}
          </UIAlert>
        )}

        {/* VIEW MODE */}
        {isView && accountData && (
          <div className="space-y-4">
            <UIKeyValueList
              items={[
                { label: "Account Name", value: accountData.accountName || accountData.name || "N/A" },
                { label: "Account Code", value: accountData.accountCode || accountData.code || "N/A", copyable: true },
                {
                  label: "Group",
                  value:
                    typeof accountData.accountGroupId === "object"
                      ? accountData.accountGroupId?.groupName
                      : selectedGroupObj?.groupName || "N/A",
                },
                {
                  label: "Nature",
                  value: (
                    <UIBadge variant={natureBadgeVariantMap[derivedNature] || "neutral"}>
                      {derivedNature || "N/A"}
                    </UIBadge>
                  ),
                },
                {
                  label: "Category",
                  value: accountData.accountCategory || accountData.category || "N/A",
                },
                {
                  label: "Opening Balance",
                  value: `₹${Number(accountData.openingBalance || 0).toLocaleString("en-IN")} (${(accountData.openingBalanceType || "dr").toUpperCase()})`,
                },
                {
                  label: "Status",
                  value: (
                    <UIBadge variant={accountData.status === "active" ? "success" : "neutral"}>
                      {(accountData.status || "active").toUpperCase()}
                    </UIBadge>
                  ),
                },
                {
                  label: "Description",
                  value: accountData.description || "No description provided",
                },
              ]}
            />
          </div>
        )}

        {/* CREATE / EDIT MODE */}
        {!isView && (
          <form id="account-dialog-form" onSubmit={handleSubmit} className="space-y-4">
            <UIFormSection title="Classification & Group">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UISelect
                  label="Account Group"
                  value={formData.accountGroupId}
                  onChange={(e) => handleFieldChange("accountGroupId", e.target.value)}
                  options={groupOptions}
                  error={Boolean(formErrors.accountGroupId)}
                  helperText={formErrors.accountGroupId}
                  required
                />

                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">
                    Nature (Auto-derived from Group)
                  </label>
                  <div className="h-10 px-3 flex items-center bg-surface-muted/50 border border-border rounded-xl">
                    {derivedNature ? (
                      <UIBadge variant={natureBadgeVariantMap[derivedNature] || "neutral"}>
                        {derivedNature}
                      </UIBadge>
                    ) : (
                      <span className="text-xs text-text-muted">Select group first</span>
                    )}
                  </div>
                </div>
              </div>

              <UISelect
                label="Account Category"
                value={formData.accountCategory}
                onChange={(e) => handleFieldChange("accountCategory", e.target.value)}
                options={categoryOptions}
                error={Boolean(formErrors.accountCategory)}
                helperText={formErrors.accountCategory || "Filtered based on selected Group Nature"}
                required
              />
            </UIFormSection>

            <UIFormSection title="Account Identity">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UIInput
                  label="Account Name"
                  placeholder="e.g. HDFC Bank Current Account"
                  value={formData.accountName}
                  onChange={(e) => handleFieldChange("accountName", e.target.value)}
                  error={Boolean(formErrors.accountName)}
                  helperText={formErrors.accountName}
                  required
                />

                <UIInput
                  label="Account Code"
                  placeholder="e.g. ACC-1001"
                  value={formData.accountCode}
                  onChange={(e) => handleFieldChange("accountCode", e.target.value)}
                  error={Boolean(formErrors.accountCode)}
                  helperText={formErrors.accountCode}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UIInput
                  type="number"
                  label="Opening Balance (₹)"
                  placeholder="0.00"
                  value={formData.openingBalance}
                  onChange={(e) => handleFieldChange("openingBalance", e.target.value)}
                  error={Boolean(formErrors.openingBalance)}
                  helperText={formErrors.openingBalance}
                  disabled={isEdit} // Opening balance locked after creation
                />

                <UISelect
                  label="Balance Type"
                  value={formData.openingBalanceType}
                  onChange={(e) => handleFieldChange("openingBalanceType", e.target.value)}
                  options={balanceTypeOptions}
                  disabled={isEdit}
                />
              </div>

              <UISelect
                label="Status"
                value={formData.status}
                onChange={(e) => handleFieldChange("status", e.target.value)}
                options={statusOptions}
              />

              <UIInput
                label="Description (Optional)"
                placeholder="Notes or details about this ledger account..."
                value={formData.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
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
            form="account-dialog-form"
            isLoading={isSubmitting}
          >
            {isCreate ? "Create Account" : "Save Changes"}
          </UIButton>
        )}
      </UIModalFooter>
    </UIModal>
  );
}

export default AccountDialog;
