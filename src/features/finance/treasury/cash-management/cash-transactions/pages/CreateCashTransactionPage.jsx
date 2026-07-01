import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES, API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useCashTransaction from "../hooks/useCashTransaction";
import useCashAccount from "@/features/finance/treasury/cash-management/cash-accounts/hooks/useCashAccount";
import useAccount from "@/features/finance/chart-of-accounts/accounts/hooks/useAccount";
import CreateCashTransactionDesktopPage from "./desktop/CreateCashTransactionDesktopPage";
import CreateCashTransactionMobilePage from "./mobile/CreateCashTransactionMobilePage";

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
  const [denominations, setDenominations] = useState(INITIAL_DENOMINATIONS);
  const [formErrors, setFormErrors] = useState({});

  const handleQtyChange = useCallback((denomValue, qty) => {
    const cleanQty = Math.max(0, parseInt(qty) || 0);
    setDenominations((prev) =>
      prev.map((d) =>
        d.denomination === denomValue ? { ...d, quantity: cleanQty } : d,
      ),
    );
  }, []);

  const physicalTotal = useMemo(() => {
    return denominations.reduce(
      (acc, curr) => acc + curr.denomination * curr.quantity,
      0,
    );
  }, [denominations]);

  // Fetch active cash accounts on mount
  useEffect(() => {
    if (hasFetchedCashRef.current) return;
    hasFetchedCashRef.current = true;

    getCashAccounts({ all: true }).catch((err) =>
      console.error("Failed to load cash accounts for transaction:", err),
    );
  }, [getCashAccounts]);

  // Fetch Chart of Accounts for counterparty selector
  useEffect(() => {
    if (hasFetchedAccountsRef.current) return;
    hasFetchedAccountsRef.current = true;

    getAccounts({ all: true }).catch((err) =>
      console.error("Failed to load chart of accounts for transaction:", err),
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

      let filteredDenoms = [];
      const hasDenoms = denominations.some((d) => d.quantity > 0);
      if (hasDenoms) {
        filteredDenoms = denominations
          .filter((d) => d.quantity > 0)
          .map((d) => ({
            denomination: Number(d.denomination),
            quantity: Number(d.quantity),
          }));
        const total = filteredDenoms.reduce(
          (sum, d) => sum + d.denomination * d.quantity,
          0,
        );
        if (total !== amtVal) {
          errors.denominations = `Denomination total (₹${total}) must match transaction amount (₹${amtVal})`;
        }
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
        denominations: filteredDenoms.length > 0 ? filteredDenoms : undefined,
        referenceNumber: String(formData.referenceNumber || "").trim() || null,
        narration: String(formData.narration || "").trim() || null,
        counterpartyAccountId: requiresCounterparty
          ? formData.counterpartyAccountId
          : null,
        status: formData.status,
      };

      try {
        await createCashTransaction(payload);
        navigate(ROUTES.CASH_TRANSACTIONS);
      } catch (err) {
        setFormErrors({
          submit:
            typeof err === "string"
              ? err
              : "Failed to record Cash Transaction.",
        });
      }
    },
    [formData, denominations, createCashTransaction, navigate],
  );

  const pageProps = {
    formData,
    formErrors,
    denominations,
    physicalTotal,
    handleQtyChange,
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
