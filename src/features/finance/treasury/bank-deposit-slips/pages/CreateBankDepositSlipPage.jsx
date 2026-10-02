import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import useBankAccount from "@/features/finance/treasury/bank-management/bank-accounts/hooks/useBankAccount";
import useCashAccount from "@/features/finance/treasury/cash-management/cash-accounts/hooks/useCashAccount";
import useBranch from "@/features/branch/hooks/useBranch";

import useBankDepositSlip from "../hooks/useBankDepositSlip";
import CreateBankDepositSlipDesktopPage from "./desktop/CreateBankDepositSlipDesktopPage";
import CreateBankDepositSlipMobilePage from "./mobile/CreateBankDepositSlipMobilePage";

const INITIAL_DENOMINATIONS = [
  { denomination: 500, quantity: 0 },
  { denomination: 200, quantity: 0 },
  { denomination: 100, quantity: 0 },
  { denomination: 50, quantity: 0 },
  { denomination: 20, quantity: 0 },
  { denomination: 10, quantity: 0 },
  { denomination: 5, quantity: 0 },
  { denomination: 2, quantity: 0 },
  { denomination: 1, quantity: 0 },
];

const INITIAL_FORM_DATA = {
  slipDate: new Date().toISOString().split("T")[0],
  fromCashAccountId: "",
  toBankAccountId: "",
  depositBagReference: "",
  bankBranchName: "",
  narration: "",
  dayClosingId: "",
};

const CreateBankDepositSlipPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentBranch } = useBranch();

  const prefillDayClosingId = searchParams.get("dayClosingId") || null;
  const prefillCashAccountId = searchParams.get("cashAccountId") || null;

  const {
    createBankDepositSlip,
    createBankDepositSlipStatus,
    error,
    clearError,
    message,
    clearMessage,
  } = useBankDepositSlip();

  const { bankAccounts = [], getBankAccounts } = useBankAccount();
  const { cashAccounts = [], getCashAccounts, getCashAccountById } = useCashAccount();

  const [formData, setFormData] = useState(() => ({
    ...INITIAL_FORM_DATA,
    fromCashAccountId: prefillCashAccountId || "",
    dayClosingId: prefillDayClosingId || "",
  }));
  const [denominations, setDenominations] = useState(INITIAL_DENOMINATIONS);
  const [formErrors, setFormErrors] = useState({});
  const [actionError, setActionError] = useState("");

  const hasFetchedBanksRef = useRef(false);
  const hasFetchedCashRef = useRef(false);
  const hasInitializedDenomsRef = useRef(false);

  useEffect(() => {
    if (hasFetchedBanksRef.current) return;
    hasFetchedBanksRef.current = true;
    getBankAccounts({ all: true, isActive: true }).catch((err) =>
      console.error("Failed to load bank accounts:", err)
    );
  }, [getBankAccounts]);

  useEffect(() => {
    if (hasFetchedCashRef.current) return;
    hasFetchedCashRef.current = true;
    getCashAccounts({ all: true, branchId: currentBranch?._id, status: "active" }).catch((err) =>
      console.error("Failed to load cash accounts:", err)
    );
  }, [getCashAccounts, currentBranch?._id]);

  useEffect(() => {
    if (prefillCashAccountId && cashAccounts.length > 0) {
      const found = cashAccounts.find((c) => c._id === prefillCashAccountId);
      if (found) {
        setFormData((prev) => ({
          ...prev,
          fromCashAccountId: prefillCashAccountId,
        }));
      }
    }
  }, [cashAccounts, prefillCashAccountId]);

  const selectedCashAccount = useMemo(() => {
    if (!formData.fromCashAccountId) return null;
    return cashAccounts.find((c) => c._id === formData.fromCashAccountId) || null;
  }, [formData.fromCashAccountId, cashAccounts]);

  const availableDenominationsMap = useMemo(() => {
    const map = new Map();
    if (selectedCashAccount?.denominationBalance?.denominations) {
      for (const d of selectedCashAccount.denominationBalance.denominations) {
        map.set(d.denomination, d.quantity || 0);
      }
    }
    return map;
  }, [selectedCashAccount]);

  const applyDenominationsFromAccount = useCallback((account) => {
    if (account?.denominationBalance?.denominations) {
      const balanceMap = new Map(
        account.denominationBalance.denominations.map((d) => [d.denomination, d.quantity || 0])
      );
      setDenominations(
        INITIAL_DENOMINATIONS.map((d) => ({
          denomination: d.denomination,
          quantity: balanceMap.get(d.denomination) || 0,
        }))
      );
    } else {
      setDenominations(INITIAL_DENOMINATIONS);
    }
  }, []);

  // Auto-populate when cash account is selected or prefilled
  useEffect(() => {
    if (formData.fromCashAccountId && cashAccounts.length > 0 && !hasInitializedDenomsRef.current) {
      const found = cashAccounts.find((c) => c._id === formData.fromCashAccountId);
      if (found?.denominationBalance?.denominations) {
        hasInitializedDenomsRef.current = true;
        applyDenominationsFromAccount(found);
      }
    }
  }, [cashAccounts, formData.fromCashAccountId, applyDenominationsFromAccount]);

  const totalAmount = useMemo(() => {
    return denominations.reduce(
      (sum, item) => sum + item.denomination * (item.quantity || 0),
      0
    );
  }, [denominations]);

  const cashAccountOptions = useMemo(() => {
    return [
      { label: "Select Cash Account", value: "" },
      ...cashAccounts.map((acc) => {
        const bal = acc.denominationBalance?.totalBalance;
        const balText = bal !== undefined ? ` [₹${bal.toLocaleString("en-IN")}]` : "";
        return {
          label: `${acc.accountName || "Cash Account"}${balText}`,
          value: acc._id,
        };
      }),
    ];
  }, [cashAccounts]);

  const bankAccountOptions = useMemo(() => {
    return [
      { label: "Select Bank Account", value: "" },
      ...bankAccounts.map((acc) => {
        const bankTitle =
          acc.accountName ||
          acc.bankMasterId?.name ||
          acc.bankName ||
          "Bank Account";
        const accNum = acc.accountNumber ? ` (${acc.accountNumber})` : "";
        return {
          label: `${bankTitle}${accNum}`,
          value: acc._id,
        };
      }),
    ];
  }, [bankAccounts]);

  const handleChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleCashAccountChange = useCallback(
    async (accountId) => {
      handleChange("fromCashAccountId", accountId);

      if (!accountId) {
        setDenominations(INITIAL_DENOMINATIONS);
        return;
      }

      // 1. Immediately apply cached account denominations for zero latency
      const cached = cashAccounts.find((c) => c._id === accountId);
      if (cached?.denominationBalance?.denominations) {
        applyDenominationsFromAccount(cached);
      }

      // 2. Fetch fresh live account detail to guarantee 100% current counts
      try {
        const fresh = await getCashAccountById(accountId);
        if (fresh?.denominationBalance?.denominations) {
          applyDenominationsFromAccount(fresh);
        }
      } catch (err) {
        console.warn("Could not fetch fresh cash account balance:", err);
      }
    },
    [handleChange, cashAccounts, getCashAccountById, applyDenominationsFromAccount]
  );

  const handleFillAllAvailable = useCallback(() => {
    if (selectedCashAccount) {
      applyDenominationsFromAccount(selectedCashAccount);
    }
  }, [selectedCashAccount, applyDenominationsFromAccount]);

  const handleClearAll = useCallback(() => {
    setDenominations(INITIAL_DENOMINATIONS);
  }, []);

  const handleSetMaxForDenom = useCallback(
    (denomination) => {
      const maxQty = availableDenominationsMap.get(denomination) || 0;
      setDenominations((prev) =>
        prev.map((d) =>
          d.denomination === denomination ? { ...d, quantity: maxQty } : d
        )
      );
    },
    [availableDenominationsMap]
  );

  const handleDenominationChange = useCallback((index, value) => {
    setDenominations((prev) => {
      const newDenoms = [...prev];
      newDenoms[index] = { ...newDenoms[index], quantity: Math.max(0, value) };
      return newDenoms;
    });
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};
    if (!formData.slipDate) errors.slipDate = "Date is required.";
    if (!formData.fromCashAccountId)
      errors.fromCashAccountId = "Cash account is required.";
    if (!formData.toBankAccountId)
      errors.toBankAccountId = "Bank account is required.";

    if (totalAmount <= 0) {
      errors.totalAmount = "Amount must be greater than zero.";
    }

    // Check denomination sufficiency against selected cash account
    if (selectedCashAccount) {
      const exceeded = denominations.find((d) => {
        const availableQty = availableDenominationsMap.get(d.denomination) || 0;
        return (d.quantity || 0) > availableQty;
      });

      if (exceeded) {
        const maxAvail = availableDenominationsMap.get(exceeded.denomination) || 0;
        errors.totalAmount = `Quantity for ₹${exceeded.denomination} (${exceeded.quantity}) exceeds available in account (${maxAvail} available).`;
      }

      const accountTotal = selectedCashAccount.denominationBalance?.totalBalance ?? 0;
      if (totalAmount > accountTotal) {
        errors.totalAmount = `Deposit amount (₹${totalAmount.toLocaleString("en-IN")}) exceeds total cash in account (₹${accountTotal.toLocaleString("en-IN")}).`;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, totalAmount, selectedCashAccount, denominations, availableDenominationsMap]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) e.preventDefault();

      clearError();
      clearMessage();
      setActionError("");

      if (!validateForm()) {
        return;
      }

      const payload = {
        slipDate: formData.slipDate,
        fromCashAccountId: formData.fromCashAccountId,
        toBankAccountId: formData.toBankAccountId,
        amount: totalAmount,
        depositBagReference: formData.depositBagReference || undefined,
        bankBranchName: formData.bankBranchName || undefined,
        narration: formData.narration || undefined,
        dayClosingId: formData.dayClosingId || undefined,
        denominations: denominations.filter((d) => d.quantity > 0),
      };

      try {
        const result = await createBankDepositSlip(payload);
        if (result?._id) {
          navigate(ROUTES.BANK_DEPOSIT_SLIP_DETAILS(result._id), {
            replace: true,
          });
        }
      } catch (err) {
        setActionError(
          typeof err === "string" ? err : "Failed to create bank deposit slip."
        );
      }
    },
    [
      formData,
      totalAmount,
      denominations,
      validateForm,
      createBankDepositSlip,
      navigate,
      clearError,
      clearMessage,
    ]
  );

  const handleBack = useCallback(() => {
    navigate(ROUTES.BANK_DEPOSIT_SLIPS);
  }, [navigate]);

  const isSubmitting = createBankDepositSlipStatus === API_STATUS.LOADING;

  const pageProps = {
    formData,
    denominations,
    totalAmount,
    bankAccounts: bankAccounts || [],
    cashAccounts: cashAccounts || [],
    cashAccountOptions,
    bankAccountOptions,
    currentBranch,
    isSubmitting,
    formErrors,
    error: error || actionError,
    message,
    selectedCashAccount,
    availableDenominationsMap,
    handleChange,
    handleCashAccountChange,
    handleDenominationChange,
    handleFillAllAvailable,
    handleClearAll,
    handleSetMaxForDenom,
    handleSubmit,
    handleBack,
    clearFeedback: () => {
      clearError();
      clearMessage();
      setActionError("");
    },
  };

  return isMobile ? (
    <CreateBankDepositSlipMobilePage {...pageProps} />
  ) : (
    <CreateBankDepositSlipDesktopPage {...pageProps} />
  );
};

export default CreateBankDepositSlipPage;

