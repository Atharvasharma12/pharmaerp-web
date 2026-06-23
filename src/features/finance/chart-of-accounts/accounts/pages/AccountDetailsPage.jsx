// src/features/finance/chart-of-accounts/accounts/pages/AccountDetailsPage.jsx

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useAccount from "../hooks/useAccount";
import AccountDetailsDesktopPage from "./desktop/AccountDetailsDesktopPage";
import AccountDetailsMobilePage from "./mobile/AccountDetailsMobilePage";

const AccountDetailsPage = () => {
  const navigate = useNavigate();
  const { accountId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(null);

  const currentTab = searchParams.get("tab") || "overview";

  const {
    // managedAccount is what getAccountById populates
    managedAccount,
    getAccountById,
    // `status` is updated by setPending (used by getAccountById.pending)
    status,
    error,
    clearError,
    clearManagedAccount,
  } = useAccount();

  // getAccountById.pending sets state.status via setPending helper
  const isLoading = status === API_STATUS.LOADING;
  const hasError = status === API_STATUS.ERROR;

  const fetchAccount = useCallback(async () => {
    if (!accountId) return;
    try {
      await getAccountById(accountId);
    } catch (e) {
      console.error("Error fetching account details:", e);
    }
  }, [accountId, getAccountById]);

  useEffect(() => {
    if (hasFetchedRef.current === accountId) return;
    hasFetchedRef.current = accountId;

    fetchAccount();

    return () => {
      clearError();
      clearManagedAccount();
    };
  }, [accountId, fetchAccount, clearError, clearManagedAccount]);

  const handleTabChange = useCallback(
    (tabValue) => {
      setSearchParams({ tab: tabValue });
    },
    [setSearchParams],
  );

  const handleBack = useCallback(() => {
    navigate(ROUTES.ACCOUNTS);
  }, [navigate]);

  const handleEdit = useCallback(() => {
    if (!accountId) return;
    navigate(ROUTES.EDIT_ACCOUNT(accountId));
  }, [accountId, navigate]);

  const handleRefresh = useCallback(() => {
    clearError();
    hasFetchedRef.current = null;
    fetchAccount();
  }, [clearError, fetchAccount]);

  const pageProps = useMemo(
    () => ({
      account: managedAccount,   // ← correct field
      accountId,
      currentTab,
      isLoading,
      hasError,
      error,
      handleTabChange,
      handleBack,
      handleEdit,
      handleRefresh,
    }),
    [
      managedAccount,
      accountId,
      currentTab,
      isLoading,
      hasError,
      error,
      handleTabChange,
      handleBack,
      handleEdit,
      handleRefresh,
    ],
  );

  return isMobile ? (
    <AccountDetailsMobilePage {...pageProps} />
  ) : (
    <AccountDetailsDesktopPage {...pageProps} />
  );
};

export default AccountDetailsPage;
