import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import useBranchCash from "@/features/finance/treasury/cash-management/branch-cash/hooks/useBranchCash";
import useBranch from "@/features/branch/hooks/useBranch";

import useCashExchange from "../hooks/useCashExchange";
import CreateCashExchangeDesktopPage from "./desktop/CreateCashExchangeDesktopPage";
import CreateCashExchangeMobilePage from "./mobile/CreateCashExchangeMobilePage";

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
  exchangeDate: new Date().toISOString().split("T")[0],
  partition: "running",
  narration: "",
  notes: "",
};

const CreateCashExchangePage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { currentBranch } = useBranch();

  const {
    createCashExchange,
    createCashExchangeStatus,
    error,
    clearError,
    message,
    clearMessage,
  } = useCashExchange();

  const { currentBranchCash: branchCash, fetchBranchCash: getBranchCash } = useBranchCash();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  // Denominations the customer hands IN to us (bigger notes)
  const [receivedDenominations, setReceivedDenominations] =
    useState(INITIAL_DENOMINATIONS);
  // Denominations we give OUT to the customer (smaller change)
  const [givenDenominations, setGivenDenominations] =
    useState(INITIAL_DENOMINATIONS);
  const [formErrors, setFormErrors] = useState({});
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    if (currentBranch?._id) {
      getBranchCash(currentBranch._id).catch((err) =>
        console.error("Failed to load branch cash:", err),
      );
    }
  }, [getBranchCash, currentBranch?._id]);

  useEffect(() => {
    // Reset denominations when partition changes to avoid violating available bounds
    setGivenDenominations(INITIAL_DENOMINATIONS);
    setReceivedDenominations(INITIAL_DENOMINATIONS);
  }, [formData.partition]);

  useEffect(() => {
    return () => {
      clearError();
      clearMessage();
    };
  }, [clearError, clearMessage]);

  const handleReceivedQtyChange = useCallback((denomValue, qty) => {
    const cleanQty = Math.max(0, parseInt(qty) || 0);
    setReceivedDenominations((prev) =>
      prev.map((d) =>
        d.denomination === denomValue ? { ...d, quantity: cleanQty } : d,
      ),
    );
  }, []);

  const handleGivenQtyChange = useCallback((denomValue, qty) => {
    const cleanQty = Math.max(0, parseInt(qty) || 0);
    setGivenDenominations((prev) =>
      prev.map((d) =>
        d.denomination === denomValue ? { ...d, quantity: cleanQty } : d,
      ),
    );
  }, []);

  const totalReceived = useMemo(
    () =>
      receivedDenominations.reduce(
        (acc, d) => acc + d.denomination * d.quantity,
        0,
      ),
    [receivedDenominations],
  );

  const totalGiven = useMemo(
    () =>
      givenDenominations.reduce(
        (acc, d) => acc + d.denomination * d.quantity,
        0,
      ),
    [givenDenominations],
  );

  const isBalanced = totalReceived > 0 && totalReceived === totalGiven;

  const partitionOptions = useMemo(
    () => {
      const runningBalance = branchCash?.denominationBalance?.runningDenominations?.reduce(
        (acc, d) => acc + d.denomination * d.quantity, 0
      ) || 0;
      const frozenBalance = branchCash?.denominationBalance?.frozenDenominations?.reduce(
        (acc, d) => acc + d.denomination * d.quantity, 0
      ) || 0;

      return [
        { label: `Running Cash (Available: ₹${runningBalance.toLocaleString("en-IN")})`, value: "running" },
        { label: `Frozen Cash (Available: ₹${frozenBalance.toLocaleString("en-IN")})`, value: "frozen" }
      ];
    },
    [branchCash],
  );

  const selectedCashAccount = branchCash;

  const handleInputChange = useCallback(
    (name, value) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [formErrors],
  );

  const validate = () => {
    const errors = {};

    if (!formData.exchangeDate)
      errors.exchangeDate = "Exchange date is required";
    if (!formData.partition)
      errors.partition = "Cash partition is required";

    const filteredReceived = receivedDenominations.filter((d) => d.quantity > 0);
    const filteredGiven = givenDenominations.filter((d) => d.quantity > 0);

    if (filteredReceived.length === 0) {
      errors.receivedDenominations =
        "Enter at least one denomination received from the customer";
    }

    if (filteredGiven.length === 0) {
      errors.givenDenominations =
        "Enter at least one denomination to give to the customer";
    }

    if (
      filteredReceived.length > 0 &&
      filteredGiven.length > 0 &&
      totalReceived !== totalGiven
    ) {
      errors.balance = `Exchange is imbalanced: received ₹${totalReceived} ≠ given ₹${totalGiven}. Both sides must be equal.`;
    }

    // Pre-flight: check drawer has enough of what we want to give
    if (filteredGiven.length > 0 && selectedCashAccount) {
      const availableDenoms =
        (formData.partition === "running" ? selectedCashAccount?.balance?.runningDenominations : selectedCashAccount?.balance?.frozenDenominations) || [];
      for (const gd of filteredGiven) {
        const available = availableDenoms.find(
          (ad) => ad.denomination === gd.denomination,
        );
        const availableQty = available ? available.quantity : 0;
        if (gd.quantity > availableQty) {
          errors.givenDenominations = `Not enough ₹${gd.denomination} notes in drawer — only ${availableQty} available`;
          break;
        }
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setActionError("");

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const payload = {
        exchangeDate: formData.exchangeDate,
        cashPartition: formData.partition,
        denominationsReceived: receivedDenominations
          .filter((d) => d.quantity > 0)
          .map((d) => ({ denomination: d.denomination, quantity: d.quantity })),
        denominationsGiven: givenDenominations
          .filter((d) => d.quantity > 0)
          .map((d) => ({ denomination: d.denomination, quantity: d.quantity })),
        narration: formData.narration || undefined,
        notes: formData.notes || undefined,
      };

      await createCashExchange(payload);
      navigate(ROUTES.CASH_EXCHANGES);
    } catch (err) {
      setActionError(
        typeof err === "string" ? err : "Failed to record cash exchange.",
      );
    }
  };

  const handleCancel = useCallback(
    () => navigate(ROUTES.CASH_EXCHANGES),
    [navigate],
  );

  const isSubmitting = createCashExchangeStatus === API_STATUS.LOADING;

  const pageProps = {
    formData,
    formErrors,
    partitionOptions,
    selectedCashAccount,
    receivedDenominations,
    givenDenominations,
    totalReceived,
    totalGiven,
    isBalanced,
    handleReceivedQtyChange,
    handleGivenQtyChange,
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
    <CreateCashExchangeMobilePage {...pageProps} />
  ) : (
    <CreateCashExchangeDesktopPage {...pageProps} />
  );
};

export default CreateCashExchangePage;
