import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useBankTransaction from "../hooks/useBankTransaction";
import { BankTransactionDetailsDesktopPage } from "./desktop";
import { BankTransactionDetailsMobilePage } from "./mobile";

const BankTransactionDetailsPage = () => {
  const navigate = useNavigate();
  const { bankTransactionId } = useParams();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(null);

  const {
    managedBankTransaction,
    getBankTransactionById,
    getBankTransactionStatus,
    cancelBankTransaction,
    cancelBankTransactionStatus,
    error,
    clearError,
    clearManagedBankTransaction,
  } = useBankTransaction();

  const [localError, setLocalError] = useState("");

  const fetchDetails = useCallback(async () => {
    if (!bankTransactionId) return;
    try {
      await getBankTransactionById(bankTransactionId);
    } catch (e) {
      console.error("Failed to load bank transaction details:", e);
    }
  }, [bankTransactionId, getBankTransactionById]);

  useEffect(() => {
    if (hasFetchedRef.current === bankTransactionId) return;
    hasFetchedRef.current = bankTransactionId;

    fetchDetails();

    return () => {
      clearError();
      clearManagedBankTransaction();
    };
  }, [
    bankTransactionId,
    fetchDetails,
    clearError,
    clearManagedBankTransaction,
  ]);

  const handleBack = useCallback(() => {
    navigate(ROUTES.BANK_TRANSACTIONS);
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    clearError();
    setLocalError("");
    hasFetchedRef.current = null;
    fetchDetails();
  }, [clearError, fetchDetails]);

  const handleCancel = useCallback(async () => {
    const reason = window.prompt(
      "Are you sure you want to cancel/void this bank transaction? This will reverse the associated journal postings.\n\nEnter reason for cancellation:",
    );

    if (reason === null) return; // User cancelled prompt

    try {
      await cancelBankTransaction(bankTransactionId, { reason: reason.trim() });
      fetchDetails();
    } catch (err) {
      setLocalError(
        typeof err === "string" ? err : "Failed to cancel transaction.",
      );
    }
  }, [bankTransactionId, cancelBankTransaction, fetchDetails]);

  const isLoading = getBankTransactionStatus === API_STATUS.LOADING;
  const isActioning = cancelBankTransactionStatus === API_STATUS.LOADING;

  const pageProps = useMemo(
    () => ({
      transaction: managedBankTransaction,
      isLoading,
      isActioning,
      error: error || localError,
      handleBack,
      handleRefresh,
      handleCancel,
      clearLocalErrors: () => setLocalError(""),
    }),
    [
      managedBankTransaction,
      isLoading,
      isActioning,
      error,
      localError,
      handleBack,
      handleRefresh,
      handleCancel,
    ],
  );

  return isMobile ? (
    <BankTransactionDetailsMobilePage {...pageProps} />
  ) : (
    <BankTransactionDetailsDesktopPage {...pageProps} />
  );
};

export default BankTransactionDetailsPage;
