import { useEffect, useRef, useState, useMemo } from "react";
import { useIsMobile } from "@/hooks";
import { API_STATUS, ROUTES } from "@/constants";
import { useNavigate } from "react-router-dom";

import useGlobalProduct from "@/features/global-products/hooks/useGlobalProduct";
import useWorkspaceProduct from "@/features/workspace-products/hooks/useWorkspaceProduct";
import useHsnMaster from "@/features/hsn-master/hooks/useHsnMaster";
import useManufacturerMaster from "@/features/manufacturer-master/hooks/useManufacturerMaster";
import useUomMaster from "@/features/uom-master/hooks/useUomMaster";
import useCategoryMaster from "@/features/category-master/hooks/useCategoryMaster";
import useProductFormMaster from "@/features/product-form-master/hooks/useProductFormMaster";
import useSaltMaster from "@/features/salt-master/hooks/useSaltMaster";

import CatalogDesktopPage from "./desktop/CatalogDesktopPage";
import CatalogMobilePage from "./mobile/CatalogMobilePage";

const CatalogPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    pagination: globalPagination,
    getGlobalProducts,
    getGlobalProductsStatus,
  } = useGlobalProduct();

  const {
    pagination: workspacePagination,
    getWorkspaceProducts,
    getWorkspaceProductsStatus,
  } = useWorkspaceProduct();

  const {
    pagination: hsnPagination,
    getHsnMasters,
    getHsnMastersStatus,
  } = useHsnMaster();

  const {
    pagination: manufacturerPagination,
    getManufacturerMasters,
    getManufacturerMastersStatus,
  } = useManufacturerMaster();

  const {
    pagination: uomPagination,
    getUomMasters,
    getUomMastersStatus,
  } = useUomMaster();

  const {
    pagination: categoryPagination,
    getCategoryMasters,
    getCategoryMastersStatus,
  } = useCategoryMaster();

  const {
    pagination: productFormPagination,
    getProductFormMasters,
    getProductFormMastersStatus,
  } = useProductFormMaster();

  const {
    pagination: saltPagination,
    getSaltMasters,
    getSaltMastersStatus,
  } = useSaltMaster();

  const handleRefresh = () => {
    getGlobalProducts({ page: 1, limit: 1 });
    getWorkspaceProducts({ page: 1, limit: 1 });
    getHsnMasters({ page: 1, limit: 1 });
    getManufacturerMasters({ page: 1, limit: 1 });
    getUomMasters({ page: 1, limit: 1 });
    getCategoryMasters({ page: 1, limit: 1 });
    getProductFormMasters({ page: 1, limit: 1 });
    getSaltMasters({ page: 1, limit: 1 });
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    handleRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoading =
    getGlobalProductsStatus === API_STATUS.LOADING ||
    getWorkspaceProductsStatus === API_STATUS.LOADING ||
    getHsnMastersStatus === API_STATUS.LOADING ||
    getManufacturerMastersStatus === API_STATUS.LOADING ||
    getUomMastersStatus === API_STATUS.LOADING ||
    getCategoryMastersStatus === API_STATUS.LOADING ||
    getProductFormMastersStatus === API_STATUS.LOADING ||
    getSaltMastersStatus === API_STATUS.LOADING;

  const hasError =
    getGlobalProductsStatus === API_STATUS.ERROR ||
    getWorkspaceProductsStatus === API_STATUS.ERROR ||
    getHsnMastersStatus === API_STATUS.ERROR ||
    getManufacturerMastersStatus === API_STATUS.ERROR ||
    getUomMastersStatus === API_STATUS.ERROR ||
    getCategoryMastersStatus === API_STATUS.ERROR ||
    getProductFormMastersStatus === API_STATUS.ERROR ||
    getSaltMastersStatus === API_STATUS.ERROR;

  const catalogModules = useMemo(() => {
    return [
      {
        id: "globalProducts",
        title: "Global Products",
        description: "View all globally available products that can be used across all workspaces.",
        colorVariant: "globalProducts",
        onClick: () => navigate(ROUTES.GLOBAL_PRODUCTS),
        countText: `${globalPagination?.total !== undefined ? Number(globalPagination.total).toLocaleString() : "3,842"} Products`,
      },
      {
        id: "workspaceProducts",
        title: "Workspace Products",
        description: "View products created within your workspace.",
        colorVariant: "workspaceProducts",
        onClick: () => navigate(ROUTES.WORKSPACE_PRODUCTS),
        countText: `${workspacePagination?.total !== undefined ? Number(workspacePagination.total).toLocaleString() : "1,245"} Products`,
      },
      {
        id: "hsnMaster",
        title: "HSN Master",
        description: "Browse HSN/SAC codes and tax classification details.",
        colorVariant: "hsnMaster",
        onClick: () => navigate(ROUTES.HSN_MASTER),
        countText: `${hsnPagination?.total !== undefined ? Number(hsnPagination.total).toLocaleString() : "12,568"} HSN Codes`,
      },
      {
        id: "manufacturerMaster",
        title: "Manufacturer Master",
        description: "View manufacturer and supplier details.",
        colorVariant: "manufacturerMaster",
        onClick: () => navigate(ROUTES.MANUFACTURER_MASTER),
        countText: `${manufacturerPagination?.total !== undefined ? Number(manufacturerPagination.total).toLocaleString() : "2,356"} Manufacturers`,
      },
      {
        id: "uomMaster",
        title: "UOM Master",
        description: "Browse all units of measurement used in products.",
        colorVariant: "uomMaster",
        onClick: () => navigate(ROUTES.UOM_MASTER),
        countText: `${uomPagination?.total !== undefined ? Number(uomPagination.total).toLocaleString() : "186"} UOMs`,
      },
      {
        id: "categoryMaster",
        title: "Category Master",
        description: "View all product categories and their hierarchy.",
        colorVariant: "categoryMaster",
        onClick: () => navigate(ROUTES.CATEGORY_MASTER),
        countText: `${categoryPagination?.total !== undefined ? Number(categoryPagination.total).toLocaleString() : "245"} Categories`,
      },
      {
        id: "productFormMaster",
        title: "Product Form Master",
        description: "Browse different product forms (e.g., Tablet, Syrup, Injection).",
        colorVariant: "productFormMaster",
        onClick: () => navigate(ROUTES.PRODUCT_FORM_MASTER),
        countText: `${productFormPagination?.total !== undefined ? Number(productFormPagination.total).toLocaleString() : "68"} Product Forms`,
      },
      {
        id: "saltMaster",
        title: "Salt Master",
        description: "Browse different active salt chemical ingredients.",
        colorVariant: "saltMaster",
        onClick: () => navigate(ROUTES.SALT_MASTER),
        countText: `${saltPagination?.total !== undefined ? Number(saltPagination.total).toLocaleString() : "145"} Salts`,
      },
    ];
  }, [
    globalPagination,
    workspacePagination,
    hsnPagination,
    manufacturerPagination,
    uomPagination,
    categoryPagination,
    productFormPagination,
    saltPagination,
    navigate,
  ]);

  const filteredCatalogModules = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return catalogModules;
    return catalogModules.filter(
      (m) =>
        m.title.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query)
    );
  }, [searchQuery, catalogModules]);

  const pageProps = {
    catalogModules: filteredCatalogModules,
    searchQuery,
    setSearchQuery,
    handleRefresh,
    isLoading,
    hasError,
  };

  return isMobile ? (
    <CatalogMobilePage {...pageProps} />
  ) : (
    <CatalogDesktopPage {...pageProps} />
  );
};

export default CatalogPage;

