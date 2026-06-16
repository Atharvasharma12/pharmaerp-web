// src/features/global-products/pages/GlobalProductsPage.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useGlobalProduct from "../hooks/useGlobalProduct";

import GlobalProductsDesktopPage from "./desktop/GlobalProductsDesktopPage";
import GlobalProductsMobilePage from "./mobile/GlobalProductsMobilePage";

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const formatStringTitle = (value) => {
  if (!value) return "-";
  return String(value)
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const mapProductForView = (product) => {
  const name = product?.name || "-";
  const globalProductCode = product?.globalProductCode || "-";
  const productForm = product?.productForm || "-";
  const qty = product?.qty || "-";
  const marketer = product?.marketer || "-";
  const status = product?.status || "inactive";

  let calculatedCategory = "-";
  if (product?.productType === "medicine") {
    calculatedCategory = product?.medicineDetails?.medicineType || "Medicine";
  } else if (product?.productType === "otc") {
    calculatedCategory = product?.otcDetails?.category || "OTC";
  }

  return {
    ...product,
    displayName: name,
    displaySku: globalProductCode,
    displayCategory: formatStringTitle(calculatedCategory),
    displayManufacturer: marketer,
    displayDosageForm: formatStringTitle(productForm),
    displayStrength: qty,
    displayStatus: status,
    displayAvailability: "Global",
  };
};

const GlobalProductsPage = () => {
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
    products,
    pagination,
    getGlobalProductsStatus,
    getGlobalProductStatus,
    error,
    message,
    getGlobalProducts,
    clearError,
    clearMessage,
    clearCurrentGlobalProduct,
  } = useGlobalProduct();

  const isLoadingList = getGlobalProductsStatus === API_STATUS.LOADING;
  const isLoadingItem = getGlobalProductStatus === API_STATUS.LOADING;
  const isLoading = isLoadingList || isLoadingItem;
  const hasError = getGlobalProductsStatus === API_STATUS.ERROR;

  // Unified data loader matching architecture parameters
  const fetchGlobalCatalogData = useCallback(
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
          apiParams.status = filterVal.status;
        }
        if (filterVal.category !== "all") {
          apiParams.productType = filterVal.category;
        }

        await getGlobalProducts(apiParams);
      } catch {
        // Gracefully handled via state machine slice definitions
      }
    },
    [getGlobalProducts],
  );

  // Page initialization effect loop guard matching RolesPage.jsx pattern
  useEffect(() => {
    clearError();
    clearCurrentGlobalProduct();

    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchGlobalCatalogData(currentPage, pageSize, filters);
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

  const mappedProducts = useMemo(() => {
    return (Array.isArray(products) ? products : []).map(mapProductForView);
  }, [products]);

  const filteredProducts = useMemo(() => {
    const searchToken = normalizeText(filters.search);
    const dosageToken = normalizeText(filters.productForm);

    return mappedProducts.filter((product) => {
      const matchesSearch =
        !searchToken ||
        normalizeText(product.displayName).includes(searchToken) ||
        normalizeText(product.displaySku).includes(searchToken) ||
        normalizeText(product.displayManufacturer).includes(searchToken);

      const matchesDosageForm =
        filters.productForm === "all" ||
        normalizeText(product.productForm) === dosageToken ||
        normalizeText(product.displayDosageForm).includes(dosageToken);

      return matchesSearch && matchesDosageForm;
    });
  }, [filters, mappedProducts]);

  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (filters.search) {
      chips.push({ key: "search", label: `Search: ${filters.search}` });
    }
    if (filters.category !== "all") {
      chips.push({
        key: "category",
        label: `Type: ${formatStringTitle(filters.category)}`,
      });
    }
    if (filters.productForm !== "all") {
      chips.push({
        key: "productForm",
        label: `Form: ${formatStringTitle(filters.productForm)}`,
      });
    }

    return chips;
  }, [filters]);

  const categoryOptions = useMemo(() => {
    const sourceArr = Array.isArray(products) ? products : [];
    const uniqueTypes = new Set(
      sourceArr.map((p) => p?.productType).filter(Boolean),
    );
    return [
      { label: "All Categories", value: "all" },
      ...Array.from(uniqueTypes).map((type) => ({
        label: formatStringTitle(type),
        value: type,
      })),
    ];
  }, [products]);

  const dosageFormOptions = useMemo(() => {
    const sourceArr = Array.isArray(products) ? products : [];
    const uniqueForms = new Set(
      sourceArr.map((p) => p?.productForm).filter(Boolean),
    );
    return [
      { label: "All Dosage Forms", value: "all" },
      ...Array.from(uniqueForms).map((form) => ({
        label: formatStringTitle(form),
        value: form,
      })),
    ];
  }, [products]);

  const dashboardStats = useMemo(() => {
    const totalGlobalItems = pagination?.total || filteredProducts.length;

    const uniqueCategoriesCount = new Set(
      mappedProducts
        .map((p) => normalizeText(p.displayCategory))
        .filter((c) => c !== "-"),
    ).size;

    const uniqueManufacturersCount = new Set(
      mappedProducts
        .map((p) => normalizeText(p.displayManufacturer))
        .filter((m) => m !== "-"),
    ).size;

    return [
      {
        id: "total_products",
        title: "Total Global Products",
        value: totalGlobalItems,
        description: "All active global products",
        colorVariant: "success",
      },
      {
        id: "categories",
        title: "Categories",
        value: uniqueCategoriesCount,
        description: "Product categories",
        colorVariant: "purple",
      },
      {
        id: "manufacturers",
        title: "Manufacturers",
        value: uniqueManufacturersCount,
        description: "Across master catalog",
        colorVariant: "info",
      },
    ];
  }, [pagination, filteredProducts, mappedProducts]);

  const handleFilterChange = useCallback(
    (eventOrValue) => {
      let updatedFilters = { ...filters };

      if (eventOrValue?.target) {
        const { name, value } = eventOrValue.target;
        updatedFilters = { ...prev, [name]: value };
      } else {
        updatedFilters = { ...filters, ...eventOrValue };
      }

      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchGlobalCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchGlobalCatalogData],
  );

  const handleSearchChange = useCallback(
    (event) => {
      const value = event?.target?.value ?? event;
      const updatedFilters = { ...filters, search: value };

      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchGlobalCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchGlobalCatalogData],
  );

  const handleRemoveFilter = useCallback(
    (key) => {
      const updatedFilters = { ...filters, [key]: "all" };

      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchGlobalCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchGlobalCatalogData],
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
    fetchGlobalCatalogData(1, pageSize, cleared);
  }, [pageSize, fetchGlobalCatalogData]);

  const handleRefresh = useCallback(() => {
    fetchGlobalCatalogData(currentPage, pageSize, filters);
  }, [currentPage, pageSize, filters, fetchGlobalCatalogData]);

  const handlePageChange = useCallback(
    (newPage) => {
      const boundedPage = Math.max(1, newPage);
      setCurrentPage(boundedPage);
      fetchGlobalCatalogData(boundedPage, pageSize, filters);
    },
    [pageSize, filters, fetchGlobalCatalogData],
  );

  const handlePageSizeChange = useCallback(
    (size) => {
      setPageSize(size);
      setCurrentPage(1);
      fetchGlobalCatalogData(1, size, filters);
    },
    [filters, fetchGlobalCatalogData],
  );

  const handleViewProductDetails = useCallback(
    (product) => {
      if (!product?._id) return;
      navigate(
        ROUTES.GLOBAL_PRODUCT_DETAILS.replace(":productId", product._id),
      );
    },
    [navigate],
  );

  const handleExportCatalog = useCallback(() => {
    // Structural architectural pipeline trigger point
  }, []);

  const handleViewImportHistory = useCallback(() => {
    navigate(ROUTES.GLOBAL_PRODUCT_IMPORT_HISTORY || "/catalog/import-history");
  }, [navigate]);

  const pageProps = {
    products: filteredProducts,
    dashboardStats,
    filters,
    activeFilterChips,
    categoryOptions,
    dosageFormOptions,

    isLoading,
    hasError,
    error,
    message,

    totalProducts: pagination?.total || filteredProducts.length,
    currentPage: pagination?.page || currentPage,
    totalPages: pagination?.totalPages || 1,
    pageSize,

    hasProducts: mappedProducts.length > 0,
    hasFilteredProducts: filteredProducts.length > 0,

    handleFilterChange,
    handleSearchChange,
    handleRemoveFilter,
    handleClearFilters,
    handleRefresh,
    handlePageChange,
    handlePageSizeChange,
    handleViewProductDetails,
    handleExportCatalog,
    handleViewImportHistory,
    clearMessage,
  };

  return isMobile ? (
    <GlobalProductsMobilePage {...pageProps} />
  ) : (
    <GlobalProductsDesktopPage {...pageProps} />
  );
};

export default GlobalProductsPage;
