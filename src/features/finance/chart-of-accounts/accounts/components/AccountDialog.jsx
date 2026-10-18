// src/features/finance/chart-of-accounts/accounts/components/AccountDialog.jsx

import React, { useState, useEffect, useMemo } from "react";
import {
  Layers,
  Edit3,
  Copy,
  Check,
  FolderTree,
  Folder,
  Activity,
  CheckCircle2,
  XCircle,
  X,
  FileText,
  Hash,
  Scale,
  Sparkles,
  ArrowRight,
  Shield,
  HelpCircle,
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
  openingBalance: "",
  openingBalanceType: "dr",
  description: "",
  status: "active",
};

const formatCurrency = (val) => {
  if (val === undefined || val === null || isNaN(Number(val))) return "0.00";
  return Number(val).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
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
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if ((mode === "edit" || mode === "view") && accountData) {
        const groupId =
          typeof accountData.accountGroupId === "object"
            ? accountData.accountGroupId?._id || accountData.accountGroupId?.id
            : accountData.accountGroupId || "";

        setFormData({
          accountName: accountData.accountName || accountData.name || "",
          accountCode: accountData.accountCode || accountData.code || "",
          accountGroupId: groupId,
          accountNature: accountData.accountNature || accountData.type || "",
          accountCategory: accountData.accountCategory || accountData.category || "",
          openingBalance:
            accountData.openingBalance !== undefined
              ? String(accountData.openingBalance)
              : "",
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
    const opts = [{ label: "Select Account Group...", value: "" }];
    (accountGroups || []).forEach((g) => {
      opts.push({
        label: `${g.groupName || g.name} (${g.nature || "Group"})`,
        value: g._id || g.id,
      });
    });
    return opts;
  }, [accountGroups]);

  const selectedGroupObj = useMemo(() => {
    return (accountGroups || []).find(
      (g) => (g._id || g.id) === formData.accountGroupId
    );
  }, [accountGroups, formData.accountGroupId]);

  // Derived nature from selected group
  const derivedNature = useMemo(() => {
    if (!formData.accountGroupId) return formData.accountNature || "";
    return selectedGroupObj?.nature
      ? selectedGroupObj.nature.toUpperCase()
      : formData.accountNature || "";
  }, [formData.accountGroupId, formData.accountNature, selectedGroupObj]);

  // Filtered categories based on nature
  const categoryOptions = useMemo(() => {
    let allowedCategories = [];
    if (derivedNature) {
      allowedCategories = CATEGORY_MAP_BY_NATURE[derivedNature] || [];
    }

    if (allowedCategories.length === 0) {
      return [{ label: "Select Category...", value: "" }, ...ALL_CATEGORY_OPTIONS];
    }

    const filtered = ALL_CATEGORY_OPTIONS.filter((opt) =>
      allowedCategories.includes(opt.value)
    );
    return [{ label: "Select Category...", value: "" }, ...filtered];
  }, [derivedNature]);

  const handleFieldChange = (name, val) => {
    setFormData((prev) => {
      const nextData = { ...prev, [name]: val };

      if (name === "accountGroupId") {
        const group = (accountGroups || []).find((g) => (g._id || g.id) === val);
        if (group && group.nature) {
          const nat = group.nature.toUpperCase();
          nextData.accountNature = nat;

          const groupNameNorm = String(group.groupName || "").toLowerCase();
          if (groupNameNorm.includes("bank")) nextData.accountCategory = "BANK";
          else if (groupNameNorm.includes("cash")) nextData.accountCategory = "CASH";
          else if (groupNameNorm.includes("customer") || groupNameNorm.includes("debtor"))
            nextData.accountCategory = "CUSTOMER";
          else if (groupNameNorm.includes("supplier") || groupNameNorm.includes("creditor"))
            nextData.accountCategory = "SUPPLIER";
          else if (groupNameNorm.includes("inventory") || groupNameNorm.includes("stock"))
            nextData.accountCategory = "INVENTORY";
          else if (groupNameNorm.includes("purchase")) nextData.accountCategory = "PURCHASE";
          else if (groupNameNorm.includes("sale")) nextData.accountCategory = "SALES";
          else if (groupNameNorm.includes("tax") || groupNameNorm.includes("gst"))
            nextData.accountCategory = "GST";
          else nextData.accountCategory = nat === "ASSET" ? "FIXED_ASSET" : nat;
        }
      }

      return nextData;
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
      uiToast.error("Validation Error", "Please fill in all required fields.");
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
        uiToast.success("Account Created", `Account "${payload.accountName}" has been created.`);
      } else if (mode === "edit" && accountData?._id) {
        await onSubmitUpdate(accountData._id, payload);
        uiToast.success("Account Updated", `Changes saved for "${payload.accountName}".`);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      const errMsg = typeof err === "string" ? err : err?.message || "Failed to save account.";
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
    ? "Create Ledger Account"
    : isEdit
    ? "Edit Ledger Account"
    : "Ledger Account Details";

  const subtitle = isCreate
    ? "Register a new general ledger account into your Chart of Accounts."
    : isEdit
    ? "Modify account classification, group assignment, or balance."
    : "Inspect complete account configuration, group linkage, and standing.";

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
      size="xl"
      mobileSheet
      className="w-full max-w-4xl max-h-[92vh] flex flex-col p-0 overflow-hidden select-none"
    >
      {/* ── Modal Header ── */}
      <UIModalHeader className="px-6 py-4.5 border-b border-border bg-surface shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-xs shrink-0">
            <Layers className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <UIModalTitle className="text-base sm:text-lg font-bold text-text">
                {title}
              </UIModalTitle>
              {isCreate && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                  <Sparkles className="size-3" /> CHART OF ACCOUNTS
                </span>
              )}
              {isEdit && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  EDITING
                </span>
              )}
              {isView && accountData && (
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1",
                    accountData.status === "active"
                      ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                      : "bg-surface-alt text-text-muted border-border"
                  )}
                >
                  <CheckCircle2 className="size-3" /> {(accountData.status || "active").toUpperCase()}
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

        {/* ── Live Account Preview Card ── */}
        <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                <Folder className="size-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-surface-alt border border-border text-text">
                    {formData.accountCode || "CODE-AUTO"}
                  </span>
                  {derivedNature && (
                    <span
                      className={cn(
                        "text-[10.5px] font-bold px-2 py-0.5 rounded-md border uppercase",
                        natureColorMap[derivedNature] || "bg-surface-alt text-text-muted border-border"
                      )}
                    >
                      {derivedNature}
                    </span>
                  )}
                  {formData.accountCategory && (
                    <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-md bg-surface-alt text-text-muted border border-border">
                      {formData.accountCategory}
                    </span>
                  )}
                </div>
                <h4 className="mt-1 font-bold text-base text-text truncate">
                  {formData.accountName || "New General Ledger Account"}
                </h4>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                Opening Balance
              </span>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span className="text-base font-black font-mono text-text">
                  ₹{formatCurrency(formData.openingBalance)}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface-alt border border-border text-text-muted uppercase">
                  {formData.openingBalanceType || "DR"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════════ */}
        {/* VIEW MODE                                                                 */}
        {/* ══════════════════════════════════════════════════════════════════════════ */}
        {isView && accountData && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-surface border border-border rounded-xl p-3.5 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                  Account Code
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-sm font-bold font-mono text-text">
                    {accountData.accountCode || accountData.code || "N/A"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(accountData.accountCode || accountData.code, "accCode")}
                    className="text-text-muted hover:text-text cursor-pointer"
                    title="Copy code"
                  >
                    {copiedKey === "accCode" ? (
                      <Check className="size-3 text-emerald-600" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-surface border border-border rounded-xl p-3.5 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                  Account Group
                </span>
                <span className="text-sm font-bold text-text mt-1 block truncate">
                  {typeof accountData.accountGroupId === "object"
                    ? accountData.accountGroupId?.groupName
                    : selectedGroupObj?.groupName || "N/A"}
                </span>
              </div>

              <div className="bg-surface border border-border rounded-xl p-3.5 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                  Account Nature
                </span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1 block">
                  {derivedNature || "ASSET"}
                </span>
              </div>

              <div className="bg-surface border border-border rounded-xl p-3.5 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                  Status
                </span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1 block capitalize">
                  {accountData.status || "active"}
                </span>
              </div>
            </div>

            {/* Description note */}
            <div className="bg-surface border border-border rounded-xl p-4 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-text">
                <FileText className="size-3.5 text-text-muted" />
                <span>Account Remarks / Description</span>
              </div>
              <p className="text-xs text-text-muted bg-surface-alt/50 border border-border/60 rounded-lg p-3 leading-relaxed">
                {accountData.description || "No specific remarks or description configured for this account."}
              </p>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════════ */}
        {/* CREATE / EDIT FORM                                                        */}
        {/* ══════════════════════════════════════════════════════════════════════════ */}
        {!isView && (
          <form id="account-dialog-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Classification & Group Card */}
            <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2">
                <FolderTree className="size-4 text-indigo-500" />
                <span className="text-xs uppercase font-bold text-text-muted tracking-wider">
                  Classification & Group Linkage
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-text block mb-1">
                    Account Group <span className="text-rose-500">*</span>
                  </label>
                  <UISelect
                    value={formData.accountGroupId}
                    onChange={(val) => handleFieldChange("accountGroupId", val)}
                    options={groupOptions}
                    placeholder="Select Account Group..."
                    isSearchable
                    error={Boolean(formErrors.accountGroupId)}
                    helperText={formErrors.accountGroupId}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text block mb-1">
                    Category Mapping <span className="text-rose-500">*</span>
                  </label>
                  <UISelect
                    value={formData.accountCategory}
                    onChange={(val) => handleFieldChange("accountCategory", val)}
                    options={categoryOptions}
                    placeholder="Select Ledger Category..."
                    isSearchable
                    error={Boolean(formErrors.accountCategory)}
                    helperText={formErrors.accountCategory}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Account Details & Balances Card */}
            <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-indigo-500" />
                <span className="text-xs uppercase font-bold text-text-muted tracking-wider">
                  Account Identity & Initial Balance
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-text block mb-1">
                    Account Name <span className="text-rose-500">*</span>
                  </label>
                  <UIInput
                    placeholder="e.g. HDFC Current Account, Cash in Register, Rent Expense"
                    value={formData.accountName}
                    onChange={(e) => handleFieldChange("accountName", e.target.value)}
                    error={Boolean(formErrors.accountName)}
                    helperText={formErrors.accountName}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text block mb-1">
                    Account Code <span className="text-rose-500">*</span>
                  </label>
                  <UIInput
                    placeholder="e.g. 1010, BANK01"
                    value={formData.accountCode}
                    onChange={(e) => handleFieldChange("accountCode", e.target.value)}
                    error={Boolean(formErrors.accountCode)}
                    helperText={formErrors.accountCode}
                    startIcon={<Hash className="size-3.5 text-text-muted" />}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-text block mb-1">
                    Opening Balance (₹)
                  </label>
                  <UIInput
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={formData.openingBalance}
                    onChange={(e) => handleFieldChange("openingBalance", e.target.value)}
                    error={Boolean(formErrors.openingBalance)}
                    helperText={formErrors.openingBalance}
                    prefix="₹"
                    inputClassName="font-mono text-right font-bold tabular-nums"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text block mb-1">
                    Balance Type (Dr / Cr)
                  </label>
                  <UISelect
                    value={formData.openingBalanceType}
                    onChange={(val) => handleFieldChange("openingBalanceType", val)}
                    options={balanceTypeOptions}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text block mb-1">
                    Account Status
                  </label>
                  <UISelect
                    value={formData.status}
                    onChange={(val) => handleFieldChange("status", val)}
                    options={statusOptions}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-text block mb-1">
                  Description / Remarks (Optional)
                </label>
                <UIInput
                  placeholder="Additional notes about this ledger account..."
                  value={formData.description}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                />
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
              Classification: <strong className="text-text">{derivedNature || "Not Selected"}</strong>
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
              form="account-dialog-form"
              isLoading={isSubmitting}
              startIcon={<CheckCircle2 className="size-4" />}
            >
              {isCreate ? "Create Account" : "Save Changes"}
            </UIButton>
          )}
        </div>
      </UIModalFooter>
    </UIModal>
  );
}

export default AccountDialog;
