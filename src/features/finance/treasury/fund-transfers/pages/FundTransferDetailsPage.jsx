import React, { useEffect, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useFundTransfer from "../hooks/useFundTransfer";
import FundTransferDetailsDesktopPage from "./desktop/FundTransferDetailsDesktopPage";
import FundTransferDetailsMobilePage from "./mobile/FundTransferDetailsMobilePage";

const FundTransferDetailsPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { fundTransferId } = useParams();

  const {
    managedFundTransfer,
    getFundTransferById,
    getFundTransferStatus,
    cancelFundTransfer,
    cancelFundTransferStatus,
    error,
    clearError,
    message,
    clearMessage,
  } = useFundTransfer();

  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    if (fundTransferId) {
      getFundTransferById(fundTransferId).catch((err) =>
        console.error("Failed to load fund transfer details:", err)
      );
    }
  }, [fundTransferId]);

  useEffect(() => {
    return () => {
      clearError();
      clearMessage();
    };
  }, [clearError, clearMessage]);

  const handleCancelTransfer = useCallback(
    async (reason = "") => {
      if (!fundTransferId) return;
      setActionError("");
      setActionMessage("");
      try {
        await cancelFundTransfer(fundTransferId, { reason });
        setActionMessage("Fund transfer cancelled successfully.");
        getFundTransferById(fundTransferId).catch(() => {});
      } catch (err) {
        setActionError(typeof err === "string" ? err : "Failed to cancel fund transfer.");
      }
    },
    [fundTransferId, cancelFundTransfer, getFundTransferById]
  );

  const handleBack = useCallback(() => {
    navigate(ROUTES.FUND_TRANSFERS);
  }, [navigate]);

  const isLoading = getFundTransferStatus === API_STATUS.LOADING;
  const isCancelling = cancelFundTransferStatus === API_STATUS.LOADING;

  const pageProps = {
    transferDetails: managedFundTransfer,
    isLoading,
    isCancelling,
    error: error || actionError,
    message: message || actionMessage,
    clearFeedback: () => {
      clearError();
      clearMessage();
      setActionError("");
      setActionMessage("");
    },
    handleCancelTransfer,
    handleBack,
  };

  return isMobile ? (
    <FundTransferDetailsMobilePage {...pageProps} />
  ) : (
    <FundTransferDetailsDesktopPage {...pageProps} />
  );
};

export default FundTransferDetailsPage;
