import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useManufacturerMaster from "../hooks/useManufacturerMaster";

import ManufacturerMasterDesktopPage from "./desktop/ManufacturerMasterDesktopPage";
import ManufacturerMasterMobilePage from "./mobile/ManufacturerMasterMobilePage.jsx";

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const mapManufacturerForView = (m) => {
  const name = m?.name || "-";
  const description = m?.description || "No description provided.";
  const isActive = m?.isActive !== false;

  return {
    ...m,
    displayName: name,
    displaySku: name,
    displayCategory: "Manufacturer",
    displayManufacturer: description,
    displayDosageForm: m?.description
      ? "Description Available"
      : "No Details",
    displayStrength: "-",
    displayStatus: isActive ? "active" : "inactive",
    displayAvailability: "Global",
  };
};

const ManufacturerMasterPage = () => {
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
    manufacturerMasters,
    pagination,
    getManufacturerMastersStatus,
    getManufacturerMasterStatus,
    error,
    message,
    getManufacturerMasters,
    clearError,
    clearMessage,
    clearCurrentManufacturerMaster,
  } = useManufacturerMaster();

  const isLoadingList = getManufacturerMastersStatus === API_STATUS.LOADING;
  const isLoadingItem = getManufacturerMasterStatus === API_STATUS.LOADING;
  const isLoading = isLoadingList || isLoadingItem;
  const hasError = getManufacturerMastersStatus === API_STATUS.ERROR;

  const fetchManufacturerCatalogData = useCallback(
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

        await getManufacturerMasters(apiParams);
      } catch {
        // Handled via Redux slice
      }
    },
    [getManufacturerMasters],
  );

  useEffect(() => {
    clearError();
    clearCurrentManufacturerMaster();

    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchManufacturerCatalogData(currentPage, pageSize, filters);
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
    return (Array.isArray(manufacturerMasters) ? manufacturerMasters : []).map(
      mapManufacturerForView,
    );
  }, [manufacturerMasters]);

  const filteredRecords = useMemo(() => {
    const searchToken = normalizeText(filters.search);

    return mappedRecords.filter((m) => {
      const matchesSearch =
        !searchToken ||
        normalizeText(m.displayName).includes(searchToken) ||
        normalizeText(m.displayManufacturer).includes(searchToken);

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
      (m) => m.displayStatus === "active",
    ).length;

    return [
      {
        id: "total_products",
        title: "Total Manufacturers",
        value: totalItems,
        description: "Across global catalog database",
        colorVariant: "success",
      },
      {
        id: "categories",
        title: "Active Manufacturers",
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
      fetchManufacturerCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchManufacturerCatalogData],
  );

  const handleSearchChange = useCallback(
    (event) => {
      const value = event?.target?.value ?? event;
      const updatedFilters = { ...filters, search: value };

      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchManufacturerCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchManufacturerCatalogData],
  );

  const handleRemoveFilter = useCallback(
    (key) => {
      const updatedFilters = { ...filters, [key]: "all" };

      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchManufacturerCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchManufacturerCatalogData],
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
    fetchManufacturerCatalogData(1, pageSize, cleared);
  }, [pageSize, fetchManufacturerCatalogData]);

  const handleRefresh = useCallback(() => {
    fetchManufacturerCatalogData(currentPage, pageSize, filters);
  }, [currentPage, pageSize, filters, fetchManufacturerCatalogData]);

  const handlePageChange = useCallback(
    (newPage) => {
      const boundedPage = Math.max(1, newPage);
      setCurrentPage(boundedPage);
      fetchManufacturerCatalogData(boundedPage, pageSize, filters);
    },
    [pageSize, filters, fetchManufacturerCatalogData],
  );

  const handlePageSizeChange = useCallback(
    (size) => {
      setPageSize(size);
      setCurrentPage(1);
      fetchManufacturerCatalogData(1, size, filters);
    },
    [filters, fetchManufacturerCatalogData],
  );

  const handleViewProductDetails = useCallback(
    (m) => {
      if (!m?._id) return;
      navigate(`/catalog/manufacturer-master/${m._id}`);
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
    handlePageChange,
    handlePageSizeChange,
    handleViewProductDetails,
    handleExportCatalog,
    clearMessage,
  };

  return isMobile ? (
    <ManufacturerMasterMobilePage {...pageProps} />
  ) : (
    <ManufacturerMasterDesktopPage {...pageProps} />
  );
};

export default ManufacturerMasterPage;
