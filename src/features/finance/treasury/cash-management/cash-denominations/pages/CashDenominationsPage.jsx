import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import useCashAccount from "@/features/finance/treasury/cash-management/cash-accounts/hooks/useCashAccount";
import useBranch from "@/features/branch/hooks/useBranch";

import useCashDenomination from "../hooks/useCashDenomination";
import CashDenominationsDesktopPage from "./desktop/CashDenominationsDesktopPage";
import CashDenominationsMobilePage from "./mobile/CashDenominationsMobilePage";

const CashDenominationsPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const {
    cashDenominations = [],
    getCashDenominations,
    getCashDenominationsStatus,
    error,
    clearError,
    message,
    clearMessage,
  } = useCashDenomination();

  const { cashAccounts = [], getCashAccounts } = useCashAccount();
  const { branches = [], getCompanyBranches } = useBranch();

  const [filters, setFilters] = useState({
    search: "",
    cashAccountId: "all",
    branchId: "all",
    status: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const hasFetchedBanksRef = useRef(false);
  const hasFetchedBranchesRef = useRef(false);

  useEffect(() => {
    if (hasFetchedBanksRef.current) return;
    hasFetchedBanksRef.current = true;
    getCashAccounts({ all: true }).catch((err) =>
      console.error("Failed to load cash accounts for filter:", err)
    );
  }, []);

  useEffect(() => {
    if (hasFetchedBranchesRef.current) return;
    hasFetchedBranchesRef.current = true;
    getCompanyBranches().catch((err) =>
      console.error("Failed to load branches for filter:", err)
    );
  }, []);

  useEffect(() => {
    const query = {
      page: currentPage,
      limit: pageSize,
      search: filters.search || undefined,
      cashAccountId: filters.cashAccountId === "all" ? undefined : filters.cashAccountId,
      branchId: filters.branchId === "all" ? undefined : filters.branchId,
      status: filters.status === "all" ? undefined : filters.status,
    };

    getCashDenominations(query).catch((err) =>
      console.error("Failed to fetch cash denominations:", err)
    );
  }, [currentPage, pageSize, filters.search, filters.cashAccountId, filters.branchId, filters.status]);

  useEffect(() => {
    return () => {
      clearError();
      clearMessage();
    };
  }, [clearError, clearMessage]);

  const handleSearchChange = useCallback((val) => {
    setFilters((prev) => ({ ...prev, search: val }));
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((name, val) => {
    setFilters((prev) => ({ ...prev, [name]: val }));
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const handleCreateNew = useCallback(() => {
    navigate(ROUTES.CREATE_CASH_DENOMINATION);
  }, [navigate]);

  const handleViewDetails = useCallback(
    (id) => {
      navigate(ROUTES.CASH_DENOMINATION_DETAILS(id));
    },
    [navigate]
  );

  const cashAccountOptions = useMemo(() => {
    return [
      { label: "All Cash Registers", value: "all" },
      ...cashAccounts.map((c) => ({
        label: c.accountName || "Cash Account",
        value: c._id,
      })),
    ];
  }, [cashAccounts]);

  const branchOptions = useMemo(() => {
    return [
      { label: "All Branches", value: "all" },
      ...branches.map((b) => ({
        label: b.name || "Branch",
        value: b._id,
      })),
    ];
  }, [branches]);

  const isLoading = getCashDenominationsStatus === API_STATUS.LOADING;
  const totalItems = cashDenominations?.length || 0;

  const pageProps = {
    denominations: cashDenominations || [],
    filters,
    cashAccountOptions,
    branchOptions,
    currentPage,
    pageSize,
    totalItems,
    isLoading,
    error,
    message,
    clearFeedback: () => {
      clearError();
      clearMessage();
    },
    handleSearchChange,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    handleCreateNew,
    handleViewDetails,
  };

  return isMobile ? (
    <CashDenominationsMobilePage {...pageProps} />
  ) : (
    <CashDenominationsDesktopPage {...pageProps} />
  );
};

export default CashDenominationsPage;
