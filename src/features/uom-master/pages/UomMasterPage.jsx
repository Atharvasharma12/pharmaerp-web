import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useUomMaster from "../hooks/useUomMaster";

import UomMasterDesktopPage from "./desktop/UomMasterDesktopPage";
import UomMasterMobilePage from "./mobile/UomMasterMobilePage.jsx";

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const mapUomForView = (u) => {
  const name = u?.name || "-";
  const abbreviation = u?.abbreviation || "-";
  const description = u?.description || "No description provided.";
  const isActive = u?.isActive !== false;

  return {
    ...u,
    displayName: name,
    displaySku: abbreviation,
    displayCategory: abbreviation,
    displayManufacturer: description,
    displayDosageForm: u?.description
      ? "Description Available"
      : "No Details",
    displayStrength: "-",
    displayStatus: isActive ? "active" : "inactive",
    displayAvailability: "Global",
  };
};

const UomMasterPage = () => {
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
    uomMasters,
    pagination,
    getUomMastersStatus,
    getUomMasterStatus,
    error,
    message,
    getUomMasters,
    clearError,
    clearMessage,
    clearCurrentUomMaster,
  } = useUomMaster();

  const isLoadingList = getUomMastersStatus === API_STATUS.LOADING;
  const isLoadingItem = getUomMasterStatus === API_STATUS.LOADING;
  const isLoading = isLoadingList || isLoadingItem;
  const hasError = getUomMastersStatus === API_STATUS.ERROR;

  const fetchUomCatalogData = useCallback(
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

        await getUomMasters(apiParams);
      } catch {
        // Handled via Redux slice
      }
    },
    [getUomMasters],
  );

  useEffect(() => {
    clearError();
    clearCurrentUomMaster();

    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchUomCatalogData(currentPage, pageSize, filters);
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
    return (Array.isArray(uomMasters) ? uomMasters : []).map(mapUomForView);
  }, [uomMasters]);

  const filteredRecords = useMemo(() => {
    const searchToken = normalizeText(filters.search);

    return mappedRecords.filter((u) => {
      const matchesSearch =
        !searchToken ||
        normalizeText(u.displayName).includes(searchToken) ||
        normalizeText(u.displaySku).includes(searchToken) ||
        normalizeText(u.displayManufacturer).includes(searchToken);

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
      (u) => u.displayStatus === "active",
    ).length;

    return [
      {
        id: "total_products",
        title: "Total Units (UOM)",
        value: totalItems,
        description: "Across global catalog database",
        colorVariant: "success",
      },
      {
        id: "categories",
        title: "Active UOMs",
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
      fetchUomCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchUomCatalogData],
  );

  const handleSearchChange = useCallback(
    (event) => {
      const value = event?.target?.value ?? event;
      const updatedFilters = { ...filters, search: value };

      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchUomCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchUomCatalogData],
  );

  const handleRemoveFilter = useCallback(
    (key) => {
      const updatedFilters = { ...filters, [key]: "all" };

      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchUomCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchUomCatalogData],
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
    fetchUomCatalogData(1, pageSize, cleared);
  }, [pageSize, fetchUomCatalogData]);

  const handleRefresh = useCallback(() => {
    fetchUomCatalogData(currentPage, pageSize, filters);
  }, [currentPage, pageSize, filters, fetchUomCatalogData]);

  const handlePageChange = useCallback(
    (newPage) => {
      const boundedPage = Math.max(1, newPage);
      setCurrentPage(boundedPage);
      fetchUomCatalogData(boundedPage, pageSize, filters);
    },
    [pageSize, filters, fetchUomCatalogData],
  );

  const handlePageSizeChange = useCallback(
    (size) => {
      setPageSize(size);
      setCurrentPage(1);
      fetchUomCatalogData(1, size, filters);
    },
    [filters, fetchUomCatalogData],
  );

  const handleViewProductDetails = useCallback(
    (u) => {
      if (!u?._id) return;
      navigate(`/catalog/uom-master/${u._id}`);
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
    <UomMasterMobilePage {...pageProps} />
  ) : (
    <UomMasterDesktopPage {...pageProps} />
  );
};

export default UomMasterPage;
