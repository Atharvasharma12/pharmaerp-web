import React, { useState, useEffect, useCallback, useMemo } from "react";

import { API_STATUS } from "@/constants";
import useAccount from "@/features/finance/chart-of-accounts/accounts/hooks/useAccount";
import { useIsMobile } from "@/hooks";

import useLedger from "../hooks/useLedger";
import LedgerDesktopPage from "./desktop/LedgerDesktopPage";
import LedgerMobilePage from "./mobile/LedgerMobilePage";

const LedgerPage = () => {
  const isMobile = useIsMobile();

  const {
    ledgerEntries,
    getLedger,
    getLedgerStatus,
    recalculateLedger,
    recalculateLedgerStatus,
    error,
    clearError,
    message,
    clearMessage,
  } = useLedger();

  const {
    accounts = [],
    getAccounts,
    getAccountsStatus,
  } = useAccount();

  const [filters, setFilters] = useState({
    accountId: "",
    startDate: "",
    endDate: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  // Fetch accounts dropdown list on mount
  useEffect(() => {
    getAccounts({ all: true }).catch((err) => {
      console.error("Failed to load accounts for ledger dropdown:", err);
    });
  }, []);

  const executeQuery = useCallback(async () => {
    try {
      const query = {
        page: currentPage,
        limit: pageSize,
        accountId: filters.accountId || undefined,
        startDate: filters.startDate ? new Date(filters.startDate).toISOString() : undefined,
        endDate: filters.endDate ? new Date(filters.endDate).toISOString() : undefined,
      };
      await getLedger(query);
    } catch (err) {
      console.error("Failed to fetch ledger entries:", err);
    }
  }, [currentPage, pageSize, filters, getLedger]);

  useEffect(() => {
    executeQuery();
  }, [currentPage, pageSize, filters.accountId, filters.startDate, filters.endDate]);

  const handleFilterChange = useCallback((name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const handleRecalculate = useCallback(async () => {
    if (!filters.accountId) {
      setActionError("Please select a specific account first to recalculate its ledger.");
      return;
    }
    setActionError("");
    setActionMessage("");
    try {
      await recalculateLedger({ accountId: filters.accountId });
      setActionMessage("Ledger balance sheet recalculated successfully.");
      executeQuery();
    } catch (err) {
      setActionError(typeof err === "string" ? err : "Failed to recalculate ledger balance.");
    }
  }, [filters.accountId, recalculateLedger, executeQuery]);

  const isLoading = getLedgerStatus === API_STATUS.LOADING || getAccountsStatus === API_STATUS.LOADING;
  const isRecalculating = recalculateLedgerStatus === API_STATUS.LOADING;

  const totalEntries = useMemo(() => {
    return ledgerEntries?.length || 0;
  }, [ledgerEntries]);

  // Map accounts to simple key-value pairs
  const accountOptions = useMemo(() => {
    return [
      { label: "All Accounts", value: "" },
      ...accounts.map((acc) => ({
        label: `${acc.accountName} (${acc.accountCode})`,
        value: acc._id,
      })),
    ];
  }, [accounts]);

  const selectedAccountDetails = useMemo(() => {
    if (!filters.accountId) return null;
    return accounts.find((acc) => acc._id === filters.accountId) || null;
  }, [filters.accountId, accounts]);

  const handleRefresh = useCallback(() => {
    executeQuery();
  }, [executeQuery]);

  const pageProps = {
    ledgerEntries: ledgerEntries || [],
    accountOptions,
    selectedAccountDetails,
    filters,
    currentPage,
    pageSize,
    totalEntries,
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
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    handleRecalculate,
    handleRefresh,
  };

  return isMobile ? (
    <LedgerMobilePage {...pageProps} />
  ) : (
    <LedgerDesktopPage {...pageProps} />
  );
};

export default LedgerPage;
