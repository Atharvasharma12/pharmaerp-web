// src/features/marketplace/stores/pages/MarketplaceStoreDetailPage.jsx

import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useMarketplaceStore from "../hooks/useMarketplaceStore";
import MarketplaceStoreDetailDesktopPage from "./desktop/MarketplaceStoreDetailDesktopPage";
import MarketplaceStoreDetailMobilePage from "./mobile/MarketplaceStoreDetailMobilePage";

const MarketplaceStoreDetailPage = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
    currentStore,
    getMarketplaceStoreStatus,
    statusToggleStatus,
    error,
    message,
    fetchStoreById,
    goOnline,
    goOffline,
    pauseStore,
    resumeStore,
    clearMessage,
  } = useMarketplaceStore();

  const isLoadingStore = getMarketplaceStoreStatus === API_STATUS.LOADING;
  const isTogglingStatus = statusToggleStatus === API_STATUS.LOADING;
  const isLoading = isLoadingStore || isTogglingStatus;

  useEffect(() => {
    if (storeId) {
      fetchStoreById(storeId);
    }
  }, [storeId, fetchStoreById]);

  const handleBack = () => {
    navigate(ROUTES.MARKETPLACE_STORES);
  };

  const handleEdit = (id) => {
    navigate(ROUTES.EDIT_MARKETPLACE_STORE.replace(":storeId", id));
  };

  const handleGoOnlineAction = async (id) => {
    try {
      await goOnline(id);
    } catch {
      // Handled
    }
  };

  const handleGoOfflineAction = async (id) => {
    try {
      await goOffline(id);
    } catch {
      // Handled
    }
  };

  const handlePauseStoreAction = async (id) => {
    try {
      await pauseStore(id);
    } catch {
      // Handled
    }
  };

  const handleResumeStoreAction = async (id) => {
    try {
      await resumeStore(id);
    } catch {
      // Handled
    }
  };

  const pageProps = {
    store: currentStore,
    isLoading,
    error,
    message,
    handleBack,
    handleEdit,
    handleGoOnline: handleGoOnlineAction,
    handleGoOffline: handleGoOfflineAction,
    handlePauseStore: handlePauseStoreAction,
    handleResumeStore: handleResumeStoreAction,
    clearMessage,
  };

  return isMobile ? (
    <MarketplaceStoreDetailMobilePage {...pageProps} />
  ) : (
    <MarketplaceStoreDetailDesktopPage {...pageProps} />
  );
};

export default MarketplaceStoreDetailPage;
