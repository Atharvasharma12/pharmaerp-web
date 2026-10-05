import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES, API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useAccountGroup from "../../account-groups/hooks/useAccountGroup";
import useAccount from "../hooks/useAccount";
import CreateAccountDesktopPage from "./desktop/CreateAccountDesktopPage";
import CreateAccountMobilePage from "./mobile/CreateAccountMobilePage";

const INITIAL_FORM_DATA = {
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

const normalizeText = (val) => String(val || "").trim();

const CreateAccountPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const hasFetchedRef = useRef(false);

  const {
    accountGroups = [],
    getAccountGroups,
  } = useAccountGroup();

  const {
    createAccount,
    createAccountStatus,
    error,
    message,
    clearError,
    clearMessage,
  } = useAccount();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    getAccountGroups().catch((err) => {
      console.error("Failed to load account groups for select options:", err);
    });
  }, [getAccountGroups]);

  // Clean up messages/errors on unmount
  useEffect(() => {
    return () => {
      clearError();
      clearMessage();
    };
  }, []);

  const isLoading = createAccountStatus === API_STATUS.LOADING;

  const handleFieldChange = useCallback(
    (name, value) => {
      setFormData((prev) => {
        const nextData = { ...prev, [name]: value };

        // If parent group changes, auto pre-fill its nature/type and category
        if (name === "accountGroupId") {
          if (value) {
            const group = accountGroups.find((g) => g._id === value);
            if (group && group.nature) {
              const nat = group.nature.toUpperCase();
              nextData.accountNature = nat;

              // Heuristic to auto-guess account category from parent group name
              const groupNameNorm = String(group.groupName || "").toLowerCase();
              if (groupNameNorm.includes("bank")) {
                nextData.accountCategory = "BANK";
              } else if (groupNameNorm.includes("cash")) {
                nextData.accountCategory = "CASH";
              } else if (groupNameNorm.includes("customer") || groupNameNorm.includes("debtor") || groupNameNorm.includes("receivable")) {
                nextData.accountCategory = "CUSTOMER";
              } else if (groupNameNorm.includes("supplier") || groupNameNorm.includes("creditor") || groupNameNorm.includes("payable")) {
                nextData.accountCategory = "SUPPLIER";
              } else if (groupNameNorm.includes("inventory") || groupNameNorm.includes("stock")) {
                nextData.accountCategory = "INVENTORY";
              } else if (groupNameNorm.includes("purchase")) {
                nextData.accountCategory = "PURCHASE";
              } else if (groupNameNorm.includes("sale")) {
                nextData.accountCategory = "SALES";
              } else if (groupNameNorm.includes("tax") || groupNameNorm.includes("gst") || groupNameNorm.includes("vat")) {
                nextData.accountCategory = "GST";
              } else {
                // Default based on Nature
                if (nat === "ASSET") {
                  nextData.accountCategory = "FIXED_ASSET";
                } else {
                  nextData.accountCategory = nat; // LIABILITY, EQUITY, INCOME, EXPENSE
                }
              }
            }
          }
        }
        return nextData;
      });

      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
      }
      clearError();
    },
    [accountGroups, formErrors, clearError]
  );

  const handleCancel = useCallback(() => {
    navigate(ROUTES.ACCOUNTS);
  }, [navigate]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      const errors = {};
      const name = normalizeText(formData.accountName);
      const code = normalizeText(formData.accountCode);
      const group = formData.accountGroupId;
      const nature = formData.accountNature;
      const category = formData.accountCategory;
      const balance = Number(formData.openingBalance) || 0;

      if (!name) {
        errors.accountName = "Account name is required";
      } else if (name.length < 2) {
        errors.accountName = "Account name must be at least 2 characters";
      }

      if (!code) {
        errors.accountCode = "Account code is required";
      }

      if (!group) {
        errors.accountGroupId = "Account group is required";
      }

      if (!nature) {
        errors.accountNature = "Account nature/type is required";
      }

      if (!category) {
        errors.accountCategory = "Account category is required";
      }

      if (balance < 0) {
        errors.openingBalance = "Opening balance cannot be negative";
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      const payload = {
        accountName: name,
        accountCode: code,
        accountGroupId: group,
        accountNature: nature,
        accountCategory: category,
        openingBalance: balance,
        openingBalanceType: formData.openingBalanceType || "dr",
        description: normalizeText(formData.description),
        status: formData.status || "active",
      };

      try {
        await createAccount(payload);
        navigate(ROUTES.ACCOUNTS, { replace: true });
      } catch (err) {
        setFormErrors({
          submit: typeof err === "string" ? err : "Failed to create account. Please try again.",
        });
      }
    },
    [formData, createAccount, navigate]
  );

  const groupOptions = useMemo(() => {
    const opts = [{ label: "Select account group", value: "" }];
    accountGroups.forEach((g) => {
      opts.push({ label: g.groupName, value: g._id });
    });
    return opts;
  }, [accountGroups]);

  const categoryOptions = useMemo(() => {
    let allowedCategories = [];
    if (formData.accountGroupId) {
      const group = accountGroups.find((g) => g._id === formData.accountGroupId);
      if (group && group.nature) {
        const nat = group.nature.toUpperCase();
        allowedCategories = CATEGORY_MAP_BY_NATURE[nat] || [];
      }
    }
    
    if (allowedCategories.length === 0) {
       return [{ label: "Select Category", value: "" }, ...ALL_CATEGORY_OPTIONS];
    }

    const filtered = ALL_CATEGORY_OPTIONS.filter((opt) => allowedCategories.includes(opt.value));
    return [{ label: "Select Category", value: "" }, ...filtered];
  }, [formData.accountGroupId, accountGroups]);

  const pageProps = {
    formData,
    formErrors,
    isLoading,
    groupOptions,
    categoryOptions,
    balanceTypeOptions,
    handleFieldChange,
    handleCancel,
    handleSubmit,
    serverError: error,
    serverMessage: message,
    clearError,
    clearMessage,
  };

  return isMobile ? (
    <CreateAccountMobilePage {...pageProps} />
  ) : (
    <CreateAccountDesktopPage {...pageProps} />
  );
};

export default CreateAccountPage;
