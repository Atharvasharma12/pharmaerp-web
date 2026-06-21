// src/features/workspace-products/pages/WorkspaceProductsPage.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useWorkspaceProduct from "../hooks/useWorkspaceProduct";
import WorkspaceProductsDesktopPage from "./desktop/WorkspaceProductsDesktopPage";
import WorkspaceProductsMobilePage from "./mobile/WorkspaceProductsMobilePage";

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

const mapWorkspaceProductForView = (product) => {
  return {
    ...product,
    displayName: product?.name || "-",
    displaySku: product?.workspaceProductCode || "-",
    displayCategory: product?.category?.name || formatStringTitle(product?.productType || "Custom"),
    displayManufacturer: product?.manufacturer?.name || product?.manufacturer || "-",
    displayDosageForm: product?.productForm?.name || product?.productForm || "-",
    displayStrength: Array.isArray(product?.composition) && product.composition.length > 0
      ? product.composition.map((c) => {
          const saltName = c.salt?.name || (typeof c.salt === "object" && c.salt !== null ? c.salt.name : "Unknown");
          return `${saltName} ${c.strength}${c.unit}`;
        }).join(", ")
      : "-",
    displayStatus: product?.status || "inactive",
    displayAvailability: "Workspace",
  };
};

const WorkspaceProductsPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(false);

  const [filters, setFilters] = useState({
    search: "",
    productType: "all",
    status: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    products,
    pagination,
    getWorkspaceProductsStatus,
    deleteWorkspaceProductStatus,
    error,
    message,
    getWorkspaceProducts,
    deleteWorkspaceProduct,
    clearError,
    clearMessage,
    clearCurrentWorkspaceProduct,
  } = useWorkspaceProduct();

  const isLoadingList = getWorkspaceProductsStatus === API_STATUS.LOADING;
  const isDeletingItem = deleteWorkspaceProductStatus === API_STATUS.LOADING;
  const isLoading = isLoadingList || isDeletingItem;
  const hasError = getWorkspaceProductsStatus === API_STATUS.ERROR;

  const fetchWorkspaceCatalogData = useCallback(
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
        if (filterVal.productType !== "all") {
          apiParams.productType = filterVal.productType;
        }

        await getWorkspaceProducts(apiParams);
      } catch {
        // Gracefully trapped via feature state slice boundaries
      }
    },
    [getWorkspaceProducts],
  );

  useEffect(() => {
    clearError();
    clearCurrentWorkspaceProduct();

    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchWorkspaceCatalogData(currentPage, pageSize, filters);
    }

    return () => {
      clearError();
    };
    // Standard initialization rules enforce single initial instantiation call
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
    return (Array.isArray(products) ? products : []).map(
      mapWorkspaceProductForView,
    );
  }, [products]);

  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (filters.search) {
      chips.push({ key: "search", label: `Search: ${filters.search}` });
    }
    if (filters.productType !== "all") {
      chips.push({
        key: "productType",
        label: `Type: ${formatStringTitle(filters.productType)}`,
      });
    }
    if (filters.status !== "all") {
      chips.push({
        key: "status",
        label: `Status: ${formatStringTitle(filters.status)}`,
      });
    }

    return chips;
  }, [filters]);

  const productTypeOptions = useMemo(() => {
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

  const dashboardStats = useMemo(() => {
    const totalItems = pagination?.total || mappedProducts.length;
    const activeCount = mappedProducts.filter(
      (p) => p.displayStatus === "active",
    ).length;
    const inactiveCount = totalItems - activeCount;

    return [
      {
        id: "total_products",
        title: "Total Custom Products",
        value: totalItems,
        description: "Workspace specific items",
        colorVariant: "primary",
      },
      {
        id: "active_products",
        title: "Active Products",
        value: activeCount,
        description: "Available for batches",
        colorVariant: "success",
      },
      {
        id: "inactive_products",
        title: "Inactive Products",
        value: inactiveCount,
        description: "Disabled stock targets",
        colorVariant: "warning",
      },
    ];
  }, [pagination, mappedProducts]);

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
      fetchWorkspaceCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchWorkspaceCatalogData],
  );

  const handleSearchChange = useCallback(
    (event) => {
      const value = event?.target?.value ?? event;
      const updatedFilters = { ...filters, search: value };

      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchWorkspaceCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchWorkspaceCatalogData],
  );

  const handleRemoveFilter = useCallback(
    (key) => {
      const updatedFilters = { ...filters, [key]: "all" };

      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchWorkspaceCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchWorkspaceCatalogData],
  );

  const handleClearFilters = useCallback(() => {
    const cleared = {
      search: "",
      productType: "all",
      status: "all",
    };
    setFilters(cleared);
    setCurrentPage(1);
    fetchWorkspaceCatalogData(1, pageSize, cleared);
  }, [pageSize, fetchWorkspaceCatalogData]);

  const handleRefresh = useCallback(() => {
    fetchWorkspaceCatalogData(currentPage, pageSize, filters);
  }, [currentPage, pageSize, filters, fetchWorkspaceCatalogData]);

  const handleBackToCatalog = useCallback(() => {
    navigate("/catalog");
  }, [navigate]);

  const handlePageChange = useCallback(
    (newPage) => {
      const boundedPage = Math.max(1, newPage);
      setCurrentPage(boundedPage);
      fetchWorkspaceCatalogData(boundedPage, pageSize, filters);
    },
    [pageSize, filters, fetchWorkspaceCatalogData],
  );

  const handlePageSizeChange = useCallback(
    (size) => {
      setPageSize(size);
      setCurrentPage(1);
      fetchWorkspaceCatalogData(1, size, filters);
    },
    [filters, fetchWorkspaceCatalogData],
  );

  const handleCreateProduct = useCallback(() => {
    navigate(ROUTES.CREATE_WORKSPACE_PRODUCT);
  }, [navigate]);

  const handleViewProductDetails = useCallback(
    (product) => {
      if (!product?._id) return;
      navigate(
        ROUTES.WORKSPACE_PRODUCT_DETAILS.replace(":productId", product._id),
      );
    },
    [navigate],
  );

  const handleEditProduct = useCallback(
    (product) => {
      if (!product?._id) return;
      navigate(
        ROUTES.EDIT_WORKSPACE_PRODUCT.replace(":productId", product._id),
      );
    },
    [navigate],
  );

  const handleDeleteProduct = useCallback(
    async (product) => {
      if (!product?._id) return;
      try {
        await deleteWorkspaceProduct(product._id);
        handleRefresh();
      } catch {
        // Caught inside slice reducer mechanisms
      }
    },
    [deleteWorkspaceProduct, handleRefresh],
  );

  const handleImportWorkspaceProducts = useCallback(() => {
    navigate(ROUTES.WORKSPACE_PRODUCT_IMPORT);
  }, [navigate]);

  const pageProps = {
    products: mappedProducts,
    dashboardStats,
    filters,
    activeFilterChips,
    productTypeOptions,

    isLoading,
    hasError,
    error,
    message,

    totalProducts: pagination?.total || mappedProducts.length,
    currentPage: pagination?.page || currentPage,
    totalPages: pagination?.totalPages || 1,
    pageSize,

    hasProducts: products.length > 0,
    hasFilteredProducts: mappedProducts.length > 0,

    handleFilterChange,
    handleSearchChange,
    handleRemoveFilter,
    handleClearFilters,
    handleRefresh,
    handlePageChange,
    handlePageSizeChange,
    handleCreateProduct,
    handleViewProductDetails,
    handleEditProduct,
    handleDeleteProduct,
    handleImportWorkspaceProducts,
    handleBackToCatalog,
    clearMessage,
  };

  return isMobile ? (
    <WorkspaceProductsMobilePage {...pageProps} />
  ) : (
    <WorkspaceProductsDesktopPage {...pageProps} />
  );
};

export default WorkspaceProductsPage;
