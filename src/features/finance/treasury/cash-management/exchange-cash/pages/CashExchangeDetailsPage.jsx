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


  const handleBack = useCallback(
    () => navigate(ROUTES.CASH_EXCHANGES),
    [navigate],
  );

  const isLoading = getCashExchangeStatus === API_STATUS.LOADING;

  const pageProps = {
    exchangeDetails: managedCashExchange,
    isLoading,
    error: error || actionError,
    message: message || actionMessage,
    clearFeedback: () => {
      clearError();
      clearMessage();
      setActionError("");
      setActionMessage("");
    },
    handleBack,
  };

  return isMobile ? (
    <CashExchangeDetailsMobilePage {...pageProps} />
  ) : (
    <CashExchangeDetailsDesktopPage {...pageProps} />
  );
};

export default CashExchangeDetailsPage;
