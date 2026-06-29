import React, { useEffect, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useCashDenomination from "../hooks/useCashDenomination";
import CashDenominationDetailsDesktopPage from "./desktop/CashDenominationDetailsDesktopPage";
import CashDenominationDetailsMobilePage from "./mobile/CashDenominationDetailsMobilePage";

const CashDenominationDetailsPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { cashDenominationId } = useParams();

  const {
    managedCashDenomination,
    getCashDenominationById,
    getCashDenominationStatus,
    confirmCashDenomination,
    confirmCashDenominationStatus,
    cancelCashDenomination,
    cancelCashDenominationStatus,
    error,
    clearError,
    message,
    clearMessage,
  } = useCashDenomination();

  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const fetchDetails = useCallback(async () => {
    if (!cashDenominationId) return;
    try {
      await getCashDenominationById(cashDenominationId);
    } catch (err) {
      console.error("Failed to load cash denomination details:", err);
    }
  }, [cashDenominationId, getCashDenominationById]);

  useEffect(() => {
    fetchDetails();
  }, [cashDenominationId]); // Only trigger when cashDenominationId changes to prevent infinite loops

  useEffect(() => {
    return () => {
      clearError();
      clearMessage();
    };
  }, [clearError, clearMessage]);

  const handleConfirm = useCallback(
    async (adjustVariance = false) => {
      if (!cashDenominationId) return;
      setActionError("");
      setActionMessage("");
      try {
        await confirmCashDenomination(cashDenominationId, { adjustVariance });
        setActionMessage("Physical cash count confirmed successfully.");
        fetchDetails();
      } catch (err) {
        setActionError(typeof err === "string" ? err : "Failed to confirm cash count.");
      }
    },
    [cashDenominationId, confirmCashDenomination, fetchDetails]
  );

  const handleCancel = useCallback(
    async (reason = "") => {
      if (!cashDenominationId) return;
      setActionError("");
      setActionMessage("");
      try {
        await cancelCashDenomination(cashDenominationId, { reason });
        setActionMessage("Physical cash count cancelled.");
        fetchDetails();
      } catch (err) {
        setActionError(typeof err === "string" ? err : "Failed to cancel cash count.");
      }
    },
    [cashDenominationId, cancelCashDenomination, fetchDetails]
  );

  const handleBack = useCallback(() => {
    navigate(ROUTES.CASH_DENOMINATIONS);
  }, [navigate]);

  const isLoading = getCashDenominationStatus === API_STATUS.LOADING;
  const isTransitioning =
    confirmCashDenominationStatus === API_STATUS.LOADING ||
    cancelCashDenominationStatus === API_STATUS.LOADING;

  const pageProps = {
    countDetails: managedCashDenomination,
    isLoading,
    isTransitioning,
    error: error || actionError,
    message: message || actionMessage,
    clearFeedback: () => {
      clearError();
      clearMessage();
      setActionError("");
      setActionMessage("");
    },
    handleConfirm,
    handleCancel,
    handleBack,
  };

  return isMobile ? (
    <CashDenominationDetailsMobilePage {...pageProps} />
  ) : (
    <CashDenominationDetailsDesktopPage {...pageProps} />
  );
};

export default CashDenominationDetailsPage;
