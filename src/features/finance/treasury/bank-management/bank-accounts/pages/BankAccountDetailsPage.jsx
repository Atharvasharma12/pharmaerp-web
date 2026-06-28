import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useBankAccount from "../hooks/useBankAccount";
import BankAccountDetailsDesktopPage from "./desktop/BankAccountDetailsDesktopPage";
import BankAccountDetailsMobilePage from "./mobile/BankAccountDetailsMobilePage";

const BankAccountDetailsPage = () => {
  const navigate = useNavigate();
  const { bankAccountId } = useParams();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(null);

  const {
    managedBankAccount,
    getBankAccountById,
    getBankAccountStatus,
    error,
    clearError,
    clearManagedBankAccount,
  } = useBankAccount();

  const isLoading = getBankAccountStatus === API_STATUS.LOADING;
  const hasError = getBankAccountStatus === API_STATUS.ERROR;

  const fetchBankAccount = useCallback(async () => {
    if (!bankAccountId) return;
    try {
      await getBankAccountById(bankAccountId);
    } catch (e) {
      console.error("Error fetching bank account details:", e);
    }
  }, [bankAccountId, getBankAccountById]);

  useEffect(() => {
    if (hasFetchedRef.current === bankAccountId) return;
    hasFetchedRef.current = bankAccountId;

    fetchBankAccount();

    return () => {
      clearError();
      clearManagedBankAccount();
    };
  }, [bankAccountId, fetchBankAccount, clearError, clearManagedBankAccount]);

  const handleBack = useCallback(() => {
    navigate(ROUTES.BANK_ACCOUNTS);
  }, [navigate]);

  const handleEdit = useCallback(() => {
    if (!bankAccountId) return;
    navigate(ROUTES.EDIT_BANK_ACCOUNT(bankAccountId));
  }, [bankAccountId, navigate]);

  const handleRefresh = useCallback(() => {
    clearError();
    hasFetchedRef.current = null;
    fetchBankAccount();
  }, [clearError, fetchBankAccount]);

  const pageProps = useMemo(
    () => ({
      account: managedBankAccount,
      bankAccountId,
      isLoading,
      hasError,
      error,
      handleBack,
      handleEdit,
      handleRefresh,
    }),
    [
      managedBankAccount,
      bankAccountId,
      isLoading,
      hasError,
      error,
      handleBack,
      handleEdit,
      handleRefresh,
    ]
  );

  return isMobile ? (
    <BankAccountDetailsMobilePage {...pageProps} />
  ) : (
    <BankAccountDetailsDesktopPage {...pageProps} />
  );
};

export default BankAccountDetailsPage;
