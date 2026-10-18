// src/features/finance/chart-of-accounts/account-groups/components/AccountGroupDialog.jsx

import React, { useState, useEffect, useMemo } from "react";
import {
  FolderTree,
  Folder,
  Edit3,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  X,
  FileText,
  Hash,
  Sparkles,
  GitBranch,
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
  UIAlert,
  UIBadge,
  uiToast,
} from "@/components/ui";
import { cn } from "@/lib/utils";

const natureOptions = [
  { label: "Select Nature...", value: "" },
  { label: "Asset (Assets & Receivables)", value: "ASSET" },
  { label: "Liability (Payables & Obligations)", value: "LIABILITY" },
  { label: "Income (Revenue & Sales)", value: "INCOME" },
  { label: "Expense (Operating & Direct Costs)", value: "EXPENSE" },
  { label: "Equity (Capital & Retained Earnings)", value: "EQUITY" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const INITIAL_FORM = {
  groupName: "",
  groupCode: "",
  parentGroupId: "",
  nature: "",
  description: "",
  status: "active",
};

export function AccountGroupDialog({
  isOpen,
  onClose,
  mode = "create",
  groupData = null,
  accountGroups = [],
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
      if ((mode === "edit" || mode === "view") && groupData) {
        const parentId =
          typeof groupData.parentGroupId === "object"
            ? groupData.parentGroupId?._id || groupData.parentGroupId?.id
            : groupData.parentGroupId || "";

        setFormData({
          groupName: groupData.groupName || groupData.name || "",
          groupCode: groupData.groupCode || groupData.code || "",
          parentGroupId: parentId,
          nature: groupData.nature ? groupData.nature.toUpperCase() : "",
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

  // Options for parent group (exclude itself when in edit mode)
  const parentGroupOptions = useMemo(() => {
    const opts = [{ label: "None (Primary / Root Group)", value: "" }];
    const currentId = groupData?._id || groupData?.id;

    (accountGroups || []).forEach((g) => {
      const gId = g._id || g.id;
      if (gId !== currentId) {
        opts.push({
          label: `${g.groupName || g.name} (${g.nature || "Group"})`,
          value: gId,
        });
      }
    });
    return opts;
  }, [accountGroups, groupData]);

  const parentGroupName = useMemo(() => {
    if (!formData.parentGroupId) return null;
    const parent = (accountGroups || []).find(
      (g) => (g._id || g.id) === formData.parentGroupId
    );
    return parent?.groupName || parent?.name || null;
  }, [accountGroups, formData.parentGroupId]);

  const handleFieldChange = (name, val) => {
    setFormData((prev) => {
      const next = { ...prev, [name]: val };
      if (name === "parentGroupId" && val) {
        const parent = (accountGroups || []).find((g) => (g._id || g.id) === val);
        if (parent?.nature && !next.nature) {
          next.nature = parent.nature.toUpperCase();
        }
      }
      return next;
    });

    setFormErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
  };

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard?.writeText(String(text));
    setCopiedKey(key);
    uiToast.success("Copied to Clipboard", `${text} copied.`);
    setTimeout(() => setCopiedKey(null), 2000);
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
      errors.nature = "Nature classification is required";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      uiToast.error("Validation Error", "Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    const payload = {
      groupName: formData.groupName.trim(),
      groupCode: formData.groupCode.trim(),
      parentGroupId: formData.parentGroupId || null,
      nature: formData.nature,
      description: formData.description.trim(),
      status: formData.status || "active",
    };

    try {
      if (mode === "create") {
        await onSubmitCreate(payload);
        uiToast.success("Group Created", `Account group "${payload.groupName}" has been created.`);
      } else if (mode === "edit" && groupData?._id) {
        await onSubmitUpdate(groupData._id, payload);
        uiToast.success("Group Updated", `Changes saved for "${payload.groupName}".`);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      const errMsg = typeof err === "string" ? err : err?.message || "Failed to save account group.";
      setServerError(errMsg);
      uiToast.error("Save Failed", errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";

  const title = isCreate
    ? "Create Account Group"
    : isEdit
    ? "Edit Account Group"
    : "Account Group Details";

  const subtitle = isCreate
    ? "Configure a new hierarchical category for general ledger accounts."
    : isEdit
    ? "Modify group properties, hierarchy level, or status."
    : "Inspect group hierarchy, nature classification, and child structure.";

  const natureColorMap = {
    ASSET: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    LIABILITY: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    EQUITY: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    INCOME: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    EXPENSE: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };

  return (
    <UIModal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      size="lg"
      mobileSheet
      className="w-full max-w-2xl max-h-[92vh] flex flex-col p-0 overflow-hidden select-none"
    >
      {/* ── Modal Header ── */}
      <UIModalHeader className="px-6 py-4.5 border-b border-border bg-surface shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-xs shrink-0">
            <FolderTree className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <UIModalTitle className="text-base sm:text-lg font-bold text-text">
                {title}
              </UIModalTitle>
              {isCreate && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                  <Sparkles className="size-3" /> GROUP
                </span>
              )}
              {isEdit && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  EDITING
                </span>
              )}
              {isView && groupData && (
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1",
                    groupData.status === "active"
                      ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                      : "bg-surface-alt text-text-muted border-border"
                  )}
                >
                  <CheckCircle2 className="size-3" /> {(groupData.status || "active").toUpperCase()}
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

        {/* ── Live Group Preview Card ── */}
        <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                <Folder className="size-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-surface-alt border border-border text-text">
                    {formData.groupCode || "GRP-AUTO"}
                  </span>
                  {formData.nature && (
                    <span
                      className={cn(
                        "text-[10.5px] font-bold px-2 py-0.5 rounded-md border uppercase",
                        natureColorMap[formData.nature] || "bg-surface-alt text-text-muted border-border"
                      )}
                    >
                      {formData.nature}
                    </span>
                  )}
                </div>
                <h4 className="mt-1 font-bold text-base text-text truncate">
                  {formData.groupName || "New Account Group"}
                </h4>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                Hierarchy
              </span>
              <span className="text-xs font-bold text-text mt-0.5 block">
                {formData.parentGroupId ? "Subgroup" : "Primary Group"}
              </span>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════════ */}
        {/* VIEW MODE                                                                 */}
        {/* ══════════════════════════════════════════════════════════════════════════ */}
        {isView && groupData && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface border border-border rounded-xl p-3.5 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                  Group Code
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-sm font-bold font-mono text-text">
                    {groupData.groupCode || groupData.code || "N/A"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(groupData.groupCode || groupData.code, "grpCode")}
                    className="text-text-muted hover:text-text cursor-pointer"
                    title="Copy code"
                  >
                    {copiedKey === "grpCode" ? (
                      <Check className="size-3 text-emerald-600" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-surface border border-border rounded-xl p-3.5 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                  Parent Hierarchy
                </span>
                <span className="text-sm font-bold text-text mt-1 block truncate">
                  {parentGroupName || "Primary Root Group"}
                </span>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-4 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-text">
                <FileText className="size-3.5 text-text-muted" />
                <span>Description & Purpose</span>
              </div>
              <p className="text-xs text-text-muted bg-surface-alt/50 border border-border/60 rounded-lg p-3 leading-relaxed">
                {groupData.description || "No custom description specified for this account group."}
              </p>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════════ */}
        {/* CREATE / EDIT FORM                                                        */}
        {/* ══════════════════════════════════════════════════════════════════════════ */}
        {!isView && (
          <form id="group-dialog-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-text block mb-1">
                    Group Name <span className="text-rose-500">*</span>
                  </label>
                  <UIInput
                    placeholder="e.g. Current Assets, Bank Accounts, Direct Expenses"
                    value={formData.groupName}
                    onChange={(e) => handleFieldChange("groupName", e.target.value)}
                    error={Boolean(formErrors.groupName)}
                    helperText={formErrors.groupName}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text block mb-1">
                    Group Code <span className="text-rose-500">*</span>
                  </label>
                  <UIInput
                    placeholder="e.g. CA, BANK, DE"
                    value={formData.groupCode}
                    onChange={(e) => handleFieldChange("groupCode", e.target.value)}
                    error={Boolean(formErrors.groupCode)}
                    helperText={formErrors.groupCode}
                    startIcon={<Hash className="size-3.5 text-text-muted" />}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-text block mb-1">
                    Parent Group (Hierarchy)
                  </label>
                  <UISelect
                    value={formData.parentGroupId}
                    onChange={(val) => handleFieldChange("parentGroupId", val)}
                    options={parentGroupOptions}
                    placeholder="Select Parent Group..."
                    isSearchable
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text block mb-1">
                    Nature Classification <span className="text-rose-500">*</span>
                  </label>
                  <UISelect
                    value={formData.nature}
                    onChange={(val) => handleFieldChange("nature", val)}
                    options={natureOptions}
                    error={Boolean(formErrors.nature)}
                    helperText={formErrors.nature}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-text block mb-1">
                    Description (Optional)
                  </label>
                  <UIInput
                    placeholder="Brief description of this group..."
                    value={formData.description}
                    onChange={(e) => handleFieldChange("description", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text block mb-1">
                    Status
                  </label>
                  <UISelect
                    value={formData.status}
                    onChange={(val) => handleFieldChange("status", val)}
                    options={statusOptions}
                  />
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
            <span className="text-xs text-text-muted">
              Hierarchy: <strong className="text-text">{formData.parentGroupId ? "Subgroup" : "Primary Group"}</strong>
            </span>
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
              form="group-dialog-form"
              isLoading={isSubmitting}
              startIcon={<CheckCircle2 className="size-4" />}
            >
              {isCreate ? "Create Group" : "Save Changes"}
            </UIButton>
          )}
        </div>
      </UIModalFooter>
    </UIModal>
  );
}

export default AccountGroupDialog;
