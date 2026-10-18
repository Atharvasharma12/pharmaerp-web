// src/features/workspace-products/pages/WorkspaceProductsPage.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useWorkspaceProduct from "../hooks/useWorkspaceProduct";
import WorkspaceProductsDesktopPage from "./desktop/WorkspaceProductsDesktopPage";
import WorkspaceProductsMobilePage from "./mobile/WorkspaceProductsMobilePage";

import { ImportGstModal } from "../components";

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
    displayManufacturer: product?.manufacturer?.name || product?.manufacturer || product?.marketer || "-",
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
  const [pageSize, setPageSize] = useState(25);
  const [accumulatedProducts, setAccumulatedProducts] = useState([]);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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

  const isLoadingList =
    getWorkspaceProductsStatus === API_STATUS.LOADING ||
    getWorkspaceProductsStatus === API_STATUS.IDLE;
  const isDeletingItem = deleteWorkspaceProductStatus === API_STATUS.LOADING;
  const isLoading = isLoadingList || isDeletingItem;
  const hasError = getWorkspaceProductsStatus === API_STATUS.ERROR;

  const fetchWorkspaceCatalogData = useCallback(
    async (pageVal = 1, sizeVal = pageSize, filterVal = filters) => {
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

        const res = await getWorkspaceProducts(apiParams);
        const newProducts = res?.products || [];
        const total = res?.total || newProducts.length;

        if (pageVal === 1) {
          setAccumulatedProducts(newProducts);
        } else {
          setAccumulatedProducts((prev) => {
            const existingIds = new Set(prev.map((p) => p._id));
            const freshItems = newProducts.filter((p) => !existingIds.has(p._id));
            return [...prev, ...freshItems];
          });
        }

        setTotalProductsCount(total);
        setCurrentPage(pageVal);
        setHasMore(newProducts.length >= sizeVal && pageVal * sizeVal < total);
      } catch {
        // Gracefully trapped via feature state slice boundaries
      }
    },
    [getWorkspaceProducts, pageSize, filters],
  );

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || isLoadingList) return;
    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const apiParams = {
        page: nextPage,
        limit: pageSize,
      };

      if (filters.search) {
        apiParams.search = filters.search;
      }
      if (filters.status !== "all") {
        apiParams.status = filters.status;
      }
      if (filters.productType !== "all") {
        apiParams.productType = filters.productType;
      }

      const res = await getWorkspaceProducts(apiParams);
      const newProducts = res?.products || [];
      const total = res?.total || totalProductsCount;

      if (newProducts.length > 0) {
        setAccumulatedProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p._id));
          const freshItems = newProducts.filter((p) => !existingIds.has(p._id));
          const combined = [...prev, ...freshItems];
          setHasMore(newProducts.length >= pageSize && combined.length < total);
          return combined;
        });
        setCurrentPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    isLoadingMore,
    hasMore,
    isLoadingList,
    currentPage,
    pageSize,
    filters,
    getWorkspaceProducts,
    totalProductsCount,
  ]);

  useEffect(() => {
    clearError();
    clearCurrentWorkspaceProduct();

    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchWorkspaceCatalogData(1, pageSize, filters);
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
    const list = accumulatedProducts.length > 0 ? accumulatedProducts : (Array.isArray(products) ? products : []);
    return list.map(mapWorkspaceProductForView);
  }, [accumulatedProducts, products]);

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
    const totalItems = totalProductsCount || pagination?.total || mappedProducts.length;
    const activeCount = mappedProducts.filter(
      (p) => p.displayStatus === "active",
    ).length;
    const inactiveCount = totalItems > activeCount ? totalItems - activeCount : 0;
    const categoriesCount = new Set(
      mappedProducts.map((p) => p.displayCategory).filter(Boolean),
    ).size;

    return [
      {
        id: "total_products",
        title: "Total Custom Products",
        value: totalItems,
        description: "Workspace-specific items",
        colorVariant: "primary",
      },
      {
        id: "active_products",
        title: "Active Products",
        value: activeCount,
        description: "Available for billing/batches",
        colorVariant: "success",
      },
      {
        id: "inactive_products",
        title: "Inactive Products",
        value: inactiveCount,
        description: "Disabled stock targets",
        colorVariant: "warning",
      },
      {
        id: "categories_count",
        title: "Product Categories",
        value: categoriesCount || 1,
        description: "Unique catalog types",
        colorVariant: "info",
      },
    ];
  }, [totalProductsCount, pagination, mappedProducts]);

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

  const [isImportGstOpen, setIsImportGstOpen] = useState(false);

  const handleOpenImportGst = useCallback(() => {
    setIsImportGstOpen(true);
  }, []);

  const handleCloseImportGst = useCallback(() => {
    setIsImportGstOpen(false);
  }, []);

  const handleImportGstSuccess = useCallback(() => {
    handleRefresh();
  }, [handleRefresh]);

  const pageProps = {
    products: mappedProducts,
    dashboardStats,
    filters,
    activeFilterChips,
    productTypeOptions,

    isLoading,
    isLoadingMore,
    hasMore,
    handleLoadMore,
    hasError,
    error,
    message,

    totalProducts: totalProductsCount || pagination?.total || mappedProducts.length,
    currentPage: pagination?.page || currentPage,
    totalPages: pagination?.totalPages || 1,
    pageSize,

    hasProducts: (accumulatedProducts.length > 0 ? accumulatedProducts : products).length > 0,
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
    handleOpenImportGst,
    handleBackToCatalog,
    clearMessage,
  };

  return (
    <>
      {isMobile ? (
        <WorkspaceProductsMobilePage {...pageProps} />
      ) : (
        <WorkspaceProductsDesktopPage {...pageProps} />
      )}
      <ImportGstModal
        open={isImportGstOpen}
        onClose={handleCloseImportGst}
        onSuccess={handleImportGstSuccess}
      />
    </>
  );
};

export default WorkspaceProductsPage;
