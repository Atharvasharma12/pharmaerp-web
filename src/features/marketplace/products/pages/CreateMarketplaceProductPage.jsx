// src/features/marketplace/products/pages/CreateMarketplaceProductPage.jsx

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import { apiClient, ENDPOINTS } from "@/services";

import useMarketplaceProduct from "../hooks/useMarketplaceProduct";
import useMarketplaceStore from "@/features/marketplace/stores/hooks/useMarketplaceStore";
import CreateMarketplaceProductDesktopPage from "./desktop/CreateMarketplaceProductDesktopPage";
import CreateMarketplaceProductMobilePage from "./mobile/CreateMarketplaceProductMobilePage";

const CreateMarketplaceProductPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { stores, fetchStores, getMarketplaceStoresStatus } = useMarketplaceStore();
  const { enableMarketplaceProduct, enableMarketplaceProductStatus, error, message, clearError, clearMessage } =
    useMarketplaceProduct();

  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Platform pricing list state
  const [allPricing, setAllPricing] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pricingStatus, setPricingStatus] = useState(API_STATUS.IDLE);

  // Modal / form state for enabling product
  const [productToEnable, setProductToEnable] = useState(null);
  const [formData, setFormData] = useState({
    visibility: "VISIBLE",
    prescriptionRequired: "NOT_REQUIRED",
    isFeatured: false,
    sortOrder: 0,
  });

  // Fetch stores on mount
  useEffect(() => {
    fetchStores().then((res) => {
      const storesList = res?.stores || res || [];
      if (storesList.length > 0) {
        setSelectedStoreId(storesList[0]._id);
      }
    });
  }, [fetchStores]);

  // Fetch marketplace pricing catalog whenever page, pageSize, search, or selectedStoreId changes
  useEffect(() => {
    const fetchCatalogPricing = async () => {
      setPricingStatus(API_STATUS.LOADING);
      try {
        const params = {
          page: currentPage,
          limit: pageSize,
        };
        if (selectedStoreId) {
          params.marketplaceStoreId = selectedStoreId;
        }
        if (searchQuery) {
          params.search = searchQuery;
        }
        const res = await apiClient.get(ENDPOINTS.MARKETPLACE_PRICING.CATALOG, {
          params,
        });
        const data = res.data?.data || res.data || {};
        setAllPricing(data.catalog || []);
        setTotalProducts(data.pagination?.total || (data.catalog || []).length);
        setTotalPages(data.pagination?.pages || 1);
        setPricingStatus(API_STATUS.SUCCESS);
      } catch (err) {
        setPricingStatus(API_STATUS.ERROR);
      }
    };

    fetchCatalogPricing();
  }, [currentPage, pageSize, searchQuery, selectedStoreId]);

  const isLoading =
    getMarketplaceStoresStatus === API_STATUS.LOADING ||
    pricingStatus === API_STATUS.LOADING ||
    enableMarketplaceProductStatus === API_STATUS.LOADING;

  const isSubmitting = enableMarketplaceProductStatus === API_STATUS.LOADING;

  const storeOptions = useMemo(() => {
    return (stores || []).map((s) => ({
      label: s.storeName,
      value: s._id,
    }));
  }, [stores]);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleOpenEnableModal = (product) => {
    // product here is the pricing record containing globalProductId
    const globalProduct = product.globalProductId || {};
    setProductToEnable(product);
    setFormData({
      visibility: "VISIBLE",
      prescriptionRequired: globalProduct.medicineDetails?.prescriptionRequired || "NOT_REQUIRED",
      isFeatured: false,
      sortOrder: 0,
    });
  };

  const handleCloseEnableModal = () => {
    setProductToEnable(null);
  };

  const handleFormChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveEnableProduct = async () => {
    if (!productToEnable || !selectedStoreId) return;

    try {
      const payload = {
        marketplaceStoreId: selectedStoreId,
        globalProductId: productToEnable.globalProductId?._id,
        ...formData,
      };

      await enableMarketplaceProduct(payload);
      setProductToEnable(null);
      navigate(ROUTES.MARKETPLACE_PRODUCTS);
    } catch (err) {
      // Caught inside hook
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.MARKETPLACE_PRODUCTS);
  };

  const pageProps = {
    globalProducts: allPricing,
    totalProducts,
    currentPage,
    totalPages,
    pageSize,
    isLoading,
    isSubmitting,
    error,
    message,
    selectedStoreId,
    setSelectedStoreId,
    storeOptions,
    searchQuery,
    handleSearchChange,
    handlePageChange,
    handlePageSizeChange,
    productToEnable,
    formData,
    handleFormChange,
    handleOpenEnableModal,
    handleCloseEnableModal,
    handleSaveEnableProduct,
    handleCancel,
    clearError,
    clearMessage,
  };

  return isMobile ? (
    <CreateMarketplaceProductMobilePage {...pageProps} />
  ) : (
    <CreateMarketplaceProductDesktopPage {...pageProps} />
  );
};

export default CreateMarketplaceProductPage;
