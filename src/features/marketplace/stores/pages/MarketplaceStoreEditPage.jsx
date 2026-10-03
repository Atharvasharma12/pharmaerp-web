// src/features/marketplace/stores/pages/MarketplaceStoreEditPage.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useMarketplaceStore from "../hooks/useMarketplaceStore";
import { DEFAULT_WORKING_HOURS } from "../constants/marketplaceStoreConstants";
import MarketplaceStoreEditDesktopPage from "./desktop/MarketplaceStoreEditDesktopPage";
import MarketplaceStoreEditMobilePage from "./mobile/MarketplaceStoreEditMobilePage";

const MarketplaceStoreEditPage = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
    currentStore,
    getMarketplaceStoreStatus,
    updateMarketplaceStoreStatus,
    error,
    message,
    fetchStoreById,
    updateStore,
    clearMessage,
  } = useMarketplaceStore();

  const [formData, setFormData] = useState({
    storeName: "",
    workingHours: JSON.parse(JSON.stringify(DEFAULT_WORKING_HOURS)),
  });

  const [errors, setErrors] = useState({});

  const isLoading = getMarketplaceStoreStatus === API_STATUS.LOADING;
  const isSubmitting = updateMarketplaceStoreStatus === API_STATUS.LOADING;

  useEffect(() => {
    if (storeId) {
      fetchStoreById(storeId);
    }
  }, [storeId, fetchStoreById]);

  useEffect(() => {
    if (currentStore) {
      setFormData({
        storeName: currentStore.storeName || "",
        workingHours: currentStore.workingHours || JSON.parse(JSON.stringify(DEFAULT_WORKING_HOURS)),
      });
    }
  }, [currentStore]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleWorkingHoursChange = (dayKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [dayKey]: {
          ...prev.workingHours[dayKey],
          [field]: value,
        },
      },
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.storeName || formData.storeName.trim().length < 2) {
      newErrors.storeName = "Store name must be at least 2 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!validateForm()) return;

    try {
      await updateStore(storeId, formData);
      navigate(ROUTES.MARKETPLACE_STORE_DETAILS.replace(":storeId", storeId));
    } catch {
      // Error in slice
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.MARKETPLACE_STORE_DETAILS.replace(":storeId", storeId));
  };

  const pageProps = {
    formData,
    errors,
    isSubmitting,
    isLoading,
    message,
    error,
    handleChange,
    handleWorkingHoursChange,
    handleSubmit,
    handleCancel,
    clearMessage,
  };

  return isMobile ? (
    <MarketplaceStoreEditMobilePage {...pageProps} />
  ) : (
    <MarketplaceStoreEditDesktopPage {...pageProps} />
  );
};

export default MarketplaceStoreEditPage;
