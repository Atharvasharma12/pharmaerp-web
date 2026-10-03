import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useBankDepositSlip from "../hooks/useBankDepositSlip";
import BankDepositSlipDetailsDesktopPage from "./desktop/BankDepositSlipDetailsDesktopPage";
import BankDepositSlipDetailsMobilePage from "./mobile/BankDepositSlipDetailsMobilePage";

const BankDepositSlipDetailsPage = () => {
  const { slipId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
    managedBankDepositSlip,
    getBankDepositSlipById,
    getBankDepositSlipStatus,
    confirmDeposit,
    confirmDepositStatus,
    cancelBankDepositSlip,
    cancelBankDepositSlipStatus,
    error,
    clearError,
    message,
    clearMessage,
    clearManagedBankDepositSlip,
  } = useBankDepositSlip();

  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const fetchSlipDetails = useCallback(() => {
    if (slipId) {
      getBankDepositSlipById(slipId).catch((err) =>
        console.error("Failed to load bank deposit slip details:", err)
      );
    }
  }, [slipId, getBankDepositSlipById]);

  useEffect(() => {
    fetchSlipDetails();
  }, [fetchSlipDetails]);

  useEffect(() => {
    return () => {
      clearManagedBankDepositSlip();
      clearError();
      clearMessage();
    };
  }, [clearManagedBankDepositSlip, clearError, clearMessage]);

  const handleConfirmDeposit = useCallback(
    async (payload) => {
      setActionError("");
      setActionMessage("");
      try {
        await confirmDeposit(slipId, payload);
        setActionMessage("Bank deposit slip confirmed successfully.");
        fetchSlipDetails();
      } catch (err) {
        setActionError(
          typeof err === "string" ? err : "Failed to confirm deposit slip."
        );
      }
    },
    [confirmDeposit, slipId, fetchSlipDetails]
  );

  const handleCancelSlip = useCallback(
    async (payload) => {
      setActionError("");
      setActionMessage("");
      try {
        await cancelBankDepositSlip(slipId, payload);
        setActionMessage("Bank deposit slip cancelled successfully.");
        fetchSlipDetails();
      } catch (err) {
        setActionError(
          typeof err === "string" ? err : "Failed to cancel deposit slip."
        );
      }
    },
    [cancelBankDepositSlip, slipId, fetchSlipDetails]
  );

  const handleBack = useCallback(() => {
    navigate(ROUTES.BANK_DEPOSIT_SLIPS);
  }, [navigate]);

  const isLoading = getBankDepositSlipStatus === API_STATUS.LOADING;
  const isTransitioning =
    confirmDepositStatus === API_STATUS.LOADING ||
    cancelBankDepositSlipStatus === API_STATUS.LOADING;

  const pageProps = {
    slipDetails: managedBankDepositSlip,
    isLoading,
    isTransitioning,
    error: error || actionError,
    message: message || actionMessage,
    clearFeedback: () => {
      clearError();
      clearMessage();
      setActionError("");
      setActionMessage("");
    },
    handleConfirmDeposit,
    handleCancelSlip,
    handleBack,
  };

  return isMobile ? (
    <BankDepositSlipDetailsMobilePage {...pageProps} />
  ) : (
    <BankDepositSlipDetailsDesktopPage {...pageProps} />
  );
};

export default BankDepositSlipDetailsPage;
