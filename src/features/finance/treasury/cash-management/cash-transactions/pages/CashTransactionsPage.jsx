import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useCashTransaction from "../hooks/useCashTransaction";
import useBranch from "@/features/branch/hooks/useBranch";
import CashTransactionsDesktopPage from "./desktop/CashTransactionsDesktopPage";
import CashTransactionsMobilePage from "./mobile/CashTransactionsMobilePage";

const CashTransactionsPage = () => {
  const isMobile = useIsMobile();
  const { currentBranch } = useBranch();
  const hasFetchedCashRef = useRef(false);

  const {
    cashTransactions,
    getCashTransactions,
    getCashTransactionsStatus,
    error,
    clearError,
  } = useCashTransaction();



  const [searchParams, setSearchParams] = useState({
    search: "",
    status: "all",
    transactionType: "all",
    partition: "all",
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
        partition: searchParams.partition === "all" ? undefined : searchParams.partition,
        branchId: currentBranch?._id,
      };
      await getCashTransactions(query);
    } catch (err) {
      console.error("Failed to query cash transactions list:", err);
    }
  }, [currentPage, pageSize, searchParams, getCashTransactions, currentBranch?._id]);

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
