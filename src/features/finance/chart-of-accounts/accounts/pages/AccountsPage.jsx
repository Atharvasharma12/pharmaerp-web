import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES, API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useAccountGroup from "../../account-groups/hooks/useAccountGroup";
import useAccount from "../hooks/useAccount";
import AccountsDesktopPage from "./desktop/AccountsDesktopPage";
import AccountsMobilePage from "./mobile/AccountsMobilePage";

const initialFilters = {
  search: "",
  type: "all",
  status: "all",
  group: "all",
};

const normalizeText = (val) => String(val || "").trim().toLowerCase();

const AccountsPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const hasFetchedRef = useRef(false);

  const {
    accountGroups = [],
    getAccountGroups,
  } = useAccountGroup();

  const {
    accounts = [],
    getAccounts,
    getAccountsStatus,
    deleteAccount,
    message,
    error,
    clearMessage,
    clearError,
  } = useAccount();

  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchAccountsAndGroups = useCallback(async () => {
    try {
      await Promise.all([
        getAccountGroups(),
        getAccounts(),
      ]);
    } catch (err) {
      console.error("Failed to load accounts page data:", err);
    }
  }, [getAccountGroups, getAccounts]);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchAccountsAndGroups();
  }, [fetchAccountsAndGroups]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const isLoading =
    getAccountsStatus === API_STATUS.LOADING;

  const hasError = getAccountsStatus === API_STATUS.ERROR;

  // Helper to map account group name
  const getGroupName = useCallback((accountGroupId) => {
    const parentIdStr = typeof accountGroupId === "object" ? accountGroupId?._id : accountGroupId;
    if (!parentIdStr) return "-";
    const group = accountGroups.find((g) => g._id === parentIdStr);
    return group ? group.groupName : "-";
  }, [accountGroups]);

  // Format nature string
  const formatNature = (nature) => {
    if (!nature) return "Debit";
    const norm = nature.toUpperCase();
    if (norm === "DR" || norm === "DEBIT") return "Debit";
    return "Credit";
  };

  // Map accounts for viewing
  const mappedAccounts = useMemo(() => {
    return accounts.map((acc) => {
      return {
        ...acc,
        id: acc._id,
        name: acc.accountName,
        code: acc.accountCode,
        underGroup: getGroupName(acc.accountGroupId),
        type: acc.accountNature ? (acc.accountNature.charAt(0) + acc.accountNature.slice(1).toLowerCase()) : "Asset",
        nature: formatNature(acc.openingBalanceType),
        status: acc.status || "active",
      };
    });
  }, [accounts, getGroupName]);

  // Apply filters
  const filteredAccounts = useMemo(() => {
    const searchVal = normalizeText(filters.search);
    const typeVal = normalizeText(filters.type);
    const statusVal = normalizeText(filters.status);
    const groupVal = filters.group;

    return mappedAccounts.filter((acc) => {
      const matchesSearch =
        !searchVal ||
        normalizeText(acc.name).includes(searchVal) ||
        normalizeText(acc.code).includes(searchVal);

      const matchesType =
        typeVal === "all" ||
        normalizeText(acc.type) === typeVal;

      const matchesStatus =
        statusVal === "all" ||
        normalizeText(acc.status) === statusVal;

      const parentIdStr = typeof acc.accountGroupId === "object" ? acc.accountGroupId?._id : acc.accountGroupId;
      const matchesGroup =
        groupVal === "all" ||
        parentIdStr === groupVal;

      return matchesSearch && matchesType && matchesStatus && matchesGroup;
    });
  }, [mappedAccounts, filters]);

  const totalCount = filteredAccounts.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedAccounts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAccounts.slice(startIndex, startIndex + pageSize);
  }, [filteredAccounts, currentPage, pageSize]);

  // Dynamic statistics
  const stats = useMemo(() => {
    const totalAccounts = accounts.length;
    const activeAccounts = accounts.filter((a) => a.status === "active").length;
    const inactiveAccounts = accounts.filter((a) => a.status === "inactive").length;
    const inactiveGroups = accountGroups.filter((g) => g.status === "inactive").length;

    return {
      totalAccounts,
      activeAccounts,
      inactiveAccounts,
      inactiveGroups,
      lastUpdated: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
  }, [accounts, accountGroups]);

  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (filters.search) {
      chips.push({ key: "search", label: `Search: ${filters.search}` });
    }
    if (filters.type !== "all") {
      chips.push({ key: "type", label: `Type: ${filters.type}` });
    }
    if (filters.status !== "all") {
      chips.push({ key: "status", label: `Status: ${filters.status}` });
    }
    if (filters.group !== "all") {
      const group = accountGroups.find((g) => g._id === filters.group);
      chips.push({ key: "group", label: `Group: ${group ? group.groupName : filters.group}` });
    }
    return chips;
  }, [filters, accountGroups]);

  const handleFilterChange = useCallback((name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleRemoveFilter = useCallback((key) => {
    setFilters((prev) => ({ ...prev, [key]: initialFilters[key] }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const handleCreateAccount = useCallback(() => {
    navigate(ROUTES.CREATE_ACCOUNT);
  }, [navigate]);

  const handleViewAccount = useCallback((accountId) => {
    if (typeof ROUTES.ACCOUNT_DETAILS === "function") {
      navigate(ROUTES.ACCOUNT_DETAILS(accountId));
    }
  }, [navigate]);

  const handleEditAccount = useCallback((accountId) => {
    if (typeof ROUTES.EDIT_ACCOUNT === "function") {
      navigate(ROUTES.EDIT_ACCOUNT(accountId));
    }
  }, [navigate]);

  const handleDeleteAccount = useCallback(async (accountId) => {
    try {
      await deleteAccount(accountId);
      fetchAccountsAndGroups();
    } catch (err) {
      console.error(err);
    }
  }, [deleteAccount, fetchAccountsAndGroups]);

  const handleRefresh = useCallback(() => {
    fetchAccountsAndGroups();
  }, [fetchAccountsAndGroups]);

  const accountTypeOptions = useMemo(() => [
    { label: "Account Type: All", value: "all" },
    { label: "Asset", value: "asset" },
    { label: "Liability", value: "liability" },
    { label: "Equity", value: "equity" },
    { label: "Income", value: "income" },
    { label: "Expense", value: "expense" },
  ], []);

  const statusOptions = useMemo(() => [
    { label: "Status: All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ], []);

  const accountGroupOptions = useMemo(() => {
    const opts = [{ label: "Account Group: All", value: "all" }];
    accountGroups.forEach((g) => {
      opts.push({ label: g.groupName, value: g._id });
    });
    return opts;
  }, [accountGroups]);

  const pageProps = {
    accounts: paginatedAccounts,
    totalCount,
    currentPage,
    pageSize,
    totalPages,
    handlePageChange: setCurrentPage,
    handlePageSizeChange: (size) => {
      setPageSize(size);
      setCurrentPage(1);
    },
    stats,
    filters,
    activeFilterChips,
    accountTypeOptions,
    statusOptions,
    accountGroupOptions,
    isLoading,
    hasError,
    error,
    message,
    clearMessage,
    clearError,
    handleFilterChange,
    handleRemoveFilter,
    handleClearFilters,
    handleCreateAccount,
    handleViewAccount,
    handleEditAccount,
    handleDeleteAccount,
    handleRefresh,
    handleBackToCOA: useCallback(() => {
      navigate(ROUTES.CHART_OF_ACCOUNTS);
    }, [navigate]),
  };

  return isMobile ? (
    <AccountsMobilePage {...pageProps} />
  ) : (
    <AccountsDesktopPage {...pageProps} />
  );
};

export default AccountsPage;
