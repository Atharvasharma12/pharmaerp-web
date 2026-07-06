import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import useBankAccount from "@/features/finance/treasury/bank-management/bank-accounts/hooks/useBankAccount";
import useAccount from "@/features/finance/chart-of-accounts/accounts/hooks/useAccount";

import useCheque from "../hooks/useCheque";
import CreateChequeDesktopPage from "./desktop/CreateChequeDesktopPage";
import CreateChequeMobilePage from "./mobile/CreateChequeMobilePage";

const INITIAL_FORM_DATA = {
  chequeType: "RECEIVED",
  chequeNumber: "",
  chequeDate: new Date().toISOString().split("T")[0],
  bankAccountId: "",
  counterpartyAccountId: "",
  partyName: "",
  amount: "",
  narration: "",
};

const CreateChequePage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const {
    createCheque,
    createChequeStatus,
    error,
    clearError,
    message,
    clearMessage,
  } = useCheque();

  const { bankAccounts = [], getBankAccounts } = useBankAccount();
  const { accounts = [], getAccounts } = useAccount();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});
  const [actionError, setActionError] = useState("");

  const hasFetchedBanksRef = useRef(false);
  const hasFetchedAccountsRef = useRef(false);

  useEffect(() => {
    if (hasFetchedBanksRef.current) return;
    hasFetchedBanksRef.current = true;
    getBankAccounts({ all: true }).catch((err) =>
      console.error("Failed to load bank accounts:", err)
    );
  }, [getBankAccounts]);

  useEffect(() => {
    if (hasFetchedAccountsRef.current) return;
    hasFetchedAccountsRef.current = true;
    getAccounts({ all: true }).catch((err) =>
      console.error("Failed to load chart of accounts:", err)
    );
  }, [getAccounts]);

  useEffect(() => {
    return () => {
      clearError();
      clearMessage();
    };
  }, [clearError, clearMessage]);

  const handleInputChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }, [formErrors]);

  const bankOptions = useMemo(() => {
    return bankAccounts.map((b) => ({
      label: `${b.accountName || b.bankName || "Bank Account"} (${b.accountNumber || b.accountCode || ""})`,
      value: b._id,
    }));
  }, [bankAccounts]);

  const accountOptions = useMemo(() => {
    return accounts.map((a) => ({
      label: `${a.accountName} (${a.accountCode || ""})`,
      value: a._id,
    }));
  }, [accounts]);

  const validateForm = () => {
    const errors = {};
    if (!formData.chequeNumber) errors.chequeNumber = "Cheque number is required";
    if (!formData.chequeDate) errors.chequeDate = "Cheque date is required";
    if (!formData.bankAccountId) errors.bankAccountId = "Bank account is required";
    if (!formData.counterpartyAccountId) errors.counterpartyAccountId = "Counterparty account is required";
    if (!formData.partyName) errors.partyName = "Party/Payee name is required";

    const parsedAmount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      errors.amount = "Enter a valid positive amount";
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
        chequeType: formData.chequeType,
        chequeNumber: formData.chequeNumber,
        chequeDate: formData.chequeDate,
        bankAccountId: formData.bankAccountId,
        counterpartyAccountId: formData.counterpartyAccountId,
        partyName: formData.partyName,
        amount: parseFloat(formData.amount),
        narration: formData.narration || undefined,
      };

      await createCheque(payload);
      navigate(ROUTES.CHEQUES);
    } catch (err) {
      setActionError(typeof err === "string" ? err : "Failed to record cheque entry.");
    }
  };

  const handleCancel = useCallback(() => {
    navigate(ROUTES.CHEQUES);
  }, [navigate]);

  const isSubmitting = createChequeStatus === API_STATUS.LOADING;

  const pageProps = {
    formData,
    formErrors,
    bankOptions,
    accountOptions,
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
    <CreateChequeMobilePage {...pageProps} />
  ) : (
    <CreateChequeDesktopPage {...pageProps} />
  );
};

export default CreateChequePage;
