// src/features/marketplace/products/pages/MarketplaceProductsPage.jsx

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useMarketplaceProduct from "../hooks/useMarketplaceProduct";
import useMarketplaceStore from "@/features/marketplace/stores/hooks/useMarketplaceStore";
import MarketplaceProductsDesktopPage from "./desktop/MarketplaceProductsDesktopPage";
import MarketplaceProductsMobilePage from "./mobile/MarketplaceProductsMobilePage";

const formatStringTitle = (value) => {
  if (!value) return "-";
  return String(value)
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const mapMarketplaceProductForView = (product) => {
  const global = product?.globalProductId || {};
  return {
    ...product,
    displayName: global.name || "-",
    displaySku: global.sku || "-",
    displayCategory: global.category?.name || formatStringTitle(global.productType || "Custom"),
    displayManufacturer: global.manufacturer?.name || global.manufacturer || "-",
    displayDosageForm: global.productForm?.name || global.productForm || "-",
    displayStrength: Array.isArray(global.composition) && global.composition.length > 0
      ? global.composition.map((c) => {
          const saltName = c.salt?.name || (typeof c.salt === "object" && c.salt !== null ? c.salt.name : "Unknown");
          return `${saltName} ${c.strength}${c.unit}`;
        }).join(", ")
      : "-",
    displayStatus: product?.status || "INACTIVE",
    displayVisibility: product?.visibility || "VISIBLE",
  };
};

const MarketplaceProductsPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(false);

  const { stores, fetchStores, getMarketplaceStoresStatus } = useMarketplaceStore();

  const [selectedStoreId, setSelectedStoreId] = useState("all");

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    visibility: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    products,
    pagination,
    getMarketplaceProductsStatus,
    disableMarketplaceProductStatus,
    error,
    message,
    getMarketplaceProducts,
    disableMarketplaceProduct,
    clearError,
    clearMessage,
    clearCurrentMarketplaceProduct,
  } = useMarketplaceProduct();

  const isLoadingList = getMarketplaceProductsStatus === API_STATUS.LOADING || getMarketplaceStoresStatus === API_STATUS.LOADING;
  const isDeletingItem = disableMarketplaceProductStatus === API_STATUS.LOADING;
  const isLoading = isLoadingList || isDeletingItem;
  const hasError = getMarketplaceProductsStatus === API_STATUS.ERROR;

  const fetchProductsData = useCallback(
    async (pageVal = currentPage, sizeVal = pageSize, filterVal = filters, storeId = selectedStoreId) => {
      try {
        const apiParams = {
          page: pageVal,
          limit: sizeVal,
        };

        if (storeId && storeId !== "all") {
          apiParams.marketplaceStoreId = storeId;
        }
        if (filterVal.search) {
          apiParams.search = filterVal.search;
        }
        if (filterVal.status !== "all") {
          apiParams.status = filterVal.status;
        }
        if (filterVal.visibility !== "all") {
          apiParams.visibility = filterVal.visibility;
        }

        await getMarketplaceProducts(apiParams);
      } catch {
        // Trapped via slice boundaries
      }
    },
    [getMarketplaceProducts, selectedStoreId, filters, currentPage, pageSize],
  );

  useEffect(() => {
    clearError();
    clearCurrentMarketplaceProduct();

    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchStores().then((res) => {
        const storesList = res?.stores || res || [];
        if (storesList.length > 0) {
          const firstStoreId = storesList[0]._id;
          setSelectedStoreId(firstStoreId);
          fetchProductsData(currentPage, pageSize, filters, firstStoreId);
        } else {
          fetchProductsData(currentPage, pageSize, filters, "all");
        }
      });
    }
  }, [fetchStores, fetchProductsData]);

  useEffect(() => {
    if (!message) return undefined;

    const timer = window.setTimeout(() => {
      clearMessage();
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [clearMessage, message]);

  const mappedProducts = useMemo(() => {
    return (Array.isArray(products) ? products : []).map(
      mapMarketplaceProductForView,
    );
  }, [products]);

  const storeOptions = useMemo(() => {
    const list = (stores || []).map((s) => ({
      label: s.storeName,
      value: s._id,
    }));
    return [
      { label: "All Stores", value: "all" },
      ...list,
    ];
  }, [stores]);

  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (filters.search) {
      chips.push({ key: "search", label: `Search: ${filters.search}` });
    }
    if (filters.status !== "all") {
      chips.push({
        key: "status",
        label: `Status: ${formatStringTitle(filters.status)}`,
      });
    }
    if (filters.visibility !== "all") {
      chips.push({
        key: "visibility",
        label: `Visibility: ${formatStringTitle(filters.visibility)}`,
      });
    }

    return chips;
  }, [filters]);

  const dashboardStats = useMemo(() => {
    const totalItems = pagination?.total || mappedProducts.length;
    const activeCount = mappedProducts.filter(
      (p) => p.displayStatus === "ACTIVE",
    ).length;
    const inactiveCount = totalItems - activeCount;

    return [
      {
        id: "total_products",
        title: "Total Marketplace Products",
        value: totalItems,
        description: "Products enabled for online store",
        colorVariant: "primary",
      },
      {
        id: "active_products",
        title: "Active Products",
        value: activeCount,
        description: "Visible to customers",
        colorVariant: "success",
      },
      {
        id: "inactive_products",
        title: "Inactive Products",
        value: inactiveCount,
        description: "Temporarily disabled",
        colorVariant: "warning",
      },
    ];
  }, [pagination, mappedProducts]);

  const handleStoreChange = useCallback(
    (e) => {
      const storeId = e.target.value;
      setSelectedStoreId(storeId);
      setCurrentPage(1);
      fetchProductsData(1, pageSize, filters, storeId);
    },
    [filters, pageSize, fetchProductsData],
  );

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
      fetchProductsData(1, pageSize, updatedFilters, selectedStoreId);
    },
    [filters, pageSize, selectedStoreId, fetchProductsData],
  );

  const handleSearchChange = useCallback(
    (event) => {
      const value = event?.target?.value ?? event;
      const updatedFilters = { ...filters, search: value };

      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchProductsData(1, pageSize, updatedFilters, selectedStoreId);
    },
    [filters, pageSize, selectedStoreId, fetchProductsData],
  );

  const handleRemoveFilter = useCallback(
    (key) => {
      const updatedFilters = { ...filters, [key]: "all" };

      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchProductsData(1, pageSize, updatedFilters, selectedStoreId);
    },
    [filters, pageSize, selectedStoreId, fetchProductsData],
  );

  const handleClearFilters = useCallback(() => {
    const cleared = {
      search: "",
      status: "all",
      visibility: "all",
    };
    setFilters(cleared);
    setCurrentPage(1);
    fetchProductsData(1, pageSize, cleared, selectedStoreId);
  }, [pageSize, selectedStoreId, fetchProductsData]);

  const handleRefresh = useCallback(() => {
    fetchProductsData(currentPage, pageSize, filters, selectedStoreId);
  }, [currentPage, pageSize, filters, selectedStoreId, fetchProductsData]);

  const handlePageChange = useCallback(
    (newPage) => {
      const boundedPage = Math.max(1, newPage);
      setCurrentPage(boundedPage);
      fetchProductsData(boundedPage, pageSize, filters, selectedStoreId);
    },
    [pageSize, filters, selectedStoreId, fetchProductsData],
  );

  const handlePageSizeChange = useCallback(
    (size) => {
      setPageSize(size);
      setCurrentPage(1);
      fetchProductsData(1, size, filters, selectedStoreId);
    },
    [filters, selectedStoreId, fetchProductsData],
  );

  const handleCreateProduct = useCallback(() => {
    navigate(ROUTES.CREATE_MARKETPLACE_PRODUCT);
  }, [navigate]);

  const handleViewProductDetails = useCallback(
    (product) => {
      if (!product?._id) return;
      navigate(
        ROUTES.MARKETPLACE_PRODUCT_DETAILS.replace(":productId", product._id),
      );
    },
    [navigate],
  );

  const handleEditProduct = useCallback(
    (product) => {
      if (!product?._id) return;
      navigate(
        ROUTES.EDIT_MARKETPLACE_PRODUCT.replace(":productId", product._id),
      );
    },
    [navigate],
  );

  const handleDeleteProduct = useCallback(
    async (product) => {
      if (!product?._id) return;
      try {
        await disableMarketplaceProduct(product._id);
        handleRefresh();
      } catch {
        // Trapped inside feature slice boundaries
      }
    },
    [disableMarketplaceProduct, handleRefresh],
  );

  const pageProps = {
    products: mappedProducts,
    dashboardStats,
    filters,
    selectedStoreId,
    storeOptions,
    activeFilterChips,

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

    handleStoreChange,
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
    clearMessage,
  };

  return isMobile ? (
    <MarketplaceProductsMobilePage {...pageProps} />
  ) : (
    <MarketplaceProductsDesktopPage {...pageProps} />
  );
};

export default MarketplaceProductsPage;
