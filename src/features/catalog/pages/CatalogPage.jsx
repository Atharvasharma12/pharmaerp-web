import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks";
import { API_STATUS, ROUTES } from "@/constants";
import { useNavigate } from "react-router-dom";

import useGlobalProduct from "@/features/global-products/hooks/useGlobalProduct";
import useWorkspaceProduct from "@/features/workspace-products/hooks/useWorkspaceProduct";

import CatalogDesktopPage from "./desktop/CatalogDesktopPage";
import CatalogMobilePage from "./mobile/CatalogMobilePage";

const CatalogPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const hasFetched = useRef(false);

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

  const handleRefresh = () => {
    getGlobalProducts({ page: 1, limit: 1 });
    getWorkspaceProducts({ page: 1, limit: 1 });
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    handleRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoading =
    getGlobalProductsStatus === API_STATUS.LOADING ||
    getWorkspaceProductsStatus === API_STATUS.LOADING;

  const hasError =
    getGlobalProductsStatus === API_STATUS.ERROR ||
    getWorkspaceProductsStatus === API_STATUS.ERROR;

  const catalogModules = [
    {
      id: "globalProducts",
      title: "Global Product Catalog",
      description: "Browse and view all global products available in the system.",
      colorVariant: "primary",
      actionText: "View Catalog",
      onClick: () => navigate(ROUTES.GLOBAL_PRODUCTS),
    },
    {
      id: "workspaceProducts",
      title: "Workspace Product Catalog",
      description: "Manage products specific to your workspace.",
      colorVariant: "success",
      actionText: "Manage Products",
      onClick: () => navigate(ROUTES.WORKSPACE_PRODUCTS),
    },
  ];

  const dashboardStats = [
    {
      id: "global",
      title: "Global Products",
      value: globalPagination?.total || 0,
      description: "System wide products",
      colorVariant: "primary",
    },
    {
      id: "workspace",
      title: "Workspace Products",
      value: workspacePagination?.total || 0,
      description: "Your workspace products",
      colorVariant: "success",
    },
  ];

  const pageProps = {
    catalogModules,
    dashboardStats,
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
