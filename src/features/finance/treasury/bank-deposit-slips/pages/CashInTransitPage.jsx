import React, { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import useBankDepositSlip from "../hooks/useBankDepositSlip";
import CashInTransitDesktopPage from "./desktop/CashInTransitDesktopPage";

// We'll fallback to desktop layout on mobile if a mobile page is missing
const CashInTransitPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const {
    cashInTransit,
    getCashInTransit,
    getCashInTransitStatus,
    error,
    clearError,
  } = useBankDepositSlip();

  const fetchCIT = useCallback(async () => {
    try {
      await getCashInTransit(); // No branchId filter = company-wide
    } catch (err) {
      console.error("Failed to load cash in transit:", err);
    }
  }, [getCashInTransit]);

  useEffect(() => {
    fetchCIT();
  }, [fetchCIT]);

  const handleRefresh = useCallback(() => {
    fetchCIT();
  }, [fetchCIT]);

  const handleViewDetails = useCallback(
    (slipId) => {
      navigate(ROUTES.BANK_DEPOSIT_SLIP_DETAILS(slipId));
    },
    [navigate]
  );

  const isLoading = getCashInTransitStatus === API_STATUS.LOADING;

  const pageProps = {
    cashInTransitSlips: cashInTransit || [],
    isLoading,
    error,
    handleRefresh,
    handleViewDetails,
  };

  return <CashInTransitDesktopPage {...pageProps} />;
};

export default CashInTransitPage;
