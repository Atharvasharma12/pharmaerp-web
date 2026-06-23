import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES, API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useAccountGroup from "../account-groups/hooks/useAccountGroup";
import useAccount from "../accounts/hooks/useAccount";
import ChartOfAccountsDesktopPage from "./desktop/ChartOfAccountsDesktopPage";
import ChartOfAccountsMobilePage from "./mobile/ChartOfAccountsMobilePage";

const ChartOfAccountsPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const hasFetchedRef = useRef(false);

  const {
    accountGroups = [],
    getAccountGroups,
    getAccountGroupsStatus,
  } = useAccountGroup();

  const {
    accounts = [],
    getAccounts,
    getAccountsStatus,
  } = useAccount();

  const fetchCOAData = useCallback(async () => {
    try {
      await Promise.all([
        getAccountGroups(),
        getAccounts(),
      ]);
    } catch (err) {
      console.error("Failed to load Chart of Accounts data:", err);
    }
  }, [getAccountGroups, getAccounts]);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchCOAData();
  }, [fetchCOAData]);

  const isLoading =
    getAccountGroupsStatus === API_STATUS.LOADING ||
    getAccountsStatus === API_STATUS.LOADING;

  // Dynamically calculate overview statistics from Redux store data
  const dashboardStats = useMemo(() => {
    const totalGroups = accountGroups.length;
    const totalAccs = accounts.length;
    const rootGroupsCount = accountGroups.filter((g) => !g.parentGroupId).length;
    const inactiveAccountsCount = accounts.filter((a) => a.status === "inactive").length;

    return [
      {
        id: "totalGroups",
        title: "Total Account Groups",
        value: String(totalGroups),
        description: "Active Groups",
        colorVariant: "success",
      },
      {
        id: "totalAccounts",
        title: "Total Accounts",
        value: String(totalAccs),
        description: "Active Accounts",
        colorVariant: "info",
      },
      {
        id: "rootGroups",
        title: "Root Groups",
        value: String(rootGroupsCount),
        description: "Top Level Groups",
        colorVariant: "warning",
      },
      {
        id: "inactiveAccounts",
        title: "Inactive Accounts",
        value: String(inactiveAccountsCount),
        description: "Inactive Accounts",
        colorVariant: "danger",
      },
    ];
  }, [accountGroups, accounts]);

  // Dynamically calculate summary details for the sidebar panel
  const summaryDetails = useMemo(() => {
    const totalGroups = accountGroups.length;
    const totalAccs = accounts.length;
    const rootGroupsCount = accountGroups.filter((g) => !g.parentGroupId).length;
    const activeAccs = accounts.filter((a) => a.status === "active").length;
    const inactiveAccs = accounts.filter((a) => a.status === "inactive").length;

    return {
      totalAccounts: totalAccs,
      activeAccounts: activeAccs,
      inactiveAccounts: inactiveAccs,
      totalGroups,
      rootGroups: rootGroupsCount,
      lastUpdated: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
  }, [accountGroups, accounts]);

  // Helper: Get direct and indirect accounts count for a group
  const getGroupAccountsCount = useCallback((groupId) => {
    const getDescendants = (parentId) => {
      let desc = [];
      const children = accountGroups.filter((g) => {
        const parentIdStr = typeof g.parentGroupId === "object" ? g.parentGroupId?._id : g.parentGroupId;
        return parentIdStr === parentId;
      });
      children.forEach((c) => {
        desc.push(c._id);
        desc = desc.concat(getDescendants(c._id));
      });
      return desc;
    };

    const targetGroupIds = [groupId].concat(getDescendants(groupId));
    return accounts.filter((a) => {
      const aGroupId = typeof a.accountGroupId === "object" ? a.accountGroupId?._id : a.accountGroupId;
      return targetGroupIds.includes(aGroupId);
    }).length;
  }, [accountGroups, accounts]);

  // Helper to map parent group name
  const getParentGroupName = useCallback((parentGroupId) => {
    const parentIdStr = typeof parentGroupId === "object" ? parentGroupId?._id : parentGroupId;
    if (!parentIdStr) return "-";
    const parentGroup = accountGroups.find((g) => g._id === parentIdStr);
    return parentGroup ? parentGroup.groupName : "-";
  }, [accountGroups]);

  // Map account groups to include computed hierarchy level, accounts count, parent names, etc.
  const mappedGroups = useMemo(() => {
    const calculateLevel = (group, depth = 1) => {
      const parentIdStr = typeof group.parentGroupId === "object" ? group.parentGroupId?._id : group.parentGroupId;
      if (!parentIdStr) return depth;
      const parent = accountGroups.find((g) => g._id === parentIdStr);
      if (!parent) return depth;
      return calculateLevel(parent, depth + 1);
    };

    return accountGroups.map((group) => {
      return {
        ...group,
        id: group._id,
        name: group.groupName,
        code: group.groupCode,
        level: calculateLevel(group),
        underGroup: getParentGroupName(group.parentGroupId),
        accountsCount: getGroupAccountsCount(group._id),
        status: group.status || "active",
      };
    });
  }, [accountGroups, getGroupAccountsCount, getParentGroupName]);

  // Helper to map account group name
  const getGroupName = useCallback((accountGroupId) => {
    const parentIdStr = typeof accountGroupId === "object" ? accountGroupId?._id : accountGroupId;
    if (!parentIdStr) return "-";
    const group = accountGroups.find((g) => g._id === parentIdStr);
    return group ? group.groupName : "-";
  }, [accountGroups]);

  const formatNature = (nature) => {
    if (!nature) return "Debit";
    const norm = nature.toUpperCase();
    if (norm === "DR" || norm === "DEBIT") return "Debit";
    return "Credit";
  };

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

  // Top 5 levels for the overview list display
  const topGroups = useMemo(() => {
    return [...mappedGroups].slice(0, 5);
  }, [mappedGroups]);

  // First 10 accounts for the overview list display
  const topAccounts = useMemo(() => {
    return [...mappedAccounts].slice(0, 10);
  }, [mappedAccounts]);

  const handleRefresh = useCallback(() => {
    fetchCOAData();
  }, [fetchCOAData]);

  const handleAction = useCallback((actionId) => {
    if (actionId === "add_group") {
      navigate(ROUTES.CREATE_ACCOUNT_GROUP);
    } else if (actionId === "add_account") {
      navigate(ROUTES.CREATE_ACCOUNT);
    } else {
      console.log(`Action executed: ${actionId}`);
    }
  }, [navigate]);

  const pageProps = {
    isLoading,
    stats: dashboardStats,
    accountGroups: topGroups,
    accounts: topAccounts,
    summary: summaryDetails,
    handleRefresh,
    handleAction,
    handleBackToFinance: useCallback(() => {
      navigate(ROUTES.FINANCE);
    }, [navigate]),
  };

  return isMobile ? (
    <ChartOfAccountsMobilePage {...pageProps} />
  ) : (
    <ChartOfAccountsDesktopPage {...pageProps} />
  );
};

export default ChartOfAccountsPage;
