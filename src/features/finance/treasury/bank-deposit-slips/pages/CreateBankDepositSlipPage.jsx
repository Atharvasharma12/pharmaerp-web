import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import useBankAccount from "@/features/finance/treasury/bank-management/bank-accounts/hooks/useBankAccount";
import { useBranchCash } from "@/features/finance/treasury/cash-management/branch-cash/hooks/useBranchCash";
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
  toBankAccountId: "",
  depositBagReference: "",
  bankBranchName: "",
  narration: "",
  businessDayId: "",
};

const CreateBankDepositSlipPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentBranch } = useBranch();

  const prefillbusinessDayId = searchParams.get("businessDayId") || null;

  const {
    createBankDepositSlip,
    createBankDepositSlipStatus,
    error,
    clearError,
    message,
    clearMessage,
  } = useBankDepositSlip();

  const { bankAccounts = [], getBankAccounts } = useBankAccount();
  const { fetchBranchCash, currentBranchCash, frozenDenominations, frozenCash } = useBranchCash();

  const [formData, setFormData] = useState(() => ({
    ...INITIAL_FORM_DATA,
    businessDayId: prefillbusinessDayId || "",
  }));
  const [denominations, setDenominations] = useState(INITIAL_DENOMINATIONS);
  const [formErrors, setFormErrors] = useState({});
  const [actionError, setActionError] = useState("");

  const hasFetchedBanksRef = useRef(false);

  useEffect(() => {
    if (hasFetchedBanksRef.current) return;
    hasFetchedBanksRef.current = true;
    getBankAccounts({ all: true, isActive: true }).catch((err) =>
      console.error("Failed to load bank accounts:", err)
    );
  }, [getBankAccounts]);

  useEffect(() => {
    if (currentBranch?._id) {
      fetchBranchCash(currentBranch._id);
    }
  }, [currentBranch?._id, fetchBranchCash]);

  const availableDenominationsMap = useMemo(() => {
    const map = new Map();
    if (frozenDenominations) {
      for (const d of frozenDenominations) {
        map.set(d.denomination, d.quantity || 0);
      }
    }
    return map;
  }, [frozenDenominations]);

  const applyDenominationsFromAccount = useCallback(() => {
    if (frozenDenominations) {
      const balanceMap = new Map(
        frozenDenominations.map((d) => [d.denomination, d.quantity || 0])
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
  }, [frozenDenominations]);

  const totalAmount = useMemo(() => {
    return denominations.reduce(
      (sum, item) => sum + item.denomination * (item.quantity || 0),
      0
    );
  }, [denominations]);

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

  const handleFillAllAvailable = useCallback(() => {
    applyDenominationsFromAccount();
  }, [applyDenominationsFromAccount]);

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
    if (!formData.toBankAccountId)
      errors.toBankAccountId = "Bank account is required.";

    if (totalAmount <= 0) {
      errors.amount = "Deposit amount must be greater than zero.";
    } else if (totalAmount > (frozenCash || 0)) {
      errors.amount = "Insufficient frozen cash available.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, totalAmount, frozenCash]);

  const handleSubmit = useCallback(async () => {
    setActionError("");
    if (!validateForm()) {
      return;
    }

    // Filter out zero-quantity denominations
    const filteredDenominations = denominations.filter(
      (d) => (d.quantity || 0) > 0
    );

    const payload = {
      ...formData,
      branchId: currentBranch._id,
      amount: totalAmount,
      denominations: filteredDenominations,
      businessDayId: formData.businessDayId || null,
    };

    try {
      await createBankDepositSlip(payload);
      navigate(ROUTES.BANK_DEPOSIT_SLIPS, {
        state: { message: "Bank deposit slip created successfully." },
      });
    } catch (err) {
      setActionError(
        err?.message ||
        "Failed to create deposit slip."
      );
      console.error(err);
    }
  }, [
    validateForm,
    formData,
    totalAmount,
    denominations,
    currentBranch,
    createBankDepositSlip,
    navigate,
  ]);

  const handleBack = useCallback(() => {
    navigate(ROUTES.BANK_DEPOSIT_SLIPS);
  }, [navigate]);

  const clearFeedback = useCallback(() => {
    clearError();
    clearMessage();
    setActionError("");
  }, [clearError, clearMessage]);

  const combinedError = actionError || error;
  const isSubmitting = createBankDepositSlipStatus === API_STATUS.LOADING;

  const pageProps = {
    formData,
    denominations,
    totalAmount,
    bankAccounts,
    bankAccountOptions,
    availableDenominationsMap,
    currentBranch,
    frozenCash,
    isSubmitting,
    formErrors,
    error: combinedError,
    handleChange,
    handleDenominationChange,
    handleFillAllAvailable,
    handleClearAll,
    handleSetMaxForDenom,
    handleSubmit,
    handleBack,
    clearFeedback,
  };

  return isMobile ? (
    <CreateBankDepositSlipMobilePage {...pageProps} />
  ) : (
    <CreateBankDepositSlipDesktopPage {...pageProps} />
  );
};

export default CreateBankDepositSlipPage;
