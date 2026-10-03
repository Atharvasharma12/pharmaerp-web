import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import usePaymentQr from "../hooks/usePaymentQr";
import PaymentQrDetailsDesktopPage from "./desktop/PaymentQrDetailsDesktopPage";
import PaymentQrDetailsMobilePage from "./mobile/PaymentQrDetailsMobilePage";

const PaymentQrDetailsPage = () => {
  const navigate = useNavigate();
  const { paymentQrId } = useParams();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(null);

  const {
    managedPaymentQr,
    getPaymentQrById,
    getPaymentQrStatus,
    error,
    clearError,
    clearManagedPaymentQr,
    getPaymentQrStats,
    paymentQrStats,
    paymentQrStatsStatus,
  } = usePaymentQr();

  const isLoading = getPaymentQrStatus === API_STATUS.LOADING;
  const hasError = getPaymentQrStatus === API_STATUS.ERROR;
  const isStatsLoading = paymentQrStatsStatus === API_STATUS.LOADING;

  const fetchPaymentQr = useCallback(async () => {
    if (!paymentQrId) return;
    try {
      await getPaymentQrById(paymentQrId);
    } catch (e) {
      console.error("Error fetching Payment QR details:", e);
    }
  }, [paymentQrId, getPaymentQrById]);

  const fetchStats = useCallback(async () => {
    if (!paymentQrId) return;
    try {
      await getPaymentQrStats(paymentQrId);
    } catch (e) {
      console.error("Error fetching Payment QR stats:", e);
    }
  }, [paymentQrId, getPaymentQrStats]);

  useEffect(() => {
    if (hasFetchedRef.current === paymentQrId) return;
    hasFetchedRef.current = paymentQrId;

    fetchPaymentQr();
    fetchStats();

    return () => {
      clearError();
      clearManagedPaymentQr();
    };
  }, [paymentQrId, fetchPaymentQr, fetchStats, clearError, clearManagedPaymentQr]);

  const handleBack = useCallback(() => {
    navigate(ROUTES.PAYMENT_QRS);
  }, [navigate]);

  const handleEdit = useCallback(() => {
    if (!paymentQrId) return;
    navigate(ROUTES.EDIT_PAYMENT_QR(paymentQrId));
  }, [paymentQrId, navigate]);

  const handleRefresh = useCallback(() => {
    clearError();
    hasFetchedRef.current = null;
    fetchPaymentQr();
    fetchStats();
  }, [clearError, fetchPaymentQr, fetchStats]);

  const pageProps = useMemo(
    () => ({
      paymentQr: managedPaymentQr,
      paymentQrId,
      isLoading,
      hasError,
      error,
      stats: paymentQrStats,
      isStatsLoading,
      handleBack,
      handleEdit,
      handleRefresh,
    }),
    [
      managedPaymentQr,
      paymentQrId,
      isLoading,
      hasError,
      error,
      paymentQrStats,
      isStatsLoading,
      handleBack,
      handleEdit,
      handleRefresh,
    ]
  );

  return isMobile ? (
    <PaymentQrDetailsMobilePage {...pageProps} />
  ) : (
    <PaymentQrDetailsDesktopPage {...pageProps} />
  );
};

export default PaymentQrDetailsPage;
