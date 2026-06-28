import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useBankSlip from "../hooks/useBankSlip";

const BankSlipDetailsPage = () => {
  const navigate = useNavigate();
  const { bankSlipId } = useParams();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(null);

  const {
    managedBankSlip,
    getBankSlipById,
    getBankSlipStatus,
    submitBankSlip,
    confirmBankSlip,
    rejectBankSlip,
    cancelBankSlip,
    submitBankSlipStatus,
    confirmBankSlipStatus,
    rejectBankSlipStatus,
    cancelBankSlipStatus,
    error,
    clearError,
    clearManagedBankSlip,
  } = useBankSlip();

  const [localErrors, setLocalErrors] = useState({});

  const isLoading = getBankSlipStatus === API_STATUS.LOADING;
  const isActioning =
    submitBankSlipStatus === API_STATUS.LOADING ||
    confirmBankSlipStatus === API_STATUS.LOADING ||
    rejectBankSlipStatus === API_STATUS.LOADING ||
    cancelBankSlipStatus === API_STATUS.LOADING;

  const fetchDetails = useCallback(async () => {
    if (!bankSlipId) return;
    try {
      await getBankSlipById(bankSlipId);
    } catch (e) {
      console.error("Failed to load bank slip details:", e);
    }
  }, [bankSlipId, getBankSlipById]);

  useEffect(() => {
    if (hasFetchedRef.current === bankSlipId) return;
    hasFetchedRef.current = bankSlipId;

    fetchDetails();

    return () => {
      clearError();
      clearManagedBankSlip();
    };
  }, [bankSlipId, fetchDetails, clearError, clearManagedBankSlip]);

  const handleBack = useCallback(() => {
    navigate(ROUTES.BANK_SLIPS);
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    clearError();
    setLocalErrors({});
    hasFetchedRef.current = null;
    fetchDetails();
  }, [clearError, fetchDetails]);

  // Workflow Handlers
  const handleSubmitSlip = useCallback(
    async (payload = {}) => {
      try {
        await submitBankSlip(bankSlipId, payload);
        fetchDetails();
      } catch (err) {
        setLocalErrors({ submit: typeof err === "string" ? err : "Failed to submit bank slip." });
      }
    },
    [bankSlipId, submitBankSlip, fetchDetails]
  );

  const handleConfirmSlip = useCallback(
    async (payload = {}) => {
      try {
        await confirmBankSlip(bankSlipId, payload);
        fetchDetails();
      } catch (err) {
        setLocalErrors({ confirm: typeof err === "string" ? err : "Failed to confirm bank slip." });
      }
    },
    [bankSlipId, confirmBankSlip, fetchDetails]
  );

  const handleRejectSlip = useCallback(
    async (reason) => {
      if (!reason) {
        setLocalErrors({ reject: "Rejection reason is required" });
        return;
      }
      try {
        await rejectBankSlip(bankSlipId, { reason });
        fetchDetails();
      } catch (err) {
        setLocalErrors({ reject: typeof err === "string" ? err : "Failed to reject bank slip." });
      }
    },
    [bankSlipId, rejectBankSlip, fetchDetails]
  );

  const handleCancelSlip = useCallback(
    async (reason) => {
      try {
        await cancelBankSlip(bankSlipId, { reason });
        fetchDetails();
      } catch (err) {
        setLocalErrors({ cancel: typeof err === "string" ? err : "Failed to cancel bank slip." });
      }
    },
    [bankSlipId, cancelBankSlip, fetchDetails]
  );

  const pageProps = useMemo(
    () => ({
      bankSlip: managedBankSlip,
      isLoading,
      isActioning,
      error: error || localErrors.submit || localErrors.confirm || localErrors.reject || localErrors.cancel,
      handleBack,
      handleRefresh,
      handleSubmitSlip,
      handleConfirmSlip,
      handleRejectSlip,
      handleCancelSlip,
      clearLocalErrors: () => setLocalErrors({}),
    }),
    [
      managedBankSlip,
      isLoading,
      isActioning,
      error,
      localErrors,
      handleBack,
      handleRefresh,
      handleSubmitSlip,
      handleConfirmSlip,
      handleRejectSlip,
      handleCancelSlip,
    ]
  );

  return isMobile ? (
    <PaymentQrDetailsMobilePageDummy {...pageProps} />
  ) : (
    <PaymentQrDetailsDesktopPageDummy {...pageProps} />
  );
};

// Map actual components
import BankSlipDetailsDesktopPage from "./desktop/BankSlipDetailsDesktopPage";
import BankSlipDetailsMobilePage from "./mobile/BankSlipDetailsMobilePage";

const PaymentQrDetailsDesktopPageDummy = (props) => <BankSlipDetailsDesktopPage {...props} />;
const PaymentQrDetailsMobilePageDummy = (props) => <BankSlipDetailsMobilePage {...props} />;

export default BankSlipDetailsPage;
