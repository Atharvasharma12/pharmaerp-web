import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
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


  const { branches = [], getCompanyBranches, currentBranch } = useBranch();

  const [filters, setFilters] = useState({
    search: "",
    partition: "all",
    branchId: "all",
    status: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const hasFetchedBranchesRef = useRef(false);


  useEffect(() => {
    if (hasFetchedBranchesRef.current) return;
    hasFetchedBranchesRef.current = true;
    getCompanyBranches().catch((err) =>
      console.error("Failed to load branches for filter:", err)
    );
  }, []);

  const fetchCashDenominationsData = useCallback(async () => {
    try {
      const query = {
        page: currentPage,
        limit: pageSize,
        search: filters.search || undefined,
        partition: filters.partition === "all" ? undefined : filters.partition,
        branchId: currentBranch ? currentBranch._id : (filters.branchId === "all" ? undefined : filters.branchId),
        status: filters.status === "all" ? undefined : filters.status,
      };
      await getCashDenominations(query);
    } catch (err) {
      console.error("Failed to fetch cash denominations:", err);
    }
  }, [currentPage, pageSize, filters, getCashDenominations, currentBranch]);

  useEffect(() => {
    fetchCashDenominationsData();
  }, [fetchCashDenominationsData]);

  const handleRefresh = useCallback(() => {
    fetchCashDenominationsData();
  }, [fetchCashDenominationsData]);

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

  const partitionOptions = useMemo(() => {
    return [
      { label: "All Partitions", value: "all" },
      { label: "Running Cash", value: "running" },
      { label: "Frozen Cash", value: "frozen" }
    ];
  }, []);

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
    partitionOptions,
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
    handleRefresh,
  };

  return isMobile ? (
    <CashDenominationsMobilePage {...pageProps} />
  ) : (
    <CashDenominationsDesktopPage {...pageProps} />
  );
};

export default CashDenominationsPage;
