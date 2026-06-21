import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useSaltMaster from "../hooks/useSaltMaster";

import SaltMasterDesktopPage from "./desktop/SaltMasterDesktopPage";
import SaltMasterMobilePage from "./mobile/SaltMasterMobilePage.jsx";

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const mapSaltForView = (salt) => {
  const name = salt?.name || "-";
  const description = salt?.description || "No description provided.";
  const isActive = salt?.isActive !== false;

  return {
    ...salt,
    displayName: name,
    displaySku: name,
    displayCategory: "Salt",
    displayManufacturer: description,
    displayDosageForm: salt?.description
      ? "Description Available"
      : "No Details",
    displayStrength: "-",
    displayStatus: isActive ? "active" : "inactive",
    displayAvailability: "Global",
  };
};

const SaltMasterPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(false);

  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    manufacturer: "all",
    productForm: "all",
    status: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    saltMasters,
    pagination,
    getSaltMastersStatus,
    getSaltMasterStatus,
    error,
    message,
    getSaltMasters,
    clearError,
    clearMessage,
    clearCurrentSaltMaster,
  } = useSaltMaster();

  const isLoadingList = getSaltMastersStatus === API_STATUS.LOADING;
  const isLoadingItem = getSaltMasterStatus === API_STATUS.LOADING;
  const isLoading = isLoadingList || isLoadingItem;
  const hasError = getSaltMastersStatus === API_STATUS.ERROR;

  const fetchSaltCatalogData = useCallback(
    async (pageVal = currentPage, sizeVal = pageSize, filterVal = filters) => {
      try {
        const apiParams = {
          page: pageVal,
          limit: sizeVal,
        };

        if (filterVal.search) {
          apiParams.search = filterVal.search;
        }
        if (filterVal.status !== "all") {
          apiParams.isActive = filterVal.status;
        }

        await getSaltMasters(apiParams);
      } catch {
        // Handled via Redux slice
      }
    },
    [getSaltMasters],
  );

  useEffect(() => {
    clearError();
    clearCurrentSaltMaster();

    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchSaltCatalogData(currentPage, pageSize, filters);
    }

    return () => {
      clearError();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!message) return undefined;

    const timer = window.setTimeout(() => {
      clearMessage();
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [clearMessage, message]);

  const mappedRecords = useMemo(() => {
    return (Array.isArray(saltMasters) ? saltMasters : []).map(
      mapSaltForView,
    );
  }, [saltMasters]);

  const filteredRecords = useMemo(() => {
    const searchToken = normalizeText(filters.search);

    return mappedRecords.filter((salt) => {
      const matchesSearch =
        !searchToken ||
        normalizeText(salt.displayName).includes(searchToken) ||
        normalizeText(salt.displayManufacturer).includes(searchToken);

      return matchesSearch;
    });
  }, [filters, mappedRecords]);

  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (filters.search) {
      chips.push({ key: "search", label: `Search: ${filters.search}` });
    }
    if (filters.status !== "all") {
      chips.push({
        key: "status",
        label: `Status: ${filters.status === "true" ? "Active" : "Inactive"}`,
      });
    }

    return chips;
  }, [filters]);

  const dashboardStats = useMemo(() => {
    const totalItems = pagination?.total || filteredRecords.length;

    const activeCount = mappedRecords.filter(
      (salt) => salt.displayStatus === "active",
    ).length;

    return [
      {
        id: "total_products",
        title: "Total Salts",
        value: totalItems,
        description: "Across global catalog database",
        colorVariant: "success",
      },
      {
        id: "categories",
        title: "Active Salts",
        value: activeCount,
        description: "Currently usable records",
        colorVariant: "purple",
      },
      {
        id: "manufacturers",
        title: "Database Scope",
        value: "Global",
        description: "Central platform control",
        colorVariant: "info",
      },
    ];
  }, [pagination, filteredRecords, mappedRecords]);

  const handleFilterChange = useCallback(
    (eventOrValue) => {
      let updatedFilters = { ...filters };

      if (eventOrValue?.target) {
        const { name, value } = eventOrValue.target;
        updatedFilters = { ...filters, [name]: value };
      } else {
        updatedFilters = { ...filters, ...eventOrValue };
      }

      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchSaltCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchSaltCatalogData],
  );

  const handleSearchChange = useCallback(
    (event) => {
      const value = event?.target?.value ?? event;
      const updatedFilters = { ...filters, search: value };

      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchSaltCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchSaltCatalogData],
  );

  const handleRemoveFilter = useCallback(
    (key) => {
      const updatedFilters = { ...filters, [key]: "all" };

      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchSaltCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchSaltCatalogData],
  );

  const handleClearFilters = useCallback(() => {
    const cleared = {
      search: "",
      category: "all",
      manufacturer: "all",
      productForm: "all",
      status: "all",
    };
    setFilters(cleared);
    setCurrentPage(1);
    fetchSaltCatalogData(1, pageSize, cleared);
  }, [pageSize, fetchSaltCatalogData]);

  const handleRefresh = useCallback(() => {
    fetchSaltCatalogData(currentPage, pageSize, filters);
  }, [currentPage, pageSize, filters, fetchSaltCatalogData]);
  const handleBackToCatalog = useCallback(() => {
    navigate('/catalog');
  }, [navigate]);

  const handlePageChange = useCallback(
    (newPage) => {
      const boundedPage = Math.max(1, newPage);
      setCurrentPage(boundedPage);
      fetchSaltCatalogData(boundedPage, pageSize, filters);
    },
    [pageSize, filters, fetchSaltCatalogData],
  );

  const handlePageSizeChange = useCallback(
    (size) => {
      setPageSize(size);
      setCurrentPage(1);
      fetchSaltCatalogData(1, size, filters);
    },
    [filters, fetchSaltCatalogData],
  );

  const handleViewProductDetails = useCallback(
    (salt) => {
      if (!salt?._id) return;
      navigate(`/catalog/salt-master/${salt._id}`);
    },
    [navigate],
  );

  const handleExportCatalog = useCallback(() => {
    // Stub
  }, []);

  const pageProps = {
    products: filteredRecords,
    dashboardStats,
    filters,
    activeFilterChips,
    categoryOptions: [],
    dosageFormOptions: [{ label: "All Records", value: "all" }],

    isLoading,
    hasError,
    error,
    message,

    totalProducts: pagination?.total || filteredRecords.length,
    currentPage: pagination?.page || currentPage,
    totalPages: pagination?.totalPages || 1,
    pageSize,

    hasProducts: mappedRecords.length > 0,
    hasFilteredProducts: filteredRecords.length > 0,

    handleFilterChange,
    handleSearchChange,
    handleRemoveFilter,
    handleClearFilters,
    handleRefresh,
    handleBackToCatalog,
    handlePageChange,
    handlePageSizeChange,
    handleViewProductDetails,
    handleExportCatalog,
    clearMessage,
  };

  return isMobile ? (
    <SaltMasterMobilePage {...pageProps} />
  ) : (
    <SaltMasterDesktopPage {...pageProps} />
  );
};

export default SaltMasterPage;
