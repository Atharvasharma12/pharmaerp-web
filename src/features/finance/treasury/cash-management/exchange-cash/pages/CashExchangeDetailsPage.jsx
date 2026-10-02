import React, { useEffect, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useCashExchange from "../hooks/useCashExchange";
import CashExchangeDetailsDesktopPage from "./desktop/CashExchangeDetailsDesktopPage";
import CashExchangeDetailsMobilePage from "./mobile/CashExchangeDetailsMobilePage";

const CashExchangeDetailsPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { cashExchangeId } = useParams();

  const {
    managedCashExchange,
    getCashExchangeById,
    getCashExchangeStatus,
    cancelCashExchange,
    cancelCashExchangeStatus,
    error,
    clearError,
    message,
    clearMessage,
  } = useCashExchange();

  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    if (cashExchangeId) {
      getCashExchangeById(cashExchangeId).catch((err) =>
        console.error("Failed to load cash exchange details:", err),
      );
    }
  }, [cashExchangeId]);

  useEffect(() => {
    return () => {
      clearError();
      clearMessage();
    };
  }, [clearError, clearMessage]);

  const handleCancelExchange = useCallback(
    async (reason = "") => {
      if (!cashExchangeId) return;
      setActionError("");
      setActionMessage("");
      try {
        await cancelCashExchange(cashExchangeId, { reason });
        setActionMessage("Cash exchange cancelled successfully.");
        getCashExchangeById(cashExchangeId).catch(() => {});
      } catch (err) {
        setActionError(
          typeof err === "string" ? err : "Failed to cancel cash exchange.",
        );
      }
    },
    [cashExchangeId, cancelCashExchange, getCashExchangeById],
  );

  const handleBack = useCallback(
    () => navigate(ROUTES.CASH_EXCHANGES),
    [navigate],
  );

  const isLoading = getCashExchangeStatus === API_STATUS.LOADING;
  const isCancelling = cancelCashExchangeStatus === API_STATUS.LOADING;

  const pageProps = {
    exchangeDetails: managedCashExchange,
    isLoading,
    isCancelling,
    error: error || actionError,
    message: message || actionMessage,
    clearFeedback: () => {
      clearError();
      clearMessage();
      setActionError("");
      setActionMessage("");
    },
    handleCancelExchange,
    handleBack,
  };

  return isMobile ? (
    <CashExchangeDetailsMobilePage {...pageProps} />
  ) : (
    <CashExchangeDetailsDesktopPage {...pageProps} />
  );
};

export default CashExchangeDetailsPage;
