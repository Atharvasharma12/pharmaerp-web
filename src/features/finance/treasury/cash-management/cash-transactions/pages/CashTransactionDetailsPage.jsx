import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useCashTransaction from "../hooks/useCashTransaction";
import CashTransactionDetailsDesktopPage from "./desktop/CashTransactionDetailsDesktopPage";
import CashTransactionDetailsMobilePage from "./mobile/CashTransactionDetailsMobilePage";

const CashTransactionDetailsPage = () => {
  const navigate = useNavigate();
  const { cashTransactionId } = useParams();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(null);

  const {
    managedCashTransaction,
    getCashTransactionById,
    getCashTransactionStatus,
    cancelCashTransaction,
    cancelCashTransactionStatus,
    error,
    clearError,
    clearManagedCashTransaction,
  } = useCashTransaction();

  const [localError, setLocalError] = useState("");

  const fetchDetails = useCallback(async () => {
    if (!cashTransactionId) return;
    try {
      await getCashTransactionById(cashTransactionId);
    } catch (e) {
      console.error("Failed to load cash transaction details:", e);
    }
  }, [cashTransactionId, getCashTransactionById]);

  useEffect(() => {
    if (hasFetchedRef.current === cashTransactionId) return;
    hasFetchedRef.current = cashTransactionId;

    fetchDetails();

    return () => {
      clearError();
      clearManagedCashTransaction();
    };
  }, [cashTransactionId, fetchDetails, clearError, clearManagedCashTransaction]);

  const handleBack = useCallback(() => {
    navigate(ROUTES.CASH_TRANSACTIONS);
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    clearError();
    setLocalError("");
    hasFetchedRef.current = null;
    fetchDetails();
  }, [clearError, fetchDetails]);

  const handleCancel = useCallback(async () => {
    const reason = window.prompt(
      "Are you sure you want to cancel/void this cash transaction? This will reverse the associated journal postings.\n\nEnter reason for cancellation:"
    );

    if (reason === null) return; // User cancelled prompt

    try {
      await cancelCashTransaction(cashTransactionId, { reason: reason.trim() });
      fetchDetails();
    } catch (err) {
      setLocalError(typeof err === "string" ? err : "Failed to cancel transaction.");
    }
  }, [cashTransactionId, cancelCashTransaction, fetchDetails]);

  const isLoading = getCashTransactionStatus === API_STATUS.LOADING;
  const isActioning = cancelCashTransactionStatus === API_STATUS.LOADING;

  const pageProps = useMemo(
    () => ({
      transaction: managedCashTransaction,
      isLoading,
      isActioning,
      error: error || localError,
      handleBack,
      handleRefresh,
      handleCancel,
      clearLocalErrors: () => setLocalError(""),
    }),
    [managedCashTransaction, isLoading, isActioning, error, localError, handleBack, handleRefresh, handleCancel]
  );

  return isMobile ? (
    <CashTransactionDetailsMobilePage {...pageProps} />
  ) : (
    <CashTransactionDetailsDesktopPage {...pageProps} />
  );
};

export default CashTransactionDetailsPage;
