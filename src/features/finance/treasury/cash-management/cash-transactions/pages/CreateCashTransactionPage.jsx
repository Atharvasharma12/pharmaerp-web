import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES, API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useCashTransaction from "../hooks/useCashTransaction";
import useCashAccount from "@/features/finance/treasury/cash-management/cash-accounts/hooks/useCashAccount";
import useAccount from "@/features/finance/chart-of-accounts/accounts/hooks/useAccount";
import CreateCashTransactionDesktopPage from "./desktop/CreateCashTransactionDesktopPage";
import CreateCashTransactionMobilePage from "./mobile/CreateCashTransactionMobilePage";

const INITIAL_FORM_DATA = {
  transactionDate: new Date().toISOString().split("T")[0],
  cashAccountId: "",
  transactionType: "",
  direction: "",
  amount: "",
  referenceNumber: "",
  narration: "",
  counterpartyAccountId: "",
  status: "DRAFT",
};

const CreateCashTransactionPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const hasFetchedCashRef = useRef(false);
  const hasFetchedAccountsRef = useRef(false);

  const {
    createCashTransaction,
    createCashTransactionStatus,
    error: serverError,
    clearError,
    clearMessage,
  } = useCashTransaction();

  const { cashAccounts, getCashAccounts } = useCashAccount();
  const { accounts, getAccounts } = useAccount();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  // Fetch active cash accounts on mount
  useEffect(() => {
    if (hasFetchedCashRef.current) return;
    hasFetchedCashRef.current = true;

    getCashAccounts({ all: true }).catch((err) =>
      console.error("Failed to load cash accounts for transaction:", err)
    );
  }, [getCashAccounts]);

  // Fetch Chart of Accounts for counterparty selector
  useEffect(() => {
    if (hasFetchedAccountsRef.current) return;
    hasFetchedAccountsRef.current = true;

    getAccounts({ all: true }).catch((err) =>
      console.error("Failed to load chart of accounts for transaction:", err)
    );
  }, [getAccounts]);

  // Clean up notices on unmount
  useEffect(() => {
    return () => {
      clearError();
      clearMessage();
    };
  }, [clearError, clearMessage]);

  const isLoading = createCashTransactionStatus === API_STATUS.LOADING;

  const handleFieldChange = useCallback((name, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto-set direction for specific cash transaction types
      if (name === "transactionType") {
        if (value === "CASH_IN") {
          updated.direction = "CREDIT";
        } else if (
          value === "CASH_OUT" ||
          value === "EXPENSE" ||
          value === "PETTY_CASH"
        ) {
          updated.direction = "DEBIT";
        }
      }

      return updated;
    });

    setFormErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
  }, []);

  const handleCancel = useCallback(() => {
    navigate(ROUTES.CASH_TRANSACTIONS);
  }, [navigate]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      const errors = {};

      if (!formData.transactionDate) {
        errors.transactionDate = "Select the transaction date";
      }
      if (!formData.cashAccountId) {
        errors.cashAccountId = "Select the cash account";
      }
      if (!formData.transactionType) {
        errors.transactionType = "Select the transaction type";
      }
      if (!formData.direction) {
        errors.direction = "Select the flow direction";
      }

      const amtVal = parseFloat(formData.amount);
      if (isNaN(amtVal) || amtVal <= 0) {
        errors.amount = "Amount must be a positive number greater than zero";
      }

      // Counterparty ledger account validation
      const requiresCounterparty =
        formData.transactionType &&
        formData.transactionType !== "EXPENSE" &&
        formData.transactionType !== "PETTY_CASH";

      if (requiresCounterparty && !formData.counterpartyAccountId) {
        errors.counterpartyAccountId = `Counterparty account is required for transaction type: ${formData.transactionType}`;
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      const payload = {
        transactionDate: new Date(formData.transactionDate).toISOString(),
        cashAccountId: formData.cashAccountId,
        transactionType: formData.transactionType,
        direction: formData.direction,
        amount: amtVal,
        referenceNumber: String(formData.referenceNumber || "").trim() || null,
        narration: String(formData.narration || "").trim() || null,
        counterpartyAccountId: requiresCounterparty ? formData.counterpartyAccountId : null,
        status: formData.status,
      };

      try {
        await createCashTransaction(payload);
        navigate(ROUTES.CASH_TRANSACTIONS);
      } catch (err) {
        setFormErrors({
          submit: typeof err === "string" ? err : "Failed to record Cash Transaction.",
        });
      }
    },
    [formData, createCashTransaction, navigate]
  );

  const pageProps = {
    formData,
    formErrors,
    cashAccounts: cashAccounts || [],
    accounts: accounts || [],
    isLoading,
    handleFieldChange,
    handleCancel,
    handleSubmit,
    serverError,
    clearError,
  };

  return isMobile ? (
    <CreateCashTransactionMobilePage {...pageProps} />
  ) : (
    <CreateCashTransactionDesktopPage {...pageProps} />
  );
};

export default CreateCashTransactionPage;
