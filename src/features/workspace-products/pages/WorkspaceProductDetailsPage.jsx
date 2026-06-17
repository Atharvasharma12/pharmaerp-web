// src/features/workspace-products/pages/WorkspaceProductDetailsPage.jsx

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useWorkspaceProduct from "../hooks/useWorkspaceProduct";

import WorkspaceProductDetailsDesktopPage from "./desktop/WorkspaceProductDetailsDesktopPage";
import WorkspaceProductDetailsMobilePage from "./mobile/WorkspaceProductDetailsMobilePage";

const formatProductType = (type) => {
  if (!type) return "Medicine";
  return String(type)
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatTextValue = (value) => {
  if (!value) return "-";
  return String(value).trim();
};

const buildWorkspaceProductDetails = (product) => {
  if (!product || Object.keys(product).length === 0) return null;

  return {
    ...product,
    displayName: product.name || "Calcium Tablet",
    displayType: formatProductType(product.productType),
    displayCode: product.workspaceProductCode || "CAT-WS-001",
    displayManufacturer: formatTextValue(
      product.manufacturer || "MedPlus Pharma",
    ),
    displayForm: formatTextValue(product.productForm || "Tablet"),
    displayStrength: formatTextValue(product.qty || "500 mg"),
    displayPack: formatTextValue(product.pack || "60 Tablets"),
    displayNotes: formatTextValue(product.notes),

    // Mock analytical layers provided exactly as displayed on layout blueprint image specs
    workspaceUsage: {
      totalBranches: 12,
      totalSales: "1,450 Units",
      totalStock: "8,760 Units",
      totalPurchase: "1,120 Units",
    },

    relatedProducts: [
      {
        _id: "wp_rp1",
        name: "Vitamin D3 Capsule",
        productForm: "Capsule",
        strength: "1000 IU",
      },
      {
        _id: "wp_rp2",
        name: "Magnesium Tablet",
        productForm: "Tablet",
        strength: "250 mg",
      },
      {
        _id: "wp_rp3",
        name: "Zinc Tablet",
        productForm: "Tablet",
        strength: "50 mg",
      },
      {
        _id: "wp_rp4",
        name: "Calcium Syrup",
        productForm: "Syrup",
        strength: "200 ml",
      },
    ],
  };
};

const WorkspaceProductDetailsPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(null);

  const currentTab = searchParams.get("tab") || "overview";

  const {
    currentProduct,
    getWorkspaceProductById,
    getWorkspaceProductStatus,
    deleteWorkspaceProductStatus,
    deleteWorkspaceProduct,
    error,
    clearError,
    clearCurrentWorkspaceProduct,
  } = useWorkspaceProduct();

  const isLoading = getWorkspaceProductStatus === API_STATUS.LOADING;
  const isDeleting = deleteWorkspaceProductStatus === API_STATUS.LOADING;
  const hasError = getWorkspaceProductStatus === API_STATUS.ERROR;

  const fetchProductData = useCallback(async () => {
    if (!productId) return;
    try {
      await getWorkspaceProductById(productId);
    } catch {
      // Caught and updated automatically via the redux feature slice
    }
  }, [productId, getWorkspaceProductById]);

  useEffect(() => {
    if (hasFetchedRef.current === productId) return;
    hasFetchedRef.current = productId;

    fetchProductData();

    return () => {
      clearError();
      clearCurrentWorkspaceProduct();
    };
  }, [productId, fetchProductData, clearError, clearCurrentWorkspaceProduct]);

  const product = useMemo(
    () => buildWorkspaceProductDetails(currentProduct || {}),
    [currentProduct],
  );

  const handleTabChange = useCallback(
    (tabValue) => {
      setSearchParams({ tab: tabValue });
    },
    [setSearchParams],
  );

  const handleBack = useCallback(() => {
    navigate("/catalog/workspace-products");
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    clearError();
    fetchProductData();
  }, [clearError, fetchProductData]);

  const handleEditProduct = useCallback(() => {
    if (!productId) return;
    navigate(ROUTES.EDIT_WORKSPACE_PRODUCT.replace(":productId", productId));
  }, [navigate, productId]);

  const handleDeleteProduct = useCallback(async () => {
    if (!productId) return;
    try {
      await deleteWorkspaceProduct(productId);
      navigate("/catalog/workspace-products", { replace: true });
    } catch {
      // Trace handled elegantly by slice metrics panels
    }
  }, [productId, deleteWorkspaceProduct, navigate]);

  const pageProps = useMemo(
    () => ({
      product,
      productId,
      currentTab,
      isLoading: isLoading || isDeleting,
      hasError,
      error,
      handleTabChange,
      handleBack,
      handleRefresh,
      handleEditProduct,
      handleDeleteProduct,
    }),
    [
      product,
      productId,
      currentTab,
      isLoading,
      hasError,
      error,
      handleTabChange,
      handleBack,
      handleRefresh,
      handleEditProduct,
      handleDeleteProduct,
    ],
  );

  return isMobile ? (
    <WorkspaceProductDetailsMobilePage {...pageProps} />
  ) : (
    <WorkspaceProductDetailsDesktopPage {...pageProps} />
  );
};

export default WorkspaceProductDetailsPage;
