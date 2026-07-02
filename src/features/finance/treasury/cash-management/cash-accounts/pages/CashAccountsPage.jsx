import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES, API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useCashAccount from "../hooks/useCashAccount";
import CashAccountsDesktopPage from "./desktop/CashAccountsDesktopPage";
import CashAccountsMobilePage from "./mobile/CashAccountsMobilePage";

const INITIAL_FILTERS = {
  search: "",
  status: "all",
};

const normalizeText = (val) => String(val || "").trim().toLowerCase();

const formatStringTitle = (val) => {
  if (!val) return "";
  return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
};

const mapCashAccountForView = (account) => {
  if (!account) return {};
  return {
    ...account,
    displayName: account.accountName || "Unnamed Cash Account",
    displayStatus: account.status ? String(account.status).toLowerCase() : "active",
    displayDescription: account.description || "-",
    balance: account.denominationBalance?.totalBalance !== undefined
      ? account.denominationBalance.totalBalance
      : (account.ledgerAccountId?.openingBalance || 0),
  };
};

const CashAccountsPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(false);

  const {
    cashAccounts = [],
    getCashAccountsStatus,
    deleteCashAccountStatus,
    setPrimaryCashAccountStatus,
    error,
    message,
    getCashAccounts,
    deleteCashAccount,
    setPrimaryCashAccount,
    clearError,
    clearMessage,
  } = useCashAccount();

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const isLoading =
    getCashAccountsStatus === API_STATUS.LOADING ||
    deleteCashAccountStatus === API_STATUS.LOADING ||
    setPrimaryCashAccountStatus === API_STATUS.LOADING;

  const hasError = getCashAccountsStatus === API_STATUS.ERROR;

  const fetchAccountsData = useCallback(async () => {
    try {
      await getCashAccounts({ all: true });
    } catch (err) {
      console.error("Failed to fetch cash accounts:", err);
    }
  }, [getCashAccounts]);

  useEffect(() => {
    clearError();
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchAccountsData();
    }
    return () => {
      clearError();
    };
  }, [clearError, fetchAccountsData]);

  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(() => {
      clearMessage();
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [clearMessage, message]);

  const activeAccountsList = useMemo(() => {
    return Array.isArray(cashAccounts) ? cashAccounts : [];
  }, [cashAccounts]);

  const mappedAccounts = useMemo(() => {
    return activeAccountsList.map(mapCashAccountForView);
  }, [activeAccountsList]);

  const filteredAccounts = useMemo(() => {
    const searchToken = normalizeText(filters.search);
    const statusToken = normalizeText(filters.status);

    return mappedAccounts.filter((acc) => {
      const matchesSearch =
        !searchToken ||
        normalizeText(acc.displayName).includes(searchToken) ||
        normalizeText(acc.displayDescription).includes(searchToken);

      const matchesStatus =
        filters.status === "all" ||
        normalizeText(acc.displayStatus) === statusToken;

      return matchesSearch && matchesStatus;
    });
  }, [filters, mappedAccounts]);

  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (filters.search) {
      chips.push({ key: "search", label: `Search: ${filters.search}` });
    }
    if (filters.status !== "all") {
      chips.push({
        key: "status",
        label: `Status: ${formatStringTitle(filters.status)}`,
      });
    }
    return chips;
  }, [filters]);

  const stats = useMemo(() => {
    const total = mappedAccounts.length;
    const active = mappedAccounts.filter((a) => a.displayStatus === "active").length;
    const inactive = total - active;
    const totalBalance = mappedAccounts.reduce((sum, a) => sum + (a.balance || 0), 0);

    return {
      totalAccounts: total,
      activeAccounts: active,
      inactiveAccounts: inactive,
      totalBalance,
    };
  }, [mappedAccounts]);

  // Pagination calculations
  const totalAccounts = filteredAccounts.length;
  const totalPages = Math.ceil(totalAccounts / pageSize);
  
  // Auto-correct page bound
  useEffect(() => {
    if (currentPage > 1 && currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [currentPage, totalPages]);

  const pagedAccounts = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredAccounts.slice(startIdx, startIdx + pageSize);
  }, [filteredAccounts, currentPage, pageSize]);

  // Callbacks
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  }, []);

  const handleRemoveChip = useCallback((key) => {
    setFilters((prev) => ({ ...prev, [key]: key === "status" ? "all" : "" }));
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setCurrentPage(1);
  }, []);

  const handleRefresh = useCallback(() => {
    clearError();
    hasFetchedRef.current = false;
    fetchAccountsData();
  }, [clearError, fetchAccountsData]);

  const handleCreateAccount = useCallback(() => {
    navigate(ROUTES.CREATE_CASH_ACCOUNT);
  }, [navigate]);

  const handleEditAccount = useCallback(
    (account) => {
      if (!account?._id) return;
      navigate(ROUTES.EDIT_CASH_ACCOUNT(account._id));
    },
    [navigate]
  );

  const handleViewDetails = useCallback(
    (account) => {
      if (!account?._id) return;
      navigate(ROUTES.CASH_ACCOUNT_DETAILS(account._id));
    },
    [navigate]
  );

  const handleDeleteAccount = useCallback(
    async (account) => {
      if (!account?._id) return;
      const confirmDelete = window.confirm(
        `Are you sure you want to delete the cash account "${account.displayName}"?`
      );
      if (!confirmDelete) return;

      try {
        await deleteCashAccount(account._id);
        handleRefresh();
      } catch (err) {
        console.error("Failed to delete cash account:", err);
      }
    },
    [deleteCashAccount, handleRefresh]
  );

  const handleSetPrimary = useCallback(
    async (account) => {
      if (!account?._id) return;
      try {
        await setPrimaryCashAccount(account._id);
        handleRefresh();
      } catch (err) {
        console.error("Failed to set cash account as primary:", err);
      }
    },
    [setPrimaryCashAccount, handleRefresh]
  );

  const viewProps = {
    filters,
    stats,
    pagedAccounts,
    totalAccounts,
    currentPage,
    totalPages,
    pageSize,
    activeFilterChips,
    isLoading,
    hasError,
    serverError: error,
    serverMessage: message,
    handleFilterChange,
    handleRemoveChip,
    handleClearFilters,
    handlePageChange,
    handlePageSizeChange,
    handleRefresh,
    handleCreateAccount,
    handleEditAccount,
    handleViewDetails,
    handleDeleteAccount,
    handleSetPrimary,
    clearError,
    clearMessage,
  };

  return isMobile ? (
    <CashAccountsMobilePage {...viewProps} />
  ) : (
    <CashAccountsDesktopPage {...viewProps} />
  );
};

export default CashAccountsPage;
