import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import useCashAccount from "@/features/finance/treasury/cash-management/cash-accounts/hooks/useCashAccount";

import useCashDenomination from "../hooks/useCashDenomination";
import CreateCashDenominationDesktopPage from "./desktop/CreateCashDenominationDesktopPage";
import CreateCashDenominationMobilePage from "./mobile/CreateCashDenominationMobilePage";

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
  cashAccountId: "",
  countDate: new Date().toISOString().split("T")[0],
  expectedBalance: 0,
  narration: "",
};

const CreateCashDenominationPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const {
    createCashDenomination,
    createCashDenominationStatus,
    error,
    clearError,
    message,
    clearMessage,
  } = useCashDenomination();

  const { cashAccounts = [], getCashAccounts } = useCashAccount();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [denominations, setDenominations] = useState(INITIAL_DENOMINATIONS);
  const [formErrors, setFormErrors] = useState({});
  const [actionError, setActionError] = useState("");

  const hasFetchedBanksRef = useRef(false);

  useEffect(() => {
    if (hasFetchedBanksRef.current) return;
    hasFetchedBanksRef.current = true;
    getCashAccounts({ all: true }).catch((err) =>
      console.error("Failed to load cash accounts for create count:", err)
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

      // Auto-set expected balance if cash account is selected
      if (name === "cashAccountId") {
        const acc = cashAccounts.find((c) => c._id === value);
        updated.expectedBalance = acc ? acc.balance || 0 : 0;
      }

      return updated;
    });

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }, [formErrors, cashAccounts]);

  const handleQtyChange = useCallback((denomValue, qty) => {
    const cleanQty = Math.max(0, parseInt(qty) || 0);
    setDenominations((prev) =>
      prev.map((d) => (d.denomination === denomValue ? { ...d, quantity: cleanQty } : d))
    );
  }, []);

  const physicalTotal = useMemo(() => {
    return denominations.reduce((acc, curr) => acc + curr.denomination * curr.quantity, 0);
  }, [denominations]);

  const variance = useMemo(() => {
    return physicalTotal - Number(formData.expectedBalance || 0);
  }, [physicalTotal, formData.expectedBalance]);

  const cashAccountOptions = useMemo(() => {
    return cashAccounts.map((c) => ({
      label: `${c.accountName || "Cash Account"} (Balance: ₹${Number(c.balance || 0).toLocaleString("en-IN")})`,
      value: c._id,
    }));
  }, [cashAccounts]);

  const validateForm = () => {
    const errors = {};
    if (!formData.cashAccountId) errors.cashAccountId = "Cash account selection is required";
    if (!formData.countDate) errors.countDate = "Count date is required";

    if (physicalTotal <= 0) {
      errors.denominations = "Total physical counted amount must be greater than zero";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setActionError("");

    if (!validateForm()) return;

    try {
      // Filter out lines with zero quantity to send to the backend
      const filteredDenoms = denominations
        .filter((d) => d.quantity > 0)
        .map((d) => ({
          denomination: d.denomination,
          quantity: d.quantity,
        }));

      const payload = {
        cashAccountId: formData.cashAccountId,
        countDate: formData.countDate,
        expectedBalance: Number(formData.expectedBalance) || 0,
        denominations: filteredDenoms,
        narration: formData.narration || undefined,
      };

      await createCashDenomination(payload);
      navigate(ROUTES.CASH_DENOMINATIONS);
    } catch (err) {
      setActionError(typeof err === "string" ? err : "Failed to record cash count.");
    }
  };

  const handleCancel = useCallback(() => {
    navigate(ROUTES.CASH_DENOMINATIONS);
  }, [navigate]);

  const isSubmitting = createCashDenominationStatus === API_STATUS.LOADING;

  const pageProps = {
    formData,
    formErrors,
    denominations,
    physicalTotal,
    variance,
    cashAccountOptions,
    isSubmitting,
    error: error || actionError,
    message,
    clearFeedback: () => {
      clearError();
      clearMessage();
      setActionError("");
    },
    handleInputChange,
    handleQtyChange,
    handleSubmit,
    handleCancel,
  };

  return isMobile ? (
    <CreateCashDenominationMobilePage {...pageProps} />
  ) : (
    <CreateCashDenominationDesktopPage {...pageProps} />
  );
};

export default CreateCashDenominationPage;
