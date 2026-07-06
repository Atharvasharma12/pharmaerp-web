import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useCashTransaction from "../hooks/useCashTransaction";
import useCashAccount from "@/features/finance/treasury/cash-management/cash-accounts/hooks/useCashAccount";
import CashTransactionsDesktopPage from "./desktop/CashTransactionsDesktopPage";
import CashTransactionsMobilePage from "./mobile/CashTransactionsMobilePage";

const CashTransactionsPage = () => {
  const isMobile = useIsMobile();
  const hasFetchedCashRef = useRef(false);

  const {
    cashTransactions,
    getCashTransactions,
    getCashTransactionsStatus,
    error,
    clearError,
  } = useCashTransaction();

  const { cashAccounts, getCashAccounts } = useCashAccount();

  // Load petty cash register lists once on mount
  useEffect(() => {
    if (hasFetchedCashRef.current) return;
    hasFetchedCashRef.current = true;

    getCashAccounts({ all: true }).catch((err) =>
      console.error("Failed to load cash accounts list for filters:", err)
    );
  }, [getCashAccounts]);

  const [searchParams, setSearchParams] = useState({
    search: "",
    status: "all",
    transactionType: "all",
    cashAccountId: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Trigger query list fetch
  const fetchTransactionsData = useCallback(async () => {
    try {
      const query = {
        page: currentPage,
        limit: pageSize,
        search: searchParams.search || undefined,
        status: searchParams.status === "all" ? undefined : searchParams.status,
        transactionType: searchParams.transactionType === "all" ? undefined : searchParams.transactionType,
        cashAccountId: searchParams.cashAccountId === "all" ? undefined : searchParams.cashAccountId,
      };
      await getCashTransactions(query);
    } catch (err) {
      console.error("Failed to query cash transactions list:", err);
    }
  }, [currentPage, pageSize, searchParams, getCashTransactions]);

  useEffect(() => {
    fetchTransactionsData();
  }, [fetchTransactionsData]);

  const handleRefresh = useCallback(() => {
    fetchTransactionsData();
  }, [fetchTransactionsData]);

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

  const totalTransactions = useMemo(() => {
    return cashTransactions?.length || 0;
  }, [cashTransactions]);

  const isLoading = getCashTransactionsStatus === API_STATUS.LOADING;

  const pageProps = {
    cashTransactions: cashTransactions || [],
    cashAccounts: cashAccounts || [],
    searchParams,
    currentPage,
    pageSize,
    totalTransactions,
    isLoading,
    error,
    clearError,
    handleSearchChange,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    handleRefresh,
  };

  return isMobile ? (
    <CashTransactionsMobilePage {...pageProps} />
  ) : (
    <CashTransactionsDesktopPage {...pageProps} />
  );
};

export default CashTransactionsPage;
