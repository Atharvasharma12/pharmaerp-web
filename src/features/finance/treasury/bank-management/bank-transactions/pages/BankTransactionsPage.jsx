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

  const [searchParams, setSearchParams] = useState({
    search: "",
    status: "all",
    transactionType: "all",
    bankAccountId: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Load bank accounts list for filter selectors once on mount for mobile
  useEffect(() => {
    if (!isMobile || hasFetchedBanksRef.current) return;
    hasFetchedBanksRef.current = true;

    getBankAccounts({ all: true }).catch((err) =>
      console.error("Failed to load bank accounts for filters:", err)
    );
  }, [isMobile, getBankAccounts]);

  // Trigger query list fetch for mobile
  const fetchTransactionsData = useCallback(async () => {
    if (!isMobile) return;
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
  }, [isMobile, currentPage, pageSize, searchParams, getBankTransactions]);

  useEffect(() => {
    fetchTransactionsData();
  }, [fetchTransactionsData]);

  if (!isMobile) {
    return <BankTransactionsDesktopPage />;
  }

  const handleRefresh = () => {
    fetchTransactionsData();
  };

  const handleSearchChange = (value) => {
    setSearchParams((prev) => ({ ...prev, search: value }));
    setCurrentPage(1);
  };

  const handleFilterChange = (name, value) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const totalTransactions = bankTransactions?.length || 0;
  const isLoading = getBankTransactionsStatus === API_STATUS.LOADING;

  return (
    <BankTransactionsMobilePage
      bankTransactions={bankTransactions || []}
      bankAccounts={bankAccounts || []}
      searchParams={searchParams}
      currentPage={currentPage}
      pageSize={pageSize}
      totalTransactions={totalTransactions}
      isLoading={isLoading}
      error={error}
      clearError={clearError}
      handleSearchChange={handleSearchChange}
      handleFilterChange={handleFilterChange}
      handlePageChange={handlePageChange}
      handlePageSizeChange={handlePageSizeChange}
      handleRefresh={handleRefresh}
    />
  );
};

export default BankTransactionsPage;
