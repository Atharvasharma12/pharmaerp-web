import React, { useState, useEffect, useCallback } from "react";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";
import useBranch from "@/features/branch/hooks/useBranch";

import useAccountBalance from "../hooks/useAccountBalance";
import AccountBalancesDesktopPage from "./desktop/AccountBalancesDesktopPage";
import AccountBalancesMobilePage from "./mobile/AccountBalancesMobilePage";
import { AccountBalanceDetailsDialog } from "../components/AccountBalanceDetailsDialog";

const MobileAccountBalancesContainer = () => {
  const { currentBranch } = useBranch();

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
    accountScope: "company",
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
        accountScope: searchParams.accountScope || "company",
        branchId: currentBranch?._id,
      };
      await getAccountBalances(query);
    } catch (err) {
      console.error("Failed to load account balances list:", err);
    }
  }, [currentPage, pageSize, searchParams, getAccountBalances, currentBranch?._id]);

  useEffect(() => {
    executeQuery();
  }, [currentPage, pageSize, searchParams]);

  const handleSearchChange = useCallback((eOrVal) => {
    const val =
      typeof eOrVal === "object" && eOrVal !== null && eOrVal.target
        ? eOrVal.target.value
        : typeof eOrVal === "string"
        ? eOrVal
        : "";
    setSearchParams((prev) => ({ ...prev, search: val }));
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

  const [selectedAccountIdForView, setSelectedAccountIdForView] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleViewDetails = useCallback((accountId) => {
    if (!accountId) return;
    setSelectedAccountIdForView(accountId);
    setIsViewDialogOpen(true);
  }, []);

  const handleCloseViewDialog = useCallback(() => {
    setIsViewDialogOpen(false);
    setSelectedAccountIdForView(null);
  }, []);

  const isLoading = getAccountBalancesStatus === API_STATUS.LOADING;
  const isRecalculating = recalculateAccountBalanceStatus === API_STATUS.LOADING;

  return (
    <>
      <AccountBalancesMobilePage
        accountBalances={accountBalances || []}
        searchParams={searchParams}
        currentPage={currentPage}
        pageSize={pageSize}
        totalBalances={accountBalances?.length || 0}
        isLoading={isLoading}
        isRecalculating={isRecalculating}
        error={error || actionError}
        message={message || actionMessage}
        clearFeedback={() => {
          clearError();
          clearMessage();
          setActionError("");
          setActionMessage("");
        }}
        handleSearchChange={handleSearchChange}
        handleFilterChange={handleFilterChange}
        handlePageChange={handlePageChange}
        handlePageSizeChange={handlePageSizeChange}
        handleRecalculate={handleRecalculate}
        handleViewDetails={handleViewDetails}
        handleRefresh={executeQuery}
      />

      <AccountBalanceDetailsDialog
        isOpen={isViewDialogOpen}
        onClose={handleCloseViewDialog}
        accountId={selectedAccountIdForView}
        onRecalculateSuccess={executeQuery}
      />
    </>
  );
};

const AccountBalancesPage = () => {
  const isMobile = useIsMobile();
  return isMobile ? <MobileAccountBalancesContainer /> : <AccountBalancesDesktopPage />;
};

export default AccountBalancesPage;
