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
import useBranchCash from "@/features/finance/treasury/cash-management/branch-cash/hooks/useBranchCash";
import useAccount from "@/features/finance/chart-of-accounts/accounts/hooks/useAccount";
import useBranch from "@/features/branch/hooks/useBranch";
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
  partition: "running",
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
  const { currentBranch } = useBranch();
  const hasFetchedCashRef = useRef(false);
  const hasFetchedAccountsRef = useRef(false);

  const {
    createCashTransaction,
    createCashTransactionStatus,
    error: serverError,
    clearError,
    clearMessage,
  } = useCashTransaction();

  const { currentBranchCash: branchCash, fetchBranchCash: getBranchCash } = useBranchCash();
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

  const selectedCashAccount = useMemo(() => {
    return branchCash;
  }, [branchCash]);

  // Fetch active branch cash on mount
  useEffect(() => {
    if (hasFetchedCashRef.current) return;
    if (currentBranch?._id) {
      hasFetchedCashRef.current = true;
      getBranchCash(currentBranch._id).catch((err) =>
        console.error("Failed to load branch cash for transaction:", err),
      );
    }
  }, [getBranchCash, currentBranch?._id]);

  // Fetch Chart of Accounts for counterparty selector
  useEffect(() => {
    if (hasFetchedAccountsRef.current) return;
    hasFetchedAccountsRef.current = true;

    getAccounts({ all: true, branchId: currentBranch?._id }).catch((err) =>
      console.error("Failed to load chart of accounts for transaction:", err),
    );
  }, [getAccounts, currentBranch?._id]);

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
      if (!formData.partition) {
        errors.partition = "Select the cash partition";
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

        // Outflow sufficiency check
        if (formData.direction === "DEBIT") {
          for (const fd of filteredDenoms) {
            const availableDenom = branchCash?.balance?.runningDenominations?.find(
              (ad) => ad.denomination === fd.denomination
            );
            const availableQty = availableDenom ? availableDenom.quantity : 0;
            if (fd.quantity > availableQty) {
              errors.denominations = `Cannot allocate more ₹${fd.denomination} notes than available in chest (${availableQty} available)`;
              break;
            }
          }
        }

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
        partition: formData.partition,
        transactionType: formData.transactionType,
        direction: formData.direction,
        amount: amtVal,
        denominations: filteredDenoms.length > 0 ? filteredDenoms : undefined,
        referenceNumber: formData.referenceNumber || null,
        narration: formData.narration || null,
        counterpartyAccountId: requiresCounterparty ? formData.counterpartyAccountId : undefined,
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
              : "Failed to record transaction.",
        });
      }
    },
    [formData, denominations, createCashTransaction, navigate, branchCash],
  );

  const filterAccounts = useMemo(() => {
    return accounts.map((acc) => ({
      label: `${acc.accountName} (${acc.accountCode})`,
      value: acc._id,
    }));
  }, [accounts]);

  const partitionOptions = useMemo(() => {
    return [
      { label: "Running Cash", value: "running" },
      { label: "Frozen Cash", value: "frozen" }
    ];
  }, []);

  const pageProps = {
    formData,
    formErrors,
    denominations,
    physicalTotal,
    isLoading,
    partitionOptions,
    filterAccounts,
    handleFieldChange,
    handleQtyChange,
    handleCancel,
    handleSubmit,
    serverError,
    clearError,
    selectedCashAccount,
  };

  return isMobile ? (
    <CreateCashTransactionMobilePage {...pageProps} />
  ) : (
    <CreateCashTransactionDesktopPage {...pageProps} />
  );
};

export default CreateCashTransactionPage;
