// src/features/finance/chart-of-accounts/account-groups/pages/AccountGroupDetailsPage.jsx

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useAccountGroup from "../hooks/useAccountGroup";
import AccountGroupDetailsDesktopPage from "./desktop/AccountGroupDetailsDesktopPage";
import AccountGroupDetailsMobilePage from "./mobile/AccountGroupDetailsMobilePage";

const AccountGroupDetailsPage = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(null);

  const currentTab = searchParams.get("tab") || "overview";
  // NOTE: getAccountGroupById.pending uses setPending which sets state.status (not getAccountGroupStatus)
  // So we read from `status` for loading/error on the detail page

  const {
    // managedAccountGroup is what getAccountGroupById populates
    managedAccountGroup,
    getAccountGroupById,
    // `status` is updated by setPending (used by getAccountGroupById.pending)
    status,
    error,
    clearError,
    clearManagedAccountGroup,
  } = useAccountGroup();

  // getAccountGroupById.pending sets state.status via setPending helper
  const isLoading = status === API_STATUS.LOADING;
  const hasError = status === API_STATUS.ERROR;

  const fetchGroup = useCallback(async () => {
    if (!groupId) return;
    try {
      await getAccountGroupById(groupId);
    } catch (e) {
      console.error("Error fetching account group details:", e);
    }
  }, [groupId, getAccountGroupById]);

  useEffect(() => {
    if (hasFetchedRef.current === groupId) return;
    hasFetchedRef.current = groupId;

    fetchGroup();

    return () => {
      clearError();
      clearManagedAccountGroup();
    };
  }, [groupId, fetchGroup, clearError, clearManagedAccountGroup]);

  const handleTabChange = useCallback(
    (tabValue) => {
      setSearchParams({ tab: tabValue });
    },
    [setSearchParams],
  );

  const handleBack = useCallback(() => {
    navigate(ROUTES.ACCOUNT_GROUPS);
  }, [navigate]);

  const handleEdit = useCallback(() => {
    if (!groupId) return;
    navigate(ROUTES.EDIT_ACCOUNT_GROUP(groupId));
  }, [groupId, navigate]);

  const handleRefresh = useCallback(() => {
    clearError();
    hasFetchedRef.current = null;
    fetchGroup();
  }, [clearError, fetchGroup]);

  const pageProps = useMemo(
    () => ({
      group: managedAccountGroup,   // ← correct field
      groupId,
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
      managedAccountGroup,
      groupId,
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
    <AccountGroupDetailsMobilePage {...pageProps} />
  ) : (
    <AccountGroupDetailsDesktopPage {...pageProps} />
  );
};

export default AccountGroupDetailsPage;
