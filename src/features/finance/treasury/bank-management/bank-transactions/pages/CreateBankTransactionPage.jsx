import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES, API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useBankTransaction from "../hooks/useBankTransaction";
import useBankAccount from "@/features/finance/treasury/bank-management/bank-accounts/hooks/useBankAccount";
import useAccount from "@/features/finance/chart-of-accounts/accounts/hooks/useAccount";
import CreateBankTransactionDesktopPage from "./desktop/CreateBankTransactionDesktopPage";
import CreateBankTransactionMobilePage from "./mobile/CreateBankTransactionMobilePage";

const INITIAL_FORM_DATA = {
  transactionDate: new Date().toISOString().split("T")[0],
  bankAccountId: "",
  transactionType: "",
  direction: "",
  amount: "",
  referenceNumber: "",
  narration: "",
  counterpartyAccountId: "",
  status: "DRAFT",
};

const CreateBankTransactionPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const hasFetchedBanksRef = useRef(false);
  const hasFetchedAccountsRef = useRef(false);

  const {
    createBankTransaction,
    createBankTransactionStatus,
    error: serverError,
    clearError,
    clearMessage,
  } = useBankTransaction();

  const { bankAccounts, getBankAccounts } = useBankAccount();
  const { accounts, getAccounts } = useAccount();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  // Fetch active bank accounts on mount
  useEffect(() => {
    if (hasFetchedBanksRef.current) return;
    hasFetchedBanksRef.current = true;

    getBankAccounts({ all: true }).catch((err) =>
      console.error("Failed to load bank accounts for create transaction:", err)
    );
  }, [getBankAccounts]);

  // Fetch Chart of Accounts for counterparty selector
  useEffect(() => {
    if (hasFetchedAccountsRef.current) return;
    hasFetchedAccountsRef.current = true;

    getAccounts({ all: true }).catch((err) =>
      console.error("Failed to load chart of accounts for create transaction:", err)
    );
  }, [getAccounts]);

  // Clean up notices on unmount
  useEffect(() => {
    return () => {
      clearError();
      clearMessage();
    };
  }, [clearError, clearMessage]);

  const isLoading = createBankTransactionStatus === API_STATUS.LOADING;

  const handleFieldChange = useCallback((name, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto-set direction for specific transaction types
      if (name === "transactionType") {
        if (value === "DEPOSIT" || value === "INTEREST") {
          updated.direction = "CREDIT";
        } else if (value === "WITHDRAWAL" || value === "BANK_CHARGES") {
          updated.direction = "DEBIT";
        }
      }

      return updated;
    });

    setFormErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
  }, []);

  const handleCancel = useCallback(() => {
    navigate(ROUTES.BANK_TRANSACTIONS);
  }, [navigate]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      const errors = {};

      if (!formData.transactionDate) {
        errors.transactionDate = "Select the transaction date";
      }
      if (!formData.bankAccountId) {
        errors.bankAccountId = "Select the bank account";
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
        formData.transactionType !== "BANK_CHARGES" &&
        formData.transactionType !== "INTEREST";

      if (requiresCounterparty && !formData.counterpartyAccountId) {
        errors.counterpartyAccountId = `Counterparty account is required for transaction type: ${formData.transactionType}`;
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      const payload = {
        transactionDate: new Date(formData.transactionDate).toISOString(),
        bankAccountId: formData.bankAccountId,
        transactionType: formData.transactionType,
        direction: formData.direction,
        amount: amtVal,
        referenceNumber: String(formData.referenceNumber || "").trim() || null,
        narration: String(formData.narration || "").trim() || null,
        counterpartyAccountId: requiresCounterparty ? formData.counterpartyAccountId : null,
        status: formData.status,
      };

      try {
        await createBankTransaction(payload);
        navigate(ROUTES.BANK_TRANSACTIONS);
      } catch (err) {
        setFormErrors({
          submit: typeof err === "string" ? err : "Failed to record Bank Transaction.",
        });
      }
    },
    [formData, createBankTransaction, navigate]
  );

  const pageProps = {
    formData,
    formErrors,
    bankAccounts: bankAccounts || [],
    accounts: accounts || [],
    isLoading,
    handleFieldChange,
    handleCancel,
    handleSubmit,
    serverError,
    clearError,
  };

  return isMobile ? (
    <CreateBankTransactionMobilePage {...pageProps} />
  ) : (
    <CreateBankTransactionDesktopPage {...pageProps} />
  );
};

export default CreateBankTransactionPage;
