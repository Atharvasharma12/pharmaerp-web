import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useCashAccount from "../hooks/useCashAccount";
import CashAccountDetailsDesktopPage from "./desktop/CashAccountDetailsDesktopPage";
import CashAccountDetailsMobilePage from "./mobile/CashAccountDetailsMobilePage";

const CashAccountDetailsPage = () => {
  const navigate = useNavigate();
  const { cashAccountId } = useParams();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(null);

  const {
    managedCashAccount,
    getCashAccountById,
    getCashAccountStatus,
    error,
    clearError,
    clearManagedCashAccount,
  } = useCashAccount();

  const isLoading = getCashAccountStatus === API_STATUS.LOADING;
  const hasError = getCashAccountStatus === API_STATUS.ERROR;

  const fetchCashAccount = useCallback(async () => {
    if (!cashAccountId) return;
    try {
      await getCashAccountById(cashAccountId);
    } catch (e) {
      console.error("Error fetching cash account details:", e);
    }
  }, [cashAccountId, getCashAccountById]);

  useEffect(() => {
    if (hasFetchedRef.current === cashAccountId) return;
    hasFetchedRef.current = cashAccountId;

    fetchCashAccount();

    return () => {
      clearError();
      clearManagedCashAccount();
    };
  }, [cashAccountId, fetchCashAccount, clearError, clearManagedCashAccount]);

  const handleBack = useCallback(() => {
    navigate(ROUTES.CASH_ACCOUNTS);
  }, [navigate]);

  const handleEdit = useCallback(() => {
    if (!cashAccountId) return;
    navigate(ROUTES.EDIT_CASH_ACCOUNT(cashAccountId));
  }, [cashAccountId, navigate]);

  const handleRefresh = useCallback(() => {
    clearError();
    hasFetchedRef.current = null;
    fetchCashAccount();
  }, [clearError, fetchCashAccount]);

  const pageProps = useMemo(
    () => ({
      account: managedCashAccount,
      cashAccountId,
      isLoading,
      hasError,
      error,
      handleBack,
      handleEdit,
      handleRefresh,
    }),
    [
      managedCashAccount,
      cashAccountId,
      isLoading,
      hasError,
      error,
      handleBack,
      handleEdit,
      handleRefresh,
    ]
  );

  return isMobile ? (
    <CashAccountDetailsMobilePage {...pageProps} />
  ) : (
    <CashAccountDetailsDesktopPage {...pageProps} />
  );
};

export default CashAccountDetailsPage;
