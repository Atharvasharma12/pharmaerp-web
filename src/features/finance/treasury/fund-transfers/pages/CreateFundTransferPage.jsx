import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import useBankAccount from "@/features/finance/treasury/bank-management/bank-accounts/hooks/useBankAccount";
import useCashAccount from "@/features/finance/treasury/cash-management/cash-accounts/hooks/useCashAccount";

import useFundTransfer from "../hooks/useFundTransfer";
import CreateFundTransferDesktopPage from "./desktop/CreateFundTransferDesktopPage";
import CreateFundTransferMobilePage from "./mobile/CreateFundTransferMobilePage";

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

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});
  const [actionError, setActionError] = useState("");

  const hasFetchedBanksRef = useRef(false);
  const hasFetchedCashRef = useRef(false);

  useEffect(() => {
    if (hasFetchedBanksRef.current) return;
    hasFetchedBanksRef.current = true;
    getBankAccounts({ all: true }).catch((err) =>
      console.error("Failed to load bank accounts:", err)
    );
  }, [getBankAccounts]);

  useEffect(() => {
    if (hasFetchedCashRef.current) return;
    hasFetchedCashRef.current = true;
    getCashAccounts({ all: true }).catch((err) =>
      console.error("Failed to load cash accounts:", err)
    );
  }, [getCashAccounts]);

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

  const validateForm = () => {
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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setActionError("");

    if (!validateForm()) return;

    try {
      const payload = {
        transferDate: formData.transferDate,
        fromAccountType: formData.fromAccountType,
        fromAccountId: formData.fromAccountId,
        toAccountType: formData.toAccountType,
        toAccountId: formData.toAccountId,
        amount: parseFloat(formData.amount),
        referenceNumber: formData.referenceNumber || undefined,
        narration: formData.narration || undefined,
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

  const pageProps = {
    formData,
    formErrors,
    sourceOptions,
    destinationOptions,
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
  };

  return isMobile ? (
    <CreateFundTransferMobilePage {...pageProps} />
  ) : (
    <CreateFundTransferDesktopPage {...pageProps} />
  );
};

export default CreateFundTransferPage;
