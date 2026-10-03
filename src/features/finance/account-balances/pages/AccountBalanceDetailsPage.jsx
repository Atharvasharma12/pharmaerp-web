import React, { useEffect, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useAccountBalance from "../hooks/useAccountBalance";
import AccountBalanceDetailsDesktopPage from "./desktop/AccountBalanceDetailsDesktopPage";
import AccountBalanceDetailsMobilePage from "./mobile/AccountBalanceDetailsMobilePage";

const AccountBalanceDetailsPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { accountId } = useParams();

  const {
    currentAccountBalance,
    getAccountBalanceByAccountId,
    getAccountBalanceStatus,
    recalculateAccountBalance,
    recalculateAccountBalanceStatus,
    error,
    clearError,
    message,
    clearMessage,
  } = useAccountBalance();

  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const fetchDetails = useCallback(async () => {
    if (!accountId) return;
    try {
      await getAccountBalanceByAccountId(accountId);
    } catch (err) {
      console.error("Failed to load account balance details:", err);
    }
  }, [accountId, getAccountBalanceByAccountId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleRecalculate = useCallback(async () => {
    if (!accountId) return;
    setActionError("");
    setActionMessage("");
    try {
      await recalculateAccountBalance(accountId);
      setActionMessage("Account balance sheet recalculated successfully.");
      fetchDetails();
    } catch (err) {
      setActionError(typeof err === "string" ? err : "Failed to recalculate balance.");
    }
  }, [accountId, recalculateAccountBalance, fetchDetails]);

  const handleBack = useCallback(() => {
    navigate(ROUTES.ACCOUNT_BALANCES);
  }, [navigate]);

  const isLoading = getAccountBalanceStatus === API_STATUS.LOADING;
  const isRecalculating = recalculateAccountBalanceStatus === API_STATUS.LOADING;

  const pageProps = {
    balanceDetails: currentAccountBalance,
    isLoading,
    isRecalculating,
    error: error || actionError,
    message: message || actionMessage,
    clearFeedback: () => {
      clearError();
      clearMessage();
      setActionError("");
      setActionMessage("");
    },
    handleRecalculate,
    handleBack,
  };

  return isMobile ? (
    <AccountBalanceDetailsMobilePage {...pageProps} />
  ) : (
    <AccountBalanceDetailsDesktopPage {...pageProps} />
  );
};

export default AccountBalanceDetailsPage;
