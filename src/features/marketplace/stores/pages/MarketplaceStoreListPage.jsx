// src/features/marketplace/stores/pages/MarketplaceStoreListPage.jsx

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useMarketplaceStore from "../hooks/useMarketplaceStore";
import MarketplaceStoreListDesktopPage from "./desktop/MarketplaceStoreListDesktopPage";
import MarketplaceStoreListMobilePage from "./mobile/MarketplaceStoreListMobilePage";

const formatStringTitle = (value) => {
  if (!value) return "-";
  return String(value)
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const onlineStatusOptions = [
  { label: "All Online Statuses", value: "all" },
  { label: "Online", value: "ONLINE" },
  { label: "Offline", value: "OFFLINE" },
  { label: "Busy", value: "BUSY" },
  { label: "Paused", value: "PAUSED" },
];

const verificationStatusOptions = [
  { label: "All Verification", value: "all" },
  { label: "Approved", value: "APPROVED" },
  { label: "Pending", value: "PENDING" },
  { label: "Under Review", value: "UNDER_REVIEW" },
  { label: "Rejected", value: "REJECTED" },
];

const MarketplaceStoreListPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(false);

  const [filters, setFilters] = useState({
    search: "",
    onlineStatus: "all",
    verificationStatus: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    stores,
    pagination,
    getMarketplaceStoresStatus,
    deleteMarketplaceStoreStatus,
    statusToggleStatus,
    error,
    message,
    fetchStores,
    deleteStore,
    goOnline,
    goOffline,
    pauseStore,
    resumeStore,
    clearError,
    clearMessage,
    clearStore,
  } = useMarketplaceStore();

  const isLoadingList = getMarketplaceStoresStatus === API_STATUS.LOADING;
  const isDeletingItem = deleteMarketplaceStoreStatus === API_STATUS.LOADING;
  const isTogglingStatus = statusToggleStatus === API_STATUS.LOADING;
  const isLoading = isLoadingList || isDeletingItem || isTogglingStatus;
  const hasError = getMarketplaceStoresStatus === API_STATUS.ERROR;

  const fetchStoresData = useCallback(
    async (pageVal = currentPage, sizeVal = pageSize, filterVal = filters) => {
      try {
        const apiParams = {
          page: pageVal,
          limit: sizeVal,
        };

        if (filterVal.search) {
          apiParams.search = filterVal.search;
        }
        if (filterVal.onlineStatus !== "all") {
          apiParams.onlineStatus = filterVal.onlineStatus;
        }
        if (filterVal.verificationStatus !== "all") {
          apiParams.verificationStatus = filterVal.verificationStatus;
        }

        await fetchStores(apiParams);
      } catch {
        // Handled via slice error
      }
    },
    [fetchStores, currentPage, pageSize, filters],
  );

  useEffect(() => {
    clearError();
    clearStore();

    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchStoresData(currentPage, pageSize, filters);
    }

    return () => {
      clearError();
    };
  }, []);

  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(() => {
      clearMessage();
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [clearMessage, message]);

  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (filters.search) {
      chips.push({ key: "search", label: `Search: ${filters.search}` });
    }
    if (filters.onlineStatus !== "all") {
      chips.push({
        key: "onlineStatus",
        label: `Status: ${formatStringTitle(filters.onlineStatus)}`,
      });
    }
    if (filters.verificationStatus !== "all") {
      chips.push({
        key: "verificationStatus",
        label: `Verification: ${formatStringTitle(filters.verificationStatus)}`,
      });
    }
    return chips;
  }, [filters]);

  const dashboardStats = useMemo(() => {
    const totalCount = pagination?.total || stores.length;
    const onlineCount = stores.filter((s) => s.onlineStatus === "ONLINE").length;
    const offlineCount = stores.filter((s) => s.onlineStatus === "OFFLINE").length;
    const pendingCount = stores.filter((s) => s.verificationStatus === "PENDING").length;

    return [
      {
        id: "total_stores",
        title: "Total Stores",
        value: totalCount,
        description: "Registered marketplace stores",
        colorVariant: "primary",
      },
      {
        id: "online_stores",
        title: "Online Stores",
        value: onlineCount,
        description: "Currently accepting orders",
        colorVariant: "success",
      },
      {
        id: "offline_stores",
        title: "Offline Stores",
        value: offlineCount,
        description: "Currently offline",
        colorVariant: "warning",
      },
      {
        id: "pending_verification",
        title: "Pending Approval",
        value: pendingCount,
        description: "Awaiting platform verification",
        colorVariant: "info",
      },
    ];
  }, [pagination, stores]);

  const handleFilterChange = useCallback(
    (updatedVals) => {
      let cleanUpdates = {};
      if (updatedVals && typeof updatedVals === "object" && updatedVals.target) {
        const { name, value } = updatedVals.target;
        if (name && typeof value === "string") {
          cleanUpdates = { [name]: value };
        }
      } else if (
        updatedVals &&
        typeof updatedVals === "object" &&
        !updatedVals.nativeEvent
      ) {
        Object.keys(updatedVals).forEach((key) => {
          if (typeof updatedVals[key] === "string") {
            cleanUpdates[key] = updatedVals[key];
          }
        });
      }

      const updatedFilters = { ...filters, ...cleanUpdates };
      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchStoresData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchStoresData],
  );

  const handleSearchChange = useCallback(
    (event) => {
      let searchValue = "";
      if (typeof event === "string") {
        searchValue = event;
      } else if (event && typeof event === "object" && event.target) {
        searchValue =
          typeof event.target.value === "string" ? event.target.value : "";
      }

      const updatedFilters = { ...filters, search: searchValue };
      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchStoresData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchStoresData],
  );

  const handleRemoveFilter = useCallback(
    (key) => {
      const updatedFilters = { ...filters, [key]: "all" };
      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchStoresData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchStoresData],
  );

  const handleClearFilters = useCallback(() => {
    const cleared = {
      search: "",
      onlineStatus: "all",
      verificationStatus: "all",
    };
    setFilters(cleared);
    setCurrentPage(1);
    fetchStoresData(1, pageSize, cleared);
  }, [pageSize, fetchStoresData]);

  const handleRefresh = useCallback(() => {
    fetchStoresData(currentPage, pageSize, filters);
  }, [currentPage, pageSize, filters, fetchStoresData]);

  const handlePageChange = useCallback(
    (newPage) => {
      const boundedPage = Math.max(1, newPage);
      setCurrentPage(boundedPage);
      fetchStoresData(boundedPage, pageSize, filters);
    },
    [pageSize, filters, fetchStoresData],
  );

  const handlePageSizeChange = useCallback(
    (size) => {
      setPageSize(size);
      setCurrentPage(1);
      fetchStoresData(1, size, filters);
    },
    [filters, fetchStoresData],
  );

  const handleCreateStore = useCallback(() => {
    navigate(ROUTES.CREATE_MARKETPLACE_STORE);
  }, [navigate]);

  const handleViewStoreDetails = useCallback(
    (store) => {
      if (!store?._id) return;
      navigate(
        ROUTES.MARKETPLACE_STORE_DETAILS.replace(":storeId", store._id),
      );
    },
    [navigate],
  );

  const handleEditStore = useCallback(
    (store) => {
      if (!store?._id) return;
      navigate(ROUTES.EDIT_MARKETPLACE_STORE.replace(":storeId", store._id));
    },
    [navigate],
  );

  const handleDeleteStore = useCallback(
    async (store) => {
      if (!store?._id) return;
      try {
        await deleteStore(store._id);
        handleRefresh();
      } catch {
        // Handled via slice error
      }
    },
    [deleteStore, handleRefresh],
  );

  const handleGoOnlineAction = useCallback(
    async (storeId) => {
      try {
        await goOnline(storeId);
      } catch {
        // Handled
      }
    },
    [goOnline],
  );

  const handleGoOfflineAction = useCallback(
    async (storeId) => {
      try {
        await goOffline(storeId);
      } catch {
        // Handled
      }
    },
    [goOffline],
  );

  const handlePauseStoreAction = useCallback(
    async (storeId) => {
      try {
        await pauseStore(storeId);
      } catch {
        // Handled
      }
    },
    [pauseStore],
  );

  const handleResumeStoreAction = useCallback(
    async (storeId) => {
      try {
        await resumeStore(storeId);
      } catch {
        // Handled
      }
    },
    [resumeStore],
  );

  const pageProps = {
    stores,
    dashboardStats,
    filters,
    activeFilterChips,
    onlineStatusOptions,
    verificationStatusOptions,
    isLoading,
    hasError,
    error,
    message,
    totalStores: pagination?.total || stores.length,
    currentPage: pagination?.page || currentPage,
    totalPages: pagination?.totalPages || 1,
    pageSize,
    hasStores: stores.length > 0,
    hasFilteredStores: stores.length > 0,
    handleFilterChange,
    handleSearchChange,
    handleRemoveFilter,
    handleClearFilters,
    handleRefresh,
    handlePageChange,
    handlePageSizeChange,
    handleCreateStore,
    handleViewStoreDetails,
    handleEditStore,
    handleDeleteStore,
    handleGoOnline: handleGoOnlineAction,
    handleGoOffline: handleGoOfflineAction,
    handlePauseStore: handlePauseStoreAction,
    handleResumeStore: handleResumeStoreAction,
    clearMessage,
  };

  return isMobile ? (
    <MarketplaceStoreListMobilePage {...pageProps} />
  ) : (
    <MarketplaceStoreListDesktopPage {...pageProps} />
  );
};

export default MarketplaceStoreListPage;
