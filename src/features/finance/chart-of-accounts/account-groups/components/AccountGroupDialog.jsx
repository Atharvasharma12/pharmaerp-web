import React, { useState, useEffect } from "react";
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

const natureOptions = [
  { label: "Select Nature", value: "" },
  { label: "Asset", value: "ASSET" },
  { label: "Liability", value: "LIABILITY" },
  { label: "Income", value: "INCOME" },
  { label: "Expense", value: "EXPENSE" },
  { label: "Equity", value: "EQUITY" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const INITIAL_FORM = {
  groupName: "",
  groupCode: "",
  nature: "",
  description: "",
  status: "active",
};

export function AccountGroupDialog({
  isOpen,
  onClose,
  mode = "create",
  groupData = null,
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
      if ((mode === "edit" || mode === "view") && groupData) {
        setFormData({
          groupName: groupData.groupName || groupData.name || "",
          groupCode: groupData.groupCode || groupData.code || "",
          nature: groupData.nature || "",
          description: groupData.description || "",
          status: groupData.status || "active",
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
  }, [isOpen, mode, groupData]);

  const handleFieldChange = (name, valueOrEvent) => {
    let val = valueOrEvent;
    if (valueOrEvent && typeof valueOrEvent === "object" && "target" in valueOrEvent) {
      val = valueOrEvent.target.type === "checkbox" ? valueOrEvent.target.checked : valueOrEvent.target.value;
    }
    setFormData((prev) => ({ ...prev, [name]: val }));
    setFormErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.groupName.trim()) {
      errors.groupName = "Group name is required";
    } else if (formData.groupName.trim().length < 2) {
      errors.groupName = "Group name must be at least 2 characters";
    }

    if (!formData.groupCode.trim()) {
      errors.groupCode = "Group code is required";
    }

    if (!formData.nature) {
      errors.nature = "Nature is required";
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
      groupName: formData.groupName.trim(),
      groupCode: formData.groupCode.trim(),
      parentGroupId: null,
      level: 1,
      nature: formData.nature,
      description: formData.description.trim(),
      status: formData.status || "active",
    };

    try {
      if (mode === "create") {
        await onSubmitCreate(payload);
      } else if (mode === "edit" && groupData?._id) {
        await onSubmitUpdate(groupData._id, payload);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setServerError(typeof err === "string" ? err : "Failed to save account group.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";

  const title = isCreate
    ? "Add Account Group"
    : isEdit
    ? "Edit Account Group"
    : "Account Group Details";

  const subtitle = isCreate
    ? "Create a top-level ledger category for classification."
    : isEdit
    ? "Update group name, code, or description."
    : "View account group metadata and associated accounts.";

  const natureBadgeVariantMap = {
    ASSET: "success",
    LIABILITY: "danger",
    INCOME: "info",
    EXPENSE: "warning",
    EQUITY: "neutral",
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
        {serverError && (
          <UIAlert variant="error" onDismiss={() => setServerError(null)}>
            {serverError}
          </UIAlert>
        )}

        {/* VIEW MODE */}
        {isView && groupData && (
          <div className="space-y-4">
            <UIKeyValueList
              items={[
                { label: "Group Name", value: groupData.groupName || groupData.name || "N/A" },
                { label: "Group Code", value: groupData.groupCode || groupData.code || "N/A", copyable: true },
                {
                  label: "Nature",
                  value: (
                    <UIBadge variant={natureBadgeVariantMap[groupData.nature] || "neutral"}>
                      {groupData.nature || "N/A"}
                    </UIBadge>
                  ),
                },
                {
                  label: "Status",
                  value: (
                    <UIBadge variant={groupData.status === "active" ? "success" : "neutral"}>
                      {(groupData.status || "active").toUpperCase()}
                    </UIBadge>
                  ),
                },
                {
                  label: "Accounts Count",
                  value: `${groupData.accountsCount ?? 0} Accounts`,
                },
                {
                  label: "Description",
                  value: groupData.description || "No description provided",
                },
              ]}
            />
          </div>
        )}

        {/* CREATE / EDIT MODE */}
        {!isView && (
          <form id="account-group-form" onSubmit={handleSubmit} className="space-y-4">
            <UIFormSection title="Group Information">
              <UIInput
                label="Group Name"
                placeholder="e.g. Cash & Bank Accounts"
                value={formData.groupName}
                onChange={(e) => handleFieldChange("groupName", e.target.value)}
                error={Boolean(formErrors.groupName)}
                helperText={formErrors.groupName}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UIInput
                  label="Group Code"
                  placeholder="e.g. AG-100"
                  value={formData.groupCode}
                  onChange={(e) => handleFieldChange("groupCode", e.target.value)}
                  error={Boolean(formErrors.groupCode)}
                  helperText={formErrors.groupCode}
                  required
                />

                <UISelect
                  label="Nature"
                  value={formData.nature}
                  onChange={(val) => handleFieldChange("nature", val)}
                  options={natureOptions}
                  error={Boolean(formErrors.nature)}
                  helperText={formErrors.nature}
                  disabled={isEdit} // Nature should not change after creation to preserve financial logic
                  required
                />
              </div>

              <UISelect
                label="Status"
                value={formData.status}
                onChange={(val) => handleFieldChange("status", val)}
                options={statusOptions}
              />

              <UIInput
                label="Description (Optional)"
                placeholder="Brief description of this group..."
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
            form="account-group-form"
            isLoading={isSubmitting}
          >
            {isCreate ? "Create Group" : "Save Changes"}
          </UIButton>
        )}
      </UIModalFooter>
    </UIModal>
  );
}

export default AccountGroupDialog;
