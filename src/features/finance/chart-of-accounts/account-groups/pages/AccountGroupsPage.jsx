import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES, API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useAccountGroup from "../hooks/useAccountGroup";
import useAccount from "../../accounts/hooks/useAccount";
import AccountGroupsDesktopPage from "./desktop/AccountGroupsDesktopPage";
import AccountGroupsMobilePage from "./mobile/AccountGroupsMobilePage";

const initialFilters = {
  search: "",
  status: "all",
};

const normalizeText = (val) => String(val || "").trim().toLowerCase();

const AccountGroupsPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const hasFetchedRef = useRef(false);

  const {
    accountGroups = [],
    getAccountGroups,
    getAccountGroupsStatus,
    deleteAccountGroup,
    message,
    error,
    clearMessage,
    clearError,
  } = useAccountGroup();

  const {
    accounts = [],
    getAccounts,
    getAccountsStatus,
  } = useAccount();

  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchGroupsAndAccounts = useCallback(async () => {
    try {
      await Promise.all([
        getAccountGroups(),
        getAccounts(),
      ]);
    } catch (err) {
      console.error("Failed to fetch account groups and accounts", err);
    }
  }, [getAccountGroups, getAccounts]);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchGroupsAndAccounts();
  }, [fetchGroupsAndAccounts]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const isLoading =
    getAccountGroupsStatus === API_STATUS.LOADING ||
    getAccountsStatus === API_STATUS.LOADING;

  const hasError = getAccountGroupsStatus === API_STATUS.ERROR;

  // Helper: Get accounts count for a group
  const getGroupAccountsCount = useCallback((groupId) => {
    return accounts.filter((a) => {
      const aGroupId = typeof a.accountGroupId === "object" ? a.accountGroupId?._id : a.accountGroupId;
      return aGroupId === groupId;
    }).length;
  }, [accounts]);

  // Map account groups to include accounts count, parent names, etc.
  const mappedGroups = useMemo(() => {
    return accountGroups.map((group) => {
      return {
        ...group,
        id: group._id,
        name: group.groupName,
        code: group.groupCode,
        accountsCount: getGroupAccountsCount(group._id),
        status: group.status || "active",
      };
    });
  }, [accountGroups, getGroupAccountsCount]);

  // Apply filters
  const filteredGroups = useMemo(() => {
    const searchVal = normalizeText(filters.search);
    const statusVal = normalizeText(filters.status);

    return mappedGroups.filter((group) => {
      const matchesSearch =
        !searchVal ||
        normalizeText(group.name).includes(searchVal) ||
        normalizeText(group.code).includes(searchVal) ||
        normalizeText(group.description).includes(searchVal);

      const matchesStatus =
        statusVal === "all" ||
        normalizeText(group.status) === statusVal;

      return matchesSearch && matchesStatus;
    });
  }, [mappedGroups, filters]);

  const totalCount = filteredGroups.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedGroups = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredGroups.slice(startIndex, startIndex + pageSize);
  }, [filteredGroups, currentPage, pageSize]);

  // Dynamic statistics
  const stats = useMemo(() => {
    const totalGroups = accountGroups.length;
    const totalAccs = accounts.length;
    const activeGroups = accountGroups.filter((g) => g.status === "active").length;
    const inactiveGroups = accountGroups.filter((g) => g.status === "inactive").length;

    return {
      totalGroups,
      totalAccounts: totalAccs,
      activeGroups,
      inactiveGroups,
      lastUpdated: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
  }, [accountGroups, accounts]);

  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (filters.search) {
      chips.push({ key: "search", label: `Search: ${filters.search}` });
    }
    if (filters.status !== "all") {
      chips.push({ key: "status", label: `Status: ${filters.status}` });
    }
    return chips;
  }, [filters]);

  const handleFilterChange = useCallback((name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleRemoveFilter = useCallback((key) => {
    setFilters((prev) => ({ ...prev, [key]: initialFilters[key] }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const handleCreateGroup = useCallback(() => {
    navigate(ROUTES.CREATE_ACCOUNT_GROUP);
  }, [navigate]);

  const handleViewGroup = useCallback((groupId) => {
    if (typeof ROUTES.ACCOUNT_GROUP_DETAILS === "function") {
      navigate(ROUTES.ACCOUNT_GROUP_DETAILS(groupId));
    }
  }, [navigate]);

  const handleEditGroup = useCallback((groupId) => {
    if (typeof ROUTES.EDIT_ACCOUNT_GROUP === "function") {
      navigate(ROUTES.EDIT_ACCOUNT_GROUP(groupId));
    }
  }, [navigate]);

  const handleDeleteGroup = useCallback(async (groupId) => {
    try {
      await deleteAccountGroup(groupId);
      fetchGroupsAndAccounts();
    } catch (err) {
      console.error(err);
    }
  }, [deleteAccountGroup, fetchGroupsAndAccounts]);

  const handleRefresh = useCallback(() => {
    fetchGroupsAndAccounts();
  }, [fetchGroupsAndAccounts]);

  const statusOptions = useMemo(() => [
    { label: "Status: All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ], []);

  const pageProps = {
    accountGroups: paginatedGroups,
    totalCount,
    currentPage,
    pageSize,
    totalPages,
    handlePageChange: setCurrentPage,
    handlePageSizeChange: (size) => {
      setPageSize(size);
      setCurrentPage(1);
    },
    rawGroups: accountGroups,
    stats,
    filters,
    activeFilterChips,
    statusOptions,
    isLoading,
    hasError,
    error,
    message,
    clearMessage,
    clearError,
    handleFilterChange,
    handleRemoveFilter,
    handleClearFilters,
    handleCreateGroup,
    handleViewGroup,
    handleEditGroup,
    handleDeleteGroup,
    handleRefresh,
    handleBackToCOA: useCallback(() => {
      navigate(ROUTES.CHART_OF_ACCOUNTS);
    }, [navigate]),
  };

  return isMobile ? (
    <AccountGroupsMobilePage {...pageProps} />
  ) : (
    <AccountGroupsDesktopPage {...pageProps} />
  );
};

export default AccountGroupsPage;
