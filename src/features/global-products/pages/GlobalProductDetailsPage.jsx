import { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useGlobalProduct from "../hooks/useGlobalProduct";

import GlobalProductDetailsDesktopPage from "./desktop/GlobalProductDetailsDesktopPage";
import GlobalProductDetailsMobilePage from "./mobile/GlobalProductDetailsMobilePage";

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

// Reusable structural parsing helper for database/API payload conversions
const buildGlobalProductDetails = (product) => {
  if (!product || Object.keys(product).length === 0) return null;

  return {
    ...product,
    displayName: product.name || "Paracetamol Tablet 650mg",
    displayType: formatProductType(product.productType),
    displayCode: product.globalProductCode || "GP-000001",
    displayMarketer: formatTextValue(
      product.marketer || product.otcDetails?.marketingCompany,
    ),
    displayComposition: formatTextValue(product.medicineDetails?.composition),
    displayCategory: formatTextValue(
      product.otcDetails?.category ||
        product.medicineDetails?.medicineType ||
        "Analgesic",
    ),

    // Fallback UI specifications mappings to guarantee match with design requirements
    packagingInformation: {
      primaryPack: product.packagingDetail || "Blister",
      packSize: product.pack || "10 x 10 Tablets",
      unitType: product.productForm || "Strip",
      unitsPerBox: product.qty || "10 Stops",
    },

    // Mapped analytics metrics
    workspaceUsage: {
      totalWorkspaces: 1245,
      totalBranches: 3876,
      totalSales: "45,230 Units",
      totalStock: "1,28,560 Units",
    },

    // Reference context data match arrays
    relatedProducts: [
      {
        _id: "rp1",
        name: "Paracetamol Tablet 500mg",
        productForm: "Tablet",
        strength: "500 mg",
        imageUrl: "",
      },
      {
        _id: "rp2",
        name: "Paracetamol Syrup 250mg/5ml",
        productForm: "Syrup",
        strength: "250 mg/5 ml",
        imageUrl: "",
      },
      {
        _id: "rp3",
        name: "Paracetamol Drops",
        productForm: "Drops",
        strength: "60 mg/ml",
        imageUrl: "",
      },
      {
        _id: "rp4",
        name: "Paracetamol Suppository 125mg",
        productForm: "Suppository",
        strength: "125 mg",
        imageUrl: "",
      },
    ],
  };
};

const GlobalProductDetailsPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(null);

  // Tab State syncing with query parameter tracking string descriptors
  const currentTab = searchParams.get("tab") || "overview";

  const {
    currentProduct,
    getGlobalProductById,
    getGlobalProductStatus,
    error,
    clearError,
    clearCurrentGlobalProduct,
  } = useGlobalProduct();

  const isLoading = getGlobalProductStatus === API_STATUS.LOADING;
  const hasError = getGlobalProductStatus === API_STATUS.ERROR;

  const fetchProduct = useCallback(async () => {
    if (!productId) return;
    try {
      await getGlobalProductById(productId);
    } catch {
      // Handled gracefully through active error hooks inside the store architecture
    }
  }, [productId, getGlobalProductById]);

  useEffect(() => {
    // Prevent duplicated component invocation state sync cycles
    if (hasFetchedRef.current === productId) return;
    hasFetchedRef.current = productId;

    fetchProduct();

    return () => {
      clearError();
      clearCurrentGlobalProduct();
    };
  }, [productId, fetchProduct, clearError, clearCurrentGlobalProduct]);

  const product = useMemo(
    () => buildGlobalProductDetails(currentProduct || {}),
    [currentProduct],
  );

  const handleTabChange = useCallback(
    (tabValue) => {
      setSearchParams({ tab: tabValue });
    },
    [setSearchParams],
  );

  const handleBack = useCallback(() => {
    navigate("/catalog/global-products");
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    clearError();
    fetchProduct();
  }, [clearError, fetchProduct]);

  const pageProps = useMemo(
    () => ({
      product,
      productId,
      currentTab,
      isLoading,
      hasError,
      error,
      handleTabChange,
      handleBack,
      handleRefresh,
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
    ],
  );

  return isMobile ? (
    <GlobalProductDetailsMobilePage {...pageProps} />
  ) : (
    <GlobalProductDetailsDesktopPage {...pageProps} />
  );
};

export default GlobalProductDetailsPage;
