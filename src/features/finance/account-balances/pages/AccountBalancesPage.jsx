import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useAccountBalance from "../hooks/useAccountBalance";
import AccountBalancesDesktopPage from "./desktop/AccountBalancesDesktopPage";
import AccountBalancesMobilePage from "./mobile/AccountBalancesMobilePage";

const AccountBalancesPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const {
    accountBalances,
    getAccountBalances,
    getAccountBalancesStatus,
    recalculateAccountBalance,
    recalculateAccountBalanceStatus,
    error,
    clearError,
    message,
    clearMessage,
  } = useAccountBalance();

  const [searchParams, setSearchParams] = useState({
    search: "",
    balanceType: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const executeQuery = useCallback(async () => {
    try {
      const query = {
        page: currentPage,
        limit: pageSize,
        search: searchParams.search || undefined,
        balanceType: searchParams.balanceType === "all" ? undefined : searchParams.balanceType,
      };
      await getAccountBalances(query);
    } catch (err) {
      console.error("Failed to load account balances list:", err);
    }
  }, [currentPage, pageSize, searchParams, getAccountBalances]);

  useEffect(() => {
    executeQuery();
  }, [currentPage, pageSize, searchParams]);

  const handleSearchChange = useCallback((value) => {
    setSearchParams((prev) => ({ ...prev, search: value }));
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((name, value) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const handleRecalculate = useCallback(
    async (accountId) => {
      setActionError("");
      setActionMessage("");
      try {
        await recalculateAccountBalance(accountId);
        setActionMessage("Account balance sheet recalculated successfully.");
        executeQuery();
      } catch (err) {
        setActionError(typeof err === "string" ? err : "Failed to recalculate balance.");
      }
    },
    [recalculateAccountBalance, executeQuery]
  );

  const handleViewDetails = useCallback(
    (accountId) => {
      navigate(ROUTES.ACCOUNT_BALANCE_DETAILS(accountId));
    },
    [navigate]
  );

  const isLoading = getAccountBalancesStatus === API_STATUS.LOADING;
  const isRecalculating = recalculateAccountBalanceStatus === API_STATUS.LOADING;

  const totalBalances = useMemo(() => {
    return accountBalances?.length || 0;
  }, [accountBalances]);

  const pageProps = {
    accountBalances: accountBalances || [],
    searchParams,
    currentPage,
    pageSize,
    totalBalances,
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
    handleSearchChange,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    handleRecalculate,
    handleViewDetails,
  };

  return isMobile ? (
    <AccountBalancesMobilePage {...pageProps} />
  ) : (
    <AccountBalancesDesktopPage {...pageProps} />
  );
};

export default AccountBalancesPage;
