import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useCategoryMaster from "../hooks/useCategoryMaster";

import CategoryMasterDesktopPage from "./desktop/CategoryMasterDesktopPage";
import CategoryMasterMobilePage from "./mobile/CategoryMasterMobilePage.jsx";

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const mapCategoryForView = (cat) => {
  const name = cat?.name || "-";
  const slug = cat?.slug || "-";
  const description = cat?.description || "No description provided.";
  const isActive = cat?.isActive !== false;
  const levelText = cat?.level !== undefined ? `Level ${cat.level}` : "Level 0";

  return {
    ...cat,
    displayName: name,
    displaySku: slug,
    displayCategory: levelText,
    displayManufacturer: description,
    displayDosageForm: cat?.parentCategory ? "Child Category" : "Top Level Category",
    displayStrength: "-",
    displayStatus: isActive ? "active" : "inactive",
    displayAvailability: "Global",
  };
};

const CategoryMasterPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(false);

  const [filters, setFilters] = useState({
    search: "",
    category: "all", // maps to level filter selection
    manufacturer: "all",
    productForm: "all",
    status: "all", // maps to isActive filter selection
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    categoryMasters,
    pagination,
    getCategoryMastersStatus,
    getCategoryMasterStatus,
    error,
    message,
    getCategoryMasters,
    clearError,
    clearMessage,
    clearCurrentCategoryMaster,
  } = useCategoryMaster();

  const isLoadingList = getCategoryMastersStatus === API_STATUS.LOADING;
  const isLoadingItem = getCategoryMasterStatus === API_STATUS.LOADING;
  const isLoading = isLoadingList || isLoadingItem;
  const hasError = getCategoryMastersStatus === API_STATUS.ERROR;

  const fetchCategoryCatalogData = useCallback(
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
          apiParams.level = filterVal.category;
        }

        await getCategoryMasters(apiParams);
      } catch {
        // Handled via Redux slice
      }
    },
    [getCategoryMasters],
  );

  useEffect(() => {
    clearError();
    clearCurrentCategoryMaster();

    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchCategoryCatalogData(currentPage, pageSize, filters);
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
    return (Array.isArray(categoryMasters) ? categoryMasters : []).map(
      mapCategoryForView,
    );
  }, [categoryMasters]);

  const filteredRecords = useMemo(() => {
    const searchToken = normalizeText(filters.search);

    return mappedRecords.filter((cat) => {
      const matchesSearch =
        !searchToken ||
        normalizeText(cat.displayName).includes(searchToken) ||
        normalizeText(cat.displaySku).includes(searchToken) ||
        normalizeText(cat.displayManufacturer).includes(searchToken);

      return matchesSearch;
    });
  }, [filters, mappedRecords]);

  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (filters.search) {
      chips.push({ key: "search", label: `Search: ${filters.search}` });
    }
    if (filters.category !== "all") {
      chips.push({
        key: "category",
        label: `Level: ${filters.category}`,
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

  const levelOptions = useMemo(() => {
    return [
      { label: "All Levels", value: "all" },
      { label: "Level 0 (Root)", value: 0 },
      { label: "Level 1 (Sub-category)", value: 1 },
      { label: "Level 2 (Sub-sub-category)", value: 2 },
    ];
  }, []);

  const dashboardStats = useMemo(() => {
    const totalItems = pagination?.total || filteredRecords.length;

    const activeCount = mappedRecords.filter(
      (cat) => cat.displayStatus === "active",
    ).length;

    const rootLevelsCount = mappedRecords.filter(
      (cat) => cat.level === 0,
    ).length;

    return [
      {
        id: "total_products",
        title: "Total Categories",
        value: totalItems,
        description: "Across global catalog database",
        colorVariant: "success",
      },
      {
        id: "categories",
        title: "Active Categories",
        value: activeCount,
        description: "Currently usable records",
        colorVariant: "purple",
      },
      {
        id: "manufacturers",
        title: "Root Categories",
        value: rootLevelsCount || 0,
        description: "Level 0 parent classifications",
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
      fetchCategoryCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchCategoryCatalogData],
  );

  const handleSearchChange = useCallback(
    (event) => {
      const value = event?.target?.value ?? event;
      const updatedFilters = { ...filters, search: value };

      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchCategoryCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchCategoryCatalogData],
  );

  const handleRemoveFilter = useCallback(
    (key) => {
      const updatedFilters = { ...filters, [key]: "all" };

      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchCategoryCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchCategoryCatalogData],
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
    fetchCategoryCatalogData(1, pageSize, cleared);
  }, [pageSize, fetchCategoryCatalogData]);

  const handleRefresh = useCallback(() => {
    fetchCategoryCatalogData(currentPage, pageSize, filters);
  }, [currentPage, pageSize, filters, fetchCategoryCatalogData]);
  const handleBackToCatalog = useCallback(() => {
    navigate('/catalog');
  }, [navigate]);


  const handlePageChange = useCallback(
    (newPage) => {
      const boundedPage = Math.max(1, newPage);
      setCurrentPage(boundedPage);
      fetchCategoryCatalogData(boundedPage, pageSize, filters);
    },
    [pageSize, filters, fetchCategoryCatalogData],
  );

  const handlePageSizeChange = useCallback(
    (size) => {
      setPageSize(size);
      setCurrentPage(1);
      fetchCategoryCatalogData(1, size, filters);
    },
    [filters, fetchCategoryCatalogData],
  );

  const handleViewProductDetails = useCallback(
    (cat) => {
      if (!cat?._id) return;
      navigate(`/catalog/category-master/${cat._id}`);
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
    categoryOptions: levelOptions,
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
    <CategoryMasterMobilePage {...pageProps} />
  ) : (
    <CategoryMasterDesktopPage {...pageProps} />
  );
};

export default CategoryMasterPage;
