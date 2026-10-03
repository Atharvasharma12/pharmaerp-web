// src/features/marketplace/stores/pages/MarketplaceStoreCreatePage.jsx

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import useBranch from "@/features/branch/hooks/useBranch";

import useMarketplaceStore from "../hooks/useMarketplaceStore";
import { DEFAULT_WORKING_HOURS } from "../constants/marketplaceStoreConstants";
import MarketplaceStoreCreateDesktopPage from "./desktop/MarketplaceStoreCreateDesktopPage";
import MarketplaceStoreCreateMobilePage from "./mobile/MarketplaceStoreCreateMobilePage";

const MarketplaceStoreCreatePage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { stores, createStore, createMarketplaceStoreStatus, error, message, clearMessage, fetchStores } =
    useMarketplaceStore();

  const { branches, getWorkspaceBranches, getWorkspaceBranchesStatus } = useBranch();

  const [formData, setFormData] = useState({
    branchId: "",
    companyId: "",
    storeName: "",
    workingHours: JSON.parse(JSON.stringify(DEFAULT_WORKING_HOURS)),
  });

  const [errors, setErrors] = useState({});

  const isSubmitting = createMarketplaceStoreStatus === API_STATUS.LOADING;
  const isLoadingBranches = getWorkspaceBranchesStatus === API_STATUS.LOADING;

  const hasFetchedRef = React.useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      getWorkspaceBranches();
      fetchStores();
    }
  }, [getWorkspaceBranches, fetchStores]);

  // Existing store branch IDs map
  const existingBranchStoreMap = useMemo(() => {
    const map = {};
    (stores || []).forEach((s) => {
      const bId = typeof s.branchId === "object" ? s.branchId?._id : s.branchId;
      if (bId) map[String(bId)] = s;
    });
    return map;
  }, [stores]);

  const branchOptions = useMemo(() => {
    return (branches || []).map((b) => {
      const bId = String(b._id || b.id);
      const hasStore = Boolean(existingBranchStoreMap[bId]);
      const branchName = b.name || b.branchName || "Branch";
      return {
        label: hasStore ? `${branchName} (Online Store Already Exists)` : branchName,
        value: b._id || b.id,
        disabled: hasStore,
      };
    });
  }, [branches, existingBranchStoreMap]);

  const handleBranchSelect = (selectedBranchId) => {
    const foundBranch = (branches || []).find(
      (b) => String(b._id || b.id) === String(selectedBranchId),
    );
    if (foundBranch) {
      const branchName = foundBranch.name || foundBranch.branchName || "Store";
      setFormData((prev) => ({
        ...prev,
        branchId: foundBranch._id || foundBranch.id,
        companyId: foundBranch.companyId || foundBranch.company?._id || "",
        storeName: branchName,
      }));
      if (errors.branchId) setErrors((prev) => ({ ...prev, branchId: null }));
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
    if (!formData.branchId) {
      newErrors.branchId = "Please select a branch location";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!validateForm()) return;

    try {
      const created = await createStore(formData);
      if (created?._id) {
        navigate(
          ROUTES.MARKETPLACE_STORE_DETAILS.replace(":storeId", created._id),
        );
      } else {
        navigate(ROUTES.MARKETPLACE_STORES);
      }
    } catch {
      // Handled via slice error
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.MARKETPLACE_STORES);
  };

  const pageProps = {
    formData,
    errors,
    branchOptions,
    branches,
    isLoadingBranches,
    isSubmitting,
    message,
    error,
    handleBranchSelect,
    handleWorkingHoursChange,
    handleSubmit,
    handleCancel,
    clearMessage,
  };

  return isMobile ? (
    <MarketplaceStoreCreateMobilePage {...pageProps} />
  ) : (
    <MarketplaceStoreCreateDesktopPage {...pageProps} />
  );
};

export default MarketplaceStoreCreatePage;
