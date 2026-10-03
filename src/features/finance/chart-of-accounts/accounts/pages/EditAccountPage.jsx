import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ROUTES, API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useAccountGroup from "../../account-groups/hooks/useAccountGroup";
import useAccount from "../hooks/useAccount";
import EditAccountDesktopPage from "./desktop/EditAccountDesktopPage";
import EditAccountMobilePage from "./mobile/EditAccountMobilePage";

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

const natureOptions = [
  { label: "Select Nature", value: "" },
  { label: "Asset", value: "ASSET" },
  { label: "Liability", value: "LIABILITY" },
  { label: "Income", value: "INCOME" },
  { label: "Expense", value: "EXPENSE" },
  { label: "Equity", value: "EQUITY" },
];

const categoryOptions = [
  { label: "Select Category", value: "" },
  { label: "Customer", value: "CUSTOMER" },
  { label: "Supplier", value: "SUPPLIER" },
  { label: "Bank", value: "BANK" },
  { label: "Cash", value: "CASH" },
  { label: "Inventory", value: "INVENTORY" },
  { label: "Purchase", value: "PURCHASE" },
  { label: "Sales", value: "SALES" },
  { label: "GST / Taxes", value: "GST" },
  { label: "Expense", value: "EXPENSE" },
  { label: "Income", value: "INCOME" },
  { label: "Fixed Asset", value: "FIXED_ASSET" },
  { label: "Liability", value: "LIABILITY" },
  { label: "Equity", value: "EQUITY" },
];

const balanceTypeOptions = [
  { label: "Debit (Dr)", value: "dr" },
  { label: "Credit (Cr)", value: "cr" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const normalizeText = (val) => String(val || "").trim();

const EditAccountPage = () => {
  const { accountId } = useParams();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const hasFetchedRef = useRef(false);

  const {
    accountGroups = [],
    getAccountGroups,
  } = useAccountGroup();

  const {
    getAccountById,
    updateAccount,
    getAccountStatus,
    updateAccountStatus,
    error,
    message,
    clearError,
    clearMessage,
  } = useAccount();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  // Stable initialization effect to prevent infinite calling loops
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchInitData = async () => {
      try {
        await getAccountGroups();
        const data = await getAccountById(accountId);
        if (data) {
          setFormData({
            accountName: data.accountName || "",
            accountCode: data.accountCode || "",
            accountGroupId: typeof data.accountGroupId === "object" ? data.accountGroupId?._id : (data.accountGroupId || ""),
            accountNature: data.accountNature || "",
            accountCategory: data.accountCategory || "",
            openingBalance: data.openingBalance || 0,
            openingBalanceType: data.openingBalanceType || "dr",
            description: data.description || "",
            status: data.status || "active",
          });
        }
      } catch (err) {
        console.error("Failed to load account details:", err);
        setFormErrors({ submit: "Failed to load account details. Returning to list." });
        setTimeout(() => navigate(ROUTES.ACCOUNTS), 2000);
      }
    };

    fetchInitData();
  }, [accountId, navigate]);

  // Clean up messages/errors on unmount
  useEffect(() => {
    return () => {
      clearError();
      clearMessage();
    };
  }, []);

  const isLoading = updateAccountStatus === API_STATUS.LOADING;
  const isFetching = getAccountStatus === API_STATUS.LOADING;

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
        await updateAccount(accountId, payload);
        navigate(ROUTES.ACCOUNTS, { replace: true });
      } catch (err) {
        setFormErrors({
          submit: typeof err === "string" ? err : "Failed to update account. Please try again.",
        });
      }
    },
    [formData, accountId, updateAccount, navigate]
  );

  const groupOptions = useMemo(() => {
    const opts = [{ label: "Select account group", value: "" }];
    accountGroups.forEach((g) => {
      opts.push({ label: g.groupName, value: g._id });
    });
    return opts;
  }, [accountGroups]);

  const pageProps = {
    formData,
    formErrors,
    isLoading,
    isFetching,
    groupOptions,
    natureOptions,
    categoryOptions,
    balanceTypeOptions,
    statusOptions,
    handleFieldChange,
    handleCancel,
    handleSubmit,
    serverError: error,
    serverMessage: message,
    clearError,
    clearMessage,
  };

  return isMobile ? (
    <EditAccountMobilePage {...pageProps} />
  ) : (
    <EditAccountDesktopPage {...pageProps} />
  );
};

export default EditAccountPage;
