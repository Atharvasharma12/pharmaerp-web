import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useProductFormMaster from "../hooks/useProductFormMaster";

import ProductFormMasterDesktopPage from "./desktop/ProductFormMasterDesktopPage";
import ProductFormMasterMobilePage from "./mobile/ProductFormMasterMobilePage.jsx";

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const mapProductFormForView = (form) => {
  const name = form?.name || "-";
  const description = form?.description || "No description provided.";
  const isActive = form?.isActive !== false;

  return {
    ...form,
    displayName: name,
    displaySku: name,
    displayCategory: "Product Form",
    displayManufacturer: description,
    displayDosageForm: form?.description
      ? "Description Available"
      : "No Details",
    displayStrength: "-",
    displayStatus: isActive ? "active" : "inactive",
    displayAvailability: "Global",
  };
};

const ProductFormMasterPage = () => {
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
    productFormMasters,
    pagination,
    getProductFormMastersStatus,
    getProductFormMasterStatus,
    error,
    message,
    getProductFormMasters,
    clearError,
    clearMessage,
    clearCurrentProductFormMaster,
  } = useProductFormMaster();

  const isLoadingList = getProductFormMastersStatus === API_STATUS.LOADING;
  const isLoadingItem = getProductFormMasterStatus === API_STATUS.LOADING;
  const isLoading = isLoadingList || isLoadingItem;
  const hasError = getProductFormMastersStatus === API_STATUS.ERROR;

  const fetchProductFormCatalogData = useCallback(
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

        await getProductFormMasters(apiParams);
      } catch {
        // Handled via Redux slice
      }
    },
    [getProductFormMasters],
  );

  useEffect(() => {
    clearError();
    clearCurrentProductFormMaster();

    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchProductFormCatalogData(currentPage, pageSize, filters);
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
    return (Array.isArray(productFormMasters) ? productFormMasters : []).map(
      mapProductFormForView,
    );
  }, [productFormMasters]);

  const filteredRecords = useMemo(() => {
    const searchToken = normalizeText(filters.search);

    return mappedRecords.filter((form) => {
      const matchesSearch =
        !searchToken ||
        normalizeText(form.displayName).includes(searchToken) ||
        normalizeText(form.displayManufacturer).includes(searchToken);

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
      (form) => form.displayStatus === "active",
    ).length;

    return [
      {
        id: "total_products",
        title: "Total Product Forms",
        value: totalItems,
        description: "Across global catalog database",
        colorVariant: "success",
      },
      {
        id: "categories",
        title: "Active Forms",
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
      fetchProductFormCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchProductFormCatalogData],
  );

  const handleSearchChange = useCallback(
    (event) => {
      const value = event?.target?.value ?? event;
      const updatedFilters = { ...filters, search: value };

      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchProductFormCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchProductFormCatalogData],
  );

  const handleRemoveFilter = useCallback(
    (key) => {
      const updatedFilters = { ...filters, [key]: "all" };

      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchProductFormCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchProductFormCatalogData],
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
    fetchProductFormCatalogData(1, pageSize, cleared);
  }, [pageSize, fetchProductFormCatalogData]);

  const handleRefresh = useCallback(() => {
    fetchProductFormCatalogData(currentPage, pageSize, filters);
  }, [currentPage, pageSize, filters, fetchProductFormCatalogData]);

  const handlePageChange = useCallback(
    (newPage) => {
      const boundedPage = Math.max(1, newPage);
      setCurrentPage(boundedPage);
      fetchProductFormCatalogData(boundedPage, pageSize, filters);
    },
    [pageSize, filters, fetchProductFormCatalogData],
  );

  const handlePageSizeChange = useCallback(
    (size) => {
      setPageSize(size);
      setCurrentPage(1);
      fetchProductFormCatalogData(1, size, filters);
    },
    [filters, fetchProductFormCatalogData],
  );

  const handleViewProductDetails = useCallback(
    (form) => {
      if (!form?._id) return;
      navigate(`/catalog/product-form-master/${form._id}`);
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
    <ProductFormMasterMobilePage {...pageProps} />
  ) : (
    <ProductFormMasterDesktopPage {...pageProps} />
  );
};

export default ProductFormMasterPage;
