import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useHsnMaster from "../hooks/useHsnMaster";

import HsnMasterDesktopPage from "./desktop/HsnMasterDesktopPage";
import HsnMasterMobilePage from "./mobile/HsnMasterMobilePage.jsx";

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const formatGSTLabel = (rate) => {
  if (rate === null || rate === undefined) return "-";
  return `${rate}% GST`;
};

const mapHsnForView = (hsn) => {
  const code = hsn?.code ? String(hsn.code) : "-";
  const description = hsn?.description || "No description provided.";
  const gstRate = hsn?.gstRate ?? null;
  const isActive = hsn?.isActive !== false;

  return {
    ...hsn,
    displayName: `HSN ${code}`,
    displaySku: code,
    displayCategory: formatGSTLabel(gstRate),
    displayManufacturer: description,
    displayDosageForm: hsn?.description
      ? "Description Available"
      : "No Details",
    displayStrength: gstRate !== null ? `${gstRate}%` : "-",
    displayStatus: isActive ? "active" : "inactive",
    displayAvailability: "Global",
  };
};

const HsnMasterPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(false);

  const [filters, setFilters] = useState({
    search: "",
    category: "all", // maps to gstRate filter selection
    manufacturer: "all",
    productForm: "all",
    status: "all", // maps to isActive filter selection
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    hsnMasters,
    pagination,
    getHsnMastersStatus,
    getHsnMasterStatus,
    error,
    message,
    getHsnMasters,
    clearError,
    clearMessage,
    clearCurrentHsnMaster,
  } = useHsnMaster();

  const isLoadingList = getHsnMastersStatus === API_STATUS.LOADING;
  const isLoadingItem = getHsnMasterStatus === API_STATUS.LOADING;
  const isLoading = isLoadingList || isLoadingItem;
  const hasError = getHsnMastersStatus === API_STATUS.ERROR;

  // Unified data loader matching backend filter definitions
  const fetchHsnCatalogData = useCallback(
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
        if (filterVal.category !== "all") {
          apiParams.gstRate = filterVal.category;
        }

        await getHsnMasters(apiParams);
      } catch {
        // Gracefully handled via state machine slice definitions
      }
    },
    [getHsnMasters],
  );

  // Page initialization guard matching layout standard rules
  useEffect(() => {
    clearError();
    clearCurrentHsnMaster();

    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchHsnCatalogData(currentPage, pageSize, filters);
    }

    return () => {
      clearError();
    };
    // Standard initialization rules enforce single initial invocation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!message) return undefined;

    const timer = window.setTimeout(() => {
      clearMessage();
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [clearMessage, message]);

  const mappedHsnRecords = useMemo(() => {
    return (Array.isArray(hsnMasters) ? hsnMasters : []).map(mapHsnForView);
  }, [hsnMasters]);

  // Client-side local filtering for real-time adjustments matching view tokens
  const filteredHsnRecords = useMemo(() => {
    const searchToken = normalizeText(filters.search);

    return mappedHsnRecords.filter((hsn) => {
      const matchesSearch =
        !searchToken ||
        normalizeText(hsn.displaySku).includes(searchToken) ||
        normalizeText(hsn.displayManufacturer).includes(searchToken);

      return matchesSearch;
    });
  }, [filters, mappedHsnRecords]);

  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (filters.search) {
      chips.push({ key: "search", label: `Search: ${filters.search}` });
    }
    if (filters.category !== "all") {
      chips.push({
        key: "category",
        label: `Tax Slab: ${filters.category}%`,
      });
    }
    if (filters.status !== "all") {
      chips.push({
        key: "status",
        label: `Status: ${filters.status === "true" ? "Active" : "Inactive"}`,
      });
    }

    return chips;
  }, [filters]);

  const gstRateOptions = useMemo(() => {
    return [
      { label: "All Tax Rates", value: "all" },
      { label: "0% Slab", value: 0 },
      { label: "5% Slab", value: 5 },
      { label: "12% Slab", value: 12 },
      { label: "18% Slab", value: 18 },
      { label: "28% Slab", value: 28 },
    ];
  }, []);

  const dashboardStats = useMemo(() => {
    const totalHsnItems = pagination?.total || filteredHsnRecords.length;

    const activeHsnCount = mappedHsnRecords.filter(
      (h) => h.displayStatus === "active",
    ).length;

    const distinctRatesCount = new Set(
      mappedHsnRecords.map((h) => h.gstRate).filter((r) => r !== null),
    ).size;

    return [
      {
        id: "total_products", // matches layout component lookups mapping
        title: "Total Master HSN Codes",
        value: totalHsnItems,
        description: "Across global catalog database",
        colorVariant: "success",
      },
      {
        id: "categories",
        title: "Active Codes",
        value: activeHsnCount,
        description: "Currently usable records",
        colorVariant: "purple",
      },
      {
        id: "manufacturers",
        title: "Active GST Slabs",
        value: distinctRatesCount || 5,
        description: "Distinct tax rules mapped",
        colorVariant: "info",
      },
    ];
  }, [pagination, filteredHsnRecords, mappedHsnRecords]);

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
      fetchHsnCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchHsnCatalogData],
  );

  const handleSearchChange = useCallback(
    (event) => {
      const value = event?.target?.value ?? event;
      const updatedFilters = { ...filters, search: value };

      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchHsnCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchHsnCatalogData],
  );

  const handleRemoveFilter = useCallback(
    (key) => {
      const updatedFilters = { ...filters, [key]: "all" };

      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchHsnCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchHsnCatalogData],
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
    fetchHsnCatalogData(1, pageSize, cleared);
  }, [pageSize, fetchHsnCatalogData]);

  const handleRefresh = useCallback(() => {
    fetchHsnCatalogData(currentPage, pageSize, filters);
  }, [currentPage, pageSize, filters, fetchHsnCatalogData]);

  const handlePageChange = useCallback(
    (newPage) => {
      const boundedPage = Math.max(1, newPage);
      setCurrentPage(boundedPage);
      fetchHsnCatalogData(boundedPage, pageSize, filters);
    },
    [pageSize, filters, fetchHsnCatalogData],
  );

  const handlePageSizeChange = useCallback(
    (size) => {
      setPageSize(size);
      setCurrentPage(1);
      fetchHsnCatalogData(1, size, filters);
    },
    [filters, fetchHsnCatalogData],
  );

  const handleViewProductDetails = useCallback(
    (hsn) => {
      if (!hsn?._id) return;
      navigate(`/catalog/hsn-master/${hsn._id}`);
    },
    [navigate],
  );

  const handleExportCatalog = useCallback(() => {
    // Structural architectural pipeline trigger point
  }, []);

  const pageProps = {
    products: filteredHsnRecords, // generic layout key compatibility
    dashboardStats,
    filters,
    activeFilterChips,
    categoryOptions: gstRateOptions,
    dosageFormOptions: [{ label: "All Records", value: "all" }],

    isLoading,
    hasError,
    error,
    message,

    totalProducts: pagination?.total || filteredHsnRecords.length,
    currentPage: pagination?.page || currentPage,
    totalPages: pagination?.totalPages || 1,
    pageSize,

    hasProducts: mappedHsnRecords.length > 0,
    hasFilteredProducts: filteredHsnRecords.length > 0,

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
    <HsnMasterMobilePage {...pageProps} />
  ) : (
    <HsnMasterDesktopPage {...pageProps} />
  );
};

export default HsnMasterPage;
