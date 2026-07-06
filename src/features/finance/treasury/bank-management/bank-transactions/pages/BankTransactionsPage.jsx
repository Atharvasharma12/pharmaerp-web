import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useBankTransaction from "../hooks/useBankTransaction";
import useBankAccount from "@/features/finance/treasury/bank-management/bank-accounts/hooks/useBankAccount";
import BankTransactionsDesktopPage from "./desktop/BankTransactionsDesktopPage";
import BankTransactionsMobilePage from "./mobile/BankTransactionsMobilePage";

const BankTransactionsPage = () => {
  const isMobile = useIsMobile();
  const hasFetchedBanksRef = useRef(false);

  const {
    bankTransactions,
    getBankTransactions,
    getBankTransactionsStatus,
    error,
    clearError,
  } = useBankTransaction();

  const { bankAccounts, getBankAccounts } = useBankAccount();

  // Load bank accounts list for filter selectors once on mount
  useEffect(() => {
    if (hasFetchedBanksRef.current) return;
    hasFetchedBanksRef.current = true;

    getBankAccounts({ all: true }).catch((err) =>
      console.error("Failed to load bank accounts for filters:", err)
    );
  }, [getBankAccounts]);

  const [searchParams, setSearchParams] = useState({
    search: "",
    status: "all",
    transactionType: "all",
    bankAccountId: "all",
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
        bankAccountId: searchParams.bankAccountId === "all" ? undefined : searchParams.bankAccountId,
      };
      await getBankTransactions(query);
    } catch (err) {
      console.error("Failed to query bank transactions list:", err);
    }
  }, [currentPage, pageSize, searchParams, getBankTransactions]);

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
    return bankTransactions?.length || 0;
  }, [bankTransactions]);

  const isLoading = getBankTransactionsStatus === API_STATUS.LOADING;

  const pageProps = {
    bankTransactions: bankTransactions || [],
    bankAccounts: bankAccounts || [],
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
    <BankTransactionsMobilePage {...pageProps} />
  ) : (
    <BankTransactionsDesktopPage {...pageProps} />
  );
};

export default BankTransactionsPage;
