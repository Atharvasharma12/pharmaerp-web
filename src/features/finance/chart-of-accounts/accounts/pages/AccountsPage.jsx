import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES, API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";
import useBranch from "@/features/branch/hooks/useBranch";

import useAccountGroup from "../../account-groups/hooks/useAccountGroup";
import useAccount from "../hooks/useAccount";
import AccountsDesktopPage from "./desktop/AccountsDesktopPage";
import AccountsMobilePage from "./mobile/AccountsMobilePage";
import AccountDialog from "../components/AccountDialog";

const initialFilters = {
  search: "",
  accountType: "all",
  status: "all",
  accountGroupId: "all",
};

const AccountsPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { currentBranch } = useBranch();

  const {
    accounts,
    getAccounts,
    getAccountsStatus,
    createAccount,
    updateAccount,
    deleteAccount,
    message,
    error,
    clearMessage,
    clearError,
  } = useAccount();

  const { accountGroups, getAccountGroups } = useAccountGroup();

  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [dialogState, setDialogState] = useState({
    isOpen: false,
    mode: "create",
    accountData: null,
  });

  const fetchAccountsAndGroups = useCallback(() => {
    const query = {
      page: currentPage,
      limit: pageSize,
      search: filters.search || undefined,
      accountType: filters.accountType === "all" ? undefined : filters.accountType,
      status: filters.status === "all" ? undefined : filters.status,
      accountGroupId: filters.accountGroupId === "all" ? undefined : filters.accountGroupId,
    };
    getAccounts(query).catch((err) =>
      console.error("Failed to load accounts:", err)
    );
    getAccountGroups({ all: true }).catch(() => {});
  }, [currentPage, pageSize, filters, getAccounts, getAccountGroups]);

  useEffect(() => {
    fetchAccountsAndGroups();
  }, [fetchAccountsAndGroups]);

  const handleFilterChange = useCallback((name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  }, []);

  const handleRemoveFilter = useCallback((key) => {
    setFilters((prev) => ({ ...prev, [key]: initialFilters[key] }));
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(initialFilters);
    setCurrentPage(1);
  }, []);

  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (filters.search) chips.push({ key: "search", label: `Search: ${filters.search}` });
    if (filters.accountType !== "all") chips.push({ key: "accountType", label: `Type: ${filters.accountType}` });
    if (filters.status !== "all") chips.push({ key: "status", label: `Status: ${filters.status}` });
    if (filters.accountGroupId !== "all") chips.push({ key: "accountGroupId", label: "Group filtered" });
    return chips;
  }, [filters]);

  const filteredAccounts = useMemo(() => {
    if (!Array.isArray(accounts)) return [];
    return accounts;
  }, [accounts]);

  const totalCount = filteredAccounts.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const paginatedAccounts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAccounts.slice(start, start + pageSize);
  }, [filteredAccounts, currentPage, pageSize]);

  const isLoading = getAccountsStatus === API_STATUS.LOADING;
  const hasError = getAccountsStatus === API_STATUS.ERROR;

  const stats = useMemo(() => {
    const all = Array.isArray(accounts) ? accounts : [];
    return [
      { id: "total", title: "Total Accounts", value: all.length, colorVariant: "primary" },
      { id: "active", title: "Active", value: all.filter((a) => a.status === "active").length, colorVariant: "success" },
      { id: "inactive", title: "Inactive", value: all.filter((a) => a.status === "inactive").length, colorVariant: "neutral" },
    ];
  }, [accounts]);

  const handleCreateAccount = useCallback(() => {
    setDialogState({ isOpen: true, mode: "create", accountData: null });
  }, []);

  const handleViewAccount = useCallback(
    (accountId) => {
      const target = accounts.find((a) => a._id === accountId || a.id === accountId);
      setDialogState({ isOpen: true, mode: "view", accountData: target || null });
    },
    [accounts],
  );

  const handleEditAccount = useCallback(
    (accountId) => {
      const target = accounts.find((a) => a._id === accountId || a.id === accountId);
      setDialogState({ isOpen: true, mode: "edit", accountData: target || null });
    },
    [accounts],
  );

  const handleDeleteAccount = useCallback(
    async (accountId) => {
      try {
        await deleteAccount(accountId);
        fetchAccountsAndGroups();
      } catch (err) {
        console.error(err);
      }
    },
    [deleteAccount, fetchAccountsAndGroups],
  );

  const handleRefresh = useCallback(() => {
    fetchAccountsAndGroups();
  }, [fetchAccountsAndGroups]);

  const accountTypeOptions = useMemo(
    () => [
      { label: "Account Type: All", value: "all" },
      { label: "Asset", value: "asset" },
      { label: "Liability", value: "liability" },
      { label: "Equity", value: "equity" },
      { label: "Income", value: "income" },
      { label: "Expense", value: "expense" },
    ],
    [],
  );

  const statusOptions = useMemo(
    () => [
      { label: "Status: All", value: "all" },
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
    [],
  );

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
    handleBackToCOA: () => navigate(ROUTES.CHART_OF_ACCOUNTS),
  };

  return (
    <>
      {isMobile ? (
        <AccountsMobilePage {...pageProps} />
      ) : (
        <AccountsDesktopPage {...pageProps} />
      )}

      <AccountDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState((prev) => ({ ...prev, isOpen: false }))}
        mode={dialogState.mode}
        accountData={dialogState.accountData}
        accountGroups={accountGroups}
        onSubmitCreate={createAccount}
        onSubmitUpdate={updateAccount}
        onSuccess={fetchAccountsAndGroups}
      />
    </>
  );
};

export default AccountsPage;
