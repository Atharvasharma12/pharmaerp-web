import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import useBankAccount from "@/features/finance/treasury/bank-management/bank-accounts/hooks/useBankAccount";
import useCashAccount from "@/features/finance/treasury/cash-management/cash-accounts/hooks/useCashAccount";
import useBranch from "@/features/branch/hooks/useBranch";

import useFundTransfer from "../hooks/useFundTransfer";
import CreateFundTransferDesktopPage from "./desktop/CreateFundTransferDesktopPage";
import CreateFundTransferMobilePage from "./mobile/CreateFundTransferMobilePage";

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
  transferDate: new Date().toISOString().split("T")[0],
  fromAccountType: "BANK",
  fromAccountId: "",
  toAccountType: "BANK",
  toAccountId: "",
  amount: "",
  referenceNumber: "",
  narration: "",
};

const CreateFundTransferPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentBranch } = useBranch();

  // Shift / Day Closing pre-fill from query params (set by ShiftsPage and DayClosingsPage)
  const prefillShiftId       = searchParams.get("shiftId")       || null;
  const prefillDayClosingId  = searchParams.get("dayClosingId")  || null;
  const prefillCashAccountId = searchParams.get("cashAccountId") || null;

  const {
    createFundTransfer,
    createFundTransferStatus,
    error,
    clearError,
    message,
    clearMessage,
  } = useFundTransfer();

  const { bankAccounts = [], getBankAccounts } = useBankAccount();
  const { cashAccounts = [], getCashAccounts } = useCashAccount();

  const [formData, setFormData] = useState(() => ({
    ...INITIAL_FORM_DATA,
    // Pre-fill source type to CASH when coming from a shift context
    fromAccountType: prefillCashAccountId ? "CASH" : "BANK",
    fromAccountId:   prefillCashAccountId || "",
  }));
  const [fromDenominations, setFromDenominations] = useState(INITIAL_DENOMINATIONS);
  const [toDenominations, setToDenominations] = useState(INITIAL_DENOMINATIONS);
  const [formErrors, setFormErrors] = useState({});
  const [actionError, setActionError] = useState("");

  // When cash accounts load and we have a pre-fill cashAccountId, ensure it's set
  useEffect(() => {
    if (prefillCashAccountId && cashAccounts.length > 0) {
      const found = cashAccounts.find((c) => c._id === prefillCashAccountId);
      if (found) {
        setFormData((prev) => ({
          ...prev,
          fromAccountType: "CASH",
          fromAccountId: prefillCashAccountId,
        }));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cashAccounts.length, prefillCashAccountId]);

  const handleFromQtyChange = useCallback((denomValue, qty) => {
    const cleanQty = Math.max(0, parseInt(qty) || 0);
    setFromDenominations((prev) =>
      prev.map((d) => (d.denomination === denomValue ? { ...d, quantity: cleanQty } : d))
    );
  }, []);

  const handleToQtyChange = useCallback((denomValue, qty) => {
    const cleanQty = Math.max(0, parseInt(qty) || 0);
    setToDenominations((prev) =>
      prev.map((d) => (d.denomination === denomValue ? { ...d, quantity: cleanQty } : d))
    );
  }, []);

  const fromPhysicalTotal = useMemo(() => {
    return fromDenominations.reduce((acc, curr) => acc + curr.denomination * curr.quantity, 0);
  }, [fromDenominations]);

  const toPhysicalTotal = useMemo(() => {
    return toDenominations.reduce((acc, curr) => acc + curr.denomination * curr.quantity, 0);
  }, [toDenominations]);

  const hasFetchedBanksRef = useRef(false);
  const hasFetchedCashRef = useRef(false);

  useEffect(() => {
    if (hasFetchedBanksRef.current) return;
    hasFetchedBanksRef.current = true;
    getBankAccounts({ all: true, branchId: currentBranch?._id }).catch((err) =>
      console.error("Failed to load bank accounts:", err)
    );
  }, [getBankAccounts, currentBranch?._id]);

  useEffect(() => {
    if (hasFetchedCashRef.current) return;
    hasFetchedCashRef.current = true;
    getCashAccounts({ all: true, branchId: currentBranch?._id }).catch((err) =>
      console.error("Failed to load cash accounts:", err)
    );
  }, [getCashAccounts, currentBranch?._id]);

  useEffect(() => {
    return () => {
      clearError();
      clearMessage();
    };
  }, [clearError, clearMessage]);

  const handleInputChange = useCallback((name, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Reset account selection if type changes
      if (name === "fromAccountType") updated.fromAccountId = "";
      if (name === "toAccountType") updated.toAccountId = "";
      return updated;
    });

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }, [formErrors]);

  const sourceOptions = useMemo(() => {
    if (formData.fromAccountType === "BANK") {
      return bankAccounts.map((b) => ({
        label: `${b.accountName || b.bankName || "Bank Account"} (${b.accountNumber || b.accountCode || ""})`,
        value: b._id,
      }));
    }
    return cashAccounts.map((c) => ({
      label: c.accountName || "Cash Account",
      value: c._id,
    }));
  }, [formData.fromAccountType, bankAccounts, cashAccounts]);

  const destinationOptions = useMemo(() => {
    if (formData.toAccountType === "BANK") {
      return bankAccounts.map((b) => ({
        label: `${b.accountName || b.bankName || "Bank Account"} (${b.accountNumber || b.accountCode || ""})`,
        value: b._id,
      }));
    }
    return cashAccounts.map((c) => ({
      label: c.accountName || "Cash Account",
      value: c._id,
    }));
  }, [formData.toAccountType, bankAccounts, cashAccounts]);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setActionError("");

    const errors = {};
    if (!formData.transferDate) errors.transferDate = "Transfer date is required";
    if (!formData.fromAccountId) errors.fromAccountId = "Source account is required";
    if (!formData.toAccountId) errors.toAccountId = "Destination account is required";

    const parsedAmount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      errors.amount = "Enter a valid positive transfer amount";
    }

    if (
      formData.fromAccountType === formData.toAccountType &&
      formData.fromAccountId === formData.toAccountId &&
      formData.fromAccountId
    ) {
      errors.toAccountId = "Destination account must be different from source account";
    }

    // Validate fromDenominations if source is CASH and any quantities are entered
    let filteredFromDenoms = [];
    if (formData.fromAccountType === "CASH" && !isNaN(parsedAmount) && parsedAmount > 0) {
      const hasFromDenoms = fromDenominations.some((d) => d.quantity > 0);
      if (hasFromDenoms) {
        filteredFromDenoms = fromDenominations
          .filter((d) => d.quantity > 0)
          .map((d) => ({
            denomination: Number(d.denomination),
            quantity: Number(d.quantity),
          }));

        // Outflow sufficiency check
        const selectedFromCashAccount = cashAccounts.find((c) => c._id === formData.fromAccountId);
        for (const fd of filteredFromDenoms) {
          const availableDenom = selectedFromCashAccount?.denominationBalance?.denominations?.find(
            (ad) => ad.denomination === fd.denomination
          );
          const availableQty = availableDenom ? availableDenom.quantity : 0;
          if (fd.quantity > availableQty) {
            errors.fromDenominations = `Cannot allocate more ₹${fd.denomination} notes than available in source chest (${availableQty} available)`;
            break;
          }
        }

        const total = filteredFromDenoms.reduce((sum, d) => sum + d.denomination * d.quantity, 0);
        if (total !== parsedAmount) {
          errors.fromDenominations = `Source denomination total (₹${total}) must match transfer amount (₹${parsedAmount})`;
        }
      }
    }

    // Validate toDenominations if destination is CASH and any quantities are entered
    let filteredToDenoms = [];
    if (formData.toAccountType === "CASH" && !isNaN(parsedAmount) && parsedAmount > 0) {
      const hasToDenoms = toDenominations.some((d) => d.quantity > 0);
      if (hasToDenoms) {
        filteredToDenoms = toDenominations
          .filter((d) => d.quantity > 0)
          .map((d) => ({
            denomination: Number(d.denomination),
            quantity: Number(d.quantity),
          }));
        const total = filteredToDenoms.reduce((sum, d) => sum + d.denomination * d.quantity, 0);
        if (total !== parsedAmount) {
          errors.toDenominations = `Destination denomination total (₹${total}) must match transfer amount (₹${parsedAmount})`;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const payload = {
        transferDate: formData.transferDate,
        fromAccountType: formData.fromAccountType,
        fromAccountId: formData.fromAccountId,
        toAccountType: formData.toAccountType,
        toAccountId: formData.toAccountId,
        amount: parsedAmount,
        fromDenominations: filteredFromDenoms.length > 0 ? filteredFromDenoms : undefined,
        toDenominations: filteredToDenoms.length > 0 ? filteredToDenoms : undefined,
        referenceNumber: formData.referenceNumber || undefined,
        narration: formData.narration || undefined,
        // Pass shiftId or dayClosingId so backend can directly store the link
        shiftId: prefillShiftId || undefined,
        dayClosingId: prefillDayClosingId || undefined,
      };

      await createFundTransfer(payload);
      navigate(ROUTES.FUND_TRANSFERS);
    } catch (err) {
      setActionError(typeof err === "string" ? err : "Failed to record fund transfer.");
    }
  };

  const handleCancel = useCallback(() => {
    navigate(ROUTES.FUND_TRANSFERS);
  }, [navigate]);

  const isSubmitting = createFundTransferStatus === API_STATUS.LOADING;

  const selectedFromCashAccount = useMemo(() => {
    if (formData.fromAccountType !== "CASH") return null;
    return cashAccounts.find((c) => c._id === formData.fromAccountId);
  }, [cashAccounts, formData.fromAccountType, formData.fromAccountId]);

  const pageProps = {
    formData,
    formErrors,
    sourceOptions,
    destinationOptions,
    fromDenominations,
    toDenominations,
    fromPhysicalTotal,
    toPhysicalTotal,
    handleFromQtyChange,
    handleToQtyChange,
    isSubmitting,
    error: error || actionError,
    message,
    clearFeedback: () => {
      clearError();
      clearMessage();
      setActionError("");
    },
    handleInputChange,
    handleSubmit,
    handleCancel,
    selectedFromCashAccount,
  };

  return isMobile ? (
    <CreateFundTransferMobilePage {...pageProps} />
  ) : (
    <CreateFundTransferDesktopPage {...pageProps} />
  );
};

export default CreateFundTransferPage;
